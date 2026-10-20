# Static build audit

Snapshot inspected: 20 October 2026. Scope: generated `dist/client` files, without changing source. Parent browser QA is separate. The live server/API, delivery credentials, accessibility interaction and performance under network conditions are outside this static check.

Snapshot SHA-256: `d34633a869e09a918b9746878c89b75f315bdca268c743e7b5327bd88c66da33`

## Result

- Generated HTML documents: **18**, including the expected 404 page.
- Local HTML references checked: **847**; CSS asset references: **6**.
- Broken local routes/assets: **0**.
- Missing linked HTML fragments: **0**.
- Duplicate page titles/canonicals: **0 / 0**.
- Documents without exactly one main, H1 and canonical: **0**.
- External font/media/script/stylesheet loads found: **0**.

Every local reference was resolved against emitted files. Extensionless routes such as `/projects` correctly resolve to their directory `index.html`. Mail/telephone links are excluded. Runtime API routes are excluded from static-file resolution and require server testing.

## Page metadata

| Generated document | Title | H1 | Canonical | Robots |
| --- | --- | --- | --- | --- |
| `404.html` | Page Not Found / RMB Groundworks | Let’s get backon solid ground. | https://www.rmbgroundworks.co.uk/404/ | noindex, nofollow |
| `about/index.html` | About RMB Groundworks / RMB Groundworks | Grounded in the work.Focused on your project. | https://www.rmbgroundworks.co.uk/about/ | noindex, nofollow |
| `contact/index.html` | Discuss Your Project / RMB Groundworks | Your project.Our next conversation. | https://www.rmbgroundworks.co.uk/contact/ | noindex, nofollow |
| `index.html` | Groundworks & Civil Engineering in Hertfordshire / RMB Groundworks | From theground up. | https://www.rmbgroundworks.co.uk/ | noindex, nofollow |
| `privacy/index.html` | Privacy & Cookies / RMB Groundworks | Privacy & cookies. | https://www.rmbgroundworks.co.uk/privacy/ | noindex, nofollow |
| `projects/basement-civil-works/index.html` | Basement civil works — Work in Focus / RMB Groundworks | Basement civil works. | https://www.rmbgroundworks.co.uk/projects/basement-civil-works/ | noindex, nofollow |
| `projects/block-beam-floors/index.html` | Block & beam floors — Work in Focus / RMB Groundworks | Block & beam floors. | https://www.rmbgroundworks.co.uk/projects/block-beam-floors/ | noindex, nofollow |
| `projects/car-parks-surfacing/index.html` | Car parks & surfacing — Work in Focus / RMB Groundworks | Car parks & surfacing. | https://www.rmbgroundworks.co.uk/projects/car-parks-surfacing/ | noindex, nofollow |
| `projects/drainage-installation/index.html` | Drainage installation — Work in Focus / RMB Groundworks | Drainage installation. | https://www.rmbgroundworks.co.uk/projects/drainage-installation/ | noindex, nofollow |
| `projects/foundation-reinforcement/index.html` | Foundation reinforcement — Work in Focus / RMB Groundworks | Foundation reinforcement. | https://www.rmbgroundworks.co.uk/projects/foundation-reinforcement/ | noindex, nofollow |
| `projects/hard-landscaping/index.html` | Hard landscaping — Work in Focus / RMB Groundworks | Hard landscaping. | https://www.rmbgroundworks.co.uk/projects/hard-landscaping/ | noindex, nofollow |
| `projects/index.html` | Our Work — Groundworks in Focus / RMB Groundworks | On site.In the detail. | https://www.rmbgroundworks.co.uk/projects/ | noindex, nofollow |
| `services/basement-civil-works/index.html` | Basement civil works / RMB Groundworks | Basement civil works. | https://www.rmbgroundworks.co.uk/services/basement-civil-works/ | noindex, nofollow |
| `services/car-parks-external-works/index.html` | Car parks & external works / RMB Groundworks | Car parks & external works. | https://www.rmbgroundworks.co.uk/services/car-parks-external-works/ | noindex, nofollow |
| `services/demolition-site-preparation/index.html` | Demolition & site preparation / RMB Groundworks | Demolition & site preparation. | https://www.rmbgroundworks.co.uk/services/demolition-site-preparation/ | noindex, nofollow |
| `services/drainage/index.html` | Foul & surface water drainage / RMB Groundworks | Foul & surface water drainage. | https://www.rmbgroundworks.co.uk/services/drainage/ | noindex, nofollow |
| `services/foundations-substructure/index.html` | Foundations & substructure / RMB Groundworks | Foundations & substructure. | https://www.rmbgroundworks.co.uk/services/foundations-substructure/ | noindex, nofollow |
| `services/index.html` | Groundworks & Civil Engineering Services / RMB Groundworks | The foundations.The details. The finish. | https://www.rmbgroundworks.co.uk/services/ | noindex, nofollow |

The emitted preview pages intentionally use `noindex, nofollow`; production indexability must be enabled only with the production launch decision.

## First-party script payloads

| Generated script | Bytes | Gzip bytes |
| --- | --- | --- |
| `_astro/Base.astro_astro_type_script_index_0_lang.CiO6gn4e.js` | 6,271 | 2,221 |

Total emitted client JavaScript: **6,271 bytes raw / 2,221 bytes gzip**. This is a file payload measurement, not a browser CPU or Core Web Vitals result.

## Findings

No material broken routes, missing media, invalid linked fragments, duplicate title/canonical values or unintended external font/media/CDN loads were found in this snapshot.

Re-run the audit if route/content/asset output changes. This report describes the inspected build snapshot; it is not a launch approval.
