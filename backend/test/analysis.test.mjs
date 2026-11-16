import test from 'node:test';
import assert from 'node:assert/strict';
import { parseManualTranscript, markOverlaps } from '../src/ii/transcription.js';

const segs = parseManualTranscript(`[00:00] Teacher: What makes a relationship proportional?
[00:08] Student 1: The ratio stays the same, y over x is always the same.
[00:15] Student 2: It goes up.
[00:20] Group: constant ratio and through the origin
[00:25] Teacher: [inaudible] so what are the two things?`);

test('manual transcript parsing: speakers, timestamps, inaudible', () => {
  assert.equal(segs.length, 5);
  assert.deepEqual(segs.map((s) => s.speaker), ['teacher', 'student', 'student', 'group', 'teacher']);
  assert.equal(segs[1].speaker_label, 'Student 1'); assert.equal(segs[0].start, 0); assert.equal(segs[1].start, 8); assert.equal(segs[4].inaudible, true);
  const noTs = parseManualTranscript('T: hello there class\nS1: hi');
  assert.ok(noTs[0].flags.includes('estimated_timestamp')); assert.ok(noTs[1].start > noTs[0].start);
});

test('overlap marking only across different speaker slots (F11)', () => {
  const s = markOverlaps([{ id: 'a', start: 0, end: 10, speaker_label: 'Teacher' }, { id: 'b', start: 8, end: 12, speaker_label: 'Student 1' }, { id: 'c', start: 20, end: 25, speaker_label: 'Teacher' }, { id: 'd', start: 24, end: 26, speaker_label: 'Teacher' }]);
  assert.equal(s.find((x) => x.id === 'a').overlap, true); assert.equal(s.find((x) => x.id === 'b').overlap, true); assert.equal(s.find((x) => x.id === 'c').overlap, false);
});

test('quote verification and AI output hardening with a mocked model (F49/F50)', async () => {
  process.env.ANTHROPIC_API_KEY = 'test-key';
  const { verifyQuote, analyzeQuestions, analyzeCfuAndEngagement } = await import('../src/ii/analysis.js');
  assert.equal(verifyQuote('The ratio stays the same', [segs[1].id], segs).verified, true);
  assert.equal(verifyQuote('the RATIO stays the same!', [], segs).verified, true, 'case/punctuation-insensitive');
  assert.equal(verifyQuote('students clearly mastered the standard', [segs[1].id], segs).verified, false);

  const realFetch = globalThis.fetch; let call = 0;
  globalThis.fetch = async (url, init) => {
    call++;
    const body = JSON.parse(init.body); const tool = body.tools[0].name; let input;
    if (body.messages[0].content.includes('Extract every substantive teacher question')) {
      input = { questions: [{ segment_id: segs[0].id, question: 'What makes a relationship proportional?', blooms: 'understand', dok: 2, cognitive_demand: 'moderate', standard_alignment: 'aligned', intended_evidence: 'definition', confidence: 0.9 }, { segment_id: segs[4].id, question: 'Why is the moon made of cheese?', blooms: 'analyze', dok: 3, cognitive_demand: 'high', standard_alignment: 'unknown', intended_evidence: 'x', confidence: 0.3 }],
        responses: [{ segment_id: segs[1].id, question_segment_id: segs[0].id, response: 'The ratio stays the same', correctness: 'correct', reasoning_quality: 'developing', confidence: 0.8 }], most_consequential_question: { asked: true, segment_id: segs[0].id } };
    } else {
      input = { ratings: { question_quality: { level: 'proficient', evidence_segment_ids: [segs[0].id], evidence_quote: 'What makes a relationship proportional?', rationale: 'ok', confidence: 0.7 }, actionable_feedback: { level: 'distinguished', evidence_segment_ids: ['nonexistent'], rationale: 'made up', confidence: 0.9 }, learning_targets: { level: 'basic', evidence_segment_ids: [segs[0].id], evidence_quote: 'this quote does not exist', rationale: 'r', confidence: 0.5 } }, engagement: { observable_participation: 70, cognitive_engagement: 60, task_engagement: 90, equitable_access: null, persistence: null } };
    }
    return new Response(JSON.stringify({ id: 'msg', type: 'message', role: 'assistant', model: 'mock', content: [{ type: 'tool_use', id: 't1', name: tool, input }], stop_reason: 'tool_use', usage: { input_tokens: 1, output_tokens: 1 } }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const obs = { grade: '7', subject: 'Math', standard: '7.RP.A.2', students_present: 25, evidence_types: ['audio'] };
    const q = await analyzeQuestions(obs, segs);
    assert.equal(q.questions[0].verified, true); assert.equal(q.questions[1].verified, false, 'fabricated question flagged');
    assert.ok(q.warnings.some((w) => /Unverified question quote/.test(w)));
    assert.equal(q.responses[0].speaker_label, 'Student 1'); assert.equal(q.responses[0].timestamp, 8);
    const c = await analyzeCfuAndEngagement(obs, segs, { questions: q.questions, responses: q.responses, talk: {} });
    assert.equal(c.ratings.question_quality.level, 'proficient'); assert.equal(c.ratings.question_quality.evidence_quote, 'What makes a relationship proportional?');
    assert.equal(c.ratings.actionable_feedback.level, 'insufficient_evidence', 'rating with no valid evidence is downgraded, never kept');
    assert.equal(c.ratings.learning_targets.evidence_quote, null, 'unverifiable quote dropped'); assert.equal(c.ratings.learning_targets.level, 'basic');
    assert.equal(c.ratings.misconception_diagnosis.level, 'insufficient_evidence', 'missing dimensions default to insufficient evidence, not zero');
    assert.ok(c.warnings.length >= 2); assert.ok(call >= 2);
  } finally { globalThis.fetch = realFetch; delete process.env.ANTHROPIC_API_KEY; }
});
