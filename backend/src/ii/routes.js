// Instructional Intelligence API — mounted at /api/ii (see app.js). Feature-flagged.
import express from 'express';
import crypto from 'node:crypto';
import { userFromRequest } from '../auth.js';
import { loadContext, require as authz, can, rolesAt, hasRole, isDistrictAdmin, authorizationValid, suppress, ROLES } from './authz.js';
import { get, list, create, update, remove, tryGet, httpError } from './store.js';
import * as media from './media.js';
import { transcribe, providerStatus, parseManualTranscript, markOverlaps } from './transcription.js';
import { runFullAnalysis, reflectionFollowUp, aiConfigured } from './analysis.js';
import { scoreCfu100, DEFAULT_RUBRIC, CFU_DIMENSIONS } from './scoring/cfu100.js';
import { computeEngagement } from './scoring/engagement.js';
import { computeTalkTime } from './scoring/talkTime.js';
import { assessMasteryRisk } from './scoring/masteryRisk.js';

export const FLAG = 'FEATURE_INSTRUCTIONAL_INTELLIGENCE';
export const enabled = () => /^(1|true|yes|on)$/i.test(process.env[FLAG] || '');

const router = express.Router();
const h = (fn) => async (req, res) => {
  try { const out = await fn(req, res); if (!res.headersSent && out !== undefined) res.json(out); }
  catch (e) { if (!e.status || e.status >= 500) console.error(`[ii ${req.method} ${req.path}]`, e); if (!res.headersSent) res.status(e.status || 500).json({ error: e.message, code: e.code || null, message: e.message }); }
};
const now = () => new Date().toISOString();
const typed = (type, rec) => rec && Object.assign(rec, { __type: type });
const pick = (obj, keys) => Object.fromEntries(Object.entries(obj || {}).filter(([k]) => keys.includes(k)));
const required = (obj, keys) => { const miss = keys.filter((k) => obj[k] === undefined || obj[k] === null || obj[k] === ''); if (miss.length) throw httpError(422, `Missing required field(s): ${miss.join(', ')}`); };

router.use(async (req, _res, next) => {
  try {
    if (!enabled()) throw httpError(404, 'Instructional Intelligence is not enabled on this deployment');
    req.ctx = await loadContext(await userFromRequest(req)); next();
  } catch (e) { next(e); }
});
router.use(express.json({ limit: '5mb' }));

// ---------- me / capabilities ----------
router.get('/me', h(async (req) => {
  const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated');
  const orgIds = [...new Set(ctx.memberships.map((m) => m.organization_id))];
  const orgs = (await Promise.all(orgIds.map((id) => tryGet('IIOrganization', id)))).filter(Boolean);
  const schoolIds = [...new Set(ctx.memberships.map((m) => m.school_id).filter(Boolean))];
  let schools = (await Promise.all(schoolIds.map((id) => tryGet('IISchool', id)))).filter(Boolean);
  for (const m of ctx.memberships.filter((m) => m.role === 'district_admin' && !m.school_id)) schools = schools.concat(await list('IISchool', { organization_id: m.organization_id }));
  schools = Object.values(Object.fromEntries(schools.map((s) => [s.id, s])));
  const anyOrg = ctx.platformAdmin ? (await list('IIOrganization', {}, '-created_date', 1)).length > 0 : true;
  return {
    enabled: true, user: { email: ctx.user.email, full_name: ctx.user.full_name }, platform_admin: ctx.platformAdmin, memberships: ctx.memberships, organizations: orgs, schools,
    needs_bootstrap: ctx.platformAdmin && !anyOrg,
    providers: { transcription: providerStatus(), ai: { configured: aiConfigured(), model: process.env.LLM_MODEL || 'claude-sonnet-5-5' }, media_storage: process.env.BLOB_READ_WRITE_TOKEN ? 'vercel-blob-private' : 'local-disk' },
    capabilities: {
      create_observation: ctx.memberships.some((m) => ['coach', 'observer', 'principal', 'district_admin'].includes(m.role)),
      school_aggregates: ctx.memberships.some((m) => ['principal', 'district_admin', 'coach'].includes(m.role)),
      district_aggregates: ctx.memberships.some((m) => m.role === 'district_admin'),
      admin: ctx.platformAdmin || ctx.memberships.some((m) => ['district_admin', 'principal'].includes(m.role)),
      rubric: ctx.platformAdmin || ctx.memberships.some((m) => m.role === 'district_admin'),
      plc: ctx.memberships.some((m) => ['plc_facilitator', 'coach', 'principal', 'teacher'].includes(m.role)),
      teacher: ctx.memberships.some((m) => m.role === 'teacher'),
    },
  };
}));

// ---------- tenancy & admin ----------
router.post('/bootstrap', h(async (req) => {
  const { ctx } = req; if (!ctx.platformAdmin) throw httpError(403, 'Only a platform administrator can bootstrap');
  if ((await list('IIOrganization', {}, '-created_date', 1)).length) throw httpError(409, 'Already bootstrapped');
  const org = await create('IIOrganization', { name: req.body?.organization_name || 'BetterEd Pilot District' }, ctx.user.email);
  const school = await create('IISchool', { organization_id: org.id, name: req.body?.school_name || 'Pilot School', district: org.name }, ctx.user.email);
  for (const role of ['district_admin', 'coach']) await create('IIMembership', { user_email: ctx.user.email, organization_id: org.id, school_id: role === 'district_admin' ? null : school.id, role, granted_by: ctx.user.email }, ctx.user.email);
  await create('IIRubricConfig', { organization_id: org.id, ...DEFAULT_RUBRIC, imported_by: null, source_document: null }, ctx.user.email);
  return { organization: org, school };
}));
router.get('/orgs', h(async (req) => { const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); const all = await list('IIOrganization'); return ctx.platformAdmin ? all : all.filter((o) => ctx.memberships.some((m) => m.organization_id === o.id)); }));
router.post('/orgs', h(async (req) => { const { ctx } = req; await authz(ctx, 'rubric.manage', {}, { req }); required(req.body, ['name']); return create('IIOrganization', pick(req.body, ['name', 'settings']), ctx.user.email); }));
router.get('/schools', h(async (req) => { const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); const q = req.query.organization_id ? { organization_id: req.query.organization_id } : {}; const all = await list('IISchool', q); return ctx.platformAdmin ? all : all.filter((s) => rolesAt(ctx, { organization_id: s.organization_id, school_id: s.id }).length); }));
router.post('/schools', h(async (req) => { const { ctx } = req; required(req.body, ['organization_id', 'name']); const org = typed('IIOrganization', await get('IIOrganization', req.body.organization_id)); await authz(ctx, 'org.manage', org, { req }); return create('IISchool', pick(req.body, ['organization_id', 'name', 'district', 'recording_policy', 'min_group_size']), ctx.user.email); }));
router.put('/schools/:id', h(async (req) => { const { ctx } = req; const s = typed('IISchool', await get('IISchool', req.params.id)); await authz(ctx, 'school.manage', s, { req }); return update('IISchool', s.id, pick(req.body, ['name', 'district', 'recording_policy', 'min_group_size', 'status'])); }));
router.get('/memberships', h(async (req) => { const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); const q = {}; if (req.query.school_id) q.school_id = req.query.school_id; if (req.query.organization_id) q.organization_id = req.query.organization_id; const all = await list('IIMembership', q); return all.filter((m) => ctx.platformAdmin || isDistrictAdmin(ctx, m.organization_id) || (m.school_id && hasRole(ctx, m, 'principal')) || m.user_email === ctx.user.email); }));
router.post('/memberships', h(async (req) => {
  const { ctx } = req; required(req.body, ['user_email', 'organization_id', 'role']); if (!ROLES.includes(req.body.role)) throw httpError(422, 'Unknown role');
  if (req.body.role !== 'district_admin') required(req.body, ['school_id']);
  await authz(ctx, 'membership.manage', { organization_id: req.body.organization_id, school_id: req.body.school_id || null }, { req });
  if (req.body.role === 'district_admin' && !(ctx.platformAdmin || isDistrictAdmin(ctx, req.body.organization_id))) throw httpError(403, 'Only district administrators can grant district roles');
  const dup = await list('IIMembership', { user_email: req.body.user_email.toLowerCase(), organization_id: req.body.organization_id, school_id: req.body.school_id || null, role: req.body.role });
  if (dup.length) return update('IIMembership', dup[0].id, { status: 'active' });
  return create('IIMembership', { ...pick(req.body, ['organization_id', 'school_id', 'role']), user_email: req.body.user_email.toLowerCase(), granted_by: ctx.user.email }, ctx.user.email);
}));
router.delete('/memberships/:id', h(async (req) => { const { ctx } = req; const m = await get('IIMembership', req.params.id); await authz(ctx, 'membership.manage', m, { req }); await update('IIMembership', m.id, { status: 'revoked' }); return { success: true }; }));

