# RMB Groundworks — animation checklist

Prepared and implemented: 20 October 2026. **Implementation authorized by the user.** See [motion verification](motion-verification.md) for the final design, tests and remaining device-test limits.

Primary motion reference: [Infinity Constructions](https://infinityconstructions.com.au/). This checklist incorporates the request to use its animation techniques for RMB's scrolling, first-session introduction and page changes.

## 1. Proposed direction for the build

- [x] Build an Infinity-inspired motion system: masked text entrances, image wipes, drawing divider lines and coordinated page entrances.
- [x] Use RMB's original logo, photographs, Poppins/Inter and red/charcoal identity throughout.
- [x] Make the initial introduction run once per browser-tab session; keep ordinary page changes much shorter.
- [x] Preserve the About hero's full viewport height and top-anchored photograph, including the mobile focal point and clearance above Netlify's badge.
- [x] Keep native scrolling, accessible navigation and immediate enquiry routes. Essential information must remain usable if animation cannot run.
- [x] User authorized implementation with “Implement plan.” after reviewing the Markdown plan.

### What was actually found on Infinity

The reference was inspected in a live Chromium browser and through its publicly delivered homepage/theme bundle. Paragraph lines were observed masked and translated before scrolling, then settled after entering view. Its bundle contains GSAP/ScrollTrigger, text splitting, Swiper and Lottie. [Homepage](https://infinityconstructions.com.au/), [public theme bundle](https://infinityconstructions.com.au/wp-content/cache/min/1/wp-content/themes/infinity-constructions/dist/main.js?ver=1791528792).

| Reference behaviour                                               | Proposed RMB equivalent                                                |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Non-looping branded intro followed by a coordinated entrance      | Original RMB logo sequence, then an overlapping heading/hero entrance  |
| Staggered text lines rising out of masks with slight rotation     | Selected headings and short introductory copy reveal line by line      |
| Image/container wipes in opposite directions, with scale settling | Selected below-fold photographs uncover inside their existing frames   |
| Separators grow into place                                        | Service-row rules and process connectors draw as their sections enter  |
| Distinct incoming-page timelines                                  | One coordinated entrance for each RMB page template                    |
| Slideshow/counters                                                | Retain RMB's manual slideshow; do not add unverified business counters |

The inspected bundle did not establish a once-per-session rule or a dedicated intercepted page-navigation system. Session gating and the between-page fade below are RMB additions. The review sampled the homepage, About navigation and delivered source; it was not an exhaustive audit of Infinity's plugins or mobile behaviour.

## 2. Technical approach

- [x] Use GSAP and ScrollTrigger for the coordinated scroll/entry sequences. Verify and pin current compatible versions during implementation; do not copy the reference site's older dependency versions.
- [x] Use GSAP SplitText for selected plain-text line reveals, with responsive re-splitting and accessible text handling. Do not split form labels, navigation links or paragraphs containing interactive links. The current plugin documents line masks, font/width reflow handling and accessibility limitations. [SplitText documentation](https://gsap.com/docs/v3/Plugins/SplitText/).
- [x] Give every element one animation owner. Migrate affected existing reveal behaviour rather than running the current IntersectionObserver/CSS animation and GSAP on the same target.
- [x] Keep simple button, arrow and hover feedback in CSS. Preserve the existing manual slideshow and gallery controls.
- [x] Keep Astro's current full-document navigation. Add browser-native cross-document transitions as an enhancement; do not introduce ClientRouter for this decorative work. Astro distinguishes native transitions from its router, whose script lifecycle would require a separate functional refactor. [Astro comparison](https://docs.astro.build/en/guides/view-transitions/#differences-between-browser-native-view-transitions-and-astros-clientrouter-).
- [x] Recreate RMB-specific choreography. Do not import Infinity's custom bundle, Lottie JSON, artwork, WordPress theme or business claims. The proposed RMB intro can use its existing SVG/logo; a Lottie runtime is not required for a simple mark/rule sequence.

ScrollTrigger can coordinate viewport-triggered animations without replacing native scrolling. Mobile/reduced-motion variants should be managed centrally and reverted cleanly when their conditions change. [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [GSAP media-query lifecycle](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>).

## 3. Motion specification

These are proposed RMB timings, not measurements of Infinity's exact easing or durations.

| Protocol                | Desktop proposal                                                                                               | Mobile / reduced motion                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Heading/short lead      | Rise from a line mask over 650–800ms; 60–80ms line stagger; rotation at most 1.5°; whole group within 1 second | Shorter 400–550ms entrance with no rotation; reduced motion shows complete text immediately  |
| Ordinary content group  | Opacity plus 12–16px rise over 450–550ms                                                                       | 6–8px rise over 350–450ms; reduced motion is static                                          |
| Selected image wipe     | Frame/image counter-motion over 700–850ms; image settles from at most 1.04× to its normal size                 | Opacity-only 300–400ms; reduced motion is static                                             |
| Divider/process rule    | Scale along its own axis over 500–650ms                                                                        | Shorter draw or static; no layout-width animation                                            |
| First-session intro     | Approximately 1.0–1.2 seconds, with a 1.5-second maximum and immediate dismissal                               | Shorter sequence; skip entirely for reduced motion                                           |
| Between-page transition | Approximately 180–240ms crossfade; no forced navigation delay                                                  | Same short fade where supported; ordinary navigation for reduced motion/unsupported browsers |

- [x] Use one shared easing/timing vocabulary; favor smooth ease-out entrances and avoid bounce/elastic movement.
- [x] Trigger below-fold groups once a meaningful portion is in view: use half the element height, with the viewport inset bounded to 30–45% of screen height (top normally at 55–70%). Short copy is fully visible; tall photos/cards do not need to fit the entire screen. Clamp triggers to the document scroll range.
- [x] Play reveals once per document visit; keep completed content visible when scrolling back up.
- [x] Keep already-visible content settled if motion initializes late. Never hide a readable section merely to replay its entrance.
- [x] Start each local row immediately on viewport entry; never queue readable content behind unrelated sequences. Cap a card-row stagger at 160ms.
- [x] Do not pin sections, force horizontal scrolling, replace the scroll engine or add continuous parallax in this pass.
- [x] Keep original image dimensions and final crop positions. Do not apply wipe/zoom movement to the About hero photograph.

## 4. Scroll choreography by page

| Page/area            | Planned sequence                                                                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home hero            | Original photo appears immediately. Heading lines, short introduction and actions form one coordinated entrance; slider controls remain usable. Retain manual slide changes. |
| Home introduction    | Reveal section label, then heading/short lead; use one restrained image wipe on the adjacent photograph.                                                                     |
| Featured work        | Reveal the section heading, then cards in visual rows; use one effect per card rather than separate moving captions/images/actions.                                          |
| Services and process | Draw row separators; reveal each service row as a unit. Introduce process stages in reading order with a decorative connector.                                               |
| About hero           | Animate the copy only. Preserve desktop center-top/mobile 18%-top focal points, minimum dynamic viewport height and short-landscape growth.                                  |
| About body           | Use selected image wipes, grouped copy and a small stagger on audience/process items.                                                                                        |
| Services hub/details | Shared SplitHero copy entrance; photo immediately available. Below-fold service articles and consideration groups reveal as units.                                           |
| Work index           | Paired hero photos fade into their final positions; cards reveal by row. Filtering updates immediately without animated grid shuffling.                                      |
| Work details         | One title/metadata entrance. Keep full-aspect gallery images; use subtle image entrances without changing their natural size or lightbox behaviour.                          |
| Contact/privacy/404  | Essential copy, form fields, phone/email links, error messages and recovery actions stay visible immediately. At most animate the contact introduction.                      |
| Final enquiry band   | One short grouped entrance as it enters view; do not delay or repeatedly pulse the action.                                                                                   |

- [x] Keep divider lines and counters decorative; do not suggest verified project statistics or completion states that RMB has not supplied.
- [x] After filtering, settle visible cards and refresh relevant trigger positions; a previously hidden card must never remain transparent or untabbable.
- [x] Finish a waiting reveal immediately when keyboard focus enters it or a hash link targets it.
- [x] Recalculate line wrapping/trigger positions after fonts and responsive widths change. Preserve completed state instead of replaying every heading on resize.
- [x] Prevent mask wrappers clipping Poppins descenders, focus outlines, image captions or clickable card edges.

## 5. First-visit session introduction

### Proposed visual sequence

- [x] Use a charcoal cover with the existing white RMB mark and a single red rule. Keep the treatment consistent with the website's original branding.
- [x] Fade the mark in, animate the rule once, then dissolve/lift the cover while the destination heading begins to settle into place.
- [x] Overlap the last part of the intro with the hero entrance; do not chain a full intro, page fade and another delayed headline sequence.
- [x] Make this an honest brand introduction. Do not show a fake percentage, simulated asset count or claim that every file is loading.
- [x] Do not wait for all gallery images, network-idle, third-party widgets or font completion. The intro cannot represent network/server waiting before the first HTML arrives.
- [x] If the sequence cannot start before the page is already visible, skip it instead of adding a late cover.

### Session and entry rules

Use an origin-scoped browser-tab session flag. Session storage survives navigation/reloads and may survive browser restoration; a new tab opened from another can inherit a copy of the flag. It is not an account-wide or cross-device session. [MDN sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

| Entry situation                                                                        | Required result                                                                         |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| First visible entry to Home/About/Services/Work in a fresh tab session                 | Play the RMB intro once, then continue into that page                                   |
| Internal link, refresh or later return in that tab                                     | No full intro; use the appropriate short page-entry behaviour                           |
| Back/Forward or restored page                                                          | No intro; preserve browser restoration                                                  |
| Direct Contact, Privacy, 404 or a URL targeting a section by hash                      | Skip the cover and record the session as seen, so it does not appear unexpectedly later |
| Reduced motion                                                                         | Skip intro; show the page immediately                                                   |
| Storage blocked/unavailable, background/prerendered document or initialization failure | Skip intro; ordinary usable page                                                        |

- [x] Store only a versioned seen flag; do not store enquiry data or add an account/session backend for this effect.
- [x] Write the seen flag before playback starts so an interrupted intro cannot replay repeatedly.
- [x] Treat reduced-motion and hidden/prerendered entry bypasses as seen when storage is writable. Never start a delayed intro when the preference/visibility changes or on a later internal page. If session eligibility is uncertain, skip it.
- [x] Guard all storage access. Accept opener-tab inheritance; do not introduce cookies solely to force another intro.
- [x] Dismiss immediately on Escape, pointer/touch interaction, keyboard focus or scrolling. Do not trap focus, lock scrolling or disable the underlying page.
- [x] Keep the decorative cover out of the accessibility tree; do not announce false loading status.
- [x] Make the document usable without JavaScript. The cover must have an independent maximum-duration cleanup, including if the animation library fails.
- [x] On reduced-motion changes, explicitly remove/hide the cover and restore final styles. Merely stopping its exit animation must not strand it on screen.
- [x] Clear stale cover/timeline state on restored documents without rebinding existing handlers. The browser's pageshow event includes history/bfcache restoration. [MDN pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event).

The bounded, once-per-session treatment also follows the principles in [21st's preloader reference](https://21st.dev/blog/react-preloader-components), while Infinity remains the visual/choreographic reference.

## 6. Page changes and incoming-page animation

- [x] Use a short native same-origin crossfade between participating pages, then coordinate the incoming heading/lead sequence with that fade.
- [x] Keep the outgoing document readable until navigation can complete. Do not prevent a link's default action merely to wait for an exit timeline.
- [x] Enable the enhancement consistently on source/destination pages. Cross-document view transitions require same-origin participation, and browser support remains uneven; normal document navigation is the required fallback. [MDN cross-document transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition).
- [x] Avoid separate logo/header morphs and unrelated photograph morphing in the first pass. Check white/overlay header changes for ghosting or flashes.
- [x] Keep anchors, telephone/email links, downloads, external destinations, modified clicks, form submission and gallery/filter/menu actions outside the page-change choreography.
- [x] Preserve native Back/Forward scroll and form restoration. Do not force scroll-to-top, replay a fresh hero entrance over a restored view, or resubmit an enquiry.
- [x] Keep page titles, skip links and keyboard focus correct. Do not impose a blanket focus jump after every navigation.
- [x] Verify the native-transition snapshot and GSAP initialization never capture a blank heading or create a visible–hidden–visible flash, including with slow fonts/modules. Skip an entrance if its initial frame cannot be prepared in time.
- [x] Confirm a returning mobile menu or dialog cannot leave main content inert or the body scroll-locked.
- [x] Use browser transition APIs for this native approach. Do not mix in Astro router-only transition directives/events; those belong to ClientRouter. [Astro transition API](https://docs.astro.build/en/reference/modules/astro-transitions/).

### Coordinate the three layers

| Situation                            | Intro | Page-change fade            | Heading/scroll motion                                           |
| ------------------------------------ | ----- | --------------------------- | --------------------------------------------------------------- |
| First eligible visit                 | Once  | None needed                 | Heading overlaps the intro exit; scroll groups run when reached |
| Ordinary internal page change        | Never | Short fade if supported     | Incoming heading overlaps the fade; no extra hold               |
| Same-page anchor                     | Never | None                        | Natural anchor behaviour; settle its target immediately         |
| Back/Forward/restoration             | Never | Browser enhancement may run | Preserve restored state; no forced replay or scroll reset       |
| Reduced motion or failed enhancement | None  | None                        | Complete, static, usable content                                |

## 7. Performance and implementation boundaries

- [x] Prefer opacity/transforms for animation; do not animate layout dimensions or retain unnecessary compositor layers. Profile image masks before extending them site-wide. [Browser performance guidance](https://web.dev/articles/animations-guide).
- [x] Load only the selected GSAP modules. Record their actual compressed cost and compare production loading/interactivity against the current site before accepting the added payload.
- [x] Avoid new videos, animation canvases or large Lottie files for this simple RMB intro. Keep existing responsive photos and reserved layout space.
- [x] Create motion only when its dependencies/targets are ready. If setup fails, expose final states rather than hiding content.
- [x] Dispose/revert completed or abandoned timelines, text splits and triggers while preserving settled, visible content; cleanup must not restore a hidden waiting state. Manage mobile/preference changes centrally; avoid repeated listeners or per-element unthrottled scroll handlers.
- [x] Preserve the existing enquiry API, form validation, gallery focus return, filters and truthful content. No backend, tracking or business-claim work belongs to this animation pass.

Implemented touch points:

| File/area                               | Intended responsibility                                                                              |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| src/layouts/Base.astro                  | Shared intro integration, defensive early session decision and native page-transition opt-in         |
| src/components/SessionIntro.astro — new | Accessible decorative RMB intro markup                                                               |
| src/scripts/motion.ts — new             | Motion setup, choreography, preference handling and cleanup                                          |
| src/styles/motion.css — new             | Shared motion styles and guaranteed static/failure states                                            |
| src/scripts/site.ts                     | Remove/relocate only reveal behaviour owned by the new motion module; preserve existing interactions |
| Existing page/component templates       | Target selected headings, image frames, rules and groups without restructuring content               |
| .21st design context and docs           | Record the final accepted Infinity-derived motion choices and verification                           |

## 8. Implementation and acceptance checklist

- [x] After implementation is authorized, prototype one heading reveal, one image wipe and one divider on a supporting page first.
- [x] Review that prototype at desktop/mobile widths and with reduced motion before applying the same protocols across templates.
- [x] Add the session intro and page-transition coordination only after the scroll primitives are stable.
- [x] Verify all 17 content routes at 320, 390, 768, 1024 and 1440px, plus a short landscape viewport. Keep the About hero full-height and its scroll action clear of the hosting badge.
- [ ] Check current Chrome/Edge, Safari/iOS and Firefox. Verify the unanimated navigation path wherever native transitions are unsupported.
- [ ] Test a fresh session, internal navigation, reload, Back/Forward, opener-created tabs, restored tabs, direct deep links and direct contact entry against the session table.
- [x] Test disabled JavaScript, blocked storage, delayed/failed animation modules, failed images/fonts, slow CPU/network and switching reduced motion during an animation. No permanent overlay or hidden content may remain.
- [ ] Check keyboard/skip-link navigation and screen-reader reading order. Text splitting must preserve the heading's meaning without duplicate or letter-by-letter announcements.
- [x] Confirm the first click/tap/keyboard activation during the cover still performs its intended action, rather than only dismissing the cover or swallowing a CTA/navigation event.
- [x] Fast-scroll both directions and resize/rotate during reveals. Completed groups must remain readable, with no layout shift, clipping or horizontal overflow.
- [x] Repeat hero, menu, filter, lightbox and enquiry feedback checks. Verify that animation does not duplicate submissions or discard typed details; use mocked mail for testing unless a controlled delivery is separately authorized.
- [x] Compare production bundle size, rendering, layout stability and interactivity against the pre-animation baseline; investigate any material regression.
- [x] Run Astro diagnostics, production build and relevant interaction/accessibility checks; record limitations instead of treating automated checks as complete accessibility proof.
- [x] Capture a short motion recording and settled desktop/mobile screenshots for review, then update the existing pull request with the motion specification and evidence.
- [x] Publish through the established Netlify workflow only as part of the later authorized implementation/release task. Keep the review site's indexing and mail-configuration status documented.

## Implementation status

The motion system is implemented and verified in Chromium, installed Microsoft Edge, Firefox and the Windows WebKit test engine. Real Safari/iOS hardware, full browser-restart tab restoration and an assistive-technology listening pass remain outside this environment. The original enquiry backend is unchanged; tests use fixtures or browser mocks and no external email was sent. Release evidence is recorded in motion-verification.md and netlify-deployment.md.
