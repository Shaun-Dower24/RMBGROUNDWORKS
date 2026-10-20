# Enquiry setup and verification

The contact form submits to `POST /api/enquiry`. It sends a plain-text notification through an existing, approved SMTP service. No account or paid provider is provisioned by this implementation. Direct telephone and email links remain available if configuration or delivery fails.

## Configure the server

Copy `.env.example` to an untracked `.env` for local development, or set equivalent **server-side** variables on the deployment host:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: approved SMTP account.
- `SMTP_SECURE`: `true` for implicit TLS (normally 465); `false` for STARTTLS (normally 587). TLS remains required in both modes; certificate validation is not disabled.
- `SMTP_FROM`: a single authenticated sender email address on the approved sending domain.
- `ENQUIRY_TO`: a single explicitly approved recipient email address. There is intentionally no default destination.

Do not prefix credentials with `PUBLIC_`, commit `.env`, or place values in client scripts. Verify the sending domain's authentication with the chosen mail administrator/provider before launch. Sender identity stays fixed; the visitor's email is used only as `Reply-To`, never as `From`. No automatic email is sent to a visitor-controlled address.

The endpoint reads secrets through Astro's server-only `getSecret()` helper, keeping local Astro `.env` behaviour and the Node adapter's runtime configuration consistent. The handler library receives an explicit environment object, which makes its tests independent of real credentials.

Use `npm run dev` for local development. Build with `npm run build` and serve the Node standalone output with `npm start`; runtime credentials must be present in the server process. A deployment wrapper/environment must load `.env` where appropriate: the built Node process does not automatically load an arbitrary local file. For local built-output testing, Node supports `node --env-file=.env ./dist/server/entry.mjs`.

## Behaviour and limits

- Required: name, project location, message, valid intent, and at least one email or telephone contact method.
- Optional: company, service, target dates and the other contact method. All submitted fields are length-bounded and validated server-side.
- Accepted content types: JSON and URL-encoded form data. The actual request body is limited to 16KiB, including requests without `Content-Length`. No attachments/uploads are accepted.
- Cross-origin browser submissions are rejected. No permissive CORS response is added.
- A honeypot field and a bounded in-process rate limiter reject obvious spam. Limit: five attempts per peer address per 15 minutes; up to 5,000 tracked buckets.
- The handler uses the address supplied by Astro's adapter, not a header it parses itself. Astro's Node adapter can derive that address from `X-Forwarded-For` after an allowed host matches. In production, keep the Node origin reachable only through the trusted proxy and configure that proxy to replace incoming forwarded headers with verified values; otherwise a direct client may spoof its rate-limit identity. If no address is available, requests share a fallback bucket.
- The in-memory limiter is single-process and resets on restart. A multi-instance/public deployment should use its trusted edge/WAF rate limits or a shared rate-limit store. This is not a CAPTCHA or complete abuse-prevention service.
- Statuses: `200` accepted by SMTP for the configured recipient; `400` validation/honeypot; `403` origin; `405` method; `413` request too large; `415` unsupported content type; `429` rate limit; `503` missing/invalid mail configuration; `502` SMTP error or unaccepted destination.
- SMTP acceptance is not proof of inbox delivery. No form content is logged, stored in a database, or copied to analytics by this handler. Hosting/mail-provider processing and retention still require owner review.
- No automatic retry is performed: an ambiguous network timeout may have occurred after SMTP acceptance. Staff should use their mail service logs and contact fallback rather than an unbounded resend loop. The UI should prevent simultaneous submissions.

## Host and proxy configuration

Astro 7's Node request construction uses `security.allowedDomains` to validate the incoming/forwarded host. Configure explicit production host patterns (including the correct HTTPS protocol), and explicit local hosts/ports needed for built-output testing. Do not use an unrestricted wildcard. The request URL must resolve to the same external origin the browser sends; otherwise the API intentionally returns `403` rather than disabling origin checks. Test the deployed HTTPS form through the actual reverse proxy before launch. See Astro's [allowedDomains reference](https://docs.astro.build/en/reference/configuration-reference/#securityalloweddomains).

## Verification

`npm test` uses injected in-memory fake transports and **does not send external email**. It checks valid project/tender routing, fixed sender/destination, phone-only contact, invalid fields/header injection, origin checks, byte limits, honest missing-configuration/failure states, recipient acceptance, spam controls, URL-encoded support and rate-limit reset.

Before production launch is authorised, configure the real approved recipient, confirm privacy/retention details, then perform a controlled submission and check both the browser acceptance state and the receiving inbox. Test invalid input and a delivery failure path as well. That live-delivery check has not been performed during development.
