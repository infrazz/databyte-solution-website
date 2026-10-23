import { defineConfig } from 'astro/config';

// Pages build to /<path>.html so Cloudflare Pages serves them at the
// same extensionless URLs Google Sites used (e.g. /data-sanitization/standards).
export default defineConfig({
  site: 'https://www.databytesolution.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  compressHTML: true,
});
