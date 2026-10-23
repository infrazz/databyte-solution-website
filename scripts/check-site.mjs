// Post-build check (runs after `astro build`):
// 1. every URL from the old Google Site exists in dist/ (so no old link or Google result breaks)
// 2. every internal link and image in the built pages points at a file that exists
// Fails the build (exit 1) if anything is missing.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const OLD_URLS = [
  '/', '/data-sanitization', '/data-sanitization/guide-to-data-sanitization', '/data-sanitization/equipment',
  '/data-sanitization/standards', '/data-sanitization/data-classification', '/data-sanitization/clear-purge-destroy',
  '/data-sanitization/disposal-bins', '/data-sanitization/best-price-guarantee', '/it-asset-recycling', '/for-data-centres',
  '/compliance', '/compliance/iso-9001-and-14001', '/compliance/environment', '/about-us', '/about-us/our-clients', '/contact-us',
];

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const exists = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return existsSync(join(DIST, 'index.html'));
  const candidates = [join(DIST, clean), join(DIST, clean + '.html'), join(DIST, clean, 'index.html')];
  return candidates.some((c) => existsSync(c) && statSync(c).isFile());
};

const problems = [];
for (const u of OLD_URLS) if (!exists(u)) problems.push(`Missing page for old URL ${u}`);

// _redirects targets count as existing
const redirected = new Set(
  existsSync(join(DIST, '_redirects'))
    ? readFileSync(join(DIST, '_redirects'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.trim().split(/\s+/)[0])
    : []
);

const files = walk(DIST).filter((f) => f.endsWith('.html'));
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    const target = m[1];
    if (target.startsWith('//') || target.startsWith('/api/')) continue;
    if (redirected.has(target.split('#')[0])) continue;
    if (!exists(target)) problems.push(`${relative(DIST, file)} links to missing ${target}`);
  }
}

if (problems.length) {
  console.error(`\nSite check failed (${problems.length}):\n- ` + [...new Set(problems)].join('\n- '));
  process.exit(1);
}
console.log(`Site check passed: ${OLD_URLS.length} old URLs present, ${files.length} pages, all internal links resolve.`);
