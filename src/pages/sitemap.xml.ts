import type { APIRoute } from 'astro';
import { services, workStudies } from '../data/site';
export const prerender = true;
const paths = [
  '/',
  '/about/',
  '/services/',
  '/projects',
  '/contact/',
  '/privacy/',
  ...services.map((s) => `/services/${s.slug}/`),
  ...workStudies.map((w) => `/projects/${w.slug}/`),
];
export const GET: APIRoute = () =>
  new Response(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      paths
        .map((path) => `<url><loc>https://www.rmbgroundworks.co.uk${path}</loc></url>`)
        .join('') +
      '</urlset>',
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
