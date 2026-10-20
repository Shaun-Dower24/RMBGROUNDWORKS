# Built Node server verification

Verified 20 October 2026 against a fresh `npm run build`, then the standalone `dist/server/entry.mjs` on `127.0.0.1:4322`.

All SMTP variables, sender and recipient were explicitly empty in the test server process. The synthetic payload used `qa@example.test` and contained no real customer information. **No external email was sent.** Requests were sent directly to the local Node server with controlled Host, Origin and forwarded-header combinations.

| Check | Expected / observed status | Result |
| --- | --- | --- |
| Same-origin POST at `http://127.0.0.1:4322` | 503 / 503 | Reaches missing-mail-configuration path instead of false origin rejection. |
| Local request with hostile external Origin | 403 / 403 | Rejected before submission processing. |
| Production Host `www.rmbgroundworks.co.uk`, forwarded protocol HTTPS and matching production Origin | 503 / 503 | Resolves the external origin correctly. |
| Production Host plus forwarded host/protocol and matching Origin | 503 / 503 | Resolves the ordinary proxy combination correctly. |
| Unsupported Host with its own unsupported Origin | 403 / 403 | Unapproved host cannot establish a trusted request origin. |
| Unsupported Host with production Origin but no trusted forwarded host | 403 / 403 | Production Origin alone cannot bypass host validation. |
| GET to the enquiry endpoint | 405 / 405 | Method guard remains active. |

Every response used the expected public error text and did not expose SMTP variable names, stack traces or credentials. The missing-configuration response offers the published email address and telephone number. No false success was returned.

The local server was stopped after verification. The unit suite also passed all **13 tests**, using injected fake transports only.

## Built page, asset and 404 responses

A second short-lived standalone server on the same local port verified **23 GET responses**:

- All 17 content routes returned `200` with nonempty HTML: home, About, Contact, Privacy, project index, all six work collections, service index and all five service pages.
- `/robots.txt` returned `200` as text; `/sitemap.xml` returned `200` as XML.
- `/media/logo.png`, `/media/hero-1280.webp` and `/media/fonts/poppins-600.woff2` returned `200`, nonempty bodies and the correct image/font content types.
- `/this-route-does-not-exist/` returned a real HTTP `404` with the branded HTML error page.

This test process stopped its child server automatically. Verification used Node **24.15.0**; the application's documented minimum Node version is **22.22**.

## Limits

These checks validate the built Node request path and current explicit host configuration. They do not verify a deployed reverse proxy, SMTP authentication, inbox delivery, production DNS or multi-instance rate limiting. Production must keep direct origin access restricted and replace untrusted forwarded headers at its trusted proxy. Perform an authorised controlled mail-delivery check only after real server-side configuration and launch approval.

The Windows workspace sandbox initially prevented cross-process localhost access; the final probes and test server ran outside that network sandbox, bound only to `127.0.0.1`. No public listener or deployment was created.
