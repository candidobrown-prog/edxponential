// AI quality evaluation over the synthetic library. Requires ANTHROPIC_API_KEY. Prints per-fixture results and a summary;
// writes test/fixtures/synthetic/last-ai-eval.json. Nothing here is asserted automatically — results must be reviewed by a person.
// Usage: ANTHROPIC_API_KEY=... node scripts/ai-eval.mjs [fixtureKey]
import fs from 'node:fs';
import { runFullAnalysis } from '../src/ii/analysis.js';
import { DEFAULT_RUBRIC } from '../src/ii/scoring/cfu100.js';

if (!process.env.ANTHROPIC_API_KEY) { console.error('ANTHROPIC_API_KEY is required'); process.exit(2); }
const fixtures = JSON.parse(fs.readFileSync(new URL('../test/fixtures/synthetic/fixtures.json', import.meta.url)));
const only = process.argv[2]; const results = [];
for (const f of fixtures.filter((x) => !only || x.key === only)) {
  const started = Date.now();
  const a = await runFullAnalysis({ ...f.context, evidence_types: ['audio'], excluded_intervals: f.excluded || [] }, { id: f.key, segments: f.segments }, { rubric: DEFAULT_RUBRIC });
  const e = f.expect.ai || {}; const checks = [];
  const chk = (name, ok, detail) => checks.push({ name, ok, detail });
  const doks = a.questions.map((q) => q.dok);
  if (e.question_count_min !== undefined) chk('question_count_min', a.questions.length >= e.question_count_min, a.questions.length);
  if (e.question_count_max !== undefined) chk('question_count_max', a.questions.length <= e.question_count_max, a.questions.length);
  if (e.highest_dok_max !== undefined) chk('highest_dok_max', doks.length === 0 || Math.max(...doks) <= e.highest_dok_max, doks);
  if (e.highest_dok_min !== undefined) chk('highest_dok_min', doks.length > 0 && Math.max(...doks) >= e.highest_dok_min, doks);
  if (e.misconception_min !== undefined) chk('misconception_min', a.misconceptions.length >= e.misconception_min, a.misconceptions.length);
  if (e.misconception_type) chk('misconception_type', a.misconceptions.some((m) => m.type === e.misconception_type), a.misconceptions.map((m) => m.type));
  if (e.incorrect_responses_min !== undefined) chk('incorrect_responses_min', a.responses.filter((r) => r.correctness === 'incorrect').length >= e.incorrect_responses_min, a.responses.map((r) => r.correctness));
  if (e.correct_response_by) chk('correct_response_by', a.responses.some((r) => r.speaker_label === e.correct_response_by && r.correctness === 'correct'), a.responses.map((r) => `${r.speaker_label}:${r.correctness}`));
  if (e.response_with_weak_reasoning) chk('weak_reasoning', a.responses.some((r) => r.speaker_label === e.response_with_weak_reasoning && ['none', 'weak'].includes(r.reasoning_quality)), a.responses.map((r) => `${r.speaker_label}:${r.reasoning_quality}`));
  if (e.most_consequential_asked !== undefined) chk('most_consequential_asked', a.most_consequential_question?.asked === e.most_consequential_asked, a.most_consequential_question);
  if (e.cfu_intentionality) { const lvl = a.cfu_ratings.cfu_intentionality?.level; chk('cfu_intentionality', e.cfu_intentionality === 'low' ? ['basic', 'unsatisfactory', 'not_observed'].includes(lvl) : ['proficient', 'distinguished'].includes(lvl), lvl); }
  if (e.actionable_feedback === 'present') chk('actionable_feedback', ['proficient', 'distinguished'].includes(a.cfu_ratings.actionable_feedback?.level), a.cfu_ratings.actionable_feedback?.level);
  if (e.missed_opportunity) chk('missed_opportunity', a.misconceptions.some((m) => m.type === 'missed_instructional_opportunity') || a.priorities.length > 0, a.misconceptions.map((m) => m.type));
  chk('no_unverified_quotes', ![...a.questions, ...a.responses, ...a.misconceptions, ...a.priorities].some((x) => x.verified === false), a.warnings.filter((w) => /Unverified/.test(w)));
  chk('priorities_max_3', a.priorities.length <= 3, a.priorities.length);
  results.push({ key: f.key, title: f.title, ms: Date.now() - started, checks, warnings: a.warnings, stages: a.stages });
  console.log(`\n${f.title} (${Date.now() - started} ms)`); for (const c of checks) console.log(`  ${c.ok ? 'PASS' : 'FAIL'} ${c.name} ${JSON.stringify(c.detail).slice(0, 120)}`);
}
const total = results.flatMap((r) => r.checks); const pass = total.filter((c) => c.ok).length;
console.log(`\n${pass}/${total.length} checks passed across ${results.length} fixtures`);
fs.writeFileSync(new URL('../test/fixtures/synthetic/last-ai-eval.json', import.meta.url), JSON.stringify({ run_at: new Date().toISOString(), model: process.env.LLM_MODEL || 'claude-sonnet-5-5', pass, total: total.length, results }, null, 1));