router.get('/rubric', h(async (req) => { const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); return activeRubric(); }));
router.put('/rubric', h(async (req) => {
  const { ctx } = req; await authz(ctx, 'rubric.manage', {}, { req });
  const body = req.body || {}; const mult = { ...DEFAULT_RUBRIC.multipliers, ...(body.multipliers || {}) };
  for (const [k, v] of Object.entries(mult)) if (v !== null && (typeof v !== 'number' || v < 0 || v > 1)) throw httpError(422, `Multiplier ${k} must be between 0 and 1`);
  const dims = body.dimensions || CFU_DIMENSIONS; if (dims.reduce((a, d) => a + d.weight, 0) !== 100) throw httpError(422, 'Dimension weights must total 100');
  const authoritative = body.authoritative === true && mult.basic !== null && mult.unsatisfactory !== null && !!body.source_document;
  if (body.authoritative === true && !authoritative) throw httpError(422, 'An authoritative rubric needs Basic and Unsatisfactory multipliers and the source document reference');
  const cur = await activeRubric(true); if (cur?.id) await update('IIRubricConfig', cur.id, { active: false });
  return create('IIRubricConfig', { organization_id: body.organization_id || cur?.organization_id || null, version: body.version || `CFU-100 ${now().slice(0, 10)}`, dimensions: dims, multipliers: mult, anchors: body.anchors || {}, authoritative, imported_by: ctx.user.email, source_document: body.source_document || null, active: true }, ctx.user.email);
}));
async function activeRubric(raw = false) { const r = (await list('IIRubricConfig', { active: true }, '-created_date', 1))[0]; if (!r) return raw ? null : { ...DEFAULT_RUBRIC, id: null }; return r; }

router.get('/audit', h(async (req) => { const { ctx } = req; const scope = { organization_id: req.query.organization_id, school_id: req.query.school_id || null }; await authz(ctx, 'audit.read', scope, { audit: false }); const q = {}; if (scope.organization_id) q.organization_id = scope.organization_id; if (scope.school_id) q.school_id = scope.school_id; return list('IIAuditEvent', q, '-created_date', 300); }));
router.get('/retention', h(async (req) => { const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); return (await list('IIRetentionPolicy', req.query.organization_id ? { organization_id: req.query.organization_id } : {}))[0] || null; }));
router.put('/retention', h(async (req) => { const { ctx } = req; required(req.body, ['organization_id']); await authz(ctx, 'policy.manage', req.body, { req }); const cur = (await list('IIRetentionPolicy', { organization_id: req.body.organization_id }))[0]; const data = { ...pick(req.body, ['organization_id', 'media_days', 'transcript_days', 'policy_text']), set_by: ctx.user.email }; return cur ? update('IIRetentionPolicy', cur.id, data) : create('IIRetentionPolicy', data, ctx.user.email); }));
router.get('/system/health', h(async (req) => { const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); const jobs = await list('IIJob', {}, '-created_date', 50); return { providers: { transcription: providerStatus(), ai: aiConfigured(), media: process.env.BLOB_READ_WRITE_TOKEN ? 'vercel-blob-private' : 'local-disk' }, jobs: { recent: jobs.length, failed: jobs.filter((j) => j.status === 'failed').length, running: jobs.filter((j) => j.status === 'running').length }, feature_flag: FLAG, time: now() }; }));

// ---------- observations ----------
const OBS_FIELDS = ['teacher_email', 'teacher_name', 'grade', 'subject', 'date', 'purpose', 'duration_type', 'standard', 'objective', 'success_criteria', 'lesson_type', 'instructional_phase', 'students_enrolled', 'students_present', 'seating_codes', 'evidence_modes', 'evidence_types', 'excluded_intervals'];
async function loadObs(id) { const o = typed('IIObservation', await get('IIObservation', id)); return o; }
async function visibleObservations(ctx, q = {}) { const all = await list('IIObservation', q); const out = []; for (const o of all) if (await can(ctx, 'observation.read', typed('IIObservation', o))) out.push(o); return out; }

