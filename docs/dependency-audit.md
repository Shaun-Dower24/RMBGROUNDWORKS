# Netlify dependency audit

Reviewed 20 October 2026 for Astro 7.4.1 and `@astrojs/netlify` 8.2.10. No dependency fixes were applied during this review.

## Installed dependency report

`npm audit --json` reported 13 high package findings. These are propagated through Netlify's development tools from three affected packages, rather than 13 independent flaws in application code:

| Affected package     | Dependency path below the adapter                                                       | Status                                                                                                                                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `braces` 3.0.3       | Vite plugin → Netlify Dev → Functions Dev → Zip It and Ship It → Fast Glob → Micromatch | [Nested-pattern stack exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm); no patched release available.                                                                                                                                      |
| `node-forge` 1.4.0   | Vite plugin → Netlify Dev → Images → IPX → Listhen                                      | [RSA signature verification issue](https://github.com/advisories/GHSA-86w9-cpqp-85rv); no patched release available.                                                                                                                                     |
| IPX's `sharp` 0.34.x | Vite plugin → Netlify Dev → Images → IPX                                                | Native image dependency advisories: [libvips](https://github.com/advisories/GHSA-f88m-g3jw-g9cj), [libheif](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), and [librsvg](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). Fixed in Sharp 0.35.5. |

Registry checks confirmed the adapter, Braces, and Forge were already at their latest published versions. There is no complete compatible upstream upgrade available at this review date. Do not run `npm audit fix --force`: its proposed adapter 6.4.1 downgrade is incompatible with the project's Astro 7 peer dependency. IPX 3 declares Sharp `^0.34.4`; forcing 0.35.5 is outside that range and would not fix Braces or Forge.

The Vite plugin starts its emulator in `configureServer`, rather than during a production build. Keep development bound to loopback. The configured `devFeatures: false` disables the adapter's image, environment-variable, and edge emulation switches; it does not remove those installed dependencies or disable every Netlify Dev subsystem.

## Generated runtime evidence

Inspected the final CLI build with `netlify({ devFeatures: false, imageCDN: false })`, Astro's `passthroughImageService()`, and `session: false`. This adapter version writes the deployable function to `.netlify/v1/functions/ssr/`, rather than `.netlify/functions-internal/`.

- Generated wrapper timestamp: **2026-10-20 18:49:46.894 UTC** (19:49:46 BST).
- Function directory: **323 files; 3,839,081 bytes uncompressed**.
- Wrapper `ssr.mjs`: **8,627 bytes**; imported server entry: **236,036 bytes**.
- Scan covered every file path, package manifest, and **all 323 JavaScript/JSON files totalling 3,839,081 bytes**.
- No package paths or text matches for `ipx`, `node-forge`, `braces`, `micromatch`, `fast-glob`, `@netlify/dev`, `@netlify/functions-dev`, `@netlify/images`, `@netlify/zip-it-and-ship-it`, `@netlify/vite-plugin`, or `sharp` were found in that function directory.
- The wrapper imports the generated server entry, uses `nodeBundler: 'none'`, and prefers static files. Nodemailer 10.1.7 remains present for the enquiry endpoint.
- Deployment `6ad7b7c3be6bba7e171cf407` succeeded; Netlify reported its Node 24 SSR function as **1,261,497 bytes compressed**.

The site's authored image markup uses pre-optimised local files. The passthrough service removes the unused Sharp dependency from this runtime artifact; no `.node`, `.dll`, `.so`, `.dylib`, or `.wasm` files are present. The earlier Windows native Sharp limitation therefore does not apply to this build.

Wrapper SHA-256: `1a744a2347f99bb049bb45bc45ecb58726229cb8257e046f519f761749b1e986`.

This is dependency and local artifact inspection, not a proof of general application security. The deployment size is provider-reported; remote bundle contents were not independently downloaded or compared byte for byte. The review excludes exploitation tests and future builds. Repeat after adapter, lockfile, image-service, or build-platform changes. The installed-tree audit remains at 13 high findings even though the identified vulnerable package paths are absent from this inspected runtime artifact.
