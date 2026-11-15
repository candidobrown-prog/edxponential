# edXponential — portable edition

The edXponential app (React front end + Node back end), rebuilt so it **no longer depends on Base44**.
Everything that was in the Base44 project is here: all 177 routes/pages, the 62 data models with their
access rules, and the 9 backend functions.

```
src/                 React app (same pages/components as the Base44 project)
backend/
  src/               API server: auth, data store + access rules, AI/email/upload, function runner, scheduler
  entities/          the 62 Base44 data-model files (schemas + who-can-read/write rules) — used as-is
  functions/         the 9 Base44 backend functions (Stripe checkout/webhook/refunds, match scoring, …)
  scripts/import-json.js   load data exported from Base44
Dockerfile           one-container deploy
```

## How it works (what replaced what)

| Base44 | Now |
|---|---|
| `@base44/sdk` client | `src/api/base44Client.js` — same calls (`base44.entities.X.list/filter/create/update/delete`, `base44.auth.*`, `base44.integrations.Core.*`, `base44.functions.invoke`), pointed at `/api` |
| Base44 database | Postgres (Supabase in production; an embedded Postgres for local dev) — `backend/src/db.js` |
| Base44 login | Email + password accounts. First account created becomes admin; `ADMIN_EMAILS` also grants admin |
| Row-level security | Enforced from the `rls` blocks in `backend/entities/*.jsonc` |
| `InvokeLLM` | Anthropic API (`ANTHROPIC_API_KEY`, model `LLM_MODEL`) |
| `SendEmail` | SMTP (`SMTP_URL`); without it, emails are logged, not sent |
| `UploadFile` | Supabase Storage bucket `uploads` (or local disk in dev) |
| Backend functions (Deno) | Same code, run by `backend/src/functions-runtime.js` at `/api/functions/<name>` |
| GitHub connector | `GITHUB_TOKEN` |
| Scheduled automation | `sendSessionReminders` runs daily (Vercel Cron → `/api/cron/reminders`, or `REMINDER_CRON` when self-hosted) |

## Run it locally

Requires Node 22+. No database to install: it uses an embedded Postgres unless `DATABASE_URL` is set.

```bash
npm run install:all
cp backend/.env.example backend/.env      # then edit it (at minimum JWT_SECRET)
npm run dev:api                           # terminal 1 → API on :8787
npm run dev                               # terminal 2 → app on :5173
```

Production-style (one process): `npm run build && npm start` → http://localhost:8787

## Deploy on Vercel + Supabase (recommended)

Vercel serves the app and runs the API as a serverless function; Supabase provides the Postgres database
and file storage. Tables are created automatically the first time the app talks to the database.

1. **Push this folder to GitHub** (branch `vercel-portable` of `candidobrown-prog/edxponential` already has it).
2. **Vercel → Add New → Project →** import that repo, choose the `vercel-portable` branch. Settings are read from `vercel.json`.
3. **Vercel → your project → Storage → Create → Supabase.** Accept the defaults. This creates a Supabase project and
   adds `POSTGRES_URL`, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the project automatically.
4. **Vercel → Settings → Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | your Anthropic key (console.anthropic.com → API Keys) |
   | `STRIPE_SECRET_KEY` | Stripe → Developers → API keys → Secret key |
   | `STRIPE_WEBHOOK_SECRET` | from step 6 below |
   | `PUBLIC_URL` | your site address, e.g. `https://edxponential.vercel.app` |
   | `ADMIN_EMAILS` | your email (always admin) |
   | `CRON_SECRET` | any long random text (protects the daily reminder job) |
   | `SMTP_URL`, `EMAIL_FROM` | optional — only if you want real emails (see `.env.example`) |

5. **Deployments → Redeploy** so the new variables apply. Open the site and create your account — the first account is the admin.
6. **Stripe → Developers → Webhooks → Add endpoint** `https://<your-domain>/api/functions/stripeWebhook`, event
   `checkout.session.completed` (plus refund/subscription events you used before). Copy its signing secret into
   `STRIPE_WEBHOOK_SECRET` and redeploy.

Limits to know about: uploads through the app are capped at about 4.5 MB per file on Vercel; the AI
endpoints are allowed 60 seconds per request.

## Deploy with Docker instead

Any host that runs a container with a persistent disk (Render, Railway, Fly.io, a VPS). Set `DATABASE_URL`
to any Postgres (or leave it empty to use the embedded database stored in the mounted volume):

```bash
docker build -t edxponential .
docker run -p 8787:8787 -v edx-data:/data --env-file backend/.env -e PUBLIC_URL=https://your-domain edxponential
```

## Moving your existing data

The Base44 repo contains code only — **your records and users are still in Base44**. Export each
entity (and Users) from the Base44 dashboard (Data → export), then:

```bash
cd backend
node scripts/import-json.js User  users.csv --password=ChangeMe123   # temp password; users should change it
node scripts/import-json.js Course courses.csv
node scripts/import-json.js Transaction transactions.json
```
Original ids and created dates are preserved. Base44 passwords cannot be exported, so every user needs a
password set once (there is no self-service "forgot password" email yet).

## Known gaps

- LinkedIn sign-in is not wired up (the button was removed). Needs an OAuth app of your own.
- `add_context_from_internet` in AI calls uses Anthropic web search; results will differ from Base44's.
- The logo (and a favicon) are still hot-linked from `media.base44.com`. Download it into `public/assets/`
  and update the URL in `index.html` and `src/` before you shut the Base44 app down:
  `grep -rn "media.base44.com" src index.html`
- Entity queries filter in memory (fine for thousands of rows per model; push filters into SQL if it grows).
