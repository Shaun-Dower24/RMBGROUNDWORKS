import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://www.rmbgroundworks.co.uk',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  devToolbar: { enabled: false },
  security: {
    allowedDomains: [
      { hostname: 'www.rmbgroundworks.co.uk', protocol: 'https' },
      { hostname: 'rmbgroundworks.co.uk', protocol: 'https' },
      { hostname: '127.0.0.1', protocol: 'http' },
      { hostname: 'localhost', protocol: 'http' },
      ...(process.env.PREVIEW_HOST
        ? [{ hostname: process.env.PREVIEW_HOST, protocol: 'https' }]
        : []),
    ],
  },
  server: { host: '127.0.0.1' },
});
