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

## Review comments (preview only)

On any `*.pages.dev` address (never on www.databytesolution.com) a yellow **Comment** button sits bottom-left. Reviewers click it, click the spot on the page, type the comment and press **Send**. Each comment becomes a GitHub issue (label `review`) with the page, position, nearby text, screen size and an **Open at the spot** link that shows a pin where the comment was made. Name and passcode are asked once per browser.

Code: `src/components/ReviewComments.astro` (button) and `functions/api/review-comment.js` (saves the issue).

**One-time setup (Team).** This repo is public, so comments go to a separate **private** repo.

1. **Private repo for comments.** GitHub › **New repository** › owner `infrazz`, name `databyte-website-review`, **Private**, tick "Add a README". Add your boss/team as collaborators if they should see the list.
2. **GitHub token** (fine-grained, can only touch that repo):
   1. https://github.com/settings/personal-access-tokens/new (signed in as `infrazz`).
   2. **Token name:** `website-review-comments`. **Expiration:** 90 days (or until go-live + 1 month).
   3. **Resource owner:** `infrazz`. **Repository access:** *Only select repositories* › `databyte-website-review`.
   4. **Permissions › Repository permissions › Issues:** *Read and write* (Metadata: Read-only is added automatically). Nothing else.
   5. **Generate token** and copy it (shown once).
3. **Pick a passcode** for reviewers, e.g. a short phrase. Share it with the boss by WhatsApp, not in the repo.
4. **Cloudflare Pages variables** (after the first deploy has created the project): dash.cloudflare.com › **Workers & Pages** › `databyte-solution-website` › **Settings** › **Variables and Secrets** › **Add**. Add each one for **Production** and again for **Preview**, type **Secret**:

   | Name | Value |
   | --- | --- |
   | `GITHUB_REVIEW_TOKEN` | the token from step 2 |
   | `REVIEW_REPO` | `infrazz/databyte-website-review` |
   | `REVIEW_PASSCODE` | the passcode from step 3 |

   (The plain `databyte-solution-website.pages.dev` address uses the **Production** values.)
5. **Redeploy** so the values take effect: GitHub › Actions › **Deploy website** › **Run workflow** on `main`.
6. **Test:** open https://databyte-solution-website.pages.dev, click **Comment**, leave a test comment, check an issue appears in `databyte-website-review`, then close it.

Until all three values are set, the button shows "Comment mode is not set up yet". After go-live and the review, revoke the token (GitHub › Settings › Developer settings › Fine-grained tokens) and delete the three variables.

The server-disposal landing page lives in a separate repo (`infrazz/databyte-solution`) and is never deployed from here.
