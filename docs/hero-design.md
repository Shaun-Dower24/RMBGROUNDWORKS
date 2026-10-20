# About and supporting-page heroes

Updated 20 October 2026 in response to the request to fix the cropped About photograph and use 21st.dev hero inspiration on supporting pages.

## Visual decisions

- **About:** replace the large white introduction and cropped image strip with one full-viewport photographic hero. Keep the original gallery03 image, anchor its top edge, put desktop copy on the right away from the operatives, and use a portrait focal point on phones. A minimum dynamic viewport height fills the screen; short landscape screens grow to fit text and controls.
- **Services:** a shared `SplitHero.astro` pairs the message and enquiry action with original service photography. Desktop uses two columns; mobile reads copy first, then the image. Breadcrumbs and service-specific enquiry links are retained.
- **Our work:** a staggered pair of original photographs previews substructure and external works beside the introduction. The collection action links to the existing filter/gallery section.
- **Work details:** tighter editorial titles and photos shown at their natural aspect ratio prevent the previous strip from cutting the photographs. Gallery controls remain unchanged.
- **Contact:** a shorter two-column introduction exposes the form sooner, with a direct telephone route and an anchor to the enquiry section.

Poppins, Inter, the original logo, red/neutral tokens, real content and natural scrolling remain the design foundation. No new runtime library, tracking or generated photography was added.

## 21st.dev references and access

The [Editorial Image Hero](https://21st.dev/@felipemenezes098/components/hero-07) informed the image-led composition and asymmetrical hierarchy. [Split Hero With Image Cards](https://21st.dev/@felipemenezes098/components/hero-08) informed the split service composition and paired work photographs. The [split-screen guide](https://21st.dev/blog/split-screen-layout-components) informed mobile source order and minimum-height behaviour.

These are adapted design references, not copied React components. Existing Astro Media/Icon primitives are reused. CLI catalog search requires sign-in, so public pages supplied the reference material. Automatic approval review blocked the initial context-upload search; the fallback used a generic public search without project context. No project files were uploaded to 21st.dev.

## Verification

- Astro diagnostics: 27 files, 0 errors, warnings or hints.
- 17 routes at 320,390,768,1024 and1440px: 85 checks, no horizontal overflow, one main landmark and one h1 per route.
- About hero and photo both start at y0 and fill the viewport at all five widths; the h1 stays below the fixed header. Photo vertical position remains0%. On an844×390 landscape viewport the section expands to608px to keep its content visible.
- 14 WCAG-tagged axe samples across seven changed routes at390/1440px: 0 violations. Image-overlay contrast was marked incomplete on About/services and reviewed manually in captures; this is not a complete WCAG audit.
- About mobile menu opens/closes with Escape; reduced motion retains visible content; no runtime JavaScript errors during the audit.
- Desktop/mobile About, services, work and contact screenshots plus the short landscape layout were visually reviewed.
- `21st review` ran offline with deterministic local rules: 0 errors,0 warnings,75 informational hardcoded-colour suggestions across the stylesheet. It reviewed CSS, not Astro markup. Token declarations and intentional neutral/image scrims were retained; Astro diagnostics and browser checks cover the templates.

The homepage hero was not changed. Mail configuration and indexing retain the review-site settings documented in netlify-deployment.md.
