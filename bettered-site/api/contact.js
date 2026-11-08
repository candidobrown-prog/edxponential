// Vercel serverless function: POST /api/contact
// Server-side validation, honeypot, timing check, best-effort rate limit, delivery via Resend.
// Returns { ok: true } ONLY when the email provider accepted the message. Never fakes success.
// Env: RESEND_API_KEY (required), CONTACT_TO (default info@betteredsolutions.org), CONTACT_FROM (verified sender)

const TYPES = ['Start with the diagnosis', 'School Health Index', 'Culture & Climate', 'Leadership Development', 'Educator Development', 'Whole-School Turnaround', 'Partnership', 'Procurement', 'Other'];
const LIMITS = { name: 120, email: 200, organization: 200, role: 120, message: 4000 };
const hits = new Map(); // per-instance; pair with Vercel Firewall rate limiting in production

function clean(v, max) { return typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max) : ''; }
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method_not_allowed' }); }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) return res.status(429).json({ ok: false, error: 'rate_limited' });
  hits.set(ip, [...recent, now]);

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // Honeypot and minimum fill time: silently accept-and-drop would be dishonest to humans who trip it,
  // so return a generic error instead. Bots do not read it.
  if (clean(body.website, 200)) return res.status(400).json({ ok: false, error: 'rejected' });
  const started = Number(body.started_at);
  if (started && now - started < 2500) return res.status(400).json({ ok: false, error: 'too_fast' });

  const data = {
    name: clean(body.name, LIMITS.name),
    email: clean(body.email, LIMITS.email),
    organization: clean(body.organization, LIMITS.organization),
    role: clean(body.role, LIMITS.role),
    inquiry_type: TYPES.includes(body.inquiry_type) ? body.inquiry_type : 'Other',
    message: clean(body.message, LIMITS.message),
  };
  const errors = {};
  if (!data.name) errors.name = 'required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = 'invalid';
  if (!data.organization) errors.organization = 'required';
  if (!data.message) errors.message = 'required';
  if (Object.keys(errors).length) return res.status(422).json({ ok: false, error: 'validation', fields: errors });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ ok: false, error: 'not_configured' });

  const to = process.env.CONTACT_TO || 'info@betteredsolutions.org';
  const from = process.env.CONTACT_FROM || 'BetterEd Website <website@betteredsolutions.org>';
  const html = `<h2>New inquiry: ${esc(data.inquiry_type)}</h2>
<p><strong>Name:</strong> ${esc(data.name)}<br><strong>Email:</strong> ${esc(data.email)}<br><strong>Organization:</strong> ${esc(data.organization)}<br><strong>Role:</strong> ${esc(data.role || '—')}</p>
<p style="white-space:pre-wrap">${esc(data.message)}</p>`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: data.email, subject: `[BetterEd] ${data.inquiry_type} — ${data.organization}`, html }),
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'delivery_failed' });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false, error: 'delivery_failed' });
  }
}
