# EDXPONTENTIAL — Architecture Inventory (Phase 0)

Specification: EDX-II-001 v2.0 · Inventory date: 2026-11-16 · Branch inspected: `vercel-portable` @ d787645

This inventory was produced by reading the repository, not from assumptions. Items marked **verified** were
confirmed by running code or tests in this session; items marked **observed** were read from source.

## 1. Repository structure (observed)

```
/                     Vite + React 18 single-page app (JavaScript, JSX)
  src/pages/          55 page modules incl. sub-apps (graiedx, operationx, foundaitionx, …)
  src/components/     feature folders + shadcn/ui primitives (src/components/ui)
  src/components/layout/{AppLayout,Sidebar,PublicLayout}.jsx   global shell + primary navigation
  src/api/base44Client.js   drop-in client: entities / auth / integrations / functions → /api/*
  src/lib/AuthContext.jsx   session state (JWT in localStorage key `edx_token`)
  api/index.js        Vercel entry → backend/src/app.js
  backend/src/        Express API (app.js, auth.js, db.js, entities.js, integrations.js, functions-runtime.js)
  backend/entities/   62 entity schemas (.jsonc) with `rls` rules — the data model
  backend/functions/  9 ported Base44 backend functions (Stripe, matching, reminders, …)
  backend/scripts/    import-json.js (data import)
  vercel.json         Vite build, /api rewrite, SPA fallback, daily cron → /api/cron/reminders
  Dockerfile          single-container alternative deploy
```

## 2. Framework and runtime (verified)

| Layer | Technology | Notes |
|---|---|---|
| Front end | React 18, Vite 6, react-router 7, @tanstack/react-query, Tailwind, shadcn/ui, framer-motion, lucide | SPA served from `dist/` |
| Back end | Node 22, Express 4 (ESM) | Runs as one Vercel function (`api/index.js`) or long-running (`backend/src/server.js`) |
| Database | Postgres via `pg` (`DATABASE_URL`/`POSTGRES_URL`); embedded PGlite for local dev | Two tables: `users`, `records` (entity rows as JSON `data`). Optional `DB_SCHEMA`. |
| Auth | Email + password, scrypt hashes, HS256 JWT (30 d) | Roles: `admin`, `user`; custom profile fields in `users.data` |
| Authorization | Per-entity `rls` blocks evaluated server-side (`backend/src/entities.js`) | Supports `user_condition`, `{{user.field}}` templates, `$or/$and`, Mongo-style operators |
| AI | Anthropic Messages API (`ANTHROPIC_API_KEY`, `LLM_MODEL`) | `Core.InvokeLLM` incl. structured JSON via tool-use; web search optional |
| File storage | Vercel Blob (`BLOB_READ_WRITE_TOKEN`) → Supabase Storage → local `DATA_DIR/uploads` | Public URLs; **no private/signed media yet** |
| Email | SMTP via nodemailer (`SMTP_URL`), else logged | |
| Payments | Stripe (createCheckout, stripeWebhook, adminIssueRefund functions) | Keys not yet configured in Vercel |
| Scheduling | Vercel Cron → `/api/cron/reminders` (CRON_SECRET); node-cron when self-hosted | |
| Logging | console → Vercel runtime logs | No structured audit log yet |
| Feature flags | **None** before this module | Added: `FEATURE_INSTRUCTIONAL_INTELLIGENCE` |
| Tests | **None** before this module | Added under `backend/test/` |
| Monitoring | Vercel runtime logs/errors only | |

## 3. Tenancy model (observed)

There is **no organization/school tenancy** in the existing data model. Records carry `created_by` (email).
Some entities scope by owner email (`founder_email`, `user_email`); admin sees all. Instructional
Intelligence therefore introduces its own tenancy objects (`IIOrganization`, `IISchool`, `IIMembership`)
and enforces them in a dedicated authorization layer rather than relying on the generic RLS language.

## 4. Existing user roles

`users.role ∈ {admin, user}`; first account created and `ADMIN_EMAILS` become `admin`. Profile fields
(`job_title`, `organization`, `membership_tier`, …) live in `users.data` and are flattened onto the user object.

## 5. Working routes relevant to integration

- Global shell: `src/components/layout/AppLayout.jsx` wraps authenticated routes; `Sidebar.jsx` holds the primary nav
  (`navItems`) and a "Platform Tiers" list. Sub-apps (e.g. Graiedx) mount their own `*Layout.jsx` with an
  `<Outlet/>` and a "Back to Platform" link — the pattern reused here.
- API: `/api/auth/*`, `/api/entities/:entity[...]`, `/api/integrations/core/*`, `/api/functions/:name`, `/api/health`, `/api/cron/reminders`.

## 6. Deployment configuration (verified)

- Vercel project `edxponential` (team BetterEd Solutions), production from branch `vercel-portable`, URL https://edxponential.vercel.app.
- Node 22.x, function `api/index.js` maxDuration 60 s, `includeFiles backend/{entities,functions}/**`.
- **No database is connected to production yet** (health endpoint reports it). Local development uses embedded Postgres.
- Request body limit on the platform: 100 MB per function request; this module uploads media in 8 MB chunks regardless.

## 7. Third-party services and contracts

| Service | Status |
|---|---|
| Anthropic | Key not yet set in Vercel; required for analysis stages |
| Transcription (Deepgram or OpenAI Whisper) | **Not contracted.** Module ships a provider abstraction; without a key, transcripts can be entered/pasted manually and everything downstream works |
| Vercel Blob | Store not yet created (one click in Vercel → Storage) |
| Stripe | Live keys not set |

## 8. Integration points chosen for Instructional Intelligence

| Concern | Decision |
|---|---|
| Navigation | New primary nav entry "Instructional Intelligence" → `/ii/*`, own `IILayout` with permission-aware sub-nav |
| Data | New entities prefixed `II*` in `backend/entities/` (same store, same migrations-free JSON model). Direct `/api/entities/II*` access is **blocked**; all access goes through `/api/ii/*` where authorization is enforced per resource |
| Authorization | `backend/src/ii/authz.js` — deny-by-default, evaluates organization/school membership, role, ownership, sharing grants, authorization/consent status |
| Media | Private media assets: chunked upload to private storage, playback only through `/api/ii/media/:id` with authorization + audit; no public URLs |
| AI | Reuses `backend/src/integrations.js` Anthropic client; structured outputs validated; quotes verified against the transcript |
| Jobs | `IIJob` records with idempotency keys; stages run inline (Vercel 60 s) or via `/api/ii/jobs/run` worker tick |
| Feature flag | `FEATURE_INSTRUCTIONAL_INTELLIGENCE=true` enables routes + nav; default off in production |
| Reversibility | All new data in new entities/table rows; removing the flag hides the module; no changes to existing entity schemas |

## 9. Version-control checkpoint and recovery plan

- Checkpoint: branch `vercel-portable` @ `d787645` is the last production commit; this work is on branch `instructional-intelligence`.
- Recovery: redeploy `vercel-portable` (Vercel → Deployments → Promote) or `git revert` the merge. No destructive migrations are used; II records can be deleted with `DELETE FROM records WHERE entity LIKE 'II%'`.

## 10. Existing-feature preservation checklist

- [x] No existing entity schema modified
- [x] No existing route removed or renamed
- [x] Primary navigation: one entry added, none changed
- [x] `base44Client` API surface unchanged
- [x] Auth flow unchanged (II adds roles via memberships, not by changing `users.role`)
- [x] Existing 177 routes still load (regression crawl re-run after the module — see IMPLEMENTATION_STATUS.md)
