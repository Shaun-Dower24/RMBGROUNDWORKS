# Animation implementation and verification

Implemented 20 October 2026 after the user's “Implement plan.” instruction. The original animation checklist remains the acceptance record.

## Final behaviour

- Selected below-fold headings rise through line masks with up to 1.25° rotation on desktop. SplitText provides hidden visual copies and a complete readable label; explicit line breaks become spaces in that label. Completed splits revert to the original markup.
- Ordinary groups rise 16px on desktop/8px on mobile. Visual rows share a sequence with a 120ms total stagger. Each visual row starts as soon as it reaches its viewport trigger; there is no global playback queue. Fast-passed groups, focused targets, anchors and filtered work cards settle immediately.
- Home/About body photographs wipe inside their existing frames with restrained counter-motion and a maximum 1.04 image scale. Mobile uses opacity only. Hero photographs and natural work-detail aspect ratios remain intact.
- Service/process separators draw horizontally. The original manual slideshow, links, filters, native gallery, disclosures and enquiry controls retain their behaviour.
- The original RMB mark and red rule appear on charcoal for 1.2s desktop/.95s mobile on the first eligible tab-session entry. A versioned sessionStorage seen flag is written before playback. Direct contact/privacy/404/hash entries, reduced motion, hidden entry and unavailable storage bypass the cover. No cookies, backend sessions, progress claims, scrolling locks or focus traps are added. The cover never intercepts input; input dismisses it without cancelling the underlying action. CSS exit and a separate 1.5s cleanup work independently of GSAP.
- Native same-origin document transitions crossfade for 220ms where supported. Links retain default navigation, browser scroll/form restoration and ordinary-navigation fallback. There is no ClientRouter or intercepted exit delay.

**Deliberate implementation refinement:** first-frame hero heading/lead/action entrances use CSS with a visible 50% opacity starting state; the photo is immediately available. SplitText is reserved for still-below-fold headings. This prevents late animation modules from hiding readable hero text or a native transition snapshot. GSAP loads conditionally, excluding contact/privacy/404, initially reduced-motion and Back/Forward documents. Width changes settle remaining effects; they do not replay completed content.

## Local evidence

- Prototype: one About heading, image and rule at desktop/mobile widths and reduced motion; settled screenshots reviewed.
- Astro diagnostics: 29 files, zero errors/warnings/hints. Production build passes. Thirteen existing enquiry tests pass using fake transports.
- Existing layout matrix: 17 content routes × five widths (320/390/768/1024/1440), plus short About landscape. No overflow; About photo remains at y0, full viewport height, with original desktop/mobile focal points and badge clearance.
- Fourteen WCAG-tagged axe scans across seven route patterns at 390/1440px: no violations. Image-overlay colour contrast remains an automated incomplete item requiring visual judgement, as before. This is not a complete WCAG or screen-reader certification.
- Twenty-four interaction checks pass for manual hero, menu focus/trap/Escape, filters/count, gallery navigation/focus, enquiry validation/failure recovery/mocked acceptance, reduced motion and FAQs. No external email was sent.
- Thirty-five additional scroll/layout samples across seven templates and five widths: no hidden in-view content, overflow or runtime errors. Maximum observed synthetic layout shift was 0.0402 in that run; it is not a field Core Web Vitals measurement.
- Session/failure protocol suite passes in Chromium, installed Microsoft Edge, Firefox 156 and the Windows WebKit 26.6 test engine. Cases include first visit, reload, internal navigation, Back scroll restoration, opener inheritance, direct contact/privacy/hash/404, focus/anchor settlement, live reduced-motion changes, instant long jumps, blocked storage, JavaScript disabled, failed/delayed motion module, failed fonts/photos, simulated hidden entry and a first CTA click through the cover. Native cross-document transition was observed in Chromium/Edge/WebKit; Firefox used normal navigation.
- Local 21st CSS review: zero errors/warnings, 75 informational existing hard-coded-colour suggestions. No project-context upload or catalog code was used.

Real Safari/iOS hardware, full browser-restart tab restoration and an assistive-technology listening pass are still unverified. Test-engine/mobile viewport checks must not be presented as physical-device coverage.

## Bundle and operational impact

GSAP is pinned to 3.15.0. Production client files total **131,117 bytes raw / 51,211 gzip**: shared interaction script 5,706/2,035, conditional import wrapper 1,932/1,013, optional GSAP/reveal chunk 123,479/48,163. The previously inspected client baseline was 6,271/2,221. The sizeable optional chunk is the cost of the approved GSAP/ScrollTrigger/SplitText approach; contact and initially reduced-motion documents avoid its request. Gzip figures are locally compressed file sizes, not a claim about CDN transfer encoding.

