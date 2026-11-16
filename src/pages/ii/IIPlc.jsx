import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ii } from '@/api/ii';
import { PageHeader, Card, Btn, State, Pill, Input, Textarea, Field, Select, C, useErr, ErrorNote } from '@/components/ii/ui';

export default function IIPlc() {
  const { me } = useOutletContext(); const qc = useQueryClient(); const [err, run] = useErr();
  const { data = [], isLoading } = useQuery({ queryKey: ['ii-plc'], queryFn: ii.plc });
  const [n, setN] = useState({ school_id: me.schools?.[0]?.id || '', title: '', standard: '', participants: '' }); const [edit, setEdit] = useState({});
  const canCreate = me.memberships.some((m) => ['plc_facilitator', 'coach', 'principal'].includes(m.role));
  const refresh = () => qc.invalidateQueries(['ii-plc']);
  return (<>
    <PageHeader title="PLC Collaboration" subtitle="Deidentified evidence, competing hypotheses, a shared instructional response and a reassessment date. PLC evidence is never used to rank teachers." crumbs={[{ label: 'Instructional Intelligence', to: '/ii' }, { label: 'PLC' }]} />
    <ErrorNote error={err} />
    {canCreate && <Card className="mb-4" title="New PLC session"><div className="grid md:grid-cols-4 gap-2 items-end">{me.schools.length > 1 && <Field label="School"><Select value={n.school_id} onChange={(e) => setN({ ...n, school_id: e.target.value })}>{me.schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></Field>}<Field label="Title"><Input value={n.title} onChange={(e) => setN({ ...n, title: e.target.value })} /></Field><Field label="Common standard"><Input value={n.standard} onChange={(e) => setN({ ...n, standard: e.target.value })} /></Field><Field label="Participants (emails, comma-separated)"><Input value={n.participants} onChange={(e) => setN({ ...n, participants: e.target.value })} /></Field><Btn onClick={() => run(async () => { await ii.createPlc({ ...n, participants: n.participants.split(/[,\s]+/).filter(Boolean) }); setN({ ...n, title: '', standard: '', participants: '' }); refresh(); })} disabled={!n.title || !n.school_id}>Create</Btn></div></Card>}
    {isLoading ? <State kind="loading" title="Loading…" /> : data.length === 0 ? <State kind="empty" title="No PLC sessions" /> : data.map((p) => { const e = edit[p.id] || { hypotheses: (p.hypotheses || []).join('\n'), responses: (p.responses || []).join('\n'), notes: p.notes || '', reassessment_date: p.reassessment_date || '' }; const canEdit = p.facilitator_email === me.user.email.toLowerCase() || me.memberships.some((m) => m.role === 'plc_facilitator' && m.school_id === p.school_id); return (
      <Card key={p.id} className="mb-4" title={`${p.title} · ${p.standard || 'no standard'}`} right={<Pill tone={p.status === 'open' ? 'info' : 'neutral'}>{p.status}</Pill>}>
        <p className="text-xs mb-3" style={{ color: C.slate }}>Facilitator {p.facilitator_email} · {(p.participants || []).length} participant(s)</p>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Shared misconceptions & competing instructional hypotheses (one per line, no student names)"><Textarea rows={5} value={e.hypotheses} onChange={(ev) => setEdit({ ...edit, [p.id]: { ...e, hypotheses: ev.target.value } })} disabled={!canEdit} /></Field>
          <Field label="Selected instructional responses & differentiated support (one per line)"><Textarea rows={5} value={e.responses} onChange={(ev) => setEdit({ ...edit, [p.id]: { ...e, responses: ev.target.value } })} disabled={!canEdit} /></Field>
          <Field label="Notes / subsequent learning evidence"><Textarea rows={3} value={e.notes} onChange={(ev) => setEdit({ ...edit, [p.id]: { ...e, notes: ev.target.value } })} disabled={!canEdit} /></Field>
          <Field label="Reassessment date"><Input type="date" value={e.reassessment_date} onChange={(ev) => setEdit({ ...edit, [p.id]: { ...e, reassessment_date: ev.target.value } })} disabled={!canEdit} /></Field>
        </div>
        {canEdit && <div className="flex gap-2 mt-3"><Btn size="sm" onClick={() => run(async () => { await ii.savePlc(p.id, { hypotheses: e.hypotheses.split('\n').filter(Boolean), responses: e.responses.split('\n').filter(Boolean), notes: e.notes, reassessment_date: e.reassessment_date }); refresh(); })}>Save</Btn>{p.status === 'open' && <Btn size="sm" variant="ghost" onClick={() => run(async () => { await ii.savePlc(p.id, { status: 'closed' }); refresh(); })}>Close session</Btn>}</div>}
      </Card>); })}
  </>);
}
