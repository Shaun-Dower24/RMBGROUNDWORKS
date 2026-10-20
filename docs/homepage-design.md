# Homepage component refresh

Implemented 20 October 2026 after the user approved the six-section 21st.dev shortlist. Original RMB photography, marks, Poppins/Inter, red/charcoal palette and verified content are retained. The existing hero and its manual controls are unchanged.

## Direction and provenance

The public catalog pages and rendered previews informed native Astro implementations. No third-party component source was imported, no React dependencies were introduced, and no project context was uploaded to 21st.

| Section | Reference | Implemented behaviour |
| --- | --- | --- |
| Company introduction | [Split Content Section](https://21st.dev/@felipemenezes098/components/content-06) | Adjacent original operative photograph and company copy; stacked on small screens. |
| Selected work | [Gallery4](https://21st.dev/@shadcnblockscom/components/gallery4) | Four real work collections, three full cards on desktop, next-card edge on mobile, manual arrows, native horizontal scroll and keyboard navigation. No autoplay. |
| Services | [Media Accordion](https://21st.dev/@shadcnspace/components/accordion-05) | Five named native details panels; first open, real service copy/photo/link, every summary accessible, no animated hidden panel content. |
| Process | [Timeline 05](https://21st.dev/@shadcnui-blocks/components/timeline-05) | Five visible descriptions and neutral numbered markers; no fabricated completed/pending project status. |
| Enquiry | [CTA button example](https://21st.dev/@meschacirung/components/call-to-action) | Prominent red homepage band, enquiry button and real telephone action. Supporting-page compact CTA retained. |
| Footer | [Agency Footer](https://21st.dev/@shadcnspace/components/footer-01) | Original white mark, real navigation/service links, phone/email/address, coverage and privacy link; responsive shared footer. |

## Interaction and motion

The gallery uses CSS scroll snap and a small local enhancement. Arrow keys, Home and End work when the track is focused; focusing an offscreen collection scrolls the whole card into view. Boundary controls disable correctly. Status announcements occur after scrolling settles. With JavaScript disabled, all four links remain in the native horizontal scroller and enhancement buttons stay hidden.

The service selector is native HTML and works without JavaScript. A captured toggle event coalesces one ScrollTrigger refresh after reflow. It never resets prepared/completed reveals. One outer gallery group shares the existing once-only motion owner; individual horizontally clipped cards and accordion panels stay static. The size-aware playback threshold, explicit starting states, reduced-motion path, session intro and native navigation fades are retained.

## Verification

- Astro diagnostics: 33 files, 0 errors/warnings/hints.
- Enquiry fixture tests: 13 passed, no external email sent.
- Homepage browser checks: 47 passed at 320, 390, 600, 768, 1024 and 1440px, including gallery boundaries/keyboard/focus/native wheel, service keyboard/exclusivity, real CTA destinations and JavaScript-disabled fallbacks.
- Automated WCAG-tagged axe samples: homepage at 320/390/1440px plus 14 supporting-page samples; 0 violations. Photographic contrast was marked incomplete and reviewed in decoded desktop/mobile captures; this is not a complete accessibility conformance claim.
- Shared layout matrix: 17 routes × 5 widths, 85 checks; no overflow. About hero remains full height/top-anchored; short landscape expands to fit.
- Continuous-scroll regression: 12 desktop/mobile page scenarios, 3,187 sampled frames and 115 observed starts; 0 opacity/mask resets, early starts or runtime errors. Includes opening the fourth service panel and traversing all horizontal gallery cards.
- Local 21st review of changed UI: 0 errors, 0 warnings, 24 informational colour-token suggestions in three CSS files. Core brand colours use existing tokens; overlay/neutral state colours are deliberate. No automatic fixes applied.

Desktop/mobile captures were reviewed with original images decoded. Browser automation uses Chromium on Windows; touch emulation does not establish physical iOS coverage. Published-release details and any subsequent live checks are recorded in netlify-deployment.md.
