# Deployment, Rollback and Operating Cost — Instructional Intelligence

## Enabling (staged)
1. Merge `instructional-intelligence` into `vercel-portable` **only after approval** (this branch has not been deployed anywhere).
2. In Vercel → edxponential → Environment Variables add:
   - `FEATURE_INSTRUCTIONAL_INTELLIGENCE=true` (preview first, then production)
   - `ANTHROPIC_API_KEY` (AI stages), `DEEPGRAM_API_KEY` or `OPENAI_API_KEY` (+ `TRANSCRIPTION_PROVIDER`)
   - `BLOB_READ_WRITE_TOKEN` (create a Blob store in Storage) — media is stored **private**
   - a Postgres connection (`DATABASE_URL`/`POSTGRES_URL`) — required for anything to persist
3. Redeploy. Sign in as the platform admin → Instructional Intelligence → "Create pilot organization" → Administration → grant roles.
4. Administration → CFU-100 rubric → import the authoritative Basic/Unsatisfactory multipliers with the source document reference. Until then CFU-100 cannot be finalized (by design).

## Rollback
- Set `FEATURE_INSTRUCTIONAL_INTELLIGENCE=false` and redeploy: routes return 404, navigation entry disappears, data is untouched.
- Or Vercel → Deployments → promote the previous production deployment (`vercel-portable` @ d787645).
- Data removal if ever required: `DELETE FROM records WHERE entity LIKE 'II%'` and delete the `ii-media/` prefix in the Blob store. No existing tables or rows are modified by this module.

## Runtime limits that matter
- Vercel function `maxDuration` is 60 s (`vercel.json`). Transcription of long recordings through a provider and the AI stages run inline today: a 45–90-minute recording **may exceed 60 s** on Deepgram/Whisper. Mitigation options (not yet implemented): raise `maxDuration` (Pro plan allows 300 s+), or move transcription to a background worker/queue.
- Request body limit per chunk: 8 MB (platform allows up to 100 MB).
- Embedded Postgres (PGlite) is for local development only.

## Operating-cost estimate (per 30-minute observation, list prices, to be verified against current pricing)
- Transcription: Deepgram Nova ≈ $0.0043/min → ≈ $0.13; OpenAI Whisper $0.006/min → ≈ $0.18.
- AI analysis (4 stages, ~15–25k input tokens total on a 30-min transcript, ~6k output): with Claude Sonnet ≈ $0.10–0.25 per observation; reflection follow-ups ≈ $0.002 each.
- Storage: 30 min opus audio ≈ 15 MB → Blob storage ≈ $0.0004/month per recording plus egress on playback.
- Database rows are small (transcripts tens of KB).
Set a per-month budget alert in Anthropic Console and Vercel; the module has **no built-in spend cap (F55)**.
