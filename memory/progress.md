# Progress

- Repository inspected and cloned; source checklist present.
- Public assets, content model and enquiry implementation delegated with separate file ownership.
- Shared application scaffolding established.
- Original assets, fonts, shared templates and 17 content routes implemented.
- SMTP endpoint and 13 fake-transport unit tests implemented; no external email sent.
- Passed type/build checks, 85 responsive checks, 7 axe samples, 24 interaction checks, JavaScript-disabled fallbacks, static references and built-server probes.
- Fixed CTA reflow, label contrast, menu focus/trap, form error semantics, metadata and host-origin settings during QA.
- Screenshots reviewed; final results and launch limits recorded in docs/implementation-status.md.
- Published the user-requested Netlify review site; SMTP, real delivery, company-domain migration and owner content/privacy checks remain documented release steps.
- Netlify adapter build, diagnostics and 13 unit tests passed. Live HTTP checks passed for 17 content routes, sampled assets, robots/sitemap, custom404 and API405/400/403/503. No external email was sent.
- Replaced the About title/image strip with a full-viewport, top-anchored photographic hero. Adapted public 21st editorial/split references for services, work and contact. Passed85 width/route checks,14 axe samples (0 violations; image contrast manually reviewed), short-screen and mobile-menu checks. Details: docs/hero-design.md.

- Animation release 07385e4 published to Netlify deployment 6ad7c5969664749aed8b0c6d (ready). Scroll masks/wipes/rules, session intro and native page fades verified locally and live; no backend changes or external mail. Evidence and remaining physical-device limits: docs/motion-verification.md.

- User-reported flashing reproduced as eight visible-to-hidden resets. Fixed deferred from-tweens/global queue in 8f8aeb7; ready Netlify deployment 6ad7c9a8d47111418290fffa. Saved frame-level browser regression: 2,930 local / 2,924 live frames, 12 scenarios each, zero resets. Settled screenshots alone did not catch the original defect.

- Later animation starts requested: 0ab5ba0 published in ready deployment 6ad7ccacf15425f5b390fe7f. Trigger inset uses half element height bounded to 30–45% of viewport, with page-range clamping. Local 12 scenarios/141 starts: no early starts or flashing; live 28 starts confirm later timing.

- Approved homepage shortlist implemented: split intro, manual gallery, five-service native media accordion, neutral process timeline, prominent CTA and shared footer. Local 47 homepage checks, 85 route/width checks, 17 axe samples (zero violations) and 12 frame-level scenarios passed; no animation regressions across 3,187 sampled frames. Details: docs/homepage-design.md.

- Homepage refresh d5a4ba5 published in ready Netlify deployment 6ad7d46093e09150c3b88b00. Live 47 homepage checks, 12 scroll scenarios/3,189 frames/115 starts and 44 session/failure observations passed. Saved decoded desktop/mobile screenshots and motion video. PR remains open; Git CD remains disconnected.
