# CLAUDE.md: databytesolution.com main website

Read this first. Backlog and status live in `production-tracker.md`. **Update `production-tracker.md` (and this file if anything here changes) after every action.**

Migration plan (approved 2026-10-22, all 13 decisions): https://claude.ai/code/artifact/55949462-f946-4fce-8649-b0abe16b198c

## What this repo is

The main website `www.databytesolution.com`, moving from Google Sites to Astro on Cloudflare Pages.

| Part | Technology | Where |
| --- | --- | --- |
| Site | Astro 5, static output, no UI framework, plain CSS | `src/` |
| Hosting | Cloudflare **Pages** project `databyte-solution-website` (same Cloudflare account as the landing page, ID `9df86834b0d7ed1c3f28c632787914be`) | `https://databyte-solution-website.pages.dev` |
| Source + CI/CD | GitHub `infrazz/databyte-solution-website`. GitHub Actions builds and deploys: push to `main` = production, PR = preview `pr-<n>.databyte-solution-website.pages.dev` | `.github/workflows/deploy.yml` |
| Quote form | `functions/api/quote.js` (Pages Function) → HubSpot Forms API → HubSpot emails hello@ | env `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_GUID` |
| Redirects / noindex | `functions/_middleware.js`: bare domain → www (301); every `*.pages.dev` gets `X-Robots-Tag: noindex` | |
| Analytics | GA4 `G-Q844JS8CQH` (same property as the Google Site). Google Ads conversions once IDs exist. Both only load on `www.databytesolution.com` | `src/config.ts` → `TRACKING` |
| Domain + DNS | Registered at Namecheap. DNS moves from Namecheap to Cloudflare at cutover (plan runbook) | |

## Two separate pipelines (hard rule)

The server-disposal **landing page** is a different project and must never be touched from here:
repo `infrazz/databyte-solution` (`C:\WK\databyte-solution`), Pages project `databyte-quote`, `serverdisposal.databytesolution.com`.

- This repo never deploys to `databyte-quote` and never adds `serverdisposal.databytesolution.com` as a custom domain.
- The landing page is never folded into this site. The main site may only link to it (`SITE.serverDisposalLanding`).
- At DNS cutover, the `serverdisposal` CNAME → `databyte-quote.pages.dev` must be in the Cloudflare zone **before** the nameservers change. After the switch, re-test the landing page, `/stats` and `/api/track`.

## Commands

```bash
npm install          # first time (commit package-lock.json afterwards)
npm run dev          # local preview at http://localhost:4321 (add ?theme=teal|green|charcoal to compare themes)
npm run build        # builds to dist/ AND runs scripts/check-site.mjs (fails if an old URL or internal link is missing)
npm run preview      # serve dist/ locally
```

Deploy = merge to `main` (never deploy from a laptop unless GitHub Actions is down).

## Layout

```
src/config.ts              # business details, tracking IDs, navigation, page list (sitemap + checks)
src/images.ts              # photo list with width/height
src/styles/global.css      # design tokens (Dark Blue default + 3 preview themes) and all styles
src/layouts/Base.astro     # <head>, SEO, JSON-LD, GA4, header/footer, click tracking
src/components/            # Header, Footer, PageHero, QuoteForm, CtaBand, AsideNav, Photo, Icon, Logo
src/pages/                 # one .astro file per URL; folder = URL path
src/pages/sitemap.xml.ts   # sitemap from PAGES
public/images/             # WebP photos carried over from the Google Site (max 960 px wide)
public/_redirects          # /home -> /
public/_headers            # security + cache headers
functions/                 # Cloudflare Pages Functions (quote form, middleware)
scripts/check-site.mjs     # post-build URL/link check
_migration/                # raw export from Google Sites (pages.json, image list, logo). Git-ignored; reference only
```

## Rules

1. **Keep every old URL.** The 17 Google Sites URLs (see `PAGES` in `src/config.ts`) must keep working: Google rankings and old links depend on them. Builds output `/<path>.html`, served at the extensionless URL. If a page is ever renamed, add a 301 in `public/_redirects`.
2. **Business details only from `src/config.ts`**, and they must match the landing page repo's CLAUDE.md exactly (name, address incl. `#04-31K`, phone, email, description). Never hard-code them in pages.
3. **No invented facts.** No statistics, client names, logos, certifications or claims that are not on the old site or approved by management. Public client names need management approval.
4. Run `npm run build` before every commit; it must pass the site check.
5. Photos: WebP, max 960 px wide, added to `src/images.ts` with real width/height and a descriptive `alt`.
6. Never commit secrets. Secrets live in GitHub (`CLOUDFLARE_API_TOKEN`) and Cloudflare Pages env vars (`HUBSPOT_*`).
7. Analytics stay on the production host only; never send form contents to GA4/Ads.
8. Do not change DNS records except as written in the plan's cutover runbook, and never without the boss's go-ahead.
9. Spelling follows the old site and its search keywords: "sanitization", "data centre".

## Editing content

- Text lives directly in `src/pages/*.astro`. Shared bits: header/footer in `src/components/`, contact details in `src/config.ts`.
- New page: add `src/pages/<path>.astro`, add it to `NAV` (if it belongs in the menu) and `PAGES` in `src/config.ts`.
- Theme: Dark Blue is the default. Reviewers can compare `?theme=teal`, `?theme=green`, `?theme=charcoal` on any page. To switch permanently, copy that theme's values into `:root` in `global.css`.

## Quote form

`QuoteForm.astro` posts JSON to `/api/quote`. The function validates, drops bots (hidden `website` field), and forwards to HubSpot.
Until `HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_GUID` are set in Cloudflare Pages (Production **and** Preview), it returns 503 and the page shows email/WhatsApp links with the enquiry prefilled. The HubSpot form needs fields `firstname`, `lastname`, `email`, `company`, `phone`, `message` and notification emails to hello@databytesolution.com.

## Tracking

`Base.astro` loads GA4 and, if `TRACKING.adsId` is set, Google Ads. Events: `generate_lead` (form sent), `contact_click` with `method` = call / whatsapp / email. Google Ads conversion labels go in `TRACKING.conversions`.
