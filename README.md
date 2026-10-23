# databyte-solution-website

New www.databytesolution.com: Astro static site on Cloudflare Pages, replacing the Google Site.

- **Status and tasks:** `production-tracker.md`
- **How it works and rules (for Claude Code):** `CLAUDE.md`
- **Migration plan:** https://claude.ai/code/artifact/55949462-f946-4fce-8649-b0abe16b198c

Quick start:

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # build + link check
```

Merging to `main` deploys automatically. Pull requests get their own preview link.

The server-disposal landing page lives in a separate repo (`infrazz/databyte-solution`) and is never deployed from here.