router.get('/observations', h(async (req) => { const q = {}; if (req.query.school_id) q.school_id = req.query.school_id; if (req.query.status) q.status = req.query.status; return visibleObservations(req.ctx, q); }));
router.post('/observations', h(async (req) => {
  const { ctx } = req; required(req.body, ['school_id', 'teacher_email']);
  const school = await get('IISchool', req.body.school_id); const scope = { organization_id: school.organization_id, school_id: school.id };
  await authz(ctx, 'observation.create', scope, { req });
  const data = { ...pick(req.body, OBS_FIELDS), organization_id: school.organization_id, school_id: school.id, observer_email: ctx.user.email, teacher_email: req.body.teacher_email.toLowerCase(), status: 'draft' };
  if (!data.evidence_types?.length) data.evidence_types = (data.evidence_modes || []).map((m) => (m === 'live_audio' || m === 'audio_upload' ? 'audio' : m === 'video_upload' ? 'video' : 'notes'));
  return create('IIObservation', data, ctx.user.email);
}));
router.get('/observations/:id', h(async (req) => {
  const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'observation.read', obs, { req });
  const [auth, assets, transcripts, analyses, evidence, coaching, plans, jobs] = await Promise.all([
    obs.authorization_id ? tryGet('IIRecordingAuthorization', obs.authorization_id) : null, list('IIMediaAsset', { observation_id: obs.id }), list('IITranscriptVersion', { observation_id: obs.id }, 'version'),
    list('IIAnalysis', { observation_id: obs.id }, '-created_date'), list('IIEvidenceItem', { observation_id: obs.id }), list('IICoachingSession', { observation_id: obs.id }), list('IIActionPlan', { observation_id: obs.id }), list('IIJob', { observation_id: obs.id }, '-created_date', 20),
  ]);
  const isTeacher = obs.teacher_email === ctx.user.email.toLowerCase();
  const reflections = (await list('IITeacherReflection', { observation_id: obs.id })).filter((r) => r.teacher_email === ctx.user.email.toLowerCase() || (r.shared_with || []).includes(ctx.user.email.toLowerCase()));
  const permissions = { update: await can(ctx, 'observation.update', obs), record: await can(ctx, 'observation.record', obs), share: await can(ctx, 'observation.share', obs), transcript_edit: await can(ctx, 'transcript.edit', obs), transcript_approve: await can(ctx, 'transcript.approve', obs), analysis_run: await can(ctx, 'analysis.run', obs), analysis_review: await can(ctx, 'analysis.review', obs), evidence_write: await can(ctx, 'evidence.write', obs), delete_media: await can(ctx, 'observation.delete_media', obs), is_teacher: isTeacher };
  return { observation: obs, authorization: auth, authorization_valid: await authorizationValid(obs), media: assets.filter((a) => a.status !== 'deleted').map(({ chunks, ...a }) => ({ ...a, chunk_count: chunks?.length || 0 })), transcripts: transcripts.map(({ segments, ...t }) => ({ ...t, segment_count: segments?.length || 0 })), current_transcript: transcripts.find((t) => t.id === obs.current_transcript_version_id) || transcripts.at(-1) || null, analysis: analyses[0] || null, evidence, coaching, action_plans: plans, reflections, jobs, permissions };
}));
router.put('/observations/:id', h(async (req) => {
  const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'observation.update', obs, { req });
  const patch = pick(req.body, [...OBS_FIELDS, 'status']);
  if (patch.status && !['draft', 'setup', 'recording', 'recorded', 'review', 'analyzed', 'approved', 'archived'].includes(patch.status)) throw httpError(422, 'Invalid status');
  if (patch.teacher_email) patch.teacher_email = patch.teacher_email.toLowerCase();
  return update('IIObservation', obs.id, patch);
}));
router.post('/observations/:id/authorization', h(async (req) => {
  const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'observation.update', obs, { req }); required(req.body, ['consent_basis']);
  const a = await create('IIRecordingAuthorization', { organization_id: obs.organization_id, school_id: obs.school_id, observation_id: obs.id, authorized_by: ctx.user.email, consent_basis: req.body.consent_basis, consent_status: 'valid', expires_at: req.body.expires_at || null, permitted_processing: req.body.permitted_processing || ['transcription', 'analysis'], notes: req.body.notes || '' }, ctx.user.email);
  await update('IIObservation', obs.id, { authorization_id: a.id, status: obs.status === 'draft' ? 'setup' : obs.status });
  return a;
}));
router.post('/observations/:id/authorization/withdraw', h(async (req) => { const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'observation.update', obs, { req }); if (!obs.authorization_id) throw httpError(404, 'No authorization'); await update('IIRecordingAuthorization', obs.authorization_id, { consent_status: 'withdrawn' }); return { success: true, effect: 'Recording is blocked and processing jobs will refuse to run until a new authorization is recorded.' }; }));
router.post('/observations/:id/notes', h(async (req) => { const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'observation.update', obs, { req }); required(req.body, ['text']); const note = { id: crypto.randomUUID(), text: String(req.body.text).slice(0, 4000), t: Number(req.body.t) || 0, author: ctx.user.email, created_at: now() }; await update('IIObservation', obs.id, { notes: [...(obs.notes || []), note] }); return note; }));
router.post('/observations/:id/markers', h(async (req) => { const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'observation.update', obs, { req }); required(req.body, ['type']); const types = ['evidence', 'note', 'teacher_question', 'student_response', 'misconception', 'instructional_adjustment', 'engagement', 'uncertain']; if (!types.includes(req.body.type)) throw httpError(422, 'Unknown marker type'); const m = { id: crypto.randomUUID(), type: req.body.type, t: Number(req.body.t) || 0, label: String(req.body.label || '').slice(0, 500), author: ctx.user.email, created_at: now() }; await update('IIObservation', obs.id, { markers: [...(obs.markers || []), m] }); return m; }));
router.post('/observations/:id/share', h(async (req) => {
  const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'observation.share', obs, { req });
  const patch = {}; if (typeof req.body.teacher === 'boolean') patch.shared_with_teacher = req.body.teacher; if (typeof req.body.leadership === 'boolean') patch.shared_with_leadership = req.body.leadership;
  if (req.body.grantee_email) await create('IISharingGrant', { organization_id: obs.organization_id, school_id: obs.school_id, resource_type: 'IIObservation', resource_id: obs.id, owner_email: ctx.user.email, grantee_email: req.body.grantee_email.toLowerCase(), scope: 'read', status: 'active', granted_at: now() }, ctx.user.email);
  if (req.body.revoke_email) for (const g of await list('IISharingGrant', { resource_type: 'IIObservation', resource_id: obs.id, grantee_email: req.body.revoke_email.toLowerCase(), status: 'active' })) await update('IISharingGrant', g.id, { status: 'revoked', revoked_at: now() });
  return Object.keys(patch).length ? update('IIObservation', obs.id, patch) : obs;
}));

// ---------- media ----------
router.post('/observations/:id/media', h(async (req) => {
  const { ctx } = req; const obs = await loadObs(req.params.id);
  if (!(await authorizationValid(obs))) throw httpError(403, 'Recording authorization is missing, expired or withdrawn (F10)');
  await authz(ctx, 'observation.record', obs, { req }); required(req.body, ['kind', 'mime']);
  const mimeBase = String(req.body.mime).split(';')[0];
  if (!media.ALLOWED_MIME.includes(mimeBase)) throw httpError(415, `Unsupported media type ${mimeBase}. Supported: ${media.ALLOWED_MIME.join(', ')} (F07)`);
  const asset = await create('IIMediaAsset', { organization_id: obs.organization_id, school_id: obs.school_id, observation_id: obs.id, kind: req.body.kind, mime: req.body.mime, storage: process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'local', uploaded_by: ctx.user.email, original_filename: req.body.filename || null, status: 'uploading', chunks: [] }, ctx.user.email);
  if (obs.status === 'setup' || obs.status === 'draft') await update('IIObservation', obs.id, { status: 'recording' });
  return { asset_id: asset.id, chunk_limit: media.CHUNK_LIMIT };
}));
router.put('/media/:assetId/chunks/:index', express.raw({ type: () => true, limit: media.CHUNK_LIMIT + 1024 }), h(async (req) => {
  const { ctx } = req; const asset = await get('IIMediaAsset', req.params.assetId); const obs = await loadObs(asset.observation_id);
  await authz(ctx, 'observation.record', obs, { audit: false });
  if (asset.finalized) throw httpError(409, 'Asset already finalized');
  const index = parseInt(req.params.index, 10); if (!Number.isInteger(index) || index < 0) throw httpError(422, 'Bad chunk index');
  const buf = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0); if (!buf.length) throw httpError(422, 'Empty chunk');
  const existing = (asset.chunks || []).find((c) => c.index === index);
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  if (existing && existing.sha256 === sha) return { ok: true, index, duplicate: true };          // idempotent retry (F05)
  const total = (asset.chunks || []).filter((c) => c.index !== index).reduce((a, c) => a + c.size, 0) + buf.length;
  if (total > media.MAX_ASSET_BYTES) throw httpError(413, 'Recording exceeds the maximum size');
  const stored = await media.putChunk(asset.id, index, buf);
  const chunks = [...(asset.chunks || []).filter((c) => c.index !== index), stored].sort((a, b) => a.index - b.index);
  await update('IIMediaAsset', asset.id, { chunks, size_bytes: chunks.reduce((a, c) => a + c.size, 0) });
  return { ok: true, index, received: chunks.length };
}));
router.get('/media/:assetId/status', h(async (req) => { const { ctx } = req; const asset = await get('IIMediaAsset', req.params.assetId); const obs = await loadObs(asset.observation_id); await authz(ctx, 'observation.read', obs, { audit: false }); return { id: asset.id, status: asset.status, finalized: asset.finalized, received_chunks: (asset.chunks || []).map((c) => c.index), size_bytes: asset.size_bytes, duration_seconds: asset.duration_seconds }; }));
router.post('/media/:assetId/finalize', h(async (req) => {
  const { ctx } = req; const asset = await get('IIMediaAsset', req.params.assetId); const obs = await loadObs(asset.observation_id); await authz(ctx, 'observation.record', obs, { req });
  const v = await media.verifyAsset(asset);
  if (!v.ok) { await update('IIMediaAsset', asset.id, { status: 'corrupt' }); throw httpError(422, `Recording could not be verified: ${v.problems.join('; ')} (F06)`); }
  const expected = Number(req.body?.expected_chunks); if (Number.isInteger(expected) && expected !== v.chunk_count) throw httpError(409, `Expected ${expected} chunks but ${v.chunk_count} were received — upload incomplete (F05)`);
  const dup = (await list('IIMediaAsset', { observation_id: obs.id, finalized: true })).find((a) => a.id !== asset.id && a.size_bytes === v.total_bytes && JSON.stringify((a.chunks || []).map((c) => c.sha256)) === JSON.stringify((asset.chunks || []).map((c) => c.sha256)));
  if (dup) { await update('IIMediaAsset', asset.id, { status: 'deleted', deleted_at: now() }); await media.deleteChunks(asset.chunks); throw httpError(409, `Duplicate of an existing recording (${dup.id}); the duplicate was discarded (F09)`); }
  const sha = crypto.createHash('sha256').update((asset.chunks || []).map((c) => c.sha256).join('')).digest('hex');
  const updated = await update('IIMediaAsset', asset.id, { finalized: true, status: 'ready', duration_seconds: Number(req.body?.duration_seconds) || null, sha256: sha, size_bytes: v.total_bytes });
  await update('IIObservation', obs.id, { status: 'recorded' });
  return { ...updated, chunks: undefined, verified: v };
}));
router.get('/media/:assetId', h(async (req, res) => { const { ctx } = req; const asset = await get('IIMediaAsset', req.params.assetId); const obs = await loadObs(asset.observation_id); await authz(ctx, 'media.play', obs, { req }); if (asset.status === 'deleted') throw httpError(410, 'Recording deleted'); if (!asset.finalized) throw httpError(409, 'Recording not finalized'); await media.streamToResponse(asset, req, res); }));
router.delete('/media/:assetId', h(async (req) => { const { ctx } = req; const asset = await get('IIMediaAsset', req.params.assetId); const obs = await loadObs(asset.observation_id); await authz(ctx, 'observation.delete_media', obs, { req }); await media.deleteChunks(asset.chunks); await update('IIMediaAsset', asset.id, { status: 'deleted', deleted_at: now(), chunks: [] }); return { success: true }; }));

