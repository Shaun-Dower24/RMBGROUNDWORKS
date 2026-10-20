# Netlify publication

Published 20 October 2026 at the user's request. The user selected a new `rmb-groundworks` project in the **systemsAI** team.

- Live review site: https://rmb-groundworks.netlify.app
- Immutable release: https://6ad7ccacf15425f5b390fe7f--rmb-groundworks.netlify.app
- Deployment: https://app.netlify.com/projects/rmb-groundworks/deploys/6ad7ccacf15425f5b390fe7f
- Site ID: `4e454043-6369-4cf7-a106-5f6c88c4f4b1`
- Source branch: `feat/website-rebuild`; pull request: https://github.com/Shaun-Dower24/RMBGROUNDWORKS/pull/1

## Hosting and updates

This is a CLI upload from the implementation branch. Git continuous deployment is not connected; pushing or merging the pull request alone does not update this Netlify site. The company's existing domain, DNS and public website have not been migrated.

`netlify.toml` sets the build command to `npm run build`, publish directory to `dist`, Node to 24 and indexing to false. The Astro adapter generates the Node 24 `ssr` Function for the enquiry endpoint and serves pre-rendered pages from the CDN. Sessions and runtime image transformation are unused and disabled. Local `.netlify` link/build state is ignored by Git.

To publish a reviewed update from this repository:

```sh
npm ci
npm run check
npm test
netlify link --id 4e454043-6369-4cf7-a106-5f6c88c4f4b1
netlify deploy --prod --context production --message "Describe the reviewed change"
```

The current CLI builds automatically. Do not use `--no-build` with a stale build. Check the published release before considering an update complete. See the dependency findings and runtime artifact inspection in [dependency-audit.md](dependency-audit.md).

## Live verification

Netlify reports the current release **ready**. The initial publication's live HTTP checks at 18:51 UTC passed 28 assertions:

- All 17 content routes return 200 and retain `noindex, nofollow`.
- Sampled original logo, font and hero image return 200; the social image URL uses the Netlify host and resolves.
- Robots disallows crawling; sitemap contains 17 entries with the intended company-domain canonicals.
- Unknown paths return the branded 404.
- The API returns 405 for GET, 400 for invalid input, 403 for a hostile Origin, and 503 for a valid same-origin enquiry while SMTP is absent.

All seven mail configuration variables were checked absent in Netlify's production Functions scope without displaying values. No external email was sent. The live browser passed 24 interaction checks covering menu focus/trapping/Escape, hero controls, work filters, gallery controls/focus, enquiry validation, the actual missing-mail fallback, a browser-mocked accepted response, reduced motion and FAQs. A mocked accepted response is not a real delivery test.

The subsequent hero refresh is published from code commit `8277279`. Live checks covered six page patterns at desktop/mobile widths, the About/service/work navigation actions and work filter. The final About hero passed six viewport checks: full-height photo at y0, no horizontal overflow, heading below the fixed header, and 72–76px of clearance beneath the scroll link so Netlify's badge cannot obscure it. The short landscape layout expands to fit its content. See [hero-design.md](hero-design.md) for the 21st.dev references and full local verification.

The animation release is published from code commit `07385e4`, deployment `6ad7c5969664749aed8b0c6d`, confirmed **ready**. Live Chromium passed all 44 session/failure protocol observations/checks, including failed animation assets with Netlify version query strings. Live WebKit touch emulation preserved the 844px-tall About hero at 390px width, y0 photograph, 18%-top focal point and 72px badge clearance; menu navigation and Back returned usable content. All six live About viewport checks still pass. A 13.4-second motion recording and settled desktop/mobile captures were saved for review. See [motion-verification.md](motion-verification.md).

## Remaining launch setup

The review site remains excluded from search indexing. The form provides direct phone/email routes but cannot send until the approved SMTP account, fixed sender and recipient are configured in Functions scope and the site is redeployed. See [enquiry-setup.md](enquiry-setup.md). The instance-local rate limit is not a global limit across Function instances.

Before the company-domain launch, finish the owner fact/rights/privacy checks in [content-status.md](content-status.md), verify one controlled inbox delivery, agree DNS and old-URL redirects, and enable indexing only for the approved production domain. Keep preview/branch contexts excluded from indexing. No analytics is installed.

## Scroll-flashing correction

Code commit `8f8aeb7`, deployment `6ad7c9a8d47111418290fffa`, supersedes the initial animation release and is confirmed ready. Frame-by-frame continuous scrolling reproduced eight opacity resets before the fix and zero across 12 live desktop/mobile scenarios after it. See motion-verification.md and tests/browser/scroll-motion.mjs.

## Later playback triggers

Code commit `0ab5ba0`, deployment `6ad7ccacf15425f5b390fe7f`, is confirmed ready. Size-aware starts replace the 85% viewport trigger; the desktop About photo now begins with 335/650px visible, and the mobile photo is fully visible. The no-flashing fix is retained. Local first-play/frame regression covers 12 scenarios and 141 observed starts; 28 live About starts were sampled at desktop/mobile widths.
