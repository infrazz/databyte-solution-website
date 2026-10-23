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

## One-time setup: deploy secret `CLOUDFLARE_API_TOKEN`

GitHub Actions needs a Cloudflare API token to deploy. Without it, the build runs but the deploy step fails. Do this yourself; never paste the token into chat, code or Claude.

**1. Create the token in Cloudflare**

1. Sign in at https://dash.cloudflare.com (same account as the landing page, ID `9df86834b0d7ed1c3f28c632787914be`).
2. Profile icon (top right) › **My Profile** › **API Tokens** › **Create Token**.
3. At the bottom: **Create Custom Token** › **Get started**.
4. Fill in:
   - **Token name:** `github-actions-databyte-solution-website`
   - **Permissions:** `Account` · `Cloudflare Pages` · `Edit`
   - **Account Resources:** `Include` · the Databyte account
   - Leave the rest as is (TTL optional).
5. **Continue to summary** › **Create Token**. Copy the token now; Cloudflare shows it only once.

A separate token per site (not the landing page's) lets each be revoked on its own.

**2. Save it in GitHub**

1. Open https://github.com/infrazz/databyte-solution-website/settings/secrets/actions
2. **New repository secret**.
3. **Name:** `CLOUDFLARE_API_TOKEN` (exactly). **Secret:** paste the token. **Add secret**.

Or from a terminal (prompts for the value, so it stays out of shell history):

```bash
gh secret set CLOUDFLARE_API_TOKEN -R infrazz/databyte-solution-website
```

**3. Deploy**

Go to https://github.com/infrazz/databyte-solution-website/actions, open the failed **Deploy website** run and click **Re-run all jobs** (or **Run workflow** on `main`). When it is green, check https://databyte-solution-website.pages.dev loads.

If the token is ever revoked or expires, create a new one and overwrite the same secret.

The server-disposal landing page lives in a separate repo (`infrazz/databyte-solution`) and is never deployed from here.
