# RMB Groundworks project constitution

The approved Blueprint is RMBGROUNDWORKS-WEBSITE-CHECKLIST.md, authorised for implementation by the user on 20 October 2026. Build a premium Astro/TypeScript site preserving RMB's original logos, Poppins/Inter, red palette and original photography. Source of truth: researched public RMB site and approved checklist; content data in src/data/site.ts. Do not invent credentials, reviews, named projects or outcomes. The portfolio uses truthful visual work collections until client-confirmed case studies exist.

## Architecture and data contracts
- Pre-rendered pages: home, services and details, work index and visual work details, about, privacy, contact, 404. Interactive enhancement must preserve visible HTML and natural scrolling.
- Enquiry input JSON: {name:string, email?:string, phone?:string, company?:string, intent:'project'|'tender', location:string, service?:string, timeframe?:string, message:string, website?:string}. Require name, location, message and at least one valid contact method. website is a honeypot. All inputs bounded and validated server-side.
- Enquiry output: success HTTP200 {ok:true,message:string}; validation HTTP400 {ok:false,error:string,fields?:Record<string,string>}; origin rejection403; rate limit429; missing mail configuration503; delivery failure502. Never report success without transport acceptance; no silent storage or fake lead success.
- SMTP environment variables are server-only; missing configuration retains telephone/email fallbacks. No paid provider provisioned. No external messages sent during development; test only against local transport fixtures.
- Public route canonical host https://www.rmbgroundworks.co.uk. Preview is noindex unless SITE_INDEXABLE=true at build. No analytics installed.

## Phase and maintenance
Blueprint accepted by implementation request. Link: repository verified; assets/packages being verified. Architect: templates, data and server handlers separate. Stylize: responsive, reduced motion, keyboard and screenshot review. Trigger: npm run dev/build/start; production launch requires a separate explicit instruction and completed mail/domain/privacy review.

Use memory/ for decisions/results. Keep temporary evidence in .tmp/. Never commit credentials, node_modules, build files, enquiry data or original oversized photo masters. Update docs/content-status.md and README with honest setup/launch requirements.