// ---------- transcripts ----------
async function nextVersion(obsId) { const vs = await list('IITranscriptVersion', { observation_id: obsId }); return vs.reduce((a, v) => Math.max(a, v.version || 0), 0) + 1; }
async function saveTranscript(ctx, obs, data) {
  const v = await create('IITranscriptVersion', { organization_id: obs.organization_id, school_id: obs.school_id, observation_id: obs.id, version: await nextVersion(obs.id), confidence_mean: meanConf(data.segments), ...data }, ctx.user.email);
  await update('IIObservation', obs.id, { current_transcript_version_id: v.id, status: ['draft', 'setup', 'recording', 'recorded'].includes(obs.status) ? 'review' : obs.status });
  for (const a of await list('IIAnalysis', { observation_id: obs.id, stale: false })) if (a.transcript_version_id !== v.id) await update('IIAnalysis', a.id, { stale: true });   // F17 / F51
  return v;
}
const meanConf = (segs = []) => { const c = segs.map((s) => s.confidence).filter((x) => typeof x === 'number'); return c.length ? Math.round(c.reduce((a, b) => a + b, 0) / c.length * 100) / 100 : null; };

router.post('/observations/:id/transcribe', h(async (req) => {
  const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'analysis.run', obs, { req });
  const auth = obs.authorization_id && await tryGet('IIRecordingAuthorization', obs.authorization_id);
  if (!auth || auth.consent_status !== 'valid' || !(auth.permitted_processing || []).includes('transcription')) throw httpError(403, 'Transcription is not permitted by the recording authorization (F41)');
  const asset = req.body?.asset_id ? await get('IIMediaAsset', req.body.asset_id) : (await list('IIMediaAsset', { observation_id: obs.id, status: 'ready' }, '-created_date', 1))[0];
  if (!asset || asset.observation_id !== obs.id) throw httpError(404, 'No finalized recording to transcribe');
  const idem = `transcribe:${asset.id}:${asset.sha256}`;
  const prior = (await list('IIJob', { idempotency_key: idem })).find((j) => j.status === 'done' || j.status === 'running');
  if (prior) return { job: prior, note: prior.status === 'running' ? 'Already running' : 'Already transcribed', transcript_version_id: prior.result_ref };
  const job = await create('IIJob', { organization_id: obs.organization_id, school_id: obs.school_id, observation_id: obs.id, type: 'transcribe', idempotency_key: idem, status: 'running', attempts: 1, started_at: now(), requested_by: ctx.user.email }, ctx.user.email);
  try {
    const st = providerStatus(); if (!st.configured) throw Object.assign(new Error(st.message), { status: 501, code: 'transcription_not_configured' });
    const buf = await media.assembleBuffer(asset);
    const out = await transcribe(buf, asset.mime);
    const v = await saveTranscript(ctx, obs, { source: 'machine', provider: out.provider, segments: markOverlaps(out.segments), media_asset_id: asset.id, change_summary: out.note || 'Machine transcript', duration_seconds: out.raw_duration || asset.duration_seconds || null });
    await update('IIJob', job.id, { status: 'done', finished_at: now(), result_ref: v.id });
    return { job: { ...job, status: 'done' }, transcript_version_id: v.id, segment_count: v.segments.length };
  } catch (e) { await update('IIJob', job.id, { status: 'failed', finished_at: now(), error: e.message }); throw e; }
}));
router.post('/observations/:id/transcripts/manual', h(async (req) => {
  const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'transcript.edit', obs, { req });
  const segments = Array.isArray(req.body.segments) ? req.body.segments.map(cleanSegment).filter(Boolean) : parseManualTranscript(req.body.text);
  if (!segments.length) throw httpError(422, 'No transcript lines could be read');
  return saveTranscript(ctx, obs, { source: 'manual', provider: 'manual', segments: markOverlaps(segments), change_summary: req.body.change_summary || 'Manually entered transcript', duration_seconds: Number(req.body.duration_seconds) || Math.max(...segments.map((s) => s.end)) });
}));
const cleanSegment = (s) => { if (!s || typeof s.text !== 'string') return null; const start = Number(s.start), end = Number(s.end); if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null; return { id: s.id || crypto.randomUUID().slice(0, 8), start, end, speaker: ['teacher', 'student', 'group', 'unknown'].includes(s.speaker) ? s.speaker : 'unknown', speaker_label: s.speaker_label ? String(s.speaker_label).slice(0, 40) : null, text: s.text.slice(0, 4000), confidence: typeof s.confidence === 'number' ? s.confidence : null, inaudible: !!s.inaudible, overlap: !!s.overlap, flags: Array.isArray(s.flags) ? s.flags.slice(0, 10) : [] }; };
router.get('/observations/:id/transcripts', h(async (req) => { const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'observation.read', obs, { audit: false }); return list('IITranscriptVersion', { observation_id: obs.id }, 'version'); }));
router.get('/transcripts/:vid', h(async (req) => { const { ctx } = req; const v = await get('IITranscriptVersion', req.params.vid); const obs = await loadObs(v.observation_id); await authz(ctx, 'observation.read', obs, { req }); return v; }));
router.post('/transcripts/:vid/revise', h(async (req) => {
  const { ctx } = req; const parent = await get('IITranscriptVersion', req.params.vid); const obs = await loadObs(parent.observation_id); await authz(ctx, 'transcript.edit', obs, { req });
  const segments = (req.body.segments || []).map(cleanSegment).filter(Boolean); if (!segments.length) throw httpError(422, 'No segments');
  const changed = segments.filter((s) => { const o = parent.segments.find((x) => x.id === s.id); return !o || o.text !== s.text || o.speaker !== s.speaker || o.speaker_label !== s.speaker_label || o.inaudible !== s.inaudible || o.overlap !== s.overlap; }).length;
  return saveTranscript(ctx, obs, { source: 'reviewed', provider: parent.provider, segments: markOverlaps(segments), parent_version_id: parent.id, media_asset_id: parent.media_asset_id, duration_seconds: parent.duration_seconds, change_summary: req.body.change_summary || `${changed} segment(s) corrected by ${ctx.user.email}`, notes: req.body.notes || [] });
}));
router.post('/transcripts/:vid/approve', h(async (req) => { const { ctx } = req; const v = await get('IITranscriptVersion', req.params.vid); const obs = await loadObs(v.observation_id); await authz(ctx, 'transcript.approve', obs, { req }); const unknown = v.segments.filter((s) => s.speaker === 'unknown' && !s.inaudible).length; if (unknown > v.segments.length * 0.5 && !req.body?.force) throw httpError(422, `${unknown} of ${v.segments.length} segments still have an unknown speaker. Assign speakers or approve with force=true (metrics will be limited).`); await update('IIObservation', obs.id, { current_transcript_version_id: v.id }); return update('IITranscriptVersion', v.id, { approved: true, approved_by: ctx.user.email, approved_at: now() }); }));

