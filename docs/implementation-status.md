# Implementation and verification

Completed: 20 October 2026. Built from the research checklist after the user authorised implementation.

## Included

- Astro 7 + TypeScript, pre-rendered content pages and Node standalone enquiry endpoint.
- 17 content routes: home, about, contact, privacy, service hub, five service groups, work index and six work collections; branded 404, sitemap and robots output.
- Original RMB logo variants, favicon, Poppins/Inter and 73 responsive WebPs from 36 original photos. Asset provenance and licenses are in docs/asset-register.md.
- Photographic hero with manual controls, section entrances, hover feedback, service/work relationships, work filters, native image dialog, accessible mobile menu and reduced-motion behaviour.
- Project/tender enquiry with validated server delivery, safe failure states, contact fallbacks and no third-party tracking.

## Verification performed

| Check | Result |
| --- | --- |
| Astro diagnostics | 0 errors, 0 warnings, 0 hints |
| Production build | Passed |
| Enquiry unit tests | 13 passed; fake transports only |
| Route/width matrix | 17 routes at 320, 390, 768, 1024 and 1440px = 85 checks; no horizontal overflow |
| Automated WCAG-tagged axe samples | 7 routes at 390px; 0 violations. Homepage image contrast marked incomplete by the tool and manually reviewed in desktop/mobile captures |
| Interaction checks | 24 passed: hero, menu focus/trap/Escape, filters/count, gallery navigation/focus, enquiry intent/service routing, missing-contact validation, missing-SMTP recovery, mocked success, reduced motion and native disclosures |
| JavaScript disabled | Homepage content and service links visible; all 6 work collections visible; direct contact fallback visible and scripted form hidden |
| Runtime JavaScript errors | 0 during final screenshot/fallback sampling |
| Static output | 18 HTML documents, 847 local references, 6 CSS asset checks; 0 broken references/fragments, 0 duplicate titles/canonicals and 0 external resource loads |
| Built-server probes | 17 content routes 200; robots/sitemap and sampled assets 200; unknown route 404; API method/origin/configuration states behave as expected |
| Client JavaScript | 6,271 bytes raw / 2,221 bytes gzip in inspected build |
| Dependency audit | 0 known vulnerabilities reported by npm at install/lock verification |

Desktop/mobile homepage, full homepage, work index and contact screenshots were visually reviewed in the local workspace. Browser checks used Chromium on Windows. These results do not establish complete WCAG conformance, cross-browser coverage or field Core Web Vitals. No traffic/ranking/lead-uplift claims are made.

## Operational handover

The site is implemented and reviewable locally. No production domain, DNS or public website was changed. Indexing remains disabled by default. The server-side form intentionally returns 503 with direct email/phone guidance until an approved SMTP account, sender and recipient are configured. Browser success was simulated locally; real delivery has not been tested and no external email was sent.

Before production release, complete the client fact/rights/privacy checks in docs/content-status.md, the SMTP/proxy checks in docs/enquiry-setup.md and domain/redirect/rollback checks in README.md. Enable SITE_INDEXABLE=true only in the production build after approval. Cross-browser testing on the intended deployment and a controlled real inbox-delivery test remain launch steps.
