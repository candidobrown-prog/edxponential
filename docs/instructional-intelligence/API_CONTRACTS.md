# API Contracts — `/api/ii` (feature-flagged)

All endpoints require `Authorization: Bearer <token>` (the platform's JWT). JSON unless noted. Errors: `{ error, message, code? }` with HTTP status (401 unauthenticated, 403 unauthorized, 404, 409 conflict/state, 413 too large, 415 unsupported media, 422 validation, 501 provider not configured, 503 no database).

## Access & tenancy
- `GET /me` → `{ user, platform_admin, memberships[], organizations[], schools[], needs_bootstrap, providers{transcription, ai, media_storage}, capabilities{} }`
- `POST /bootstrap {organization_name?, school_name?}` (platform admin, once)
- `GET/POST /orgs` · `GET/POST /schools` · `PUT /schools/:id`
- `GET /memberships?school_id|organization_id` · `POST /memberships {user_email, organization_id, school_id?, role}` · `DELETE /memberships/:id`
- `GET /rubric` · `PUT /rubric {version, dimensions?, multipliers{basic?, unsatisfactory?}, anchors?, source_document, authoritative}`
- `GET /audit?organization_id&school_id` · `GET/PUT /retention` · `GET /system/health`

## Observations
- `GET /observations?school_id&status` (only those the caller may read)
- `POST /observations {school_id, teacher_email, teacher_name?, grade?, subject?, date?, purpose?, duration_type?, standard?, objective?, success_criteria?, lesson_type?, instructional_phase?, students_enrolled?, students_present?, seating_codes[], evidence_modes[]}`
- `GET /observations/:id` → `{ observation, authorization, authorization_valid, media[], transcripts[], current_transcript, analysis, evidence[], coaching[], action_plans[], reflections[] (visible only), jobs[], permissions{} }`
- `PUT /observations/:id` (context fields, status)
- `POST /observations/:id/authorization {consent_basis, expires_at?, permitted_processing[], notes?}` · `POST …/authorization/withdraw`
- `POST /observations/:id/notes {text, t}` · `POST /observations/:id/markers {type, t, label?}`
- `POST /observations/:id/share {teacher?: bool, leadership?: bool, grantee_email?, revoke_email?}`

## Media (private)
- `POST /observations/:id/media {kind: audio|video, mime, filename?}` → `{asset_id, chunk_limit}` (requires valid authorization)
- `PUT /media/:assetId/chunks/:index` raw body ≤ 8 MB (idempotent by index+hash)
- `GET /media/:assetId/status` · `POST /media/:assetId/finalize {expected_chunks?, duration_seconds?}` → verifies integrity, detects duplicates
- `GET /media/:assetId` streams with Range support (authorized + audited) · `DELETE /media/:assetId`

## Transcripts
- `POST /observations/:id/transcribe {asset_id?}` → job (501 if no provider)
- `POST /observations/:id/transcripts/manual {text | segments[]}`
- `GET /observations/:id/transcripts` · `GET /transcripts/:vid`
- `POST /transcripts/:vid/revise {segments[], change_summary?}` → new version; marks analyses stale
- `POST /transcripts/:vid/approve {force?}`

Segment shape: `{ id, start, end, speaker: teacher|student|group|unknown, speaker_label, text, confidence, inaudible, overlap, flags[] }`

## Analysis
- `POST /observations/:id/analyze {force?}` → `{ job, analysis }` (idempotent per transcript version)
- `GET /observations/:id/analysis`
- `PUT /analysis/:aid/cfu {ratings: {dimensionKey: {level, rationale?, reviewer_comment?, reason?}}}` (coach)
- `PUT /analysis/:aid/engagement {scores: {domainKey: 0-100}}` · `PUT /analysis/:aid/priorities {priorities[]}`
- `POST /analysis/:aid/approve {accept_unverified?, finalize_cfu?}`
- `POST /observations/:id/evidence {kind, correct, denominator, aligned, summary, items[]?, representative?}`
- `GET /observations/:id/report?level=executive|full`
- `GET /jobs?observation_id`

## Reflection, coaching, plans, PLC, trends
- `GET /reflections/areas` · `GET /reflections` · `POST /reflections {school_id, observation_id?}` · `GET/PUT /reflections/:id` · `POST /reflections/:id/followup {area, answer}` · `POST /reflections/:id/share {emails[]}` · `POST /reflections/:id/revoke {email}`
- `GET/POST /coaching` · `GET/PUT /coaching/:id` · `POST /coaching/:id/acknowledge {agree, note?}`
- `GET/POST /action-plans` · `PUT /action-plans/:id {items?, status?, adult_behavior_evidence?, student_outcome_evidence?}`
- `GET/POST /reassessments` · `PUT /reassessments/:id {results:{correct,total,aligned}, notes?}`
- `GET/POST /plc` · `PUT /plc/:id`
- `GET /dashboard` · `GET /trends/school/:schoolId` · `GET /trends/district/:orgId`
