import { defineConfig, passthroughImageService } from 'astro/config';
import netlify from '@astrojs/netlify';

const deploymentHosts = [
  process.env.URL,
  process.env.DEPLOY_URL,
  process.env.DEPLOY_PRIME_URL,
  process.env.PREVIEW_HOST && `https://${process.env.PREVIEW_HOST}`,
]
  .filter(Boolean)
  .map((value) => new URL(value))
  .filter((url) => url.protocol === 'https:')
  .map((url) => url.hostname);

export default defineConfig({
  site: 'https://www.rmbgroundworks.co.uk',
  output: 'server',
  adapter: netlify({ devFeatures: false, imageCDN: false }),
  image: { service: passthroughImageService() },
  session: false,
  devToolbar: { enabled: false },
  security: {
    allowedDomains: [
      { hostname: 'www.rmbgroundworks.co.uk', protocol: 'https' },
      { hostname: 'rmbgroundworks.co.uk', protocol: 'https' },
      { hostname: '127.0.0.1', protocol: 'http' },
      { hostname: 'localhost', protocol: 'http' },
      ...[...new Set(deploymentHosts)].map((hostname) => ({
        hostname,
        protocol: 'https',
      })),
    ],
  },
  server: { host: '127.0.0.1' },
});
