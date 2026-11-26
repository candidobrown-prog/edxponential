// shi-notify: emails BetterEd and the respondent when a School Health Index is submitted.
// Called by the database (supabase/notify.sql) with a shared secret; not callable by the public.
// Secrets (Supabase > Edge Functions > Secrets): RESEND_API_KEY, WEBHOOK_SECRET,
//   NOTIFY_TO (default info@betteredsolutions.org), MAIL_FROM (e.g. "BetterEd <index@betteredsolutions.org>").
import { createClient } from "jsr:@supabase/supabase-js@2";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

async function send(to: string, subject: string, html: string, replyTo?: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: Deno.env.get("MAIL_FROM") ?? "BetterEd <index@betteredsolutions.org>", to: [to], subject, html, reply_to: replyTo }),
  });
  if (!r.ok) throw new Error(`email failed: ${r.status} ${await r.text()}`);
}

Deno.serve(async (req) => {
  if (req.method !== "POST" || req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) return new Response("forbidden", { status: 403 });
  const { submission_id } = await req.json().catch(() => ({}));
  if (!submission_id) return new Response("missing submission_id", { status: 400 });

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: s, error } = await db.from("shi_inbox").select("*").eq("id", submission_id).single();
  if (error || !s) return new Response("not found", { status: 404 });

  const team = Deno.env.get("NOTIFY_TO") ?? "info@betteredsolutions.org";
  const rows: [string, unknown][] = [
    ["Name", `${s.first_name} ${s.last_name}`], ["Role", s.role], ["Email", s.email], ["Phone", s.phone || "Not given"],
    ["Best time to call", s.best_time], ["School", `${s.school_name}, ${s.city}, ${s.state}`], ["Budget", s.budget],
    ["Interested in", s.interest || "Not given"], ["Heard about us", s.heard_from],
    ["Preliminary score", s.overall == null ? "Not enough answers" : `${s.overall} (${s.band})`],
  ];
  await send(team, `New School Health Index: ${s.school_name} (${s.state})`,
    `<h2>New School Health Index submitted</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><th align="left">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>
     <h3>In their words</h3><p>${esc(s.in_their_words)}</p>
     <p>Report due within 24 to 48 hours. Full answers: Supabase &gt; Table editor &gt; shi_submissions (id ${esc(s.id)}).</p>`, s.email);
  await send(s.email, "We received your School Health Index",
    `<p>Hi ${esc(s.first_name)},</p><p>Thank you for completing the BetterEd School Health Index for ${esc(s.school_name)}. A BetterEd practitioner is reading it now. You will receive your report by email within 24 to 48 hours, and we will reach out at your preferred time (${esc(s.best_time)}) to talk it through.</p><p>Schools can get well. Fast.</p><p>BetterEd Solutions<br><a href="https://betteredsolutions.org">betteredsolutions.org</a></p>`, team);
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
});
