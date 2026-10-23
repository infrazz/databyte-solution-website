# Production Tracker: databytesolution.com migration (Google Sites → Astro on Cloudflare Pages)

Last updated: 2026-10-23

How to use (for people and Claude Code):
- One task per line: `- [ ] ID · Task · Owner · Status · Updated · Notes`.
- Status: `TODO`, `IN PROGRESS`, `BLOCKED`, `DONE`, `DROPPED`. Tick `[x]` only when `DONE`.
- Owner: `Team` (Databyte staff), `Mgmt` (boss decision), `Claude`.
- Edit lines in place, set `Updated`, add a short note. Never renumber. New tasks get the next free ID.
- Plan and decisions: https://claude.ai/code/artifact/55949462-f946-4fce-8649-b0abe16b198c

## Current snapshot

| Item | State |
| --- | --- |
| Live site | Still Google Sites at www.databytesolution.com |
| New site | Builds cleanly on the PC (17 pages + 404, site check passed); pushed to `main`, deploy waits for W-04 |
| Preview URL | Appears after W-05: https://databyte-solution-website.pages.dev |
| Quote form | Built; waits for HubSpot IDs (W-06) |
| GA4 | `G-Q844JS8CQH` wired in (production host only) |
| Google Ads conversions | Placeholders; waits for IDs (W-07) |
| Landing page | Untouched, separate pipeline (repo `databyte-solution`, project `databyte-quote`) |
| Target go-live | Sat 31 Oct 2026 (DNS cutover) |

## Phase A: Build (22–28 Oct)

- [x] W-01 · Copy content of all 17 Google Sites pages and 47 images · Claude · DONE · 2026-10-22 · Raw export in `_migration/` (git-ignored); 30 photos kept as WebP in `public/images/`, stock clip-art replaced by icons
- [x] W-02 · Build Astro site from approved Dark Blue mockup: 17 pages at the same URLs, 404, sitemap, robots, redirects, JSON-LD, GA4, quote form, middleware, CI workflow · Claude · DONE · 2026-10-22 · Not compiled yet: npm was blocked in Claude's sandbox. Static checks passed (links, images, tags)
- [x] W-03 · First build on the PC: `npm install`, `npm run build` (must print "Site check passed"), fix any errors, commit incl. `package-lock.json` · Claude Code (PC) · DONE · 2026-10-23 · Built first time, no fixes needed: "Site check passed: 17 old URLs present, 18 pages, all internal links resolve." `npm audit` flags astro 5 / sharp / esbuild (fix = astro 7 major upgrade), see W-12
- [ ] W-04 · Add GitHub secret `CLOUDFLARE_API_TOKEN` to `infrazz/databyte-solution-website` (same token type as the landing page: Account › Cloudflare Pages › Edit) · Team · TODO · 2026-10-23 · Not set yet (checked 2026-10-23). Step-by-step in `README.md` › "One-time setup: deploy secret". After adding it, re-run the failed "Deploy website" Action
- [ ] W-05 · Push to `main`; first Action run creates Pages project `databyte-solution-website` and deploys; check the pages.dev URL loads · Claude Code (PC) · IN PROGRESS · 2026-10-23 · Pushed 2026-10-23. Deploy step fails until W-04; then re-run the Action and check the pages.dev URL
- [ ] W-06 · Create free HubSpot account for Databyte (separate from Portable Shredder), form with fields firstname, lastname, email, company, phone, message; notifications to hello@; add `HUBSPOT_PORTAL_ID` + `HUBSPOT_FORM_GUID` to Pages env (Production + Preview); send a test enquiry · Team/Claude · TODO · 2026-10-22 ·
- [ ] W-07 · Google Ads: create conversion actions (Form, Call, WhatsApp, Email) and put IDs/labels in `TRACKING` in `src/config.ts` · Team/Claude · TODO · 2026-10-22 · Same Ads account as the landing page
- [ ] W-08 · Visual check of every page on desktop and phone on the preview URL; fix layout issues · Claude · TODO · 2026-10-22 · After W-05
- [ ] W-09 · Boss reviews all pages and copy on the preview URL (theme: Dark Blue default; `?theme=teal|green|charcoal` to compare) · Mgmt · TODO · 2026-10-22 ·
- [ ] W-10 · Boss confirms client names shown publicly (Coca-Cola, ExxonMobil, Fujifilm on Our Clients) are still approved · Mgmt · TODO · 2026-10-22 · Carried over from the old site
- [ ] W-11 · Optional: replace stock photos with real Databyte job photos (team onsite, shredding, certificates) · Team · TODO · 2026-10-22 ·
- [ ] W-12 · Review `npm audit` findings (astro <=7.3.1 advisories, sharp/libvips, esbuild dev-server on Windows). Most target SSR/server islands, which this static site doesn't use; upgrade to Astro 7 in a PR and re-check the build · Claude · TODO · 2026-10-23 · Major version bump; do before go-live if it builds cleanly

