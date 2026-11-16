// End-to-end API test for Instructional Intelligence on an embedded Postgres (no external services).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ii-test-'));
process.env.DATA_DIR = dir; process.env.FEATURE_INSTRUCTIONAL_INTELLIGENCE = 'true'; process.env.JWT_SECRET = 'test-secret'; process.env.ADMIN_EMAILS = 'admin@test.org,admin2@test.org';
delete process.env.DATABASE_URL; delete process.env.POSTGRES_URL; delete process.env.VERCEL; delete process.env.ANTHROPIC_API_KEY; delete process.env.BLOB_READ_WRITE_TOKEN;
const { default: app } = await import('../src/app.js');
const server = app.listen(0); const port = server.address().port; const B = `http://127.0.0.1:${port}/api`;

const tokens = {};
async function api(as, method, p, body, raw) {
  const headers = {}; if (as) headers.Authorization = `Bearer ${tokens[as]}`; if (body !== undefined && !raw) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${B}${p}`, { method, headers, body: raw ? body : body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text(); let json; try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, body: json, headers: res.headers };
}
async function register(key, email) { const r = await api(null, 'POST', '/auth/register', { email, password: 'password123', full_name: key }); assert.equal(r.status, 200, JSON.stringify(r.body)); tokens[key] = r.body.token; }

let orgId, schoolId, obsId, assetId, transcriptId, analysisId, coachingId, planId, reflectionId;

test('setup: users, bootstrap, memberships', async () => {
  await register('admin', 'admin@test.org'); await register('coach', 'coach@test.org'); await register('teacher', 'teacher@test.org'); await register('principal', 'principal@test.org'); await register('outsider', 'outsider@test.org'); await register('district', 'district@test.org');
  const me = await api('admin', 'GET', '/ii/me'); assert.equal(me.status, 200); assert.equal(me.body.needs_bootstrap, true);
  const bs = await api('admin', 'POST', '/ii/bootstrap', { organization_name: 'Test District', school_name: 'Pine Valley MS' }); assert.equal(bs.status, 200);
  orgId = bs.body.organization.id; schoolId = bs.body.school.id;
  for (const [email, role] of [['coach@test.org', 'coach'], ['teacher@test.org', 'teacher'], ['principal@test.org', 'principal']]) { const r = await api('admin', 'POST', '/ii/memberships', { user_email: email, organization_id: orgId, school_id: schoolId, role }); assert.equal(r.status, 200, JSON.stringify(r.body)); }
  const d = await api('admin', 'POST', '/ii/memberships', { user_email: 'district@test.org', organization_id: orgId, role: 'district_admin' }); assert.equal(d.status, 200);
  // a principal cannot grant district roles
  const bad = await api('principal', 'POST', '/ii/memberships', { user_email: 'x@test.org', organization_id: orgId, role: 'district_admin' }); assert.equal(bad.status, 403);
});

test('II entities are not reachable through the generic entity API', async () => {
  const r = await api('admin', 'GET', '/entities/IIObservation'); assert.equal(r.status, 404);
  const r2 = await api('admin', 'POST', '/entities/IIMembership', { user_email: 'evil@test.org', organization_id: orgId, role: 'district_admin' }); assert.equal(r2.status, 404);
});

test('observation lifecycle: create, authorization gate, recording upload, finalize', async () => {
  const denied = await api('teacher', 'POST', '/ii/observations', { school_id: schoolId, teacher_email: 'teacher@test.org' }); assert.equal(denied.status, 403, 'teacher role cannot create observations by default');
  const outsider = await api('outsider', 'POST', '/ii/observations', { school_id: schoolId, teacher_email: 'teacher@test.org' }); assert.equal(outsider.status, 403);
  const c = await api('coach', 'POST', '/ii/observations', { school_id: schoolId, teacher_email: 'Teacher@test.org', teacher_name: 'T. Rivera', grade: '7', subject: 'Math', standard: '7.RP.A.2', objective: 'Recognise proportional relationships', students_enrolled: 28, students_present: 25, evidence_modes: ['live_audio'] });
  assert.equal(c.status, 200, JSON.stringify(c.body)); obsId = c.body.id; assert.equal(c.body.teacher_email, 'teacher@test.org'); assert.deepEqual(c.body.evidence_types, ['audio']);
  // F10: recording blocked without authorization
  const noAuth = await api('coach', 'POST', `/ii/observations/${obsId}/media`, { kind: 'audio', mime: 'audio/webm' }); assert.equal(noAuth.status, 403);
  const auth = await api('coach', 'POST', `/ii/observations/${obsId}/authorization`, { consent_basis: 'school_policy' }); assert.equal(auth.status, 200);
  // F07 unsupported codec
  const badMime = await api('coach', 'POST', `/ii/observations/${obsId}/media`, { kind: 'audio', mime: 'audio/x-weird' }); assert.equal(badMime.status, 415);
  const init = await api('coach', 'POST', `/ii/observations/${obsId}/media`, { kind: 'audio', mime: 'audio/webm' }); assert.equal(init.status, 200); assetId = init.body.asset_id;
  const chunkA = Buffer.from('chunk-A-'.repeat(1000)), chunkB = Buffer.from('chunk-B-'.repeat(1000));
  assert.equal((await api('coach', 'PUT', `/ii/media/${assetId}/chunks/0`, chunkA, true)).status, 200);
  const dup = await api('coach', 'PUT', `/ii/media/${assetId}/chunks/0`, chunkA, true); assert.equal(dup.body.duplicate, true, 'F05 idempotent retry');
  // F05: finalize with a missing chunk is refused
  const early = await api('coach', 'POST', `/ii/media/${assetId}/finalize`, { expected_chunks: 2, duration_seconds: 600 }); assert.equal(early.status, 409);
  assert.equal((await api('coach', 'PUT', `/ii/media/${assetId}/chunks/1`, chunkB, true)).status, 200);
  const fin = await api('coach', 'POST', `/ii/media/${assetId}/finalize`, { expected_chunks: 2, duration_seconds: 600 }); assert.equal(fin.status, 200, JSON.stringify(fin.body)); assert.equal(fin.body.status, 'ready'); assert.equal(fin.body.verified.total_bytes, 16000);
  // playback with Range, only for authorized users
  const play = await api('coach', 'GET', `/ii/media/${assetId}`); assert.equal(play.status, 200); assert.equal(play.body.length, 16000);
  const res = await fetch(`${B}/ii/media/${assetId}`, { headers: { Authorization: `Bearer ${tokens.coach}`, Range: 'bytes=7990-8010' } }); assert.equal(res.status, 206); assert.equal((await res.text()).length, 21);
  assert.equal((await api('outsider', 'GET', `/ii/media/${assetId}`)).status, 403, 'F39 cross-school media access denied');
  assert.equal((await api('teacher', 'GET', `/ii/media/${assetId}`)).status, 403, 'teacher cannot play before the observation is shared');
  assert.equal((await api(null, 'GET', `/ii/media/${assetId}`)).status, 401);
  // F09 duplicate upload detection
  const init2 = await api('coach', 'POST', `/ii/observations/${obsId}/media`, { kind: 'audio', mime: 'audio/webm' });
  await api('coach', 'PUT', `/ii/media/${init2.body.asset_id}/chunks/0`, chunkA, true); await api('coach', 'PUT', `/ii/media/${init2.body.asset_id}/chunks/1`, chunkB, true);
  const dupFin = await api('coach', 'POST', `/ii/media/${init2.body.asset_id}/finalize`, { duration_seconds: 600 }); assert.equal(dupFin.status, 409); assert.match(dupFin.body.error, /Duplicate/);
});

test('transcription without a provider fails honestly; manual transcript works', async () => {
  const t = await api('coach', 'POST', `/ii/observations/${obsId}/transcribe`, {}); assert.equal(t.status, 501); assert.equal(t.body.code, 'transcription_not_configured');
  const jobs = await api('coach', 'GET', `/ii/jobs?observation_id=${obsId}`); assert.equal(jobs.body[0].status, 'failed');
  const text = `[00:00] Teacher: Today we are looking at proportional relationships. What makes a relationship proportional?
[00:12] Student 1: When the ratio stays the same, like y over x is always the same number.
[00:20] Teacher: Say more. What do you mean by the same number?
[00:25] Student 1: If you divide y by x you get the constant, the k.
[00:33] Teacher: Does everyone agree? Student 2?
[00:36] Student 2: I think it's proportional if the graph goes up.
[00:41] Teacher: Interesting. Let's test that. Turn and talk with your partner about whether every line that goes up is proportional.
[01:30] Student 3: It has to go through zero. Ours went up but it started at 4, so it is not proportional.
[01:40] Teacher: So what are the two things we need? [inaudible]
[01:45] Group: Constant ratio and passes through the origin.
[01:50] Teacher: Exit ticket: table 2 — is it proportional, and how do you know?`;
  const m = await api('coach', 'POST', `/ii/observations/${obsId}/transcripts/manual`, { text }); assert.equal(m.status, 200, JSON.stringify(m.body)); transcriptId = m.body.id;
  assert.equal(m.body.segments.length, 11); assert.equal(m.body.segments[0].speaker, 'teacher'); assert.equal(m.body.segments[1].speaker_label, 'Student 1'); assert.equal(m.body.segments[9].speaker, 'group'); assert.equal(m.body.segments[8].inaudible, true);
});

test('transcript revision creates a version and marks analysis stale (F16/F17/F51)', async () => {
  // analysis requires approval first
  const notApproved = await api('coach', 'POST', `/ii/observations/${obsId}/analyze`, {}); assert.equal(notApproved.status, 409);
  const ap = await api('coach', 'POST', `/ii/transcripts/${transcriptId}/approve`, {}); assert.equal(ap.status, 200); assert.equal(ap.body.approved, true);
  const an = await api('coach', 'POST', `/ii/observations/${obsId}/analyze`, {}); assert.equal(an.status, 200, JSON.stringify(an.body)); analysisId = an.body.analysis.id;
  assert.equal(an.body.analysis.stale, false);
  assert.ok(an.body.analysis.warnings.some((w) => /ANTHROPIC_API_KEY/.test(w)), 'AI stages honestly reported as skipped');
  const tt = an.body.analysis.talk_time; assert.ok(tt.teacher_seconds > 0 && tt.student_seconds > 0); assert.equal(an.body.analysis.cfu_result.status, 'unscored'); assert.equal(an.body.analysis.cfu_result.score_out_of_100, null);
  // idempotent re-run
  const again = await api('coach', 'POST', `/ii/observations/${obsId}/analyze`, {}); assert.equal(again.body.analysis_id, analysisId);
  // revise a misheard term
  const v = await api('coach', 'GET', `/ii/transcripts/${transcriptId}`); const segs = v.body.segments.map((s) => (s.speaker_label === 'Student 2' ? { ...s, text: s.text.replace('goes up', 'goes up and to the right') } : s));
  const rev = await api('coach', 'POST', `/ii/transcripts/${transcriptId}/revise`, { segments: segs, change_summary: 'Corrected Student 2' }); assert.equal(rev.status, 200); assert.equal(rev.body.version, 2); assert.equal(rev.body.parent_version_id, transcriptId);
  const a = await api('coach', 'GET', `/ii/observations/${obsId}/analysis`); assert.equal(a.body.stale, true, 'analysis invalidated by transcript change');
  const approveStale = await api('coach', 'POST', `/ii/analysis/${analysisId}/approve`, {}); assert.equal(approveStale.status, 409, 'F51 stale analysis cannot be approved');
  // approve v2 and re-analyze
  await api('coach', 'POST', `/ii/transcripts/${rev.body.id}/approve`, {});
  const an2 = await api('coach', 'POST', `/ii/observations/${obsId}/analyze`, {}); assert.equal(an2.status, 200); analysisId = an2.body.analysis.id;
});

test('CFU-100 review: reviewer ratings, missing evidence, finalization blocked without authoritative rubric (F29/F30/F36)', async () => {
  const teacherTry = await api('teacher', 'PUT', `/ii/analysis/${analysisId}/cfu`, { ratings: { question_quality: { level: 'distinguished' } } }); assert.equal(teacherTry.status, 403);
  const r = await api('coach', 'PUT', `/ii/analysis/${analysisId}/cfu`, { ratings: { question_quality: { level: 'proficient', evidence: [{ segment_id: 'x', timestamp: 20 }], rationale: 'Probing follow-ups' }, actionable_feedback: { level: 'basic', evidence: [{ segment_id: 'y' }] } } });
  assert.equal(r.status, 200); assert.equal(r.body.cfu_result.status, 'provisional'); assert.equal(r.body.cfu_result.score_out_of_100, null);
  assert.ok(r.body.cfu_result.blockers.some((b) => /no approved multiplier/.test(b)));
  const approve = await api('coach', 'POST', `/ii/analysis/${analysisId}/approve`, { finalize_cfu: true }); assert.equal(approve.status, 422);
  const approve2 = await api('coach', 'POST', `/ii/analysis/${analysisId}/approve`, {}); assert.equal(approve2.status, 200); assert.equal(approve2.body.status, 'approved'); assert.equal(approve2.body.cfu_result.finalized, false);
});

test('rubric import requires authoritative multipliers + source', async () => {
  const bad = await api('district', 'PUT', '/ii/rubric', { authoritative: true, multipliers: { basic: 0.5 } }); assert.equal(bad.status, 422);
  const ok = await api('district', 'PUT', '/ii/rubric', { authoritative: true, version: 'CFU-100 v1.0 (approved)', multipliers: { basic: 0.5, unsatisfactory: 0.2 }, source_document: 'BetterEd CFU-100 Rubric v1.0.pdf' }); assert.equal(ok.status, 200); assert.equal(ok.body.authoritative, true);
  const coachTry = await api('coach', 'PUT', '/ii/rubric', { multipliers: { basic: 0.9 } }); assert.equal(coachTry.status, 403);
  const r = await api('coach', 'PUT', `/ii/analysis/${analysisId}/cfu`, { ratings: {} }); assert.ok(!r.body.cfu_result.blockers.some((b) => /no approved multiplier/.test(b)));
});

test('exit ticket evidence drives mastery risk; missing denominator is refused (F32)', async () => {
  const ev = await api('coach', 'POST', `/ii/observations/${obsId}/evidence`, { kind: 'exit_ticket', correct: 18, denominator: 25, aligned: true, summary: 'Table 2 proportional?' }); assert.equal(ev.status, 200);
  const a = await api('coach', 'GET', `/ii/observations/${obsId}/analysis`); assert.equal(a.body.mastery_risk.risk, 'moderate'); assert.equal(a.body.mastery_risk.observed.assessment_pct, 72); assert.equal(a.body.mastery_risk.predicted, null);
  const noDen = await api('coach', 'POST', `/ii/observations/${obsId}/evidence`, { kind: 'exit_ticket', correct: 5 }); assert.equal(noDen.body.denominator, null);
});

test('sharing: teacher sees nothing until shared; principal sees nothing until shared for leadership (F37/F38/F40)', async () => {
  assert.equal((await api('teacher', 'GET', `/ii/observations/${obsId}`)).status, 403);
  assert.equal((await api('principal', 'GET', `/ii/observations/${obsId}`)).status, 403);
  assert.equal((await api('teacher', 'GET', '/ii/observations')).body.length, 0);
  await api('coach', 'POST', `/ii/observations/${obsId}/share`, { teacher: true });
  const t = await api('teacher', 'GET', `/ii/observations/${obsId}`); assert.equal(t.status, 200); assert.equal(t.body.permissions.is_teacher, true); assert.equal(t.body.permissions.analysis_review, false);
  assert.equal((await api('teacher', 'GET', `/ii/media/${assetId}`)).status, 200, 'teacher can play once shared');
  assert.equal((await api('principal', 'GET', `/ii/observations/${obsId}`)).status, 403);
  await api('coach', 'POST', `/ii/observations/${obsId}/share`, { grantee_email: 'principal@test.org' });
  assert.equal((await api('principal', 'GET', `/ii/observations/${obsId}`)).status, 200);
  await api('coach', 'POST', `/ii/observations/${obsId}/share`, { revoke_email: 'principal@test.org' });
  assert.equal((await api('principal', 'GET', `/ii/observations/${obsId}`)).status, 403, 'revocation takes effect immediately');
  // district admin: aggregates only, not student-level evidence
  assert.equal((await api('district', 'GET', `/ii/observations/${obsId}`)).status, 403);
  // audit trail recorded the denials
  const audit = await api('district', 'GET', `/ii/audit?organization_id=${orgId}`); assert.ok(audit.body.some((e) => e.outcome === 'denied' && e.actor_email === 'principal@test.org'));
  assert.equal((await api('coach', 'GET', `/ii/audit?organization_id=${orgId}`)).status, 403);
});

test('teacher reflection is private, teacher-controlled sharing, AI follow-up degrades gracefully', async () => {
  const r = await api('teacher', 'POST', '/ii/reflections', { school_id: schoolId, observation_id: obsId }); assert.equal(r.status, 200); reflectionId = r.body.id;
  assert.equal((await api('coach', 'GET', `/ii/reflections/${reflectionId}`)).status, 403, 'F37');
  assert.equal((await api('principal', 'GET', `/ii/reflections/${reflectionId}`)).status, 403);
  const f = await api('teacher', 'POST', `/ii/reflections/${reflectionId}/followup`, { area: 'actual_evidence', answer: 'Most students got it.' }); assert.equal(f.status, 200); assert.equal(f.body.follow_up, null);
  const incomplete = await api('teacher', 'PUT', `/ii/reflections/${reflectionId}`, { status: 'complete', answers: { intended_learning: { response: 'x' } } }); assert.equal(incomplete.status, 422);
  const areas = (await api('teacher', 'GET', '/ii/reflections/areas')).body; const answers = Object.fromEntries(areas.map((a) => [a.key, { response: `Answer for ${a.key}` }]));
  const done = await api('teacher', 'PUT', `/ii/reflections/${reflectionId}`, { status: 'complete', answers }); assert.equal(done.body.status, 'complete');
  await api('teacher', 'POST', `/ii/reflections/${reflectionId}/share`, { emails: ['coach@test.org'] });
  assert.equal((await api('coach', 'GET', `/ii/reflections/${reflectionId}`)).status, 200);
  assert.equal((await api('coach', 'PUT', `/ii/reflections/${reflectionId}`, { answers: {} })).status, 403, 'coach cannot edit the teacher reflection');
  await api('teacher', 'POST', `/ii/reflections/${reflectionId}/revoke`, { email: 'coach@test.org' });
  assert.equal((await api('coach', 'GET', `/ii/reflections/${reflectionId}`)).status, 403, 'F38');
  const anotherTeacherObs = await api('coach', 'POST', '/ii/observations', { school_id: schoolId, teacher_email: 'other@test.org' });
  assert.equal((await api('teacher', 'POST', '/ii/reflections', { school_id: schoolId, observation_id: anotherTeacherObs.body.id })).status, 403);
});

test('coaching conference, acknowledgments with disagreement, action plan, reassessment', async () => {
  const c = await api('coach', 'POST', '/ii/coaching', { observation_id: obsId }); assert.equal(c.status, 200); coachingId = c.body.id;
  await api('coach', 'PUT', `/ii/coaching/${coachingId}`, { notes: 'Focus on probing', priorities: ['Probe after first answer'], commitments: [{ text: 'Ask "say more" after every first response', owner: 'teacher@test.org', date: '2026-11-30' }], follow_up_date: '2026-12-05' });
  assert.equal((await api('teacher', 'PUT', `/ii/coaching/${coachingId}`, { notes: 'x' })).status, 403);
  const tAck = await api('teacher', 'POST', `/ii/coaching/${coachingId}/acknowledge`, { agree: false, note: 'I think wait time, not probing, is the issue' }); assert.equal(tAck.body.disagreement_note, 'I think wait time, not probing, is the issue');
  const cAck = await api('coach', 'POST', `/ii/coaching/${coachingId}/acknowledge`, { agree: true }); assert.equal(cAck.body.status, 'agreed');
  assert.equal((await api('principal', 'GET', `/ii/coaching/${coachingId}`)).status, 403);
  const p = await api('coach', 'POST', '/ii/action-plans', { coaching_session_id: coachingId, items: [{ title: 'Probe first answers', recommended_adult_behavior: 'Ask a second question', implementation_date: '2026-11-30', success_criterion: '80% on reassessment', reassessment: 'Exit ticket 12/5' }] }); assert.equal(p.status, 200); planId = p.body.id;
  const ev = await api('teacher', 'PUT', `/ii/action-plans/${planId}`, { adult_behavior_evidence: { note: 'Used say-more 6 times in Tuesday lesson' } }); assert.equal(ev.body.adult_behavior_evidence.length, 1);
  const ra = await api('coach', 'POST', '/ii/reassessments', { action_plan_id: planId, standard: '7.RP.A.2', due_date: '2026-12-05' }); assert.equal(ra.status, 200);
  const bad = await api('teacher', 'PUT', `/ii/reassessments/${ra.body.id}`, { results: { correct: 20 } }); assert.equal(bad.status, 422, 'denominator required');
  const good = await api('teacher', 'PUT', `/ii/reassessments/${ra.body.id}`, { results: { correct: 21, total: 25 } }); assert.equal(good.body.status, 'complete');
});

test('reports, dashboards and small-group suppression', async () => {
  const exec = await api('coach', 'GET', `/ii/observations/${obsId}/report?level=executive`); assert.equal(exec.status, 200); assert.ok(exec.body.limitations.length > 0); assert.equal(exec.body.questions, undefined);
  const full = await api('coach', 'GET', `/ii/observations/${obsId}/report?level=full`); assert.ok(Array.isArray(full.body.transcript_excerpts));
  assert.equal((await api('outsider', 'GET', `/ii/observations/${obsId}/report`)).status, 403, 'F43');
  const dash = await api('coach', 'GET', '/ii/dashboard'); assert.equal(dash.status, 200); assert.ok(dash.body.observations.total >= 1);
  const tdash = await api('teacher', 'GET', '/ii/dashboard'); assert.equal(tdash.body.reflections.drafts, 0); assert.equal(tdash.body.coaching.agreed, 1);
  const trend = await api('principal', 'GET', `/ii/trends/school/${schoolId}`); assert.equal(trend.status, 200); assert.equal(trend.body.suppressed, true, 'F44: fewer than 5 teachers');
  assert.equal((await api('teacher', 'GET', `/ii/trends/school/${schoolId}`)).status, 403);
  assert.equal((await api('principal', 'GET', `/ii/trends/district/${orgId}`)).status, 403);
  assert.equal((await api('district', 'GET', `/ii/trends/district/${orgId}`)).status, 200);
});

test('consent withdrawal blocks processing (F41); membership revocation blocks access (F52)', async () => {
  await api('coach', 'POST', `/ii/observations/${obsId}/authorization/withdraw`, {});
  assert.equal((await api('coach', 'POST', `/ii/observations/${obsId}/analyze`, { force: true })).status, 403);
  assert.equal((await api('coach', 'POST', `/ii/observations/${obsId}/media`, { kind: 'audio', mime: 'audio/webm' })).status, 403);
  const ms = await api('admin', 'GET', `/ii/memberships?school_id=${schoolId}`); const coachM = ms.body.find((m) => m.user_email === 'coach@test.org');
  await api('admin', 'DELETE', `/ii/memberships/${coachM.id}`);
  assert.equal((await api('coach', 'GET', `/ii/observations/${obsId}`)).status, 200, 'the observer still owns the record');
  assert.equal((await api('coach', 'POST', '/ii/observations', { school_id: schoolId, teacher_email: 'teacher@test.org' })).status, 403, 'no new observations after role removal');
});

test('platform admin has operational access but no automatic classroom-evidence access', async () => {
  await register('admin2', 'admin2@test.org');   // platform admin with no school memberships
  assert.equal((await api('admin2', 'GET', '/ii/me')).body.platform_admin, true);
  assert.equal((await api('admin2', 'GET', `/ii/observations/${obsId}`)).status, 403);
  assert.equal((await api('admin2', 'GET', `/ii/media/${assetId}`)).status, 403);
  assert.equal((await api('admin2', 'GET', `/ii/reflections/${reflectionId}`)).status, 403);
  assert.equal((await api('admin2', 'GET', '/ii/observations')).body.length, 0);
  assert.equal((await api('admin2', 'GET', '/ii/system/health')).status, 200);
  assert.equal((await api('admin2', 'GET', `/ii/audit?organization_id=${orgId}`)).status, 200);
});

test.after(() => { server.close(); fs.rmSync(dir, { recursive: true, force: true }); });
