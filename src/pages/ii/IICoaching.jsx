import React, { useEffect, useState } from 'react';
import { Link, useParams, useOutletContext } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ii, fmtTime } from '@/api/ii';
import { PageHeader, Card, Btn, State, Pill, Textarea, Input, Field, C, useErr, ErrorNote } from '@/components/ii/ui';

export function IICoachingList() {
  const { data = [], isLoading } = useQuery({ queryKey: ['ii-coaching'], queryFn: () => ii.coachingList() });
  return (<>
    <PageHeader title="Coaching Conferences" subtitle="Evidence on the left, decisions on the right. Both people acknowledge the commitments; disagreement is recorded, not erased." crumbs={[{ label: 'Instructional Intelligence', to: '/ii' }, { label: 'Coaching' }]} />
    {isLoading ? <State kind="loading" title="Loading…" /> : data.length === 0 ? <State kind="empty" title="No coaching conferences" detail="Start one from an analysed observation (Next Steps → Open coaching conference)." /> : <Card><ul className="divide-y" style={{ borderColor: C.mist }}>{data.map((c) => <li key={c.id} className="py-2.5 flex justify-between items-center"><div><Link to={`/ii/coaching/${c.id}`} className="font-semibold text-sm hover:underline" style={{ color: C.navy }}>{c.teacher_email} · coach {c.coach_email}</Link><p className="text-[11px]" style={{ color: C.slate }}>{(c.commitments || []).length} commitment(s) · follow-up {c.follow_up_date || 'not set'}</p></div><Pill tone={c.status === 'agreed' ? 'good' : 'neutral'}>{c.status}</Pill></li>)}</ul></Card>}
  </>);
}