// ---------- analysis ----------
router.post('/observations/:id/analyze', h(async (req) => {
  const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'analysis.run', obs, { req });
  const auth = obs.authorization_id && await tryGet('IIRecordingAuthorization', obs.authorization_id);
  if (!auth || auth.consent_status !== 'valid' || !(auth.permitted_processing || []).includes('analysis')) throw httpError(403, 'Analysis is not permitted by the recording authorization (F41)');
  const t = obs.current_transcript_version_id && await tryGet('IITranscriptVersion', obs.current_transcript_version_id);
  if (!t) throw httpError(409, 'No transcript yet'); if (!t.approved) throw httpError(409, 'Approve the transcript before analysis');
  const idem = `analyze:${t.id}:${aiConfigured() ? 'ai' : 'noai'}`;
  const prior = (await list('IIJob', { idempotency_key: idem })).find((j) => j.status === 'done' || j.status === 'running');
  if (prior && !req.body?.force) return { job: prior, analysis_id: prior.result_ref, note: 'Analysis already exists for this transcript version (idempotent). Pass force=true to rerun.' };
  const job = await create('IIJob', { organization_id: obs.organization_id, school_id: obs.school_id, observation_id: obs.id, type: 'analyze', idempotency_key: idem, status: 'running', attempts: 1, started_at: now(), requested_by: ctx.user.email }, ctx.user.email);
  try {
    const result = await runFullAnalysis(obs, t, { rubric: await activeRubric(), evidenceItems: await list('IIEvidenceItem', { observation_id: obs.id }) });
    for (const a of await list('IIAnalysis', { observation_id: obs.id })) if (!a.stale) await update('IIAnalysis', a.id, { stale: true });
    const saved = await create('IIAnalysis', { organization_id: obs.organization_id, school_id: obs.school_id, observation_id: obs.id, ...result }, ctx.user.email);
    await update('IIJob', job.id, { status: 'done', finished_at: now(), result_ref: saved.id, stages: result.stages }); await update('IIObservation', obs.id, { current_analysis_id: saved.id, status: 'analyzed' });
    return { job: { ...job, status: 'done', stages: result.stages }, analysis: saved };
  } catch (e) { await update('IIJob', job.id, { status: 'failed', finished_at: now(), error: e.message }); throw e; }
}));
router.get('/observations/:id/analysis', h(async (req) => { const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'observation.read', obs, { req }); return (await list('IIAnalysis', { observation_id: obs.id }, '-created_date', 1))[0] || null; }));
async function loadAnalysis(req, action) { const a = await get('IIAnalysis', req.params.aid); const obs = await loadObs(a.observation_id); await authz(req.ctx, action, obs, { req }); return { a, obs }; }
router.put('/analysis/:aid/cfu', h(async (req) => {
  const { a } = await loadAnalysis(req, 'analysis.review'); const ratings = { ...a.cfu_ratings };
  for (const [k, v] of Object.entries(req.body.ratings || {})) { if (!CFU_DIMENSIONS.some((d) => d.key === k)) continue; const prev = ratings[k] || {}; ratings[k] = { ...prev, ...pick(v, ['level', 'rationale', 'missing_evidence', 'evidence', 'reviewer_comment']), source: 'reviewer', reviewer: req.ctx.user.email, approval_status: v.approval_status || 'reviewed', ai_recommendation: prev.source === 'ai' ? { level: prev.level, rationale: prev.rationale } : prev.ai_recommendation || null, adjudication: v.level && prev.level && v.level !== prev.level ? { from: prev.level, to: v.level, by: req.ctx.user.email, reason: v.reason || null, at: now() } : prev.adjudication || null }; }
  const cfu_result = scoreCfu100(ratings, await activeRubric());
  return update('IIAnalysis', a.id, { cfu_ratings: ratings, cfu_result, status: 'reviewed', reviewed_by: req.ctx.user.email });
}));
router.put('/analysis/:aid/engagement', h(async (req) => { const { a, obs } = await loadAnalysis(req, 'analysis.review'); const engagement = computeEngagement({ ...(a.engagement?.domains ? Object.fromEntries(a.engagement.domains.map((d) => [d.key, d.score])) : {}), ...(req.body.scores || {}) }, obs.evidence_types?.length ? obs.evidence_types : ['audio']); return update('IIAnalysis', a.id, { engagement: { ...engagement, reviewer: req.ctx.user.email }, status: 'reviewed' }); }));
router.put('/analysis/:aid/priorities', h(async (req) => { const { a } = await loadAnalysis(req, 'analysis.review'); const priorities = (req.body.priorities || []).slice(0, 3).map((p, i) => ({ ...(a.priorities.find((x) => x.id === p.id) || {}), ...pick(p, ['title', 'instructional_concern', 'connection_to_standard', 'recommended_adult_behavior', 'model_teacher_language', 'expected_student_response', 'reassessment', 'success_criterion', 'status', 'owner', 'implementation_date']), id: p.id || `p${i + 1}` })); return update('IIAnalysis', a.id, { priorities, status: 'reviewed' }); }));
router.post('/analysis/:aid/approve', h(async (req) => {
  const { a, obs } = await loadAnalysis(req, 'analysis.approve');
  if (a.stale) throw httpError(409, 'This analysis is based on an outdated transcript version; rerun analysis first (F51)');
  const unverified = [...a.questions, ...a.responses, ...a.misconceptions, ...a.priorities].filter((x) => x.verified === false).length;
  if (unverified && !req.body?.accept_unverified) throw httpError(422, `${unverified} finding(s) cite text that could not be verified in the transcript. Correct or remove them, or approve with accept_unverified=true to keep them flagged (F50)`);
  const cfu_result = scoreCfu100(a.cfu_ratings, await activeRubric());
  const finalize_cfu = req.body?.finalize_cfu === true; if (finalize_cfu && !cfu_result.finalizable) throw httpError(422, `CFU-100 cannot be finalized: ${cfu_result.blockers.join('; ')}`);
  await update('IIObservation', obs.id, { status: 'approved' });
  return update('IIAnalysis', a.id, { status: 'approved', approved_by: req.ctx.user.email, approved_at: now(), cfu_result: { ...cfu_result, finalized: finalize_cfu } });
}));
router.post('/observations/:id/evidence', h(async (req) => {
  const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'evidence.write', obs, { req }); required(req.body, ['kind']);
  const b = req.body; const denominator = Number(b.denominator); const correct = Number(b.correct);
  const item = await create('IIEvidenceItem', { organization_id: obs.organization_id, school_id: obs.school_id, observation_id: obs.id, kind: b.kind, standard: b.standard || obs.standard || null, items: (b.items || []).slice(0, 500), denominator: Number.isFinite(denominator) && denominator > 0 ? denominator : null, correct: Number.isFinite(correct) ? correct : null, aligned: typeof b.aligned === 'boolean' ? b.aligned : null, summary: b.summary || '', source: b.source || 'manual', representative: !!b.representative, uploaded_by: ctx.user.email }, ctx.user.email);
  const a = (await list('IIAnalysis', { observation_id: obs.id }, '-created_date', 1))[0];
  if (a) { const rs = { analyzed: a.responses.length, correct: a.responses.filter((r) => r.correctness === 'correct').length, incorrect: a.responses.filter((r) => r.correctness === 'incorrect').length, partial: a.responses.filter((r) => r.correctness === 'partially_correct').length, unique_students: new Set(a.responses.filter((r) => !r.is_group && r.speaker_label).map((r) => r.speaker_label)).size }; const contradictions = item.denominator && rs.analyzed ? (Math.abs(item.correct / item.denominator * 100 - rs.correct / rs.analyzed * 100) > 30 ? 1 : 0) : 0; await update('IIAnalysis', a.id, { mastery_risk: assessMasteryRisk({ assessment: item.denominator ? { correct: item.correct, total: item.denominator, aligned: item.aligned !== false } : null, responses: rs, studentsPresent: obs.students_present || 0, contradictions, misconceptionsHigh: a.misconceptions.filter((m) => m.confidence !== 'low').length }) }); }
  return item;
}));

