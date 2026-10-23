// Runs in front of every request on Cloudflare Pages.
// 1. databytesolution.com (no www) -> https://www.databytesolution.com (301), keeping the path.
// 2. Any *.pages.dev address (previews and the project's own address) is marked noindex,
//    so only www.databytesolution.com appears in Google.
export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  if (url.hostname === 'databytesolution.com') {
    url.hostname = 'www.databytesolution.com';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  const response = await next();
  if (url.hostname.endsWith('.pages.dev')) {
    const r = new Response(response.body, response);
    r.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return r;
  }
  return response;
}
