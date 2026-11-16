import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ii } from '@/api/ii';
import { PageHeader, Card, Btn, Field, Input, Select, Textarea, State, ErrorNote, useErr, C } from '@/components/ii/ui';

const DRAFT_KEY = 'ii-new-observation-draft';
const STEPS = ['Observation context', 'Learning context', 'Classroom context', 'Recording & evidence', 'Authorization', 'Begin'];
const PURPOSES = ['walkthrough', 'formal_observation', 'coaching_cycle', 'peer_observation', 'follow_up'];
const DURATIONS = [['walkthrough_12_15', '12–15 min walkthrough'], ['observation_20_30', '20–30 min observation'], ['full_lesson_45_90', 'Full lesson (45–90 min)'], ['other', 'Other']];
const MODES = [['live_audio', 'Live audio recording'], ['audio_upload', 'Existing audio file'], ['video_upload', 'Existing video file'], ['manual_notes', 'Manual notes only']];

export default function IINewObservation() {
  const { me } = useOutletContext(); const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState(() => { try { return { ...blank(me), ...(JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') || {}) }; } catch { return blank(me); } });
  const [err, run] = useErr(); const [busy, setBusy] = useState(false);
  useEffect(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(f)); } catch { /* ignore */ } }, [f]);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e }));
  const toggleMode = (m) => setF((s) => ({ ...s, evidence_modes: s.evidence_modes.includes(m) ? s.evidence_modes.filter((x) => x !== m) : [...s.evidence_modes, m] }));
  const school = me.schools.find((s) => s.id === f.school_id);
  const requiresAuth = school?.recording_policy?.requires_authorization !== false;
  const recordsMedia = f.evidence_modes.some((m) => m !== 'manual_notes');

  const validate = () => {
    if (step === 0) return f.school_id && f.teacher_email && f.purpose ? null : 'School, teacher email and purpose are required.';
    if (step === 3) return f.evidence_modes.length ? null : 'Choose at least one evidence source.';
    if (step === 4 && recordsMedia && requiresAuth) return f.authorization_confirmed && f.consent_basis ? null : 'Recording authorization must be confirmed before media can be captured.';
    return null;
  };
  const [stepErr, setStepErr] = useState(null);
  const next = () => { const e = validate(); setStepErr(e); if (!e) setStep((s) => Math.min(STEPS.length - 1, s + 1)); };

  const begin = async () => {
    setBusy(true);
    try {
      await run(async () => {
        const obs = await ii.createObservation({ ...f, students_enrolled: num(f.students_enrolled), students_present: num(f.students_present), seating_codes: f.seating_codes_text.split(/[,\s]+/).filter(Boolean) });
        if (recordsMedia && requiresAuth) await ii.authorize(obs.id, { consent_basis: f.consent_basis, notes: f.authorization_notes, permitted_processing: ['transcription', 'analysis'] });
        else await ii.updateObservation(obs.id, { status: 'setup' });
        localStorage.removeItem(DRAFT_KEY);
        nav(f.evidence_modes.includes('live_audio') ? `/ii/observations/${obs.id}/record` : f.evidence_modes.some((m) => m.endsWith('_upload')) ? `/ii/upload?observation=${obs.id}` : `/ii/observations/${obs.id}`);
      });
    } catch { /* shown */ } finally { setBusy(false); }
  };

  return (
    <>
      <PageHeader title="New Classroom Observation" subtitle="A short guided setup. Your draft is saved on this device as you go." crumbs={[{ label: 'Instructional Intelligence', to: '/ii' }, { label: 'Observations', to: '/ii/observations' }, { label: 'New' }]} />
      <ol className="flex flex-wrap gap-2 mb-5 text-xs" aria-label="Setup steps">{STEPS.map((s, i) => <li key={s} aria-current={i === step ? 'step' : undefined} className="px-2.5 py-1 rounded-full font-semibold" style={i === step ? { background: C.navy, color: '#fff' } : i < step ? { background: C.mist, color: C.navy } : { background: '#fff', color: C.slate, border: `1px solid ${C.mist}` }}>{i + 1}. {s}</li>)}</ol>
      <Card>
        {step === 0 && (<div className="grid md:grid-cols-2 gap-4">
          <Field label="School" required><Select value={f.school_id} onChange={set('school_id')}><option value="">Select…</option>{me.schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></Field>
          <Field label="Observation purpose" required><Select value={f.purpose} onChange={set('purpose')}><option value="">Select…</option>{PURPOSES.map((p) => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)}</Select></Field>
          <Field label="Teacher email" required hint="The teacher's account email. They see nothing until you share the observation."><Input type="email" value={f.teacher_email} onChange={set('teacher_email')} /></Field>
          <Field label="Teacher name"><Input value={f.teacher_name} onChange={set('teacher_name')} /></Field>
          <Field label="Grade"><Input value={f.grade} onChange={set('grade')} placeholder="K, 1 … 12" /></Field>
          <Field label="Subject"><Input value={f.subject} onChange={set('subject')} /></Field>
          <Field label="Date"><Input type="date" value={f.date} onChange={set('date')} /></Field>
          <Field label="Planned duration"><Select value={f.duration_type} onChange={set('duration_type')}>{DURATIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
        </div>)}
        {step === 1 && (<div className="grid md:grid-cols-2 gap-4">
          <Field label="Standard" hint="e.g. 7.RP.A.2 or a state standard code"><Input value={f.standard} onChange={set('standard')} /></Field>
          <Field label="Lesson type"><Select value={f.lesson_type} onChange={set('lesson_type')}><option value="">Select…</option>{['new_learning', 'practice', 'review', 'assessment', 'project', 'discussion', 'lab'].map((v) => <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>)}</Select></Field>
          <div className="md:col-span-2"><Field label="Learning objective"><Textarea rows={2} value={f.objective} onChange={set('objective')} /></Field></div>
          <div className="md:col-span-2"><Field label="Success criteria" hint="What students will say, write or do if they have learned it"><Textarea rows={2} value={f.success_criteria} onChange={set('success_criteria')} /></Field></div>
          <Field label="Instructional phase"><Select value={f.instructional_phase} onChange={set('instructional_phase')}><option value="">Select…</option>{['launch', 'explicit_modeling', 'guided_practice', 'collaborative', 'independent_practice', 'discussion', 'closure', 'mixed'].map((v) => <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>)}</Select></Field>
        </div>)}
        {step === 2 && (<div className="grid md:grid-cols-2 gap-4">
          <Field label="Students enrolled"><Input type="number" min="0" value={f.students_enrolled} onChange={set('students_enrolled')} /></Field>
          <Field label="Students present"><Input type="number" min="0" value={f.students_present} onChange={set('students_present')} /></Field>
          <div className="md:col-span-2"><Field label="Anonymous seating codes (optional)" hint="Non-identifying codes such as A1, A2, B1 — never names"><Input value={f.seating_codes_text} onChange={set('seating_codes_text')} placeholder="A1, A2, A3, B1 …" /></Field></div>
        </div>)}
        {step === 3 && (<div>
          <p className="text-sm mb-3" style={{ color: C.slate }}>Choose how evidence will be captured. You can combine sources.</p>
          <div className="grid md:grid-cols-2 gap-2">{MODES.map(([v, l]) => (<label key={v} className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer" style={{ borderColor: f.evidence_modes.includes(v) ? C.harbor : C.mist, background: f.evidence_modes.includes(v) ? '#eef4fc' : '#fff' }}><input type="checkbox" checked={f.evidence_modes.includes(v)} onChange={() => toggleMode(v)} /><span className="text-sm font-semibold" style={{ color: C.navy }}>{l}</span></label>))}</div>
          {f.evidence_modes.includes('live_audio') && <State className="mt-4" kind="warning" title="Device check before recording" detail="Live recording runs in this browser tab. Keep the tab in the foreground; locking the screen or switching apps on a phone can stop capture. Audio is saved in 10-second pieces to this device and uploaded as you go, so an interruption loses at most a few seconds." />}
          <p className="text-[11px] mt-3" style={{ color: C.slate }}>Audio-only evidence cannot establish visual on-task behaviour; engagement domains that need visual evidence will be reported as insufficient.</p>
        </div>)}
        {step === 4 && (<div className="space-y-4">
          {!recordsMedia ? <State kind="success" title="No recording planned" detail="Manual notes do not require recording authorization." /> : !requiresAuth ? <State kind="success" title="This school does not require per-observation authorization" /> : (<>
            <State kind="warning" title="Recording authorization is required" detail="Confirm the school-approved basis for recording this classroom. Without it, recording is blocked." />
            <Field label="Consent / authorization basis" required><Select value={f.consent_basis} onChange={set('consent_basis')}><option value="">Select…</option>{(school?.recording_policy?.consent_basis_options || ['district_policy', 'school_policy', 'teacher_consent', 'parent_notice']).map((o) => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}</Select></Field>
            <Field label="Notes (optional)" hint="e.g. reference to the signed district recording policy or teacher consent date"><Textarea rows={2} value={f.authorization_notes} onChange={set('authorization_notes')} /></Field>
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={f.authorization_confirmed} onChange={set('authorization_confirmed')} className="mt-1" /><span>I confirm this recording is authorized under the selected basis, that processing is limited to transcription and instructional analysis, and that student identities will not be recorded (anonymous labels only).</span></label>
          </>)}
        </div>)}
        {step === 5 && (<div className="space-y-3 text-sm">
          <h3 className="font-bold" style={{ color: C.navy }}>Ready to begin</h3>
          <dl className="grid md:grid-cols-2 gap-x-6 gap-y-1">
            {[['School', school?.name], ['Teacher', f.teacher_name || f.teacher_email], ['Grade / Subject', `${f.grade || '–'} / ${f.subject || '–'}`], ['Purpose', f.purpose], ['Duration', DURATIONS.find((d) => d[0] === f.duration_type)?.[1]], ['Standard', f.standard || '–'], ['Students present', f.students_present || '–'], ['Evidence', f.evidence_modes.map((m) => MODES.find((x) => x[0] === m)?.[1]).join(', ')], ['Authorization', recordsMedia ? (requiresAuth ? f.consent_basis : 'not required') : 'n/a']].map(([k, v]) => <div key={k}><dt className="text-[11px] uppercase tracking-wide" style={{ color: C.slate }}>{k}</dt><dd className="font-semibold" style={{ color: C.navy }}>{v || '–'}</dd></div>)}
          </dl>
          <ErrorNote error={err} />
        </div>)}
        {stepErr && <p role="alert" className="text-sm text-red-700 mt-3">{stepErr}</p>}
        <div className="flex justify-between mt-6">
          <div className="flex gap-2"><Btn variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Btn><Btn variant="ghost" onClick={() => { localStorage.removeItem(DRAFT_KEY); setF(blank(me)); setStep(0); }}>Clear draft</Btn></div>
          {step < STEPS.length - 1 ? <Btn onClick={next}>Continue</Btn> : <Btn size="lg" onClick={begin} disabled={busy}>{busy ? 'Creating…' : f.evidence_modes.includes('live_audio') ? 'Begin & open recorder' : 'Create observation'}</Btn>}
        </div>
      </Card>
    </>
  );
}
const num = (v) => (v === '' || v === undefined ? undefined : Number(v));
const blank = (me) => ({ school_id: me?.schools?.length === 1 ? me.schools[0].id : '', teacher_email: '', teacher_name: '', grade: '', subject: '', date: new Date().toISOString().slice(0, 10), purpose: '', duration_type: 'observation_20_30', standard: '', objective: '', success_criteria: '', lesson_type: '', instructional_phase: '', students_enrolled: '', students_present: '', seating_codes_text: '', evidence_modes: ['live_audio'], consent_basis: '', authorization_notes: '', authorization_confirmed: false });