// ---------- reflections ----------
export const REFLECTION_AREAS = [
  { key: 'intended_learning', title: 'Intended learning', question: 'What exactly did you intend students to learn in this lesson, and how would you know they had learned it?' },
  { key: 'actual_evidence', title: 'Actual student learning evidence', question: 'What evidence do you have of what students actually learned? Be specific: what did they say, write or do, and how many?' },
  { key: 'misconceptions', title: 'Misconceptions', question: 'What misconceptions or partial understandings surfaced? What did they sound like?' },
  { key: 'instructional_decisions', title: 'Instructional decisions', question: 'Which instructional decisions in the moment most shaped what students learned? What would you decide differently?' },
  { key: 'checking_for_understanding', title: 'Checking for understanding', question: 'How and when did you check for understanding? Whose thinking did you see, and whose did you not?' },
  { key: 'student_thinking', title: 'Student thinking and participation', question: 'Who did the cognitive work? How did students explain their reasoning, and who participated?' },
  { key: 'instructional_changes', title: 'Instructional changes', question: 'What specific adult behaviour will you change next lesson, and what student response do you expect?' },
  { key: 'reassessment', title: 'Reassessment', question: 'How and when will you reassess the standard, and what result would show the change worked?' },
];
router.get('/reflections/areas', h(async () => REFLECTION_AREAS));
router.get('/reflections', h(async (req) => { const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); const me = ctx.user.email.toLowerCase(); const all = await list('IITeacherReflection', {}); return all.filter((r) => r.teacher_email === me || (r.shared_with || []).includes(me)).map((r) => ({ ...r, is_owner: r.teacher_email === me })); }));
router.post('/reflections', h(async (req) => {
  const { ctx } = req; required(req.body, ['school_id']); const school = await get('IISchool', req.body.school_id);
  const scope = { organization_id: school.organization_id, school_id: school.id }; if (!rolesAt(ctx, scope).length) throw httpError(403, 'You are not a member of this school');
  if (req.body.observation_id) { const obs = await loadObs(req.body.observation_id); if (obs.teacher_email !== ctx.user.email.toLowerCase()) throw httpError(403, 'Reflections can only be attached to your own observations'); }
  return create('IITeacherReflection', { organization_id: school.organization_id, school_id: school.id, observation_id: req.body.observation_id || null, teacher_email: ctx.user.email.toLowerCase(), answers: {}, status: 'draft', shared_with: [] }, ctx.user.email);
}));
router.get('/reflections/:id', h(async (req) => { const { ctx } = req; const r = typed('IITeacherReflection', await get('IITeacherReflection', req.params.id)); await authz(ctx, 'reflection.read', r, { req }); return { ...r, is_owner: r.teacher_email === ctx.user.email.toLowerCase(), areas: REFLECTION_AREAS }; }));
router.put('/reflections/:id', h(async (req) => { const { ctx } = req; const r = typed('IITeacherReflection', await get('IITeacherReflection', req.params.id)); await authz(ctx, 'reflection.write', r, { audit: false }); const answers = { ...r.answers }; for (const [k, v] of Object.entries(req.body.answers || {})) if (REFLECTION_AREAS.some((a) => a.key === k)) answers[k] = { ...(answers[k] || {}), ...pick(v, ['response', 'follow_up_response', 'evidence_refs']) }; const complete = req.body.status === 'complete'; if (complete && REFLECTION_AREAS.some((a) => !answers[a.key]?.response)) throw httpError(422, 'All eight areas need a response before completing'); return update('IITeacherReflection', r.id, { answers, status: complete ? 'complete' : 'draft', completed_at: complete ? now() : r.completed_at || null }); }));
router.post('/reflections/:id/followup', h(async (req) => { const { ctx } = req; const r = typed('IITeacherReflection', await get('IITeacherReflection', req.params.id)); await authz(ctx, 'reflection.write', r, { audit: false }); const area = REFLECTION_AREAS.find((a) => a.key === req.body.area); if (!area) throw httpError(422, 'Unknown area'); const obs = r.observation_id ? await tryGet('IIObservation', r.observation_id) : null; const out = await reflectionFollowUp(area.title, area.question, String(req.body.answer || '').slice(0, 4000), obs ? pick(obs, ['grade', 'subject', 'standard', 'objective']) : {}); const answers = { ...r.answers, [area.key]: { ...(r.answers[area.key] || {}), response: req.body.answer, follow_up: out.follow_up || null } }; await update('IITeacherReflection', r.id, { answers }); return out; }));
router.post('/reflections/:id/share', h(async (req) => { const { ctx } = req; const r = typed('IITeacherReflection', await get('IITeacherReflection', req.params.id)); await authz(ctx, 'reflection.write', r, { req }); const emails = (req.body.emails || []).map((e) => String(e).toLowerCase()); const shared_with = [...new Set([...(r.shared_with || []), ...emails])]; return update('IITeacherReflection', r.id, { shared_with, share_log: [...(r.share_log || []), { action: 'share', emails, at: now() }] }); }));
router.post('/reflections/:id/revoke', h(async (req) => { const { ctx } = req; const r = typed('IITeacherReflection', await get('IITeacherReflection', req.params.id)); await authz(ctx, 'reflection.write', r, { req }); const email = String(req.body.email || '').toLowerCase(); return update('IITeacherReflection', r.id, { shared_with: (r.shared_with || []).filter((e) => e !== email), share_log: [...(r.share_log || []), { action: 'revoke', emails: [email], at: now() }] }); }));

