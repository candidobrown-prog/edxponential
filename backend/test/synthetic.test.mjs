// Deterministic expectations over the synthetic instructional library (§23). AI expectations are evaluated by
// scripts/ai-eval.mjs when ANTHROPIC_API_KEY is available; they are NOT asserted here.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { computeTalkTime } from '../src/ii/scoring/talkTime.js';
import { computeEngagement } from '../src/ii/scoring/engagement.js';
import { suppress } from '../src/ii/scoring/suppression.js';

const fixtures = JSON.parse(fs.readFileSync(new URL('./fixtures/synthetic/fixtures.json', import.meta.url)));

test('every fixture is labelled synthetic and well-formed', () => {
  assert.ok(fixtures.length >= 15);
  for (const f of fixtures) { assert.equal(f.synthetic, true); assert.match(f.label, /SYNTHETIC/); assert.ok(f.segments.length >= 2); assert.ok(f.context.standard); }
});

for (const f of fixtures) {
  test(`synthetic: ${f.title}`, () => {
    const dur = Math.max(...f.segments.map((s) => s.end));
    const excluded = f.expect.excluded || [];
    const t = computeTalkTime(f.segments, { observationDuration: excluded.length ? 760 : dur, excludedIntervals: excluded });
    const e = f.expect.talk || {};
    if (e.unique_student_speakers !== undefined) assert.equal(t.unique_student_speakers, e.unique_student_speakers);
    if (e.student_pct_max !== undefined) assert.ok(t.student_pct <= e.student_pct_max, `student_pct ${t.student_pct}`);
    if (e.student_pct_min !== undefined) assert.ok(t.student_pct >= e.student_pct_min, `student_pct ${t.student_pct}`);
    if (e.band !== undefined) assert.equal(t.provisional_student_talk_band, e.band);
    if (e.band_null_or_low) assert.ok(t.provisional_student_talk_band === null || !t.evidence_sufficient || t.provisional_student_talk_band <= 2);
    if (e.unknown_seconds_min !== undefined) assert.ok(t.unknown_seconds >= e.unknown_seconds_min);
    if (e.overlap_seconds_min !== undefined) assert.ok(t.overlap_seconds >= e.overlap_seconds_min, `overlap ${t.overlap_seconds}`);
    if (e.silence_min !== undefined) assert.ok(t.silence_or_independent_seconds + t.excluded_seconds >= e.silence_min);
    if (e.group_counts_as_student) assert.ok(t.student_seconds > 0);
    if (f.expect.ai?.engagement_task_domain === 'unscored_on_audio') { const eng = computeEngagement({ task_engagement: 95 }, ['audio']); assert.equal(eng.domains.find((d) => d.key === 'task_engagement').scored, false); }
    if (f.expect.aggregates?.suppress_below) assert.equal(suppress(f.context.students_present > 0 ? 1 : 0, f.expect.aggregates.suppress_below), true);
  });
}
