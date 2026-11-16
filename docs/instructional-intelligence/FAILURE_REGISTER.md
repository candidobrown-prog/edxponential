# Failure & Edge-Case Register — EDX-II-001 §22

Status key: **Tested** = automated test passes in this repo · **Implemented** = behaviour is in code, verified manually in the browser or by inspection, no automated test yet · **Partial** = some of the expected behaviour · **Not covered** = not implemented · **Device test required** = needs a real phone/browser matrix.

| ID | Scenario | Status | Where / evidence |
|---|---|---|---|
| F01 | Microphone permission denied | Implemented | `IIRecord.jsx` start(): detects NotAllowed, keeps setup, explains recovery (verified with Playwright fake-mic only; real denial = device test) |
| F02 | Microphone disconnected mid-recording | Implemented | `track.onended` → warns, preserves uploaded pieces, pauses; chunks already saved (device test required) |
| F03 | Browser/app interrupted during recording | Partial | 10-s slices stored in IndexedDB and uploaded as they arrive; pieces received server-side are kept. Automatic resume UI after a reload is **not** built (pending pieces are listed but not re-driven) |
| F04 | Device storage exhausted | Partial | IndexedDB writes are try/catch; upload continues from memory. No explicit storage-quota warning |
| F05 | Upload interrupted | Tested | `ii.integration` chunk 0 idempotent retry; finalize refuses when `expected_chunks` ≠ received |
| F06 | Corrupt media file | Tested | `verifyAsset` hash/size check → 422, asset marked corrupt |
| F07 | Unsupported codec | Tested | 415 with supported list |
| F08 | Ninety-minute recording | Partial | Chunked design has no length limit (1.5 GB cap); a real 90-min run was **not** executed |
| F09 | Duplicate upload | Tested | hash-identical finalized asset → 409, duplicate discarded |
| F10 | Recording authorization missing | Tested | media init 403; wizard gate blocks "Begin" |
| F11 | Teacher and student speak simultaneously | Tested | `markOverlaps`, `crossOverlap`; pct never double-counts |
| F12 | Multiple students answer together | Tested | `group` speaker; never counts as a unique individual |
| F13 | Student voice cannot be distinguished | Tested | `unknown` speaker kind reported separately; approval warns when >50 % unknown |
| F14 | Background noise obscures speech | Tested | `[inaudible]` → `inaudible: true`; Whisper `no_speech_prob` flag |
| F15 | Nonstandard dialect / code-switching | Implemented | Fixture `multilingual`; prompt forbids correction; AI check in `ai-eval.mjs` (needs key) |
| F16 | Misheard academic term | Tested | revise → new version with parent id |
| F17 | Speaker label changes after review | Tested | new version marks analyses `stale` |
| F18 | Timestamp drift | Partial | Manual transcripts without timestamps are flagged `estimated_timestamp`; no drift detection for machine transcripts |
| F19 | Hard-sounding recall question | Implemented | Prompt rule + fixture `history_misaligned` (`highest_dok_max: 1`) — AI check needs key |
| F20 | Correct answer without explanation | Implemented | Separate `correctness` and `reasoning_quality`; fixture `g2_reading` |
| F21 | Incorrect answer with sophisticated reasoning | Implemented | Same fields; no dedicated fixture yet |
| F22 | Question unrelated to the standard | Implemented | `standard_alignment` field; fixture `history_misaligned` |
| F23 | Essential question never asked | Implemented | `most_consequential_question.asked=false` + recommendation |
| F24 | Ambiguous student response | Implemented | `alternative_interpretation`, `unverifiable` correctness |
| F25 | One student dominates | Tested | `participation_concentration`, `dominated` |
| F26 | Lecture in explicit-modelling phase | Implemented | Phase passed to prompts; UI note on Discourse tab; fixture `g7_social` |
| F27 | Silent productive work | Tested | excluded intervals → `silence_or_independent_seconds`, not disengagement |
| F28 | No student responses captured | Tested | mastery risk `indeterminate`, no mastery inferred |
| F29 | Missing CFU evidence | Tested | unscored dimensions; no /100 |
| F30 | Missing authoritative rubric | Tested | finalization blocked until import with source document |
| F31 | Audio-only engagement evidence | Tested | task-engagement domain unscored on audio |
| F32 | Assessment denominator missing | Tested | percentage withheld |
| F33 | Exit ticket contradicts discussion | Tested (unit) | contradiction lowers risk/confidence; warning in analysis |
| F34 | Small, nonrepresentative sample | Tested | coverage < 50 % → limited conclusions, lower confidence |
| F35 | All speak, many wrong | Implemented | Fixture `alg1_strong_talk_weak_learning`; talk band ≠ learning (AI check needs key) |
| F36 | AI score differs from coach | Tested | reviewer rating keeps `ai_recommendation` + `adjudication` log |
| F37 | Unshared private reflection | Tested | coach/principal 403 |
| F38 | Teacher revokes sharing | Tested | immediate 403 |
| F39 | Access to another school's recording | Tested | 403 + audit |
| F40 | District admin requests student-level evidence | Tested | 403; aggregates only |
| F41 | Consent expires / withdrawn | Tested | withdraw → recording, transcription, analysis blocked; expiry checked in `authorizationValid` |
| F42 | Malicious instructions in transcript | Implemented | transcript wrapped as data; system prompt instructs to ignore; no automated adversarial test yet |
| F43 | Report export would expose restricted data | Tested | report requires `observation.read`; private reflections never included |
| F44 | Small reporting group | Tested | school trends suppressed below `min_group_size` |
| F45 | AI service times out | Implemented | per-stage try/catch; completed stages kept; `force=true` rerun |
| F46 | Background job runs twice | Tested | idempotency keys for transcribe/analyze |
| F47 | Session expires during editing | Partial | Wizard draft persisted in localStorage; transcript edits are in memory until saved (lost on expiry) |
| F48 | Database migration fails | Not applicable | No DDL migrations; schema is additive JSON rows |
| F49 | Model output violates schema | Tested (mock) | tool-use schema + `analysis.test` downgrades invalid ratings |
| F50 | AI generates unsupported quotation | Tested (mock) | `verifyQuote` flags; approval requires explicit `accept_unverified` |
| F51 | Report from outdated transcript | Tested | stale analysis cannot be approved; report lists limitation |
| F52 | User loses permission mid-process | Tested | membership revoked → no new observations; every request re-checks |
| F53 | School account suspended | Partial | `IISchool.status` exists; not yet enforced in authz |
| F54 | Deletion vs retention conflict | Partial | Retention policy stored and displayed; automated purge not scheduled |
| F55 | Processing cost exceeds budget | Not covered | No budget controls; Vercel function limit (60 s) bounds each call |
| F56 | Deployment breaks existing feature | Tested | 177-route regression crawl unchanged (174 pass; 3 pre-existing AI pages need key) |
