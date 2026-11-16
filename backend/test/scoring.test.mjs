import test from 'node:test';
import assert from 'node:assert/strict';
import { computeTalkTime, studentTalkBand } from '../src/ii/scoring/talkTime.js';
import { computeEngagement } from '../src/ii/scoring/engagement.js';
import { scoreCfu100, DEFAULT_RUBRIC, CFU_DIMENSIONS } from '../src/ii/scoring/cfu100.js';
import { assessMasteryRisk } from '../src/ii/scoring/masteryRisk.js';

const seg = (start, end, speaker, speaker_label) => ({ start, end, speaker, speaker_label });

test('talk time: basic teacher/student split', () => {
  const r = computeTalkTime([seg(0, 60, 'teacher'), seg(60, 100, 'student', 'Student 1')], { observationDuration: 120 });
  assert.equal(r.teacher_seconds, 60);
  assert.equal(r.student_seconds, 40);
  assert.equal(r.teacher_pct, 60);
  assert.equal(r.student_pct, 40);
  assert.equal(r.silence_or_independent_seconds, 20);
  assert.equal(r.provisional_student_talk_band, 2);
});

test('talk time: overlapping speech is not double counted (F11)', () => {
  // teacher 0-60, student 50-70 → overlap 10s
  const r = computeTalkTime([seg(0, 60, 'teacher'), seg(50, 70, 'student', 'Student 1')]);
  assert.equal(r.overlap_seconds, 10);
  assert.equal(r.analyzable_speech_seconds, 70);       // union, not 80
  assert.equal(r.teacher_pct + r.student_pct, 100);
});

test('talk time: overlapping segments of the same speaker merge', () => {
  const r = computeTalkTime([seg(0, 30, 'teacher'), seg(20, 40, 'teacher')]);
  assert.equal(r.teacher_seconds, 40);
});

test('talk time: group responses count as student talk, unknown is reported separately (F12/F13)', () => {
  const r = computeTalkTime([seg(0, 10, 'teacher'), seg(10, 20, 'group'), seg(20, 30, 'unknown')]);
  assert.equal(r.student_seconds, 10);
  assert.equal(r.unknown_seconds, 10);
  assert.equal(r.unique_student_speakers, 0);           // a group answer never proves an individual spoke
});

test('talk time: participation concentration flags a dominating student (F25)', () => {
  const r = computeTalkTime([seg(0, 10, 'teacher'), seg(10, 70, 'student', 'Student 1'), seg(70, 80, 'student', 'Student 2'), seg(80, 90, 'student', 'Student 3')]);
  assert.equal(r.unique_student_speakers, 3);
  assert.equal(r.participation_concentration, 75);
  assert.equal(r.dominated, true);
});

test('talk time: excluded intervals and short evidence', () => {
  const r = computeTalkTime([seg(0, 30, 'teacher')], { observationDuration: 600, excludedIntervals: [{ start: 100, end: 400, reason: 'independent work' }] });
  assert.equal(r.excluded_seconds, 300);
  assert.equal(r.silence_or_independent_seconds, 270);
  assert.equal(r.evidence_sufficient, false);
});

test('student talk bands', () => {
  assert.equal(studentTalkBand(70), 5); assert.equal(studentTalkBand(69.9), 4); assert.equal(studentTalkBand(60), 4);
  assert.equal(studentTalkBand(50), 3); assert.equal(studentTalkBand(35), 2); assert.equal(studentTalkBand(34.9), 1); assert.equal(studentTalkBand(null), null);
});

test('engagement: audio-only evidence cannot score visual task engagement (F31)', () => {
  const r = computeEngagement({ observable_participation: 80, cognitive_engagement: 70, task_engagement: 90, equitable_access: 60, persistence: 70 }, ['audio']);
  const task = r.domains.find((d) => d.key === 'task_engagement');
  assert.equal(task.scored, false);
  assert.equal(r.coverage_pct, 80);
  assert.equal(r.complete, false);
  assert.equal(r.status, 'partial');
  assert.ok(r.note);
});

test('engagement: weighting and rating-5 guard', () => {
  const full = computeEngagement({ observable_participation: 95, cognitive_engagement: 95, task_engagement: 95, equitable_access: 95, persistence: 95 }, ['video']);
  assert.equal(full.weighted_score, 95); assert.equal(full.provisional_rating, 5);
  const weakCog = computeEngagement({ observable_participation: 100, cognitive_engagement: 80, task_engagement: 100, equitable_access: 100, persistence: 100 }, ['video']);
  assert.equal(weakCog.weighted_score, 94); assert.equal(weakCog.provisional_rating, 4, 'a 5 requires strong cognitive engagement');
  const none = computeEngagement({}, ['audio']);
  assert.equal(none.status, 'insufficient_evidence'); assert.equal(none.provisional_rating, null);
});