export default function IICoachingSession() {
  const { id } = useParams(); const { me } = useOutletContext(); const qc = useQueryClient(); const [err, run] = useErr(); const [busy, setBusy] = useState(null);
  const { data: c, isLoading, error } = useQuery({ queryKey: ['ii-coaching', id], queryFn: () => ii.coaching(id) });
  const { data: obs } = useQuery({ queryKey: ['ii-observation', c?.observation_id], queryFn: () => ii.observation(c.observation_id), enabled: !!c?.observation_id });
  const { data: refl = [] } = useQuery({ queryKey: ['ii-reflections'], queryFn: ii.reflections });
  const [form, setForm] = useState(null); const [ackNote, setAckNote] = useState('');
  useEffect(() => { if (c && !form) setForm({ notes: c.notes || '', priorities: c.priorities?.length ? c.priorities : ['', '', ''], commitments: c.commitments?.length ? c.commitments : [{ text: '', owner: c.teacher_email, date: '' }], support_needed: c.support_needed || '', follow_up_date: c.follow_up_date || '' }); }, [c, form]);
  if (isLoading || !form) return <State kind="loading" title="Loading conference…" />;
  if (error) return <State kind={error.status === 403 ? 'denied' : 'error'} title={error.status === 403 ? 'Not authorized' : 'Could not load'} detail={error.message} />;
  const me_ = me.user.email.toLowerCase(); const isCoach = c.coach_email === me_; const isTeacher = c.teacher_email === me_; const a = obs?.analysis;
  const act = async (name, fn) => { setBusy(name); try { await run(fn); qc.invalidateQueries(['ii-coaching', id]); } catch { /* shown */ } finally { setBusy(null); } };
  const save = () => act('save', () => ii.saveCoaching(id, { ...form, priorities: form.priorities.filter(Boolean).slice(0, 3), commitments: form.commitments.filter((x) => x.text) }));
  const sharedReflection = refl.find((r) => r.observation_id === c.observation_id && r.teacher_email === c.teacher_email && (r.is_owner || (r.shared_with || []).includes(me_)));
  const createPlan = () => act('plan', async () => { const items = form.priorities.filter(Boolean).map((t, i) => ({ id: `a${i + 1}`, title: t, implementation_owner: c.teacher_email, implementation_date: form.commitments[i]?.date || form.follow_up_date || '', recommended_adult_behavior: form.commitments[i]?.text || '', success_criterion: a?.priorities?.[i]?.success_criterion || '', reassessment: a?.priorities?.[i]?.reassessment || '', evidence: a?.priorities?.[i]?.evidence_quote || '' })); const p = await ii.createActionPlan({ coaching_session_id: id, items }); window.location.assign(`/ii/action-plans#${p.id}`); });

  return (<>
    <PageHeader title="Coaching Conference" subtitle={`${c.teacher_email} with ${c.coach_email}${c.scheduled_at ? ` · ${c.scheduled_at}` : ''}`} crumbs={[{ label: 'Instructional Intelligence', to: '/ii' }, { label: 'Coaching', to: '/ii/coaching' }, { label: 'Conference' }]} actions={<><Pill tone={c.status === 'agreed' ? 'good' : 'neutral'}>{c.status}</Pill>{c.observation_id && <Btn size="sm" variant="secondary" as={Link} to={`/ii/observations/${c.observation_id}`}>Observation</Btn>}</>} />
    <ErrorNote error={err} />
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="space-y-4">
        <Card title="Observation evidence">{!obs ? <State kind={obs === undefined ? 'loading' : 'denied'} title={obs === undefined ? 'Loading evidence…' : 'Observation not visible to you'} /> : !a ? <State kind="empty" title="No analysis yet" /> : (<div className="space-y-3 text-sm"><div className="flex flex-wrap gap-2"><Pill>student talk {a.talk_time?.student_pct ?? '–'}%</Pill><Pill>{a.questions.length} questions</Pill><Pill>CFU {a.cfu_result?.status}</Pill><Pill>mastery risk {a.mastery_risk?.risk}</Pill></div>
          <div><h4 className="font-bold text-xs uppercase" style={{ color: C.slate }}>Priorities from analysis</h4>{a.priorities.length === 0 ? <p className="text-xs">None generated.</p> : a.priorities.map((p) => <div key={p.id} className="border-l-2 pl-2 my-2" style={{ borderColor: C.yellow }}><p className="font-semibold">{p.title}</p><p className="text-xs">“{p.evidence_quote}” <span className="font-mono">{fmtTime(p.timestamp)}</span></p><p className="text-xs" style={{ color: C.slate }}>{p.recommended_adult_behavior}</p></div>)}</div>
          <div><h4 className="font-bold text-xs uppercase" style={{ color: C.slate }}>CFU-100 findings</h4><ul className="text-xs grid grid-cols-2 gap-x-3">{(a.cfu_result?.rows || []).map((r) => <li key={r.key}>{r.label}: <strong>{r.level.replace(/_/g, ' ')}</strong></li>)}</ul></div>
          <div><h4 className="font-bold text-xs uppercase" style={{ color: C.slate }}>Student responses ({a.responses.length})</h4>{a.responses.slice(0, 6).map((r) => <p key={r.id} className="text-xs">“{r.response}” — {r.speaker_label || 'student'}, {r.correctness.replace('_', ' ')}</p>)}</div>
          <div><h4 className="font-bold text-xs uppercase" style={{ color: C.slate }}>Misconceptions</h4>{a.misconceptions.slice(0, 4).map((m) => <p key={m.id} className="text-xs">{m.hypothesis} <em>({m.confidence})</em></p>)}</div></div>)}</Card>
      </div>
      <div className="space-y-4">
        <Card title="Teacher reflection">{sharedReflection ? <p className="text-sm">A reflection {sharedReflection.is_owner ? 'by you' : 'shared with you'} exists: <Link to={`/ii/reflections/${sharedReflection.id}`} className="underline">open</Link>.</p> : <p className="text-sm" style={{ color: C.slate }}>{isTeacher ? 'You have not shared a reflection for this lesson.' : 'The teacher has not shared a reflection. It stays private unless they choose to share it.'}</p>}</Card>
        <Card title="Coaching notes & decisions">
          <div className="space-y-3">
            <Field label="Notes"><Textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} disabled={!isCoach} /></Field>
            <div><p className="text-xs font-semibold mb-1" style={{ color: C.navy }}>Priority decisions (max 3)</p>{form.priorities.map((p, i) => <Input key={i} className="mb-1" value={p} onChange={(e) => { const n = [...form.priorities]; n[i] = e.target.value; setForm({ ...form, priorities: n }); }} placeholder={`Priority ${i + 1}`} disabled={!isCoach} aria-label={`Priority ${i + 1}`} />)}</div>
            <div><p className="text-xs font-semibold mb-1" style={{ color: C.navy }}>Action commitments</p>{form.commitments.map((cm, i) => <div key={i} className="grid grid-cols-[1fr_140px_120px] gap-1 mb-1"><Input value={cm.text} onChange={(e) => { const n = [...form.commitments]; n[i] = { ...cm, text: e.target.value }; setForm({ ...form, commitments: n }); }} placeholder="Specific adult behaviour" disabled={!isCoach} aria-label={`Commitment ${i + 1}`} /><Input value={cm.owner} onChange={(e) => { const n = [...form.commitments]; n[i] = { ...cm, owner: e.target.value }; setForm({ ...form, commitments: n }); }} placeholder="owner" disabled={!isCoach} aria-label="Owner" /><Input type="date" value={cm.date} onChange={(e) => { const n = [...form.commitments]; n[i] = { ...cm, date: e.target.value }; setForm({ ...form, commitments: n }); }} disabled={!isCoach} aria-label="Date" /></div>)}{isCoach && <Btn size="sm" variant="ghost" onClick={() => setForm({ ...form, commitments: [...form.commitments, { text: '', owner: c.teacher_email, date: '' }] })}>+ commitment</Btn>}</div>
            <Field label="Support needed"><Input value={form.support_needed} onChange={(e) => setForm({ ...form, support_needed: e.target.value })} disabled={!isCoach} /></Field>
            <Field label="Follow-up date"><Input type="date" value={form.follow_up_date} onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} disabled={!isCoach} /></Field>
            {isCoach && <div className="flex gap-2"><Btn onClick={save} disabled={busy === 'save'}>Save</Btn><Btn variant="secondary" onClick={createPlan} disabled={busy === 'plan' || !form.priorities.some(Boolean)}>Create action plan</Btn></div>}
          </div>
        </Card>
        <Card title="Agreed-action summary & acknowledgment">
          <ul className="text-sm list-disc ml-5 mb-3">{(c.commitments || []).map((cm, i) => <li key={i}>{cm.text} — <em>{cm.owner}</em>{cm.date ? `, by ${cm.date}` : ''}</li>)}{(c.commitments || []).length === 0 && <li style={{ color: C.slate }}>No commitments saved yet.</li>}</ul>
          <div className="grid grid-cols-2 gap-3 text-xs">{['coach', 'teacher'].map((role) => <div key={role} className="rounded-lg p-2" style={{ background: C.paper }}><p className="font-semibold capitalize">{role}</p>{c.acknowledgments?.[role] ? <p>{c.acknowledgments[role].agree ? 'Acknowledged' : 'Acknowledged with disagreement'} · {new Date(c.acknowledgments[role].at).toLocaleDateString()}{c.acknowledgments[role].note && <><br /><em>{c.acknowledgments[role].note}</em></>}</p> : <p style={{ color: C.slate }}>Pending</p>}</div>)}</div>
          {c.disagreement_note && <p className="text-xs mt-2" style={{ color: '#92400e' }}>Documented disagreement: {c.disagreement_note}</p>}
          {(isCoach || isTeacher) && !c.acknowledgments?.[isCoach ? 'coach' : 'teacher'] && (c.commitments || []).length > 0 && <div className="mt-3 space-y-2"><Input placeholder="Optional note (required if you disagree)" value={ackNote} onChange={(e) => setAckNote(e.target.value)} aria-label="Acknowledgment note" /><div className="flex gap-2"><Btn size="sm" onClick={() => act('ack', () => ii.acknowledge(id, { agree: true, note: ackNote }))}>I acknowledge these commitments</Btn><Btn size="sm" variant="secondary" onClick={() => act('ack', () => ii.acknowledge(id, { agree: false, note: ackNote }))} disabled={!ackNote}>Acknowledge with disagreement</Btn></div></div>}
        </Card>
      </div>
    </div>
  </>);
}