// ---------- coaching / action plans / reassessment ----------
router.get('/coaching', h(async (req) => { const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); const all = await list('IICoachingSession', req.query.observation_id ? { observation_id: req.query.observation_id } : {}); const out = []; for (const c of all) if (await can(ctx, 'coaching.read', typed('IICoachingSession', c))) out.push(c); return out; }));
router.post('/coaching', h(async (req) => { const { ctx } = req; required(req.body, ['observation_id']); const obs = await loadObs(req.body.observation_id); await authz(ctx, 'analysis.review', obs, { req }); return create('IICoachingSession', { organization_id: obs.organization_id, school_id: obs.school_id, observation_id: obs.id, coach_email: ctx.user.email.toLowerCase(), teacher_email: obs.teacher_email, notes: '', priorities: [], commitments: [], acknowledgments: {}, status: 'draft', scheduled_at: req.body.scheduled_at || null }, ctx.user.email); }));
router.get('/coaching/:id', h(async (req) => { const { ctx } = req; const c = typed('IICoachingSession', await get('IICoachingSession', req.params.id)); await authz(ctx, 'coaching.read', c, { req }); return c; }));
router.put('/coaching/:id', h(async (req) => { const { ctx } = req; const c = typed('IICoachingSession', await get('IICoachingSession', req.params.id)); await authz(ctx, 'coaching.write', c, { req }); return update('IICoachingSession', c.id, pick(req.body, ['notes', 'priorities', 'commitments', 'support_needed', 'follow_up_date', 'status', 'scheduled_at', 'shared_with_leadership'])); }));
router.post('/coaching/:id/acknowledge', h(async (req) => { const { ctx } = req; const c = typed('IICoachingSession', await get('IICoachingSession', req.params.id)); await authz(ctx, 'coaching.acknowledge', c, { req }); const me = ctx.user.email.toLowerCase(); const role = me === c.coach_email ? 'coach' : 'teacher'; const ack = { ...(c.acknowledgments || {}), [role]: { agree: req.body.agree !== false, note: req.body.note || null, at: now(), by: me } }; const both = ack.coach && ack.teacher; return update('IICoachingSession', c.id, { acknowledgments: ack, disagreement_note: req.body.agree === false ? (req.body.note || 'Disagreement recorded') : c.disagreement_note, status: both ? 'agreed' : c.status }); }));
router.get('/action-plans', h(async (req) => { const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); const all = await list('IIActionPlan', req.query.observation_id ? { observation_id: req.query.observation_id } : {}); const out = []; for (const p of all) if (await can(ctx, 'actionplan.read', typed('IIActionPlan', p))) out.push(p); return out; }));
router.post('/action-plans', h(async (req) => { const { ctx } = req; required(req.body, ['coaching_session_id']); const c = typed('IICoachingSession', await get('IICoachingSession', req.body.coaching_session_id)); await authz(ctx, 'coaching.write', c, { req }); const items = (req.body.items || []).slice(0, 3).map((it, i) => ({ id: it.id || `a${i + 1}`, ...pick(it, ['title', 'instructional_concern', 'evidence', 'connection_to_standard', 'recommended_adult_behavior', 'model_teacher_language', 'implementation_owner', 'implementation_date', 'evidence_of_implementation', 'expected_student_response', 'reassessment', 'success_criterion']), status: 'open' })); return create('IIActionPlan', { organization_id: c.organization_id, school_id: c.school_id, observation_id: c.observation_id, coaching_session_id: c.id, teacher_email: c.teacher_email, coach_email: c.coach_email, items, status: 'open' }, ctx.user.email); }));
router.put('/action-plans/:id', h(async (req) => { const { ctx } = req; const p = typed('IIActionPlan', await get('IIActionPlan', req.params.id)); await authz(ctx, 'actionplan.write', p, { req }); const patch = pick(req.body, ['items', 'status', 'teacher_response']); if (req.body.adult_behavior_evidence) patch.adult_behavior_evidence = [...(p.adult_behavior_evidence || []), { ...req.body.adult_behavior_evidence, by: ctx.user.email, at: now() }]; if (req.body.student_outcome_evidence) patch.student_outcome_evidence = [...(p.student_outcome_evidence || []), { ...req.body.student_outcome_evidence, by: ctx.user.email, at: now() }]; return update('IIActionPlan', p.id, patch); }));
router.get('/reassessments', h(async (req) => { const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); const all = await list('IIReassessment', {}); const me = ctx.user.email.toLowerCase(); return all.filter((r) => r.teacher_email === me || hasRole(ctx, r, 'coach', 'principal', 'district_admin')); }));
router.post('/reassessments', h(async (req) => { const { ctx } = req; required(req.body, ['action_plan_id', 'standard', 'due_date']); const p = typed('IIActionPlan', await get('IIActionPlan', req.body.action_plan_id)); await authz(ctx, 'actionplan.write', p, { req }); return create('IIReassessment', { organization_id: p.organization_id, school_id: p.school_id, action_plan_id: p.id, observation_id: p.observation_id, teacher_email: p.teacher_email, standard: req.body.standard, due_date: req.body.due_date, status: 'planned', results: {} }, ctx.user.email); }));
router.put('/reassessments/:id', h(async (req) => { const { ctx } = req; const r = await get('IIReassessment', req.params.id); const p = typed('IIActionPlan', await get('IIActionPlan', r.action_plan_id)); await authz(ctx, 'actionplan.write', p, { req }); const results = req.body.results ? { correct: Number(req.body.results.correct), total: Number(req.body.results.total), aligned: req.body.results.aligned !== false } : r.results; if (results.total !== undefined && !(results.total > 0)) throw httpError(422, 'Reassessment needs a denominator (total students assessed)'); return update('IIReassessment', r.id, { results, notes: req.body.notes ?? r.notes, status: req.body.status || (results.total ? 'complete' : r.status), completed_at: results.total ? now() : r.completed_at || null }); }));

// ---------- PLC ----------
router.get('/plc', h(async (req) => { const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); const all = await list('IIPlcSession', {}); const out = []; for (const p of all) if (await can(ctx, 'plc.read', typed('IIPlcSession', p))) out.push(p); return out; }));
router.post('/plc', h(async (req) => { const { ctx } = req; required(req.body, ['school_id', 'title']); const school = await get('IISchool', req.body.school_id); const scope = { organization_id: school.organization_id, school_id: school.id }; await authz(ctx, 'plc.create', scope, { req }); return create('IIPlcSession', { ...scope, facilitator_email: ctx.user.email.toLowerCase(), title: req.body.title, participants: (req.body.participants || []).map((e) => e.toLowerCase()), standard: req.body.standard || '', hypotheses: [], responses: [], notes: '', status: 'open' }, ctx.user.email); }));
router.put('/plc/:id', h(async (req) => { const { ctx } = req; const p = typed('IIPlcSession', await get('IIPlcSession', req.params.id)); await authz(ctx, 'plc.write', p, { req }); const patch = pick(req.body, ['title', 'participants', 'standard', 'hypotheses', 'responses', 'reassessment_date', 'notes', 'status', 'evidence_refs']); for (const k of ['hypotheses', 'responses', 'notes', 'title', 'standard']) if (typeof patch[k] === 'string' && /@[\w.-]+\.[a-z]{2,}|student\s+[A-Z][a-z]+\s+[A-Z]/.test(patch[k])) throw httpError(422, `PLC ${k} appears to contain identifying information; use anonymous codes (F44/§16)`); return update('IIPlcSession', p.id, patch); }));

