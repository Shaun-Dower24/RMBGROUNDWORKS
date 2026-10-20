import nodemailer from 'nodemailer';

export interface Enquiry {
  name: string;
  email: string;
  phone: string;
  company: string;
  intent: 'project' | 'tender';
  location: string;
  service: string;
  timeframe: string;
  message: string;
  website: string;
}

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
}

export interface MailMessage {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
}

export type MailSender = (
  message: MailMessage,
  config: MailConfig,
) => Promise<{ accepted?: Array<string | { address: string }> }>;

type Environment = Record<string, string | undefined>;

const BYTE_LIMIT = 16 * 1024;
const WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;
const MAX_BUCKETS = 5000;
const emailPattern =
  /^[^\s<>@,;:\x00-\x1f\x7f]+@[^\s<>@,;:\x00-\x1f\x7f]+\.[^\s<>@,;:\x00-\x1f\x7f]+$/;
const singleLineControls = /[\x00-\x1f\x7f]/;
const messageControls = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/;

function json(status: number, payload: object, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function validate(input: unknown): { data?: Enquiry; fields: Record<string, string> } {
  const fields: Record<string, string> = {};
  if (!input || typeof input !== 'object' || Array.isArray(input))
    return { fields: { form: 'Please check the enquiry details.' } };
  const source = input as Record<string, unknown>;
  const limits = {
    name: 100,
    email: 254,
    phone: 40,
    company: 160,
    intent: 20,
    location: 160,
    service: 100,
    timeframe: 120,
    message: 5000,
    website: 200,
  } as const;
  const values: Record<string, string> = {};
  for (const [key, max] of Object.entries(limits)) {
    const value = source[key] ?? '';
    if (typeof value !== 'string') {
      fields[key] = 'Please enter text for this field.';
      values[key] = '';
      continue;
    }
    values[key] = value.trim();
    if (values[key].length > max) fields[key] = `Please use ${max} characters or fewer.`;
    if ((key === 'message' ? messageControls : singleLineControls).test(values[key]))
      fields[key] = 'Please remove unsupported characters.';
  }
  if (!values.name) fields.name = 'Please enter your name.';
  if (!values.location) fields.location = 'Please enter the project location.';
  if (!values.message) fields.message = 'Please tell us a little about the project.';
  if (values.intent !== 'project' && values.intent !== 'tender')
    fields.intent = 'Please select a project or tender enquiry.';
  if (!values.email && !values.phone)
    fields.email = 'Please enter an email address or telephone number.';
  if (values.email && !emailPattern.test(values.email))
    fields.email = 'Please enter a valid email address.';
  if (
    values.phone &&
    (!/^[+()\d][\d\s()+.\-]{5,39}$/.test(values.phone) ||
      (values.phone.match(/\d/g)?.length ?? 0) < 7)
  )
    fields.phone = 'Please enter a valid telephone number.';
  return Object.keys(fields).length ? { fields } : { fields, data: values as unknown as Enquiry };
}

function mailConfiguration(env: Environment): MailConfig | undefined {
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS;
  const from = env.SMTP_FROM?.trim();
  const to = env.ENQUIRY_TO?.trim();
  const port = Number(env.SMTP_PORT || '587');
  if (!host || !user || !pass || !from || !to || !emailPattern.test(from) || !emailPattern.test(to))
    return undefined;
  if (singleLineControls.test(host) || !Number.isInteger(port) || port < 1 || port > 65535)
    return undefined;
  if (env.SMTP_SECURE && !['true', 'false'].includes(env.SMTP_SECURE)) return undefined;
  return {
    host,
    user,
    pass,
    from,
    to,
    port,
    secure: env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465,
  };
}

const sendSmtp: MailSender = async (message, config) => {
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: !config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    return await transport.sendMail(message);
  } finally {
    transport.close();
  }
};

function makeMessage(data: Enquiry, config: MailConfig): MailMessage {
  return {
    from: config.from,
    to: config.to,
    ...(data.email ? { replyTo: data.email } : {}),
    subject:
      data.intent === 'tender' ? 'RMB website — tender enquiry' : 'RMB website — project enquiry',
    text: [
      `Enquiry type: ${data.intent === 'tender' ? 'Tender' : 'Project'}`,
      `Name: ${data.name}`,
      `Email: ${data.email || 'Not supplied'}`,
      `Telephone: ${data.phone || 'Not supplied'}`,
      `Company: ${data.company || 'Not supplied'}`,
      `Project location: ${data.location}`,
      `Service: ${data.service || 'Not supplied'}`,
      `Target dates: ${data.timeframe || 'Not supplied'}`,
      '',
      'Project details:',
      data.message,
      '',
      'Sent through the RMB Groundworks website enquiry form.',
    ].join('\n'),
  };
}

