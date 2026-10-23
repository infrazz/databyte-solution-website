// POST /api/quote: receives the quote form and forwards it to HubSpot.
// HubSpot stores the enquiry as a contact and emails a notification to hello@databytesolution.com
// (set the notification recipients on the HubSpot form).
//
// Cloudflare Pages environment variables (Settings > Variables and Secrets, production AND preview):
//   HUBSPOT_PORTAL_ID   e.g. 12345678
//   HUBSPOT_FORM_GUID   e.g. 0a1b2c3d-....
// Until both are set the endpoint answers 503 and the page offers email / WhatsApp instead.
// Nothing from the form is logged here.

const MAX = { name: 120, company: 160, email: 200, phone: 40, message: 4000, item: 60 };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (data.website) return json({ ok: true });

  const clean = (v, n) => String(v ?? '').trim().slice(0, n);
  const name = clean(data.name, MAX.name);
  const email = clean(data.email, MAX.email);
  const company = clean(data.company, MAX.company);
  const phone = clean(data.phone, MAX.phone);
  const message = clean(data.message, MAX.message);
  const items = Array.isArray(data.items) ? data.items.slice(0, 10).map((i) => clean(i, MAX.item)) : [];
  const page = clean(data.page, 200);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'invalid' }, 422);
  }

  if (!env.HUBSPOT_PORTAL_ID || !env.HUBSPOT_FORM_GUID) {
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const [firstname, ...rest] = name.split(/\s+/);
  const details = [items.length ? `Items: ${items.join(', ')}` : '', message].filter(Boolean).join('\n\n');
  const payload = {
    fields: [
      { objectTypeId: '0-1', name: 'firstname', value: firstname },
      { objectTypeId: '0-1', name: 'lastname', value: rest.join(' ') },
      { objectTypeId: '0-1', name: 'email', value: email },
      { objectTypeId: '0-1', name: 'company', value: company },
      { objectTypeId: '0-1', name: 'phone', value: phone },
      { objectTypeId: '0-1', name: 'message', value: details },
    ],
    context: {
      pageUri: `https://www.databytesolution.com${page || '/contact-us'}`,
      pageName: 'Website quote form',
    },
  };

  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${env.HUBSPOT_PORTAL_ID}/${env.HUBSPOT_FORM_GUID}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return json({ ok: false, error: 'upstream', status: res.status }, 502);
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'upstream' }, 502);
  }
}

export function onRequest() {
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}
