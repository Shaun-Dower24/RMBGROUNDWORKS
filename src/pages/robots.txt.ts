import type { APIRoute } from 'astro';
export const prerender = true;
export const GET: APIRoute = () =>
  new Response(
    import.meta.env.SITE_INDEXABLE === 'true'
      ? 'User-agent: *\nAllow: /\nSitemap: https://www.rmbgroundworks.co.uk/sitemap.xml\n'
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
