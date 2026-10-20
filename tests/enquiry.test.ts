import assert from 'node:assert/strict';
import test from 'node:test';
import { createEnquiryHandler, type MailMessage, type MailSender } from '../src/lib/enquiry.ts';

const env = {
  SMTP_HOST: 'smtp.example.test',
  SMTP_USER: 'test-user',
  SMTP_PASS: 'test-password',
  SMTP_FROM: 'website@example.test',
  ENQUIRY_TO: 'office@example.test',
};
const enquiry = {
  name: 'Jane Builder',
  email: 'jane@example.test',
  phone: '',
  company: 'Example Ltd',
  intent: 'project',
  location: 'St Albans',
  service: 'Foundations',
  timeframe: 'Autumn',
  message: 'Please discuss the groundworks package.',
  website: '',
};
const request = (body: unknown = enquiry, headers: Record<string, string> = {}) =>
  new Request('https://rmb.example.test/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://rmb.example.test', ...headers },
    body: JSON.stringify(body),
  });
const accepts: MailSender = async () => ({ accepted: ['office@example.test'] });

test('valid enquiries use fixed sender and recipient, with the visitor only in Reply-To', async () => {
  let sent: MailMessage | undefined;
  const handler = createEnquiryHandler({
    env,
    sendMail: async (message) => {
      sent = message;
      return { accepted: ['office@example.test'] };
    },
  });
  const response = await handler(request());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(sent?.from, 'website@example.test');
  assert.equal(sent?.to, 'office@example.test');
  assert.equal(sent?.replyTo, 'jane@example.test');
  assert.match(sent?.text ?? '', /Project location: St Albans/);
  assert.equal(sent?.subject, 'RMB website — project enquiry');
});

test('a telephone-only tender enquiry is accepted without a reply-to email', async () => {
  let sent: MailMessage | undefined;
  const handler = createEnquiryHandler({
    env,
    sendMail: async (message) => {
      sent = message;
      return { accepted: [{ address: 'office@example.test' }] };
    },
  });
  const response = await handler(
    request({ ...enquiry, intent: 'tender', email: '', phone: '+44 7864 692868' }),
  );
  assert.equal(response.status, 200);
  assert.equal(sent?.replyTo, undefined);
  assert.equal(sent?.subject, 'RMB website — tender enquiry');
});

test('validation errors do not reach the email transport', async () => {
  let calls = 0;
  const handler = createEnquiryHandler({
    env,
    sendMail: async () => {
      calls++;
      return { accepted: [] };
    },
  });
  const response = await handler(request({ ...enquiry, name: '', email: '', message: '' }));
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.ok(body.fields.name);
  assert.ok(body.fields.email);
  assert.ok(body.fields.message);
  assert.equal(calls, 0);
});

test('header-injection strings and invalid typed fields are rejected', async () => {
  const handler = createEnquiryHandler({ env, sendMail: accepts });
  const injection = await handler(
    request({ ...enquiry, email: 'jane@example.test\r\nBcc: other@example.test' }),
  );
  assert.equal(injection.status, 400);
  assert.ok((await injection.json()).fields.email);
  const typed = await handler(request({ ...enquiry, company: ['wrong type'] }));
  assert.equal(typed.status, 400);
});

test('cross-origin requests are rejected before processing or sending', async () => {
  const handler = createEnquiryHandler({
    env,
    sendMail: async () => {
      throw new Error('Transport should not run');
    },
  });
  assert.equal(
    (await handler(request(enquiry, { Origin: 'https://another.example.test' }))).status,
    403,
  );
  assert.equal((await handler(request(enquiry, { Origin: 'null' }))).status, 403);
});

test('actual body bytes are bounded even without a Content-Length header', async () => {
  const handler = createEnquiryHandler({ env, sendMail: accepts });
  const response = await handler(request({ ...enquiry, message: 'é'.repeat(9000) }));
  assert.equal(response.status, 413);
});

test('missing SMTP configuration never creates a false success', async () => {
  let called = false;
  const handler = createEnquiryHandler({
    env: {},
    sendMail: async () => {
      called = true;
      return { accepted: ['office@example.test'] };
    },
  });
  const response = await handler(request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(called, false);
});

test('SMTP recipient must match the explicitly configured destination', async () => {
  const handler = createEnquiryHandler({
    env,
    sendMail: async () => ({ accepted: ['somebody-else@example.test'] }),
  });
  const response = await handler(request());
  assert.equal(response.status, 502);
  assert.equal((await response.json()).ok, false);
});

test('transport errors are safe and do not expose secrets or enquiry content', async () => {
  const handler = createEnquiryHandler({
    env,
    sendMail: async () => {
      throw new Error('Secret: test-password Jane Builder');
    },
  });
  const response = await handler(request());
  assert.equal(response.status, 502);
  const text = await response.text();
  assert.doesNotMatch(text, /test-password|Jane Builder|smtp\.example/);
});

test('honeypot submissions are rejected without delivery', async () => {
  let calls = 0;
  const handler = createEnquiryHandler({
    env,
    sendMail: async () => {
      calls++;
      return { accepted: [] };
    },
  });
  const response = await handler(request({ ...enquiry, website: 'spam.example.test' }));
  assert.equal(response.status, 400);
  assert.equal(calls, 0);
});

test('burst limiting resets after the window and ignores spoofable forwarding headers', async () => {
  let now = 1000;
  const handler = createEnquiryHandler({ env, sendMail: accepts, now: () => now });
  for (let index = 0; index < 5; index++)
    assert.equal(
      (await handler(request(enquiry, { 'X-Forwarded-For': `fake-${index}` }), 'real-peer')).status,
      200,
    );
  const limited = await handler(request(), 'real-peer');
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('Retry-After'), '900');
  now += 15 * 60 * 1000;
  assert.equal((await handler(request(), 'real-peer')).status, 200);
});

test('URL-encoded forms are supported and duplicated fields are rejected', async () => {
  const handler = createEnquiryHandler({ env, sendMail: accepts });
  const body = new URLSearchParams(enquiry).toString();
  const makeForm = (value: string) =>
    new Request('https://rmb.example.test/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: value,
    });
  assert.equal((await handler(makeForm(body))).status, 200);
  assert.equal((await handler(makeForm(`${body}&email=second@example.test`))).status, 400);
});

test('unsupported methods and malformed JSON receive explicit failures', async () => {
  const handler = createEnquiryHandler({ env, sendMail: accepts });
  const response = await handler(new Request('https://rmb.example.test/api/enquiry'));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'POST');
  const bad = await handler(
    new Request('https://rmb.example.test/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{bad',
    }),
  );
  assert.equal(bad.status, 400);
});
