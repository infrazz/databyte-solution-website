// POST /api/review-comment: review comments from the preview site, saved as GitHub issues.
// Only answers on *.pages.dev (and localhost for testing); on www.databytesolution.com it is 404.
// The Comment button that calls it lives in src/components/ReviewComments.astro.
//
// Cloudflare Pages environment variables (Settings > Variables and Secrets, production AND preview,
// type "Secret"; the project's own *.pages.dev address uses the Production values):
//   GITHUB_REVIEW_TOKEN   fine-grained GitHub token, access to REVIEW_REPO only, Issues: Read and write
//   REVIEW_REPO           e.g. infrazz/databyte-website-review (keep it PRIVATE: comments are internal)
//   REVIEW_PASSCODE       shared passcode reviewers type once; stops strangers creating issues
// Until all three are set the endpoint answers 503 and the button says so.

const MAX = { comment: 4000, name: 80, url: 500, text: 200, selector: 300 };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

const isReviewHost = (hostname) =>
  hostname.endsWith('.pages.dev') || hostname === 'localhost' || hostname === '127.0.0.1';

// Stop accidental @mentions / #refs in GitHub from pinging people or linking issues.
const defang = (s) => s.replace(/@/g, '@​').replace(/#(\d)/g, '#​$1');
const quote = (s) => s.split('\n').map((l) => `> ${l}`).join('\n');

export async function onRequestPost({ request, env }) {
  if (!isReviewHost(new URL(request.url).hostname)) return json({ ok: false, error: 'not_found' }, 404);

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  if (!env.GITHUB_REVIEW_TOKEN || !env.REVIEW_REPO || !env.REVIEW_PASSCODE) {
    return json({ ok: false, error: 'not_configured' }, 503);
  }
  if (String(data.passcode ?? '') !== env.REVIEW_PASSCODE) return json({ ok: false, error: 'passcode' }, 403);

  const clean = (v, n) => String(v ?? '').trim().slice(0, n);
  const num = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0);
  const comment = clean(data.comment, MAX.comment);
  const name = clean(data.name, MAX.name) || 'Reviewer';
  const url = clean(data.url, MAX.url);
  const path = clean(data.path, MAX.url) || '/';
  const text = clean(data.text, MAX.text).replace(/\s+/g, ' ');
  const selector = clean(data.selector, MAX.selector);
  const theme = clean(data.theme, 20);
  const x = num(data.x); // percent of page width
  const y = num(data.y); // px from the top of the page
  const vw = num(data.vw);
  const vh = num(data.vh);

  if (!comment) return json({ ok: false, error: 'invalid' }, 422);

  const firstLine = comment.split('\n')[0];
  const title = `[Review] ${path}: ${firstLine.length > 70 ? firstLine.slice(0, 67) + '…' : firstLine}`;
  const pinUrl = url ? `${url.split('#')[0]}${url.includes('?') ? '&' : '?'}pin=${x},${y}` : '';
  const when = new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore', dateStyle: 'medium', timeStyle: 'short' });
  const rows = [
    `| From | ${defang(name).replace(/\|/g, '/')} |`,
    `| Page | \`${path}\` |`,
    pinUrl && `| Open at the spot | ${pinUrl} |`,
    `| Position | ${x}% across, ${y}px down (screen ${vw}×${vh}, ${vw && vw < 768 ? 'phone' : 'desktop'}) |`,
    text && `| Near | “${defang(text).replace(/\|/g, '/')}” |`,
    selector && `| Element | \`${selector.replace(/`/g, '')}\` |`,
    theme && `| Theme | ${theme} |`,
    `| Sent | ${when} (SGT) |`,
  ].filter(Boolean);
  const body = `${quote(defang(comment))}\n\n| | |\n| --- | --- |\n${rows.join('\n')}\n`;

  const create = (labels) =>
    fetch(`https://api.github.com/repos/${env.REVIEW_REPO}/issues`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.GITHUB_REVIEW_TOKEN}`,
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
        'user-agent': 'databyte-website-review',
        'content-type': 'application/json',
      },
      body: JSON.stringify(labels ? { title, body, labels } : { title, body }),
    });

  try {
    let res = await create(['review']);
    // A token without permission to create the "review" label gets 403/422: retry without labels.
    if (res.status === 403 || res.status === 422) res = await create(null);
    if (!res.ok) return json({ ok: false, error: 'upstream', status: res.status }, 502);
    const issue = await res.json();
    return json({ ok: true, number: issue.number });
  } catch {
    return json({ ok: false, error: 'upstream' }, 502);
  }
}

export function onRequest() {
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}
