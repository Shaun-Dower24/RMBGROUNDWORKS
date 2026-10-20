# RMB Groundworks

A photographic Astro + TypeScript website built from the approved research checklist. Original RMB logos, Poppins/Inter fonts and responsive site photography are self-hosted. The design adapts the Infinity reference through image scale, spacing and project storytelling.

Review site: https://rmb-groundworks.netlify.app. See [deployment and update instructions](docs/netlify-deployment.md).

## Run locally

Node.js 22.22+ and npm 9.6.5+ are required; development was verified with Node 24.15.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4321. Content pages are pre-rendered; `/api/enquiry` runs as a Netlify Node Function after deployment. `npm start` is an alias for local development.

```sh
npm run check
npm test
npm run build
```

The Netlify adapter generates static files in `dist` and the server Function under `.netlify`. Netlify CLI builds and publishes both with `netlify deploy --prod --context production`. Link the intended project first with `netlify link --id <site-id>`. Local state is ignored by Git. No standalone Node server or SPA fallback is required.

See [enquiry setup](docs/enquiry-setup.md) for server-side SMTP configuration. Copy `.env.example` to `.env` locally and configure real secrets only in the approved host. No real email is sent by the automated tests.

## Content and design

- src/data/site.ts: services, work collections, contact details and process.
- src/components/ and src/layouts/: reusable page elements.
- src/styles/global.css: brand tokens and responsive styling.
- src/scripts/site.ts: mobile navigation, manual hero, work filters, native gallery dialog and enquiry feedback.
- public/media/: original logos, licensed fonts and optimized photographic derivatives.
- docs/asset-register.md: provenance, dimensions and image budget.
- docs/content-status.md: facts and permissions to confirm before production.

## Launch requirements

The initial Netlify publication is a review site with search indexing disabled. Before replacing the company's public website:

1. Confirm the public contact/address, legal identity, service scope, image rights and privacy wording with RMB. Unverified testimonials, credentials, statistics and named project claims have been excluded.
2. Configure the approved SMTP host, credentials, fixed authenticated sender and fixed enquiry recipient. Until configured, the API returns503 and the page retains direct phone/email routes. Confirm one controlled delivery with the owner before launch.
3. Review domain/DNS/hosting and redirects. Existing /projects and homepage #about/#services/#quote destinations are retained.
4. Change `SITE_INDEXABLE` in `netlify.toml` to `true` **at build time** only for the approved production domain; current builds use noindex and disallow crawling. Keep deploy-preview and branch-deploy contexts set to `false` when enabling production indexing.
5. Repeat responsive, keyboard, reduced-motion, enquiry delivery and domain smoke checks. The included privacy text requires owner review against the actual host/mail arrangements.

No analytics or third-party feed is installed. Mail acceptance is distinct from delivery and a submitted enquiry is distinct from a qualified lead. In-memory spam limits apply per Function instance; see the setup guide. Production/local forwarded-host patterns are explicit. Netlify's `URL`, `DEPLOY_URL` and `DEPLOY_PRIME_URL` supply exact deployment hostnames during its build; `PREVIEW_HOST` supports an additional exact HTTPS test host. Canonicals retain the intended RMB domain, while social images use the Netlify site URL supplied during the build.


## Scroll-animation regression check

With the site running locally, use the browser check in addition to diagnostics/build. It inspects animation frames and fails on visible-to-hidden resets:

```sh
npx --yes --package @playwright/cli playwright-cli -s=motion open http://127.0.0.1:4321/about/
npx --yes --package @playwright/cli playwright-cli -s=motion run-code --filename=tests/browser/scroll-motion.mjs --raw
npx --yes --package @playwright/cli playwright-cli -s=motion close
```

The script uses the opened page's origin, so the same check can verify a deployed release. See docs/motion-verification.md for the defect reproduction and fix evidence.
