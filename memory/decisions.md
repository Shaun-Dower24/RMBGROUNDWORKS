# Decisions

- Astro with TypeScript; content pages prerendered, enquiry endpoint dynamic. Initial Node adapter replaced by the Netlify adapter after the user's deployment request.
- Preserve original marks, font families and red/neutral identity; use existing darker red for small white button labels.
- Wide photographic hero and editorial layouts inspired by Infinity; native motion, natural scroll, no loader.
- Work in focus visual collections instead of fictional case studies.
- Generic SMTP transport avoids provisioning a vendor account. Recipient remains server-side; no real email during testing.
- Indexing opt-in for production. No trackers or third-party social embeds at launch.
- User selected a new rmb-groundworks project in the systemsAI Netlify team. Publish a manual review release without migrating the company domain; keep noindex and contact fallback until SMTP is supplied.
- Pre-optimised static photography uses Astro's passthrough service; unused image processing, sessions and Netlify development feature switches are disabled.
