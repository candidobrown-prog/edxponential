import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ii, fmtTime } from '@/api/ii';
import { Tabs, Card, Btn, State, Pill, Verified, Confidence, Select, Input, Stat, C, useErr, ErrorNote } from './ui';

const LEVELS = ['distinguished', 'proficient', 'basic', 'unsatisfactory', 'not_observed', 'insufficient_evidence'];
const Seek = ({ t, onSeek, children }) => <button onClick={() => onSeek?.(t)} className="font-mono text-[11px] hover:underline" style={{ color: C.harbor }} aria-label={`Jump to ${fmtTime(t)}`}>{children || fmtTime(t)}</button>;

export default function AnalysisTabs({ obsData, onSeek, segments }) {
  const qc = useQueryClient(); const { observation: o, analysis: a, permissions: perm } = obsData;
  const [tab, setTab] = useState('overview'); const [err, run] = useErr(); const [busy, setBusy] = useState(null);
  const [filters, setFilters] = useState({ dok: '', demand: '', speaker: '', conf: '' });
  const refresh = () => qc.invalidateQueries(['ii-observation', o.id]);
  const act = async (name, fn) => { setBusy(name); try { await run(fn); refresh(); } catch { /* shown */ } finally { setBusy(null); } };
  const segText = (id) => segments?.find((s) => s.id === id)?.text;

  if (!a) {
    const t = obsData.current_transcript;
    return (<div className="space-y-3"><ErrorNote error={err} />{!t ? <State kind="empty" title="No transcript yet" detail="Add a transcript in the Transcript tab first." /> : !t.approved ? <State kind="warning" title="Transcript not approved" detail="Approve the transcript in the Transcript tab, then run analysis." /> : <State kind="empty" title="Ready to analyse" detail={obsData.providers?.ai?.configured ? 'Runs discourse metrics, question/response extraction, misconception hypotheses, CFU-100 recommendations and coaching priorities.' : 'The AI key is not configured: only discourse metrics will be computed; CFU-100 can be rated manually.'} action={perm.analysis_run && <Btn onClick={() => act('analyze', () => ii.analyze(o.id))} disabled={busy === 'analyze'}>{busy === 'analyze' ? 'Analysing… (may take a minute)' : 'Run analysis'}</Btn>} />}</div>);
  }
  const questions = a.questions.filter((q) => (!filters.dok || String(q.dok) === filters.dok) && (!filters.demand || q.cognitive_demand === filters.demand) && (!filters.conf || confBand(q.confidence) === filters.conf));
  const responses = a.responses.filter((r) => (!filters.speaker || r.speaker_label === filters.speaker) && (!filters.conf || confBand(r.confidence) === filters.conf));
  const tabs = [{ key: 'overview', label: 'Overview' }, { key: 'questions', label: 'Questions', count: a.questions.length }, { key: 'responses', label: 'Student Responses', count: a.responses.length }, { key: 'discourse', label: 'Discourse' }, { key: 'engagement', label: 'Engagement' }, { key: 'cfu', label: 'CFU-100' }, { key: 'misconceptions', label: 'Misconceptions', count: a.misconceptions.length }, { key: 'next', label: 'Next Steps', count: a.priorities.length }];
  const unverified = [...a.questions, ...a.responses, ...a.misconceptions, ...a.priorities].filter((x) => x.verified === false).length;
  return (
    <div>
      <ErrorNote error={err} />
      {a.stale && <State className="mb-3" kind="warning" title="This analysis is out of date" detail="The transcript changed after it was generated. Findings below may not match the current transcript." action={perm.analysis_run && <Btn size="sm" onClick={() => act('analyze', () => ii.analyze(o.id, { force: true }))}>Re-run analysis</Btn>} />}
      <div className="flex flex-wrap gap-2 items-center mb-3 text-xs">
        <Pill tone={a.status === 'approved' ? 'good' : a.status === 'reviewed' ? 'info' : 'warn'}>{a.status}</Pill>{a.model ? <Pill>model {a.model}</Pill> : <Pill tone="warn">AI stages skipped</Pill>}<Pill>{a.rubric_version}</Pill>{unverified > 0 && <Pill tone="bad">{unverified} unverified quotation(s)</Pill>}
        <span style={{ color: C.slate }}>Generated {new Date(a.created_date).toLocaleString()}</span>
        {perm.analysis_review && a.status !== 'approved' && <Btn size="sm" variant="accent" className="ml-auto" onClick={() => act('approve', async () => { try { await ii.approveAnalysis(a.id, {}); } catch (e) { if (e.status === 422 && window.confirm(`${e.message}\n\nApprove and keep them flagged?`)) return ii.approveAnalysis(a.id, { accept_unverified: true }); throw e; } })} disabled={busy === 'approve' || a.stale}>Approve findings</Btn>}
      </div>
      {a.warnings?.length > 0 && <details className="mb-3 text-xs rounded-lg border p-2" style={{ borderColor: C.mist, background: '#fffbeb' }}><summary className="font-semibold cursor-pointer">{a.warnings.length} processing note(s)</summary><ul className="list-disc ml-5 mt-1 space-y-0.5">{a.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul></details>}
      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      {tab === 'overview' && (<div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Student talk" value={a.talk_time.student_pct !== null ? `${a.talk_time.student_pct}%` : '–'} sub={a.talk_time.evidence_sufficient ? `band ${a.talk_time.provisional_student_talk_band ?? '–'} (provisional)` : 'insufficient speech to band'} />
          <Stat label="Questions" value={a.questions.length} sub={`${a.questions.filter((q) => q.cognitive_demand === 'high').length} high demand`} />
          <Stat label="CFU-100" value={a.cfu_result.score_out_of_100 !== null ? a.cfu_result.score_out_of_100 : a.cfu_result.status} sub={a.cfu_result.status === 'complete' ? '/100' : `${a.cfu_result.weight_scored}/100 weight scored`} />
          <Stat label="Mastery risk" value={a.mastery_risk?.risk || '–'} sub={a.mastery_risk?.confidence ? `confidence ${a.mastery_risk.confidence}` : ''} tone={a.mastery_risk?.risk === 'high' ? 'warn' : undefined} />
        </div>
        <Card title="Most consequential question">{!a.most_consequential_question ? <p className="text-sm" style={{ color: C.slate }}>Not evaluated (AI stage skipped).</p> : a.most_consequential_question.asked ? <p className="text-sm">The key question for the standard was asked{a.most_consequential_question.segment_id && <> at <Seek t={segments?.find((s) => s.id === a.most_consequential_question.segment_id)?.start ?? 0} onSeek={onSeek} /></>}.</p> : <div className="text-sm space-y-1"><p><strong style={{ color: '#92400e' }}>Not asked.</strong> Recommended: <em>“{a.most_consequential_question.recommended_question}”</em></p><p style={{ color: C.slate }}>{a.most_consequential_question.why_it_matters}</p></div>}</Card>
        <Card title="Mastery risk"><p className="text-sm">{a.mastery_risk?.notice}</p><ul className="text-sm list-disc ml-5 mt-2">{(a.mastery_risk?.reasons || []).map((r, i) => <li key={i}>{r}</li>)}</ul><p className="text-xs mt-2" style={{ color: C.slate }}>Observed: assessment {a.mastery_risk?.observed?.assessment_pct ?? '–'}% · verbal {a.mastery_risk?.observed?.verbal_pct ?? '–'}% · coverage {a.mastery_risk?.observed?.coverage_pct ?? '–'}% of students present</p></Card>
      </div>)}

      {tab === 'questions' && (<div className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs"><Select className="h-8 w-28" value={filters.dok} onChange={(e) => setFilters({ ...filters, dok: e.target.value })}><option value="">All DOK</option>{[1, 2, 3, 4].map((d) => <option key={d}>{d}</option>)}</Select><Select className="h-8 w-36" value={filters.demand} onChange={(e) => setFilters({ ...filters, demand: e.target.value })}><option value="">All demand</option>{['low', 'moderate', 'high'].map((d) => <option key={d}>{d}</option>)}</Select><Select className="h-8 w-40" value={filters.conf} onChange={(e) => setFilters({ ...filters, conf: e.target.value })}><option value="">All confidence</option>{['high', 'moderate', 'low'].map((d) => <option key={d}>{d}</option>)}</Select></div>
        {questions.length === 0 ? <State kind="empty" title="No questions extracted" detail={a.model ? 'Nothing matched.' : 'AI stage not run.'} /> : questions.map((q) => (<div key={q.id} className="rounded-xl border bg-white p-4" style={{ borderColor: C.mist }}><div className="flex flex-wrap gap-2 items-center mb-1"><Seek t={q.timestamp} onSeek={onSeek} /><Pill tone="info">Bloom's: {q.blooms}</Pill><Pill tone="info">DOK {q.dok}</Pill><Pill tone={q.cognitive_demand === 'high' ? 'good' : q.cognitive_demand === 'moderate' ? 'warn' : 'neutral'}>{q.cognitive_demand} demand</Pill><Pill tone={q.standard_alignment === 'aligned' ? 'good' : q.standard_alignment === 'not_aligned' ? 'bad' : 'neutral'}>{q.standard_alignment.replace('_', ' ')}</Pill><Confidence value={q.confidence} /><Verified ok={q.verified} /></div><p className="text-sm font-semibold" style={{ color: C.navy }}>“{q.question}”</p><p className="text-xs mt-1" style={{ color: C.slate }}>Intended evidence: {q.intended_evidence}{q.teacher_follow_up ? ` · Follow-up: ${q.teacher_follow_up}` : ''}{q.note ? ` · ${q.note}` : ''}</p></div>))}
      </div>)}

      {tab === 'responses' && (<div className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs"><Select className="h-8 w-40" value={filters.speaker} onChange={(e) => setFilters({ ...filters, speaker: e.target.value })}><option value="">All speakers</option>{[...new Set(a.responses.map((r) => r.speaker_label).filter(Boolean))].map((s) => <option key={s}>{s}</option>)}</Select></div>
        {responses.length === 0 ? <State kind="empty" title="No student responses captured" detail="Insufficient evidence — mastery is not inferred." /> : responses.map((r) => (<div key={r.id} className="rounded-xl border bg-white p-4" style={{ borderColor: C.mist }}><div className="flex flex-wrap gap-2 items-center mb-1"><Seek t={r.timestamp} onSeek={onSeek} /><Pill>{r.speaker_label || 'unknown'}{r.is_group ? ' (group)' : ''}</Pill><Pill tone={r.correctness === 'correct' ? 'good' : r.correctness === 'incorrect' ? 'bad' : r.correctness === 'partially_correct' ? 'warn' : 'neutral'}>{r.correctness.replace('_', ' ')}</Pill><Pill tone={r.reasoning_quality === 'strong' ? 'good' : 'neutral'}>reasoning: {r.reasoning_quality}</Pill><Confidence value={r.confidence} /><Verified ok={r.verified} /></div><p className="text-sm font-semibold" style={{ color: C.navy }}>“{r.response}”</p><p className="text-xs mt-1" style={{ color: C.slate }}>Responding to: “{segText(r.question_segment_id)?.slice(0, 120) || '–'}”</p>{r.conceptual_understanding && <p className="text-xs mt-1"><strong>Understanding:</strong> {r.conceptual_understanding}</p>}{r.possible_misconception && <p className="text-xs mt-1"><strong>Possible misconception:</strong> {r.possible_misconception}{r.alternative_interpretation ? <> · <em>Alternative:</em> {r.alternative_interpretation}</> : null}</p>}{r.probing_question && <p className="text-xs mt-1" style={{ color: C.harbor }}><strong>Probe:</strong> “{r.probing_question}”</p>}</div>))}
      </div>)}

      {tab === 'discourse' && (<div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[['Teacher speech', `${fmtTime(a.talk_time.teacher_seconds)} (${a.talk_time.teacher_pct ?? '–'}%)`], ['Student speech', `${fmtTime(a.talk_time.student_seconds)} (${a.talk_time.student_pct ?? '–'}%)`], ['Unknown speaker', fmtTime(a.talk_time.unknown_seconds)], ['Overlap', fmtTime(a.talk_time.overlap_seconds)], ['Analyzable speech', fmtTime(a.talk_time.analyzable_speech_seconds)], ['Silence / independent', fmtTime(a.talk_time.silence_or_independent_seconds)], ['Verified student speakers', a.talk_time.unique_student_speakers], ['Top-speaker share', a.talk_time.participation_concentration !== null ? `${a.talk_time.participation_concentration}%` : '–']].map(([k, v]) => <Stat key={k} label={k} value={v} />)}</div>
        <Card title="Participation distribution">{a.talk_time.participation.length === 0 ? <State kind="insufficient" title="No labelled student speakers" detail="Assign Student 1, Student 2… labels in the transcript to see distribution." /> : <ul className="space-y-1.5">{a.talk_time.participation.map((p) => <li key={p.label} className="text-sm"><div className="flex justify-between"><span>{p.label}</span><span style={{ color: C.slate }}>{fmtTime(p.seconds)} · {p.share}%</span></div><div className="h-1.5 rounded-full" style={{ background: C.mist }}><div className="h-full rounded-full" style={{ width: `${p.share}%`, background: C.harbor }} /></div></li>)}</ul>}{a.talk_time.dominated && <p className="text-xs mt-3" style={{ color: '#92400e' }}>One student holds ≥50% of labelled student talk — participation is concentrated.</p>}<p className="text-[11px] mt-3" style={{ color: C.slate }}>Percentages use attributable, non-overlapping teacher + student speech as the denominator. More talking is not equated with more learning; the provisional band also requires cognitive rigour and equitable participation. {o.instructional_phase === 'explicit_modeling' && 'This lesson was documented as explicit modelling, which justifies more teacher talk.'}</p></Card>
      </div>)}

      {tab === 'engagement' && <EngagementPanel a={a} perm={perm} act={act} busy={busy} />}
      {tab === 'cfu' && <CfuPanel a={a} perm={perm} act={act} busy={busy} onSeek={onSeek} segments={segments} />}
      {tab === 'misconceptions' && (<div className="space-y-3">{a.misconceptions.length === 0 ? <State kind="empty" title="No misconception hypotheses" detail={a.model ? 'None identified in this transcript.' : 'AI stage not run.'} /> : a.misconceptions.map((m) => (<div key={m.id} className="rounded-xl border bg-white p-4" style={{ borderColor: C.mist }}><div className="flex flex-wrap gap-2 items-center mb-1"><Pill tone="info">{m.type.replace(/_/g, ' ')}</Pill><Confidence value={m.confidence} /><Verified ok={m.verified} />{(m.evidence_segment_ids || []).map((sid) => { const s = segments?.find((x) => x.id === sid); return s ? <Seek key={sid} t={s.start} onSeek={onSeek} /> : null; })}</div><p className="text-sm font-semibold" style={{ color: C.navy }}>Hypothesis: {m.hypothesis}</p><p className="text-xs mt-1"><strong>Direct evidence:</strong> “{m.direct_evidence}”</p><p className="text-xs mt-1"><strong>Competing explanation:</strong> {m.competing_explanation}</p><p className="text-xs mt-1"><strong>Evidence needed:</strong> {m.additional_evidence_needed}</p><p className="text-xs mt-1" style={{ color: C.harbor }}><strong>Teacher action:</strong> {m.recommended_teacher_action} · <strong>Verify by:</strong> {m.verification_strategy}</p></div>))}</div>)}
      {tab === 'next' && <NextSteps a={a} obs={o} perm={perm} act={act} busy={busy} onSeek={onSeek} />}
    </div>
  );
}
const confBand = (c) => (typeof c !== 'number' ? c : c >= 0.75 ? 'high' : c >= 0.45 ? 'moderate' : 'low');

function EngagementPanel({ a, perm, act, busy }) {
  const e = a.engagement; const [scores, setScores] = useState({});
  return (<div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3"><Stat label="Status" value={e.status.replace('_', ' ')} /><Stat label="Coverage" value={`${e.coverage_pct}%`} sub="of weight scored" /><Stat label="Provisional rating" value={e.provisional_rating ?? '–'} sub={e.weighted_score !== null ? `weighted ${e.weighted_score} (scored domains only)` : ''} /></div>
    {e.note && <State kind="warning" title="Incomplete scoring coverage" detail={e.note} />}
    <Card title="Domains">
      <table className="w-full text-sm"><thead><tr className="text-left text-[11px] uppercase" style={{ color: C.slate }}><th>Domain</th><th>Weight</th><th>Score</th><th>Status</th>{perm.analysis_review && <th>Reviewer score</th>}</tr></thead>
        <tbody>{e.domains.map((d) => <tr key={d.key} className="border-t" style={{ borderColor: C.mist }}><td className="py-2">{d.label}</td><td>{d.weight}%</td><td>{d.score ?? '–'}</td><td className="text-xs" style={{ color: C.slate }}>{d.scored ? 'scored' : d.reason}</td>{perm.analysis_review && <td><Input type="number" min="0" max="100" className="h-8 w-20" disabled={!d.supported} value={scores[d.key] ?? ''} onChange={(ev) => setScores({ ...scores, [d.key]: ev.target.value === '' ? undefined : Number(ev.target.value) })} aria-label={`Reviewer score for ${d.label}`} /></td>}</tr>)}</tbody></table>
      {perm.analysis_review && <Btn className="mt-3" size="sm" onClick={() => act('eng', () => ii.reviewEngagement(a.id, { scores }))} disabled={busy === 'eng' || !Object.keys(scores).length}>Save reviewer scores</Btn>}
      <p className="text-[11px] mt-2" style={{ color: C.slate }}>Audio-only evidence cannot establish visual on-task engagement; those domains stay unscored unless video or observer notes support them.</p>
    </Card>
  </div>);
}

function CfuPanel({ a, perm, act, busy, onSeek, segments }) {
  const r = a.cfu_result; const [edits, setEdits] = useState({});
  const rows = r.rows || [];
  return (<div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Stat label="Status" value={r.status} /><Stat label="Weight scored" value={`${r.weight_scored}/100`} /><Stat label="Earned points" value={r.earned_points} sub={r.status === 'complete' ? 'complete score /100' : 'partial — not a /100 score'} /><Stat label="Finalizable" value={r.finalizable ? 'Yes' : 'No'} /></div>
    {r.blockers?.length > 0 && <State kind="warning" title="Finalization blockers" detail={r.blockers.join(' · ')} />}
    <p className="text-xs" style={{ color: C.slate }}>{r.developmental_notice} Rubric: {r.rubric_version}.</p>
    <div className="space-y-2">{rows.map((row) => { const rating = a.cfu_ratings?.[row.key] || {}; const ed = edits[row.key] || {}; return (
      <div key={row.key} className="rounded-xl border bg-white p-4" style={{ borderColor: C.mist }}>
        <div className="flex flex-wrap items-center gap-2"><h4 className="font-bold text-sm" style={{ color: C.navy }}>{row.label}</h4><Pill>weight {row.weight}</Pill><Pill tone={row.status === 'scored' ? 'good' : row.status === 'unapproved_multiplier' ? 'bad' : 'neutral'}>{row.level.replace(/_/g, ' ')}{row.points !== null ? ` · ${row.points} pts` : ''}</Pill><Pill tone={row.approval_status === 'reviewed' ? 'info' : 'neutral'}>{row.approval_status}</Pill>{rating.source === 'ai' && <Pill tone="warn">AI recommendation</Pill>}<Confidence value={rating.confidence} /></div>
        {rating.ai_recommendation && <p className="text-[11px] mt-1" style={{ color: C.slate }}>AI recommended: {rating.ai_recommendation.level} — {rating.ai_recommendation.rationale}</p>}
        <p className="text-xs mt-2"><strong>Rationale:</strong> {rating.rationale || '–'}</p>
        {rating.evidence_quote && <p className="text-xs mt-1"><strong>Evidence:</strong> “{rating.evidence_quote}”</p>}
        <p className="text-xs mt-1"><strong>Timestamps:</strong> {(rating.evidence || []).length ? rating.evidence.map((e, i) => <Seek key={i} t={e.timestamp ?? segments?.find((s) => s.id === e.segment_id)?.start ?? 0} onSeek={onSeek} />).reduce((acc, x) => (acc.length ? [...acc, ', ', x] : [x]), []) : <span style={{ color: C.slate }}>none linked</span>}</p>
        {rating.missing_evidence && <p className="text-xs mt-1" style={{ color: '#92400e' }}><strong>Missing evidence:</strong> {rating.missing_evidence}</p>}
        {rating.reviewer_comment && <p className="text-xs mt-1"><strong>Reviewer:</strong> {rating.reviewer_comment}</p>}
        {perm.analysis_review && (<div className="grid md:grid-cols-[180px_1fr] gap-2 mt-3"><Select className="h-8 text-xs" value={ed.level ?? row.level} onChange={(e) => setEdits({ ...edits, [row.key]: { ...ed, level: e.target.value } })} aria-label={`Level for ${row.label}`}>{LEVELS.map((l) => <option key={l} value={l}>{l.replace(/_/g, ' ')}</option>)}</Select><Input className="h-8 text-xs" placeholder="Reviewer comment / reason for change" value={ed.reviewer_comment ?? ''} onChange={(e) => setEdits({ ...edits, [row.key]: { ...ed, reviewer_comment: e.target.value, reason: e.target.value } })} aria-label={`Reviewer comment for ${row.label}`} /></div>)}
      </div>); })}</div>
    {perm.analysis_review && <Btn onClick={() => act('cfu', () => ii.reviewCfu(a.id, { ratings: Object.fromEntries(Object.entries(edits).map(([k, v]) => [k, { ...v, evidence: a.cfu_ratings?.[k]?.evidence || [] }])) }))} disabled={!Object.keys(edits).length || busy === 'cfu'}>Save reviewer ratings</Btn>}
  </div>);
}

function NextSteps({ a, obs, perm, act, busy, onSeek }) {
  const existing = useMemo(() => a.priorities, [a]);
  return (<div className="space-y-3">
    {existing.length === 0 ? <State kind="empty" title="No coaching priorities yet" detail={a.model ? 'None generated.' : 'AI stage not run. Priorities can be written in the coaching conference.'} /> : existing.map((p, i) => (<div key={p.id} className="rounded-xl border bg-white p-4" style={{ borderColor: C.mist }}><div className="flex flex-wrap gap-2 items-center mb-1"><Pill tone="accent">Priority {i + 1}</Pill>{p.timestamp !== null && p.timestamp !== undefined && <Seek t={p.timestamp} onSeek={onSeek} />}<Verified ok={p.verified} /><Pill>{p.status}</Pill></div><h4 className="font-bold text-sm" style={{ color: C.navy }}>{p.title}</h4><dl className="grid md:grid-cols-2 gap-x-6 gap-y-1 text-xs mt-2">{[['Instructional concern', p.instructional_concern], ['Evidence', `“${p.evidence_quote}”`], ['Connection to standard', p.connection_to_standard], ['Recommended adult behaviour', p.recommended_adult_behavior], ['Model teacher language', `“${p.model_teacher_language}”`], ['Expected student response', p.expected_student_response], ['Reassessment', p.reassessment], ['Success criterion', p.success_criterion]].map(([k, v]) => <div key={k}><dt className="font-semibold" style={{ color: C.slate }}>{k}</dt><dd>{v}</dd></div>)}</dl></div>))}
    {perm.analysis_review && <div className="flex gap-2"><Btn onClick={() => act('coach', async () => { const c = await ii.createCoaching({ observation_id: obs.id }); await ii.saveCoaching(c.id, { priorities: existing.map((p) => p.title) }); window.location.assign(`/ii/coaching/${c.id}`); })} disabled={busy === 'coach'}>Open coaching conference</Btn><Btn variant="secondary" as={Link} to={`/ii/reports/${obs.id}`}>View report</Btn></div>}
  </div>);
}
