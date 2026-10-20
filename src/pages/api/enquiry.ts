import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import { createEnquiryHandler } from '../../lib/enquiry';

export const prerender = false;

const mailKeys = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
  'ENQUIRY_TO',
];
const handleEnquiry = createEnquiryHandler({
  env: Object.fromEntries(mailKeys.map((key) => [key, getSecret(key)])),
});

export const ALL: APIRoute = async (context) => {
  let address: string | undefined;
  try {
    address = context.clientAddress;
  } catch {
    /* Shared fallback limit when a host cannot supply the peer address. */
  }
  return handleEnquiry(context.request, address);
};
