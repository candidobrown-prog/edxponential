# School Health Index: backend setup

The School Health Index is a gated lead magnet: people create a free account (one index per person), pass a Cloudflare Turnstile bot check, complete the index (answers autosave), and submit. BetterEd is notified and sends a practitioner-reviewed report within 24 to 48 hours.

Until `SHI_SUPABASE_URL` is set at build time, the forms show "School Health Index accounts open soon" and point people to the contact form.

## Pieces

| Piece | Where |
|---|---|
| Pages | `src/templates/shi.mjs` (`/school-health-index/start/`, `sign-in/`, `check-email/`, `reset/`, `exam/`, `submitted/`, `terms/`) |
| Browser app | `src/assets/shi-app.js` + `src/assets/vendor/supabase-js-2.119.0.min.js` (MIT) |
| Questions and options | `src/content/shi-questions.mjs` (roles, how-heard list, budgets, 12 domains) |
| School lookups | `src/assets/schools/{STATE}.json`: 100,063 open public and charter schools, NCES Common Core of Data 2024. Refresh with `python3 scripts/update-schools.py` |
| Database | `supabase/schema.sql` (profiles, one submission per person, row-level security, scoring views, staff inbox view) |
| Notifications | `supabase/functions/shi-notify/` + `supabase/notify.sql` |

## Switch it on

1. **Supabase project.** Create a dedicated project ("BetterEd School Health Index"), then run `supabase/schema.sql` in the SQL editor.
2. **Auth settings** (Authentication > URL configuration): Site URL `https://betteredsolutions.org`; add redirect URLs `https://betteredsolutions.org/school-health-index/exam/` and `https://betteredsolutions.org/school-health-index/reset/`. Keep "Confirm email" on: it verifies the address and enforces one index per real person.
3. **Bot check.** In Cloudflare, create a Turnstile widget for `betteredsolutions.org`. Put the **secret key** in Supabase (Authentication > Attack Protection > Enable CAPTCHA protection > Turnstile). The **site key** goes in Vercel as `SHI_TURNSTILE_SITE_KEY`.
4. **Email.** Supabase's built-in email is rate-limited and meant for testing. Create a Resend account, verify the `betteredsolutions.org` domain (DNS records), then:
   - Supabase > Authentication > SMTP settings: use Resend's SMTP so confirmation and password emails come from BetterEd.
   - Deploy `supabase/functions/shi-notify` and set its secrets: `RESEND_API_KEY`, `WEBHOOK_SECRET` (any long random string), `NOTIFY_TO=info@betteredsolutions.org`, `MAIL_FROM=BetterEd <index@betteredsolutions.org>`.
   - Run `supabase/notify.sql` with the project reference and the same `WEBHOOK_SECRET`.
5. **Vercel environment variables** (Production and Preview): `SHI_SUPABASE_URL`, `SHI_SUPABASE_KEY` (the publishable key), `SHI_TURNSTILE_SITE_KEY`. Redeploy. The Content-Security-Policy in `vercel.json` already allows Supabase and Turnstile.

## Working the inbox

In Supabase > Table editor, the `shi_inbox` view lists every submitted index with contact details, best time to call, budget, preliminary score and band, and the respondent's own words. Update `shi_submissions.status` to `in_review`, then `report_sent` (with `report_sent_at`) as you go. Scores: each agreement answer maps 1 to 5 onto 0 to 100 ("Don't know" is excluded); a domain is the mean of its three items; the overall score is the mean of the 12 domains, placed in the five health bands.
