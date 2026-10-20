# RMB Groundworks design context

Preserve the original RMB identity and use Infinity-inspired photographic scale, editorial spacing and project/service storytelling for a UK groundworks website.

- Poppins display and Inter body typography, original logo PNG/white SVG, and original photographs.
- Brand red #EC2028, action #D11C23, ink #171717, white #FFFFFF and mist #F4F3F0.
- Wide photographs, generous spacing, quiet service rows and useful project/tender actions.
- Natural scroll, manual hero, restrained entrances, native image dialog and reduced motion.
- Five service groups retain nine existing services. Six truthful visual work collections. No invented testimonials, credentials, statistics or named project outcomes.

Sources: src/styles/global.css, docs/asset-register.md and the research checklist. The 21st context was initialized; CLI catalog access requires sign-in. No catalog code or metered generation was used and no project context was uploaded.

The supporting-page redesign adapts the public [Editorial Image Hero](https://21st.dev/@felipemenezes098/components/hero-07) and [Split Hero With Image Cards](https://21st.dev/@felipemenezes098/components/hero-08) references in native Astro. About uses a full-screen, top-anchored original photograph. Services use SplitHero.astro; the work index uses staggered photo columns, and contact keeps a concise editorial opening. Responsive choices follow the public [split-layout guide](https://21st.dev/blog/split-screen-layout-components): copy first on mobile and a minimum viewport height that can grow to fit content. Verification and tradeoffs are recorded in docs/hero-design.md.

Motion follows the accepted Infinity-derived animation checklist: GSAP/ScrollTrigger/SplitText for below-fold content; original once-per-tab intro and native 220ms document fades. Immediate hero entrances use CSS to avoid late hidden headings. Respect reduced motion, first input and browser restoration. See docs/motion-verification.md.