The npm audit remains at the existing 13 high development-tool findings documented in dependency-audit.md. No backend, SMTP, tracking, domain or indexing settings were changed for animation. The Netlify review site retains noindex and its honest missing-mail fallback.

## Published release

Netlify deployment **6ad7c5969664749aed8b0c6d**, code commit **07385e4**, is confirmed ready at [the live review site](https://rmb-groundworks.netlify.app). [Immutable release](https://6ad7c5969664749aed8b0c6d--rmb-groundworks.netlify.app).

The full 44-case/observation protocol suite passed against production in Chromium with no runtime errors. Blocking the actual versioned animation asset leaves static content usable. Six live About geometries and the anchor action pass, including short landscape. A live WebKit touch/mobile-emulation check confirmed menu navigation, usable Back restoration, y0 photo, original focal point and 72px clearance at 390×844.

A single illustrative Chromium run at 4× CPU slowdown, 120ms network latency and 200kB/s download sampled the previous immutable About release and the new first/seen sessions. Observed CLS was approximately 0.0004 before and 0.0051 after; headings remained readable, the cover cleared and no horizontal overflow appeared. The new runs recorded three tasks over 50ms versus zero in that previous sample. The optional 48kB-gzip GSAP chunk and Netlify's injected badge script contribute extra work; conditional loading limits that cost on essential/reduced-motion routes. This is not a controlled benchmark or field-performance claim: CDN/cache/injection conditions differ, and an intro can also change the element counted as LCP. No speed-improvement claim is made.

Review artifacts saved in the task outputs: `rmb-motion-preview.webm` (13.4 seconds), `rmb-session-intro-live.png`, `rmb-motion-about-desktop.png` and `rmb-motion-about-mobile.png`. Desktop/mobile captures and a frame from the recording were visually reviewed. The existing pull request was updated; it remains open and unmerged.


## Scroll-flashing correction

The user's report revealed a defect the original settled-state checks missed. A continuous-wheel trace of the published About page captured **eight visible-to-transparent opacity resets**: paused `from()` tweens deferred their initial hidden state until playback, and the global queue could start them after content was already readable.

The correction sets initial states synchronously while targets are still below the viewport, then uses explicit forward `to()` animations. Each row starts on entry without waiting for unrelated animations. Natural completion no longer seeks its own tween from inside the completion callback. Line preparation waits for fonts; already-reached content remains static. Intro and page-transition behaviour is unchanged.

A permanent Playwright CLI regression check is saved at `tests/browser/scroll-motion.mjs`. It samples actual frames during normal wheel scrolling, upward return and another downward pass, checking for opacity/mask regressions rather than only final visibility. The local fix passed **12 scenarios across six templates at 1440/390px, 2,930 sampled frames, zero regressions and zero runtime errors**. Firefox About sampling also reported zero resets. Reduced-motion changes, anchors, filters and resize cleanup pass. Astro diagnostics and production build pass.

These results supersede the earlier implication that settled screenshots alone established smooth scrolling. Corrected code commit **8f8aeb7** is published as Netlify deployment **6ad7c9a8d47111418290fffa**, confirmed ready. The same production regression passed **12 scenarios / 2,924 sampled frames / zero opacity or mask regressions / zero runtime errors**. The live page was refreshed in the user's existing in-app tab. A new actual scroll recording (`rmb-scroll-fix-preview.webm`) and settled audience-section screenshot (`rmb-scroll-fix-live.png`) were saved and visually reviewed. The release retains the session intro, page fades, original assets and full-height hero.


## Later, size-aware scroll triggers

The user requested that animation begin only once content is properly in view. The shared `top 85%` trigger is replaced by a size-aware inset: half the element height, bounded between 30% and 45% of viewport height. Short copy is fully visible and larger photos/cards have a substantial portion on screen before playing. Start values are clamped to the scrollable page range; rules use their parent row's trigger so they stay coordinated. Once-only playback, explicit offscreen starting states and immediate local playback remain intact.

The About desktop photo's measured visible area at first playback increased from 185/650px to 335/650px. At 390×844, the 277px-tall photo was fully visible at first playback. Selected headings were also fully within view in the desktop/mobile timing samples. The slow-wheel timing sample recorded 14 starts per viewport.

The saved regression check now validates first-play visible area as well as opacity/mask continuity, using untransformed line height for rotated text. Local verification: 12 desktop/mobile scenarios, 2,926 sampled frames, 141 observed starts, zero early-start failures, zero opacity/mask regressions and zero runtime errors. Astro diagnostics pass. Release evidence follows after publication.
