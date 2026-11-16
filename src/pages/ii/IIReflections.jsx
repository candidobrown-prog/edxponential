import React, { useEffect, useState } from 'react';
import { Link, useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ii } from '@/api/ii';
import { PageHeader, Card, Btn, State, Pill, Textarea, Input, Field, Select, C, useErr, ErrorNote } from '@/components/ii/ui';

export function IIReflectionList() {
  const { me } = useOutletContext(); const nav = useNavigate(); const [err, run] = useErr();
  const { data = [], isLoading } = useQuery({ queryKey: ['ii-reflections'], queryFn: ii.reflections });
  const [school, setSchool] = useState(me.schools?.[0]?.id || '');
  return (<>
    <PageHeader title="Teacher Reflection" subtitle="A private, guided 20–30 minute reflection. Only you decide whether and with whom to share it." crumbs={[{ label: 'Instructional Intelligence', to: '/ii' }, { label: 'Reflection' }]}
      actions={me.capabilities.teacher && <div className="flex gap-2 items-end">{me.schools.length > 1 && <Select className="h-10 w-48" value={school} onChange={(e) => setSchool(e.target.value)}>{me.schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>}<Btn onClick={() => run(async () => { const r = await ii.createReflection({ school_id: school }); nav(`/ii/reflections/${r.id}`); })}>Start a reflection</Btn></div>} />
    <ErrorNote error={err} />
    {isLoading ? <State kind="loading" title="Loading…" /> : data.length === 0 ? <State kind="empty" title="No reflections yet" detail={me.capabilities.teacher ? 'You can reflect on any lesson, with or without a recorded observation.' : 'Reflections appear here when a teacher shares one with you.'} /> : (
      <Card><ul className="divide-y" style={{ borderColor: C.mist }}>{data.map((r) => <li key={r.id} className="py-2.5 flex items-center justify-between"><div><Link to={`/ii/reflections/${r.id}`} className="font-semibold text-sm hover:underline" style={{ color: C.navy }}>{r.is_owner ? 'My reflection' : `Shared by ${r.teacher_email}`} · {new Date(r.created_date).toLocaleDateString()}</Link><p className="text-[11px]" style={{ color: C.slate }}>{r.observation_id ? 'Linked to an observation' : 'Standalone'} · {Object.keys(r.answers || {}).length}/8 areas</p></div><div className="flex gap-2"><Pill tone={r.status === 'complete' ? 'good' : 'neutral'}>{r.status}</Pill>{r.is_owner && <Pill tone={(r.shared_with || []).length ? 'info' : 'neutral'}>{(r.shared_with || []).length ? `shared with ${(r.shared_with || []).length}` : 'private'}</Pill>}</div></li>)}</ul></Card>
    )}
  </>);
}

export default function IIReflection() {
  const { id } = useParams(); const qc = useQueryClient(); const [err, run] = useErr();
  const { data: r, isLoading, error } = useQuery({ queryKey: ['ii-reflection', id], queryFn: () => ii.reflection(id) });
  const [i, setI] = useState(0); const [answer, setAnswer] = useState(''); const [follow, setFollow] = useState(''); const [busy, setBusy] = useState(null); const [shareEmail, setShareEmail] = useState(''); const [dictating, setDictating] = useState(false);
  const area = r?.areas?.[i];
  useEffect(() => { if (area) { setAnswer(r.answers?.[area.key]?.response || ''); setFollow(r.answers?.[area.key]?.follow_up_response || ''); } }, [area, r]);
  if (isLoading) return <State kind="loading" title="Loading reflection…" />;
  if (error) return <State kind={error.status === 403 ? 'denied' : 'error'} title={error.status === 403 ? 'This reflection is private' : 'Could not load'} detail={error.status === 403 ? 'Only the teacher, and people they have shared it with, can read it.' : error.message} />;
  const owner = r.is_owner; const total = r.areas.length; const done = r.areas.filter((a) => r.answers?.[a.key]?.response).length; const minutesLeft = Math.max(0, Math.round((total - done) * (r.estimated_minutes || 25) / total));
  const act = async (name, fn) => { setBusy(name); try { await run(fn); qc.invalidateQueries(['ii-reflection', id]); } catch { /* shown */ } finally { setBusy(null); } };
  const save = (extra = {}) => act('save', () => ii.saveReflection(id, { answers: { [area.key]: { response: answer, follow_up_response: follow } }, ...extra }));
  const askFollowUp = () => act('fu', () => ii.reflectionFollowUp(id, { area: area.key, answer }));
  const dictate = () => { const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return alert('Voice dictation is not available in this browser.'); const rec = new SR(); rec.continuous = true; rec.interimResults = false; rec.onresult = (e) => setAnswer((a) => (a + ' ' + Array.from(e.results).slice(e.resultIndex).map((x) => x[0].transcript).join(' ')).trim()); rec.onend = () => setDictating(false); rec.start(); setDictating(true); window.__iiDictation = rec; };

  return (<>
    <PageHeader title="Teacher Reflection" subtitle={owner ? 'Private to you until you share it. Specific evidence (what students said, wrote, how many) makes this useful.' : `Shared with you by ${r.teacher_email}. Read-only.`} crumbs={[{ label: 'Instructional Intelligence', to: '/ii' }, { label: 'Reflection', to: '/ii/reflections' }, { label: 'Reflection' }]} />
    <ErrorNote error={err} />
    <div className="grid lg:grid-cols-[1fr_280px] gap-5">
      <Card>
        <div className="flex items-center justify-between text-xs mb-3" style={{ color: C.slate }}><span>Question {i + 1} of {total} · {done}/{total} answered</span><span>≈ {minutesLeft} min remaining</span></div>
        <div className="h-1.5 rounded-full mb-5" style={{ background: C.mist }}><div className="h-full rounded-full" style={{ width: `${done / total * 100}%`, background: C.harbor }} /></div>
        <h2 className="text-lg font-bold" style={{ color: C.navy }}>{area.title}</h2>
        <p className="text-sm mt-1 mb-3">{area.question}</p>
        {r.observation_id && <p className="text-[11px] mb-2" style={{ color: C.slate }}>Evidence from the observation can be opened in another tab: <Link to={`/ii/observations/${r.observation_id}`} className="underline">observation</Link>. The transcript never overrides your account; where they differ, both are shown and you can respond.</p>}
        {owner ? <>
          <Textarea rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} aria-label={`Response: ${area.title}`} />
          <div className="flex flex-wrap gap-2 mt-2"><Btn size="sm" variant="secondary" onClick={dictating ? () => { window.__iiDictation?.stop(); setDictating(false); } : dictate}>{dictating ? 'Stop dictation' : 'Voice dictation'}</Btn><Btn size="sm" variant="secondary" onClick={askFollowUp} disabled={!answer.trim() || busy === 'fu'}>{busy === 'fu' ? 'Thinking…' : 'Ask me a follow-up'}</Btn></div>
          {r.answers?.[area.key]?.follow_up && <div className="mt-4 rounded-lg p-3" style={{ background: '#eef4fc' }}><p className="text-sm font-semibold" style={{ color: C.harbor }}>Follow-up: {r.answers[area.key].follow_up}</p><Textarea rows={3} className="mt-2" value={follow} onChange={(e) => setFollow(e.target.value)} aria-label="Follow-up response" /></div>}
          {!r.areas.length ? null : (!r.answers?.[area.key]?.follow_up && !window.__iiAI && null)}
          <div className="flex flex-wrap justify-between gap-2 mt-5"><div className="flex gap-2"><Btn variant="ghost" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0}>Back</Btn><Btn variant="secondary" onClick={() => save()} disabled={busy === 'save'}>Save draft</Btn></div><div className="flex gap-2">{i < total - 1 ? <Btn onClick={async () => { await save(); setI(i + 1); }} disabled={busy === 'save'}>Save & continue</Btn> : <Btn variant="accent" onClick={() => save({ status: 'complete' })} disabled={busy === 'save'}>Review & complete</Btn>}</div></div>
        </> : <div className="rounded-lg p-3 text-sm" style={{ background: C.paper }}><p>{r.answers?.[area.key]?.response || <em style={{ color: C.slate }}>No response.</em>}</p>{r.answers?.[area.key]?.follow_up && <p className="mt-2 text-xs"><strong>Follow-up:</strong> {r.answers[area.key].follow_up}<br /><strong>Response:</strong> {r.answers[area.key].follow_up_response || '–'}</p>}<div className="flex gap-2 mt-3"><Btn size="sm" variant="ghost" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0}>Back</Btn><Btn size="sm" variant="secondary" onClick={() => setI((x) => Math.min(total - 1, x + 1))} disabled={i === total - 1}>Next</Btn></div></div>}
      </Card>
      <div className="space-y-4">
        <Card title="Areas"><ol className="text-sm space-y-1">{r.areas.map((a, idx) => <li key={a.key}><button onClick={() => setI(idx)} className="text-left hover:underline" style={{ color: idx === i ? C.harbor : C.navy }}>{r.answers?.[a.key]?.response ? '✓ ' : '○ '}{a.title}</button></li>)}</ol></Card>
        <Card title="Sharing"><p className="text-xs mb-2" style={{ color: C.slate }}>Status: <Pill tone={r.status === 'complete' ? 'good' : 'neutral'}>{r.status}</Pill></p>
          {owner ? <><p className="text-xs mb-2">Shared with: {(r.shared_with || []).length ? r.shared_with.map((e) => <span key={e} className="inline-flex items-center gap-1 mr-2">{e}<button className="underline" onClick={() => act('rv', () => ii.revokeReflection(id, { email: e }))} aria-label={`Revoke ${e}`}>revoke</button></span>) : <em>no one</em>}</p><Field label="Share with (email)"><Input type="email" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} /></Field><Btn size="sm" className="mt-2" onClick={() => act('sh', async () => { await ii.shareReflection(id, { emails: [shareEmail] }); setShareEmail(''); })} disabled={!shareEmail}>Share</Btn><p className="text-[11px] mt-2" style={{ color: C.slate }}>Self-report is never scored as observed performance. You can revoke sharing at any time.</p></> : <p className="text-xs">Shared with you. You cannot edit or re-share it.</p>}
        </Card>
      </div>
    </div>
  </>);
}