test('cfu-100: weights total 100 and distinguished earns full weight', () => {
  assert.equal(CFU_DIMENSIONS.reduce((a, d) => a + d.weight, 0), 100);
  const ratings = Object.fromEntries(CFU_DIMENSIONS.map((d) => [d.key, { level: 'distinguished', evidence: ['seg1'] }]));
  const r = scoreCfu100(ratings, { ...DEFAULT_RUBRIC, authoritative: true });
  assert.equal(r.score_out_of_100, 100); assert.equal(r.status, 'complete'); assert.equal(r.finalizable, true);
});

test('cfu-100: proficient = 80% of weight; missing evidence stays unscored, never zero (F29)', () => {
  const ratings = { question_quality: { level: 'proficient', evidence: ['s1'] } };
  const r = scoreCfu100(ratings, { ...DEFAULT_RUBRIC, authoritative: true });
  const q = r.rows.find((x) => x.key === 'question_quality');
  assert.equal(q.points, 9.6);
  assert.equal(r.score_out_of_100, null, 'no /100 score when dimensions are unscored');
  assert.equal(r.weight_scored, 12); assert.equal(r.status, 'provisional');
  assert.equal(r.rows.filter((x) => x.status === 'insufficient_evidence').length, 9);
});

test('cfu-100: basic/unsatisfactory blocked until authoritative multipliers exist (F30)', () => {
  const ratings = Object.fromEntries(CFU_DIMENSIONS.map((d) => [d.key, { level: 'distinguished', evidence: ['s1'] }]));
  ratings.actionable_feedback = { level: 'basic', evidence: ['s2'] };
  const r = scoreCfu100(ratings, DEFAULT_RUBRIC);
  assert.equal(r.finalizable, false);
  assert.ok(r.blockers.some((b) => /no approved multiplier/.test(b)));
  assert.ok(r.blockers.some((b) => /Authoritative CFU-100 rubric/.test(b)));
  // once imported, the same ratings finalize
  const imported = { ...DEFAULT_RUBRIC, authoritative: true, multipliers: { ...DEFAULT_RUBRIC.multipliers, basic: 0.5, unsatisfactory: 0.2 } };
  const r2 = scoreCfu100(ratings, imported);
  assert.equal(r2.finalizable, true); assert.equal(r2.score_out_of_100, 96);
});

test('cfu-100: a rating without evidence is a blocker', () => {
  const r = scoreCfu100({ learning_targets: { level: 'proficient' } }, { ...DEFAULT_RUBRIC, authoritative: true });
  assert.ok(r.blockers.some((b) => /without linked evidence/.test(b)));
});

test('mastery risk: no denominator → no percentage (F32); no evidence → indeterminate (F28)', () => {
  const r = assessMasteryRisk({ assessment: { correct: 10, total: 0 }, responses: { analyzed: 0 }, studentsPresent: 25 });
  assert.equal(r.risk, 'indeterminate'); assert.equal(r.observed.assessment_pct, undefined);
  assert.ok(r.reasons.some((x) => /denominator/.test(x)));
});

test('mastery risk: categories, small samples and contradictions (F33/F34)', () => {
  const low = assessMasteryRisk({ assessment: { correct: 22, total: 25, aligned: true }, studentsPresent: 25 });
  assert.equal(low.risk, 'low'); assert.equal(low.confidence, 'high'); assert.equal(low.predicted, null);
  const small = assessMasteryRisk({ responses: { analyzed: 4, correct: 4, incorrect: 0, partial: 0, unique_students: 4 }, studentsPresent: 28 });
  assert.equal(small.confidence, 'low'); assert.equal(small.risk, 'indeterminate');
  const contra = assessMasteryRisk({ assessment: { correct: 23, total: 25, aligned: true }, studentsPresent: 25, contradictions: 1 });
  assert.equal(contra.risk, 'moderate'); assert.equal(contra.confidence, 'moderate');
  const high = assessMasteryRisk({ assessment: { correct: 10, total: 25, aligned: true }, studentsPresent: 25 });
  assert.equal(high.risk, 'high');
});
