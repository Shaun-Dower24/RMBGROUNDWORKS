# RMB Groundworks

A photographic Astro + TypeScript website built from the approved research checklist. Original RMB logos, Poppins/Inter fonts and responsive site photography are self-hosted. The design adapts the Infinity reference through image scale, spacing and project storytelling.

## Run locally

Node.js 22.22+ and npm 9.6.5+ are required; development was verified with Node 24.15.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4321. Content pages are pre-rendered; /api/enquiry runs on the Node server.

```sh
npm run check
npm test
npm run build
npm start
```

The production Node server uses HOST/PORT environment variables; default development server remains local. See [enquiry setup](docs/enquiry-setup.md) for server-side SMTP configuration. Copy .env.example to .env locally and configure real secrets only in the approved host. No real email is sent by the automated tests.

## Content and design

- src/data/site.ts: services, work collections, contact details and process.
- src/components/ and src/layouts/: reusable page elements.
- src/styles/global.css: brand tokens and responsive styling.
- src/scripts/site.ts: mobile navigation, manual hero, work filters, native gallery dialog and enquiry feedback.
- public/media/: original logos, licensed fonts and optimized photographic derivatives.
- docs/asset-register.md: provenance, dimensions and image budget.
- docs/content-status.md: facts and permissions to confirm before production.

## Launch requirements

This implementation is a reviewable website, not a production launch. Before publishing:

1. Confirm the public contact/address, legal identity, service scope, image rights and privacy wording with RMB. Unverified testimonials, credentials, statistics and named project claims have been excluded.
2. Configure the approved SMTP host, credentials, fixed authenticated sender and fixed enquiry recipient. Until configured, the API returns503 and the page retains direct phone/email routes. Confirm one controlled delivery with the owner before launch.
3. Review domain/DNS/hosting and redirects. Existing /projects and homepage #about/#services/#quote destinations are retained.
4. Set SITE_INDEXABLE=true **at build time** only for approved production; default builds use noindex and disallow crawling. Deploy previews must remain protected from indexing.
5. Repeat responsive, keyboard, reduced-motion, enquiry delivery and domain smoke checks. The included privacy text requires owner review against the actual host/mail arrangements.

No analytics or third-party feed is installed. Mail acceptance is distinct from delivery and a submitted enquiry is distinct from a qualified lead. In-memory spam limits require an upstream/shared solution for multiple production instances; see the setup guide. The Node origin must sit behind a trusted proxy that replaces forwarded headers. Production/local host patterns are explicit; set PREVIEW_HOST to an exact HTTPS preview hostname before building for another host.