// ---------- dashboards, trends, reports ----------
router.get('/dashboard', h(async (req) => {
  const { ctx } = req; if (!ctx.user) throw httpError(401, 'Not authenticated'); const me = ctx.user.email.toLowerCase();
  const obs = await visibleObservations(ctx); const coaching = (await list('IICoachingSession', {})).filter((c) => c.coach_email === me || c.teacher_email === me);
  const plans = (await list('IIActionPlan', {})).filter((p) => p.coach_email === me || p.teacher_email === me);
  const reass = (await list('IIReassessment', {})).filter((r) => r.teacher_email === me || plans.some((p) => p.id === r.action_plan_id));
  const reflections = (await list('IITeacherReflection', {})).filter((r) => r.teacher_email === me || (r.shared_with || []).includes(me));
  const analyses = await list('IIAnalysis', { stale: false });
  const mine = analyses.filter((a) => obs.some((o) => o.id === a.observation_id));
  return {
    role_summary: [...new Set(ctx.memberships.map((m) => m.role))],
    observations: { total: obs.length, awaiting_review: obs.filter((o) => ['recorded', 'review'].includes(o.status)).length, analyzed: obs.filter((o) => o.status === 'analyzed').length, approved: obs.filter((o) => o.status === 'approved').length, recent: obs.slice(0, 8) },
    evidence_requiring_verification: mine.reduce((n, a) => n + [...a.questions, ...a.responses, ...a.misconceptions, ...a.priorities].filter((x) => x.verified === false).length, 0),
    coaching: { open: coaching.filter((c) => c.status !== 'agreed').length, agreed: coaching.filter((c) => c.status === 'agreed').length, recent: coaching.slice(0, 5) },
    action_plans: { open: plans.filter((p) => p.status === 'open').length, items: plans.slice(0, 5) },
    reassessments: { upcoming: reass.filter((r) => r.status !== 'complete').sort((a, b) => (a.due_date || '').localeCompare(b.due_date || '')).slice(0, 5), outstanding: reass.filter((r) => r.status !== 'complete').length },
    reflections: { drafts: reflections.filter((r) => r.teacher_email === me && r.status === 'draft').length, shared_with_me: reflections.filter((r) => r.teacher_email !== me).length },
    data_quality: { stale_analyses: analyses.filter((a) => a.stale).length, unverified_findings: mine.reduce((n, a) => n + [...a.questions, ...a.responses].filter((x) => x.verified === false).length, 0) },
    trends: trendsFrom(mine),
  };
}));
function trendsFrom(analyses) {
  const dims = {}; for (const a of analyses) for (const row of a.cfu_result?.rows || []) if (row.status === 'scored') { dims[row.key] ||= { label: row.label, n: 0, pct: 0 }; dims[row.key].n++; dims[row.key].pct += row.points / row.weight * 100; }
  const talk = analyses.map((a) => a.talk_time?.student_pct).filter((x) => typeof x === 'number');
  const dok = analyses.flatMap((a) => a.questions.map((q) => q.dok)).filter(Boolean);
  return { cfu_dimensions: Object.fromEntries(Object.entries(dims).map(([k, v]) => [k, { label: v.label, n: v.n, mean_pct: Math.round(v.pct / v.n) }])), student_talk_mean: talk.length ? Math.round(talk.reduce((a, b) => a + b, 0) / talk.length) : null, dok_distribution: [1, 2, 3, 4].map((l) => ({ level: l, count: dok.filter((d) => d === l).length })), n: analyses.length };
}
router.get('/trends/school/:schoolId', h(async (req) => {
  const { ctx } = req; const school = await get('IISchool', req.params.schoolId); const scope = { organization_id: school.organization_id, school_id: school.id }; await authz(ctx, 'school.aggregates', scope, { req });
  const obs = await list('IIObservation', { school_id: school.id }); const analyses = (await list('IIAnalysis', { school_id: school.id, stale: false })).filter((a) => a.status === 'approved' || a.status === 'reviewed');
  const teachers = new Set(obs.map((o) => o.teacher_email)).size; const min = school.min_group_size || 5;
  if (suppress(teachers, min)) return { suppressed: true, reason: `Fewer than ${min} teachers have observations; aggregates are suppressed to prevent re-identification (F44)`, observation_count: obs.length, teachers };
  const plans = await list('IIActionPlan', { school_id: school.id }); const reass = await list('IIReassessment', { school_id: school.id });
  return { suppressed: false, school: pick(school, ['id', 'name']), observation_coverage: { observations: obs.length, teachers, approved: obs.filter((o) => o.status === 'approved').length }, ...trendsFrom(analyses), coaching_followthrough: { plans: plans.length, closed: plans.filter((p) => p.status === 'complete').length }, reassessment: { planned: reass.length, complete: reass.filter((r) => r.status === 'complete').length }, data_quality: { stale: (await list('IIAnalysis', { school_id: school.id, stale: true })).length }, generated_at: now(), note: 'Aggregates only. Not for comparing or ranking teachers.' };
}));
router.get('/trends/district/:orgId', h(async (req) => { const { ctx } = req; const scope = { organization_id: req.params.orgId }; await authz(ctx, 'district.aggregates', scope, { req }); const schools = await list('IISchool', { organization_id: req.params.orgId }); const out = []; for (const s of schools) { const obs = await list('IIObservation', { school_id: s.id }); const analyses = (await list('IIAnalysis', { school_id: s.id, stale: false })).filter((a) => a.status !== 'proposed'); const teachers = new Set(obs.map((o) => o.teacher_email)).size; out.push(suppress(teachers, s.min_group_size || 5) ? { school: pick(s, ['id', 'name']), suppressed: true, observations: obs.length } : { school: pick(s, ['id', 'name']), suppressed: false, observations: obs.length, teachers, ...trendsFrom(analyses) }); } return { organization_id: req.params.orgId, schools: out, generated_at: now() }; }));
router.get('/observations/:id/report', h(async (req) => {
  const { ctx } = req; const obs = await loadObs(req.params.id); await authz(ctx, 'observation.read', obs, { req });
  const a = (await list('IIAnalysis', { observation_id: obs.id }, '-created_date', 1))[0]; if (!a) throw httpError(404, 'No analysis yet');
  const t = a.transcript_version_id ? await tryGet('IITranscriptVersion', a.transcript_version_id) : null; const level = req.query.level === 'full' ? 'full' : 'executive';
  const limitations = [...(a.warnings || [])]; if (a.stale) limitations.unshift('Analysis is STALE: the transcript changed after it was generated.'); if (!t?.approved) limitations.push('Transcript was not approved by a reviewer.'); if (a.cfu_result?.status !== 'complete') limitations.push('CFU-100 score is partial/provisional.'); if (!a.cfu_result?.finalized) limitations.push('CFU-100 has not been finalized against the authoritative rubric.');
  const base = { generated_at: now(), level, observation: pick(obs, ['id', 'teacher_name', 'grade', 'subject', 'date', 'standard', 'objective', 'success_criteria', 'duration_type', 'students_present', 'students_enrolled', 'lesson_type', 'instructional_phase']), review_status: { analysis: a.status, transcript_approved: !!t?.approved, transcript_source: t?.source, transcript_version: t?.version, approved_by: a.approved_by || null }, provenance: { model: a.model, rubric_version: a.rubric_version, transcript_provider: t?.provider, stages: a.stages }, limitations, key_metrics: { student_talk_pct: a.talk_time?.student_pct ?? null, teacher_talk_pct: a.talk_time?.teacher_pct ?? null, unique_student_speakers: a.talk_time?.unique_student_speakers ?? null, questions: a.questions.length, high_demand_questions: a.questions.filter((q) => q.cognitive_demand === 'high').length, cfu: { status: a.cfu_result?.status, score_out_of_100: a.cfu_result?.score_out_of_100 ?? null, weight_scored: a.cfu_result?.weight_scored }, engagement: { status: a.engagement?.status, rating: a.engagement?.provisional_rating ?? null }, mastery_risk: a.mastery_risk }, priorities: a.priorities, developmental_notice: 'Developmental coaching report. Not a personnel evaluation.' };
  if (level === 'executive') return base;
  return { ...base, questions: a.questions, responses: a.responses, most_consequential_question: a.most_consequential_question, talk_time: a.talk_time, engagement: a.engagement, cfu: a.cfu_result, cfu_ratings: a.cfu_ratings, misconceptions: a.misconceptions, evidence_items: await list('IIEvidenceItem', { observation_id: obs.id }), transcript_excerpts: (t?.segments || []).filter((s) => [...a.questions, ...a.responses, ...a.misconceptions.flatMap((m) => m.evidence_segment_ids || [])].some((x) => (typeof x === 'string' ? x : x.segment_id) === s.id)) };
}));
router.get('/jobs', h(async (req) => { const { ctx } = req; if (!req.query.observation_id) throw httpError(422, 'observation_id required'); const obs = await loadObs(req.query.observation_id); await authz(ctx, 'observation.read', obs, { audit: false }); return list('IIJob', { observation_id: obs.id }, '-created_date', 50); }));

export default router;