async function readBody(request: Request): Promise<string | undefined> {
  const length = request.headers.get('content-length');
  if (length && Number(length) > BYTE_LIMIT) return undefined;
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > BYTE_LIMIT) {
        await reader.cancel();
        return undefined;
      }
      chunks.push(value);
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return new TextDecoder().decode(body);
  } finally {
    reader.releaseLock();
  }
}

export function createEnquiryHandler({
  env,
  sendMail = sendSmtp,
  now = Date.now,
}: {
  env: Environment;
  sendMail?: MailSender;
  now?: () => number;
}) {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  return async (request: Request, clientAddress = 'unknown'): Promise<Response> => {
    if (request.method !== 'POST')
      return json(
        405,
        { ok: false, error: 'Please use the enquiry form to send a message.' },
        { Allow: 'POST' },
      );
    const origin = request.headers.get('origin');
    if (origin) {
      try {
        if (new URL(origin).origin !== new URL(request.url).origin)
          return json(403, { ok: false, error: 'Please send the enquiry from this website.' });
      } catch {
        return json(403, { ok: false, error: 'Please send the enquiry from this website.' });
      }
    }

    const timestamp = now();
    const address = clientAddress.slice(0, 100) || 'unknown';
    const existing = buckets.get(address);
    const bucket =
      existing && existing.resetAt > timestamp
        ? existing
        : { count: 0, resetAt: timestamp + WINDOW_MS };
    if (bucket.count >= RATE_LIMIT)
      return json(
        429,
        {
          ok: false,
          error:
            'Several enquiries have been attempted. Please try again later, or telephone or email us.',
        },
        { 'Retry-After': String(Math.max(1, Math.ceil((bucket.resetAt - timestamp) / 1000))) },
      );
    if (!buckets.has(address) && buckets.size >= MAX_BUCKETS) {
      for (const [key, value] of buckets) if (value.resetAt <= timestamp) buckets.delete(key);
      if (buckets.size >= MAX_BUCKETS) buckets.delete(buckets.keys().next().value!);
    }
    bucket.count += 1;
    buckets.set(address, bucket);

    const contentType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
    if (contentType !== 'application/json' && contentType !== 'application/x-www-form-urlencoded')
      return json(415, { ok: false, error: 'Please use the enquiry form, telephone or email us.' });
    let raw: string | undefined;
    try {
      raw = await readBody(request);
    } catch {
      return json(400, { ok: false, error: 'We could not read the enquiry. Please try again.' });
    }
    if (raw === undefined)
      return json(413, {
        ok: false,
        error: 'This enquiry is too long. Please shorten the message or email us directly.',
      });
    let input: unknown;
    try {
      if (contentType === 'application/json') input = JSON.parse(raw);
      else {
        const parameters = new URLSearchParams(raw);
        for (const key of parameters.keys())
          if (parameters.getAll(key).length > 1) throw new Error('Repeated field');
        input = Object.fromEntries(parameters);
      }
    } catch {
      return json(400, { ok: false, error: 'Please check the enquiry details and try again.' });
    }
    const { data, fields } = validate(input);
    if (!data)
      return json(400, { ok: false, error: 'Please check the highlighted details.', fields });
    if (data.website)
      return json(400, {
        ok: false,
        error: 'We could not accept this enquiry. Please telephone or email us directly.',
      });
    const config = mailConfiguration(env);
    if (!config)
      return json(503, {
        ok: false,
        error:
          'The form is temporarily unavailable. Please email info@rmbgroundworks.co.uk or call 07864 692868.',
      });
    try {
      const result = await sendMail(makeMessage(data, config), config);
      const accepted = result.accepted?.some(
        (recipient) =>
          (typeof recipient === 'string' ? recipient : recipient.address).toLowerCase() ===
          config.to.toLowerCase(),
      );
      if (!accepted)
        return json(502, {
          ok: false,
          error: 'Your enquiry could not be sent. Please email or telephone us instead.',
        });
      return json(200, {
        ok: true,
        message: 'Thank you. Your enquiry has been sent to the RMB team for review.',
      });
    } catch {
      return json(502, {
        ok: false,
        error:
          'Your enquiry could not be sent. Please try again, or email or telephone us instead.',
      });
    }
  };
}
