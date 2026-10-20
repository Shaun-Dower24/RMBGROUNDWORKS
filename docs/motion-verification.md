# Animation implementation and verification

Implemented 20 October 2026 after the user's “Implement plan.” instruction. The original animation checklist remains the acceptance record.

## Final behaviour

- Selected below-fold headings rise through line masks with up to 1.25° rotation on desktop. SplitText provides hidden visual copies and a complete readable label; explicit line breaks become spaces in that label. Completed splits revert to the original markup.
- Ordinary groups rise 16px on desktop/8px on mobile. Visual rows share a sequence with a 120ms total stagger. One content sequence and one supporting photo/rule sequence run at a time. Fast-passed groups, focused targets, anchors and filtered work cards settle immediately.
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

GSAP is pinned to 3.15.0. Production client files total **131,207 bytes raw / 51,264 gzip**: shared interaction script 5,706/2,035, conditional import wrapper 1,932/1,013, optional GSAP/reveal chunk 123,569/48,216. The previously inspected client baseline was 6,271/2,221. The sizeable optional chunk is the cost of the approved GSAP/ScrollTrigger/SplitText approach; contact and initially reduced-motion documents avoid its request. Gzip figures are locally compressed file sizes, not a claim about CDN transfer encoding.

The npm audit remains at the existing 13 high development-tool findings documented in dependency-audit.md. No backend, SMTP, tracking, domain or indexing settings were changed for animation. The Netlify review site retains noindex and its honest missing-mail fallback.

Production release, live samples and review artifacts are recorded below after publication.