## Phase B: DNS cutover (prepare 27–29 Oct, switch Sat 31 Oct evening)

Runbook: plan doc, "DNS cutover runbook". Do not start without the boss's go (W-09).

- [ ] W-20 · Add databytesolution.com to Cloudflare (free plan, same account); compare imported records with the plan's DNS table · Team/Claude · TODO · 2026-10-22 · Must include MX, autodiscover (DNS only), SPF, MS= TXT, **serverdisposal CNAME → databyte-quote.pages.dev**
- [ ] W-21 · Enable DKIM in Microsoft 365 (selector1/selector2 CNAMEs, DNS only) and add `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:hello@databytesolution.com` · Team · TODO · 2026-10-22 ·
- [ ] W-22 · Add Search Console DNS TXT (weikai365@gmail.com); confirm DNSSEC is off at Namecheap · Team · TODO · 2026-10-22 ·
- [ ] W-23 · Cutover: change nameservers at Namecheap; attach www + bare domain to Pages project `databyte-solution-website` · Team/Claude · TODO · 2026-10-22 · Bare domain → www handled by `_middleware.js`
- [ ] W-24 · Post-switch tests: email in/out for hello@, all 17 URLs, `/home` redirect, quote form → HubSpot, GA4 realtime, landing page + /stats + /api/track · Team/Claude · TODO · 2026-10-22 ·

## Phase C: After go-live

- [ ] W-30 · Submit sitemap in Search Console + Bing; request indexing of home · Claude · TODO · 2026-10-22 ·
- [ ] W-31 · Validate DKIM in Microsoft 365; review DMARC reports after 2 weeks · Team · TODO · 2026-10-22 ·
- [ ] W-32 · Watch Search Console coverage for 404s for 2 weeks; add redirects if needed · Claude · TODO · 2026-10-22 ·
- [ ] W-33 · Retire the Google Site after two quiet weeks (around 14 Nov) · Mgmt · TODO · 2026-10-22 ·

## Change log

- 2026-10-23 · Added step-by-step instructions for creating the Cloudflare token and the `CLOUDFLARE_API_TOKEN` GitHub secret to `README.md` (W-04).
- 2026-10-23 · W-03 done: `npm install` + `npm run build` pass on the PC, site check passed. Code + `package-lock.json` committed and pushed to `main` (W-05). Deploy waits for the `CLOUDFLARE_API_TOKEN` secret (W-04).
- 2026-10-22 · Site built in this repo by Claude: 17 pages migrated from Google Sites at identical URLs, Dark Blue design from the approved mockup, quote form (HubSpot), GA4, JSON-LD, sitemap, CI/CD to Pages project `databyte-solution-website`. Awaiting first build on the PC (W-03).
- 2026-10-22 · Plan approved (all 13 decisions). Two separate pipelines confirmed: landing page stays in `databyte-solution`.
