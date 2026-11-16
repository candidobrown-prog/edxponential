import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Mic, Pause, Play, Square, Flag, HelpCircle, MessageCircle, AlertTriangle, RefreshCw, Users, StickyNote, Zap } from 'lucide-react';
import { ii, chunkStore, uploadChunk, fmtTime } from '@/api/ii';
import { PageHeader, Card, Btn, State, Textarea, C } from '@/components/ii/ui';

const MARKERS = [
  ['evidence', 'Evidence', Flag], ['teacher_question', 'Teacher question', HelpCircle], ['student_response', 'Student response', MessageCircle], ['misconception', 'Misconception', AlertTriangle],
  ['instructional_adjustment', 'Instructional adjustment', RefreshCw], ['engagement', 'Engagement evidence', Users], ['uncertain', 'Uncertain evidence', Zap],
];
const SLICE_MS = 10_000;

export default function IIRecord() {
  const { id } = useParams(); const nav = useNavigate(); const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['ii-observation', id], queryFn: () => ii.observation(id) });
  const [phase, setPhase] = useState('idle');         // idle | requesting | recording | paused | stopping | saving | saved | error
  const [elapsed, setElapsed] = useState(0); const [level, setLevel] = useState(0);
  const [assetId, setAssetId] = useState(null); const [uploaded, setUploaded] = useState(0); const [queued, setQueued] = useState(0); const [failedUploads, setFailedUploads] = useState(0);
  const [msg, setMsg] = useState(null); const [note, setNote] = useState(''); const [support, setSupport] = useState(null); const [pendingRecovery, setPendingRecovery] = useState([]);
  const rec = useRef(null); const stream = useRef(null); const chunkIndex = useRef(0); const startedAt = useRef(null); const pausedTotal = useRef(0); const pauseStart = useRef(null); const timer = useRef(null); const analyser = useRef(null); const raf = useRef(null); const uploadQueue = useRef(Promise.resolve()); const mimeRef = useRef('audio/webm');

  useEffect(() => {
    const ok = typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia && window.MediaRecorder;
    const mime = ok ? ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find((m) => MediaRecorder.isTypeSupported(m)) : null;
    mimeRef.current = mime || 'audio/webm';
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setSupport({ ok: !!(ok && mime), mime, ios, secure: window.isSecureContext });
    chunkStore.pending().then((p) => setPendingRecovery(p.filter((x) => x.assetId && x.assetId.startsWith(`${id}:`) === false)));
  }, [id]);

  // Keep the screen awake while recording when the browser allows it
  useEffect(() => { let lock; if (phase === 'recording' && navigator.wakeLock) navigator.wakeLock.request('screen').then((l) => (lock = l)).catch(() => {}); return () => lock?.release?.(); }, [phase]);
  useEffect(() => { const h = (e) => { if (phase === 'recording' || phase === 'paused') { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', h); return () => window.removeEventListener('beforeunload', h); }, [phase]);

  const tick = useCallback(() => { if (startedAt.current) setElapsed(Math.floor((Date.now() - startedAt.current - pausedTotal.current) / 1000)); }, []);
  const meter = useCallback(() => { if (!analyser.current) return; const buf = new Uint8Array(analyser.current.fftSize); analyser.current.getByteTimeDomainData(buf); let sum = 0; for (const v of buf) { const d = (v - 128) / 128; sum += d * d; } setLevel(Math.min(1, Math.sqrt(sum / buf.length) * 4)); raf.current = requestAnimationFrame(meter); }, []);

  const enqueueChunk = (aid, index, blob) => {
    setQueued((q) => q + 1);
    uploadQueue.current = uploadQueue.current.then(async () => {
      await chunkStore.put(aid, index, blob, { observationId: id });
      try { await uploadChunk(aid, index, blob); setUploaded((u) => u + 1); } catch (e) { setFailedUploads((f) => f + 1); setMsg({ kind: 'warning', title: 'A piece of audio could not be uploaded yet', detail: `${e.message}. It is kept on this device and will be retried when you stop.` }); }
      finally { setQueued((q) => q - 1); }
    });
  };

  const start = async () => {
    setMsg(null); setPhase('requesting');
    try {
      if (!data?.authorization_valid) throw new Error('Recording authorization is missing, expired or withdrawn. Record authorization first.');
      const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true } });
      stream.current = s;
      const { asset_id } = await ii.initMedia(id, { kind: 'audio', mime: mimeRef.current });
      setAssetId(asset_id); chunkIndex.current = 0; setUploaded(0); setFailedUploads(0);
      const ctx = new (window.AudioContext || window.webkitAudioContext)(); const src = ctx.createMediaStreamSource(s); analyser.current = ctx.createAnalyser(); analyser.current.fftSize = 1024; src.connect(analyser.current); raf.current = requestAnimationFrame(meter);
      const r = new MediaRecorder(s, { mimeType: mimeRef.current, audioBitsPerSecond: 64_000 }); rec.current = r;
      r.ondataavailable = (e) => { if (e.data && e.data.size > 0) enqueueChunk(asset_id, chunkIndex.current++, e.data); };
      r.onerror = (e) => setMsg({ kind: 'error', title: 'Recorder error', detail: String(e.error?.message || e.error || 'unknown') });
      s.getAudioTracks()[0].onended = () => { setMsg({ kind: 'error', title: 'Microphone disconnected', detail: 'Audio captured so far is preserved. Stop and save, then reconnect your microphone to continue in a new recording.' }); if (r.state !== 'inactive') r.stop(); setPhase('paused'); };
      r.start(SLICE_MS); startedAt.current = Date.now(); pausedTotal.current = 0; timer.current = setInterval(tick, 500); setPhase('recording');
    } catch (e) {
      stream.current?.getTracks().forEach((t) => t.stop()); setPhase('idle');
      const denied = /denied|NotAllowed|Permission/i.test(e.name + e.message);
      setMsg({ kind: 'error', title: denied ? 'Microphone permission denied' : 'Could not start recording', detail: denied ? 'Allow microphone access for this site in your browser settings, then press Record again. Your observation setup is unchanged.' : e.message });
    }
  };
  const pause = () => { if (rec.current?.state === 'recording') { rec.current.pause(); pauseStart.current = Date.now(); setPhase('paused'); } };
  const resume = () => { if (rec.current?.state === 'paused') { rec.current.resume(); pausedTotal.current += Date.now() - pauseStart.current; setPhase('recording'); } };
  const stop = async () => {
    setPhase('stopping'); clearInterval(timer.current); cancelAnimationFrame(raf.current);
    await new Promise((res) => { if (!rec.current || rec.current.state === 'inactive') return res(); rec.current.onstop = res; rec.current.stop(); });
    stream.current?.getTracks().forEach((t) => t.stop());
    setPhase('saving');
    await uploadQueue.current;
    // retry anything still on this device
    const local = await chunkStore.forAsset(assetId); const notUp = local.filter((c) => !c.uploaded);
    for (const c of notUp) { try { await uploadChunk(assetId, c.index, c.blob); setUploaded((u) => u + 1); } catch { /* reported below */ } }
    const expected = chunkIndex.current; const duration = Math.floor((Date.now() - startedAt.current - pausedTotal.current) / 1000);
    try {
      const fin = await ii.finalizeMedia(assetId, { expected_chunks: expected, duration_seconds: duration });
      await chunkStore.clear(assetId); setPhase('saved'); setMsg({ kind: 'success', title: 'Recording saved', detail: `${fmtTime(fin.duration_seconds)} · ${(fin.size_bytes / 1024 / 1024).toFixed(1)} MB verified (${fin.verified.chunk_count} pieces).` }); qc.invalidateQueries(['ii-observation', id]);
    } catch (e) { setPhase('error'); setMsg({ kind: 'error', title: 'Recording could not be verified as saved', detail: `${e.message}. The audio pieces are still stored on this device — use Retry upload. Do not treat this recording as saved.` }); }
  };
  const retryFinalize = async () => { setPhase('saving'); const local = await chunkStore.forAsset(assetId); for (const c of local.filter((x) => !x.uploaded)) { try { await uploadChunk(assetId, c.index, c.blob); } catch { /* keep */ } } try { const fin = await ii.finalizeMedia(assetId, { expected_chunks: chunkIndex.current, duration_seconds: elapsed }); await chunkStore.clear(assetId); setPhase('saved'); setMsg({ kind: 'success', title: 'Recording saved', detail: `${fmtTime(fin.duration_seconds)} verified.` }); qc.invalidateQueries(['ii-observation', id]); } catch (e) { setPhase('error'); setMsg({ kind: 'error', title: 'Still not saved', detail: e.message }); } };

  const addMarker = async (type) => { const t = elapsed; try { await ii.addMarker(id, { type, t }); setMsg({ kind: 'success', title: `${MARKERS.find((m) => m[0] === type)[1]} marked at ${fmtTime(t)}` }); qc.invalidateQueries(['ii-observation', id]); } catch (e) { setMsg({ kind: 'error', title: 'Marker not saved', detail: e.message }); } };
  const saveNote = async () => { if (!note.trim()) return; const t = elapsed; try { await ii.addNote(id, { text: note, t }); setNote(''); qc.invalidateQueries(['ii-observation', id]); } catch (e) { setMsg({ kind: 'error', title: 'Note not saved', detail: e.message }); } };

  if (isLoading) return <State kind="loading" title="Loading observation…" />;
  if (error) return <State kind={error.status === 403 ? 'denied' : 'error'} title={error.status === 403 ? 'Not authorized' : 'Could not load'} detail={error.message} />;
  const o = data.observation; const busy = ['recording', 'paused', 'stopping', 'saving'].includes(phase);
  return (
    <>
      <PageHeader title="Live Audio Recording" subtitle={`${o.teacher_name || o.teacher_email} · ${o.subject || ''} ${o.grade ? `Gr ${o.grade}` : ''} · ${o.standard || 'no standard'}`} crumbs={[{ label: 'Instructional Intelligence', to: '/ii' }, { label: 'Observations', to: '/ii/observations' }, { label: 'Observation', to: `/ii/observations/${id}` }, { label: 'Record' }]} />
      {!data.permissions.record && <State className="mb-4" kind="denied" title="You cannot record for this observation" detail={!data.authorization_valid ? 'Recording authorization is missing, expired or withdrawn.' : 'Only the observer or a coach at this school can record.'} action={data.permissions.update && !data.authorization_valid && <Btn size="sm" as={Link} to={`/ii/observations/${id}`}>Record authorization</Btn>} />}
      {support && !support.ok && <State className="mb-4" kind="error" title="This browser cannot record audio" detail={!support.secure ? 'Recording needs a secure (https) connection.' : 'MediaRecorder is not available here. Use Chrome, Edge, Firefox or Safari 14.5+, or upload a recording instead.'} />}
      {support?.ios && <State className="mb-4" kind="warning" title="iPhone/iPad limitation" detail="Safari stops capture when the screen locks or you switch apps. Keep this screen open for the whole observation. Audio is uploaded every 10 seconds so an interruption loses at most a few seconds." />}
      {msg && <State className="mb-4" kind={msg.kind} title={msg.title} detail={msg.detail} action={phase === 'error' && <Btn size="sm" onClick={retryFinalize}>Retry upload</Btn>} />}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <Card>
          <div className="flex flex-col items-center py-6">
            <div className="text-5xl font-black tabular-nums" style={{ color: C.navy }} aria-live="off">{fmtTime(elapsed)}</div>
            <p className="text-xs mt-1 font-semibold uppercase tracking-wide" role="status" style={{ color: phase === 'recording' ? '#b91c1c' : C.slate }}>{{ idle: 'Ready', requesting: 'Requesting microphone…', recording: '● Recording', paused: 'Paused', stopping: 'Stopping…', saving: 'Saving and verifying…', saved: 'Saved', error: 'Not saved' }[phase]}</p>
            <div className="w-64 h-2 rounded-full mt-4 overflow-hidden" style={{ background: C.mist }} aria-label="Microphone input level" role="meter" aria-valuenow={Math.round(level * 100)} aria-valuemin={0} aria-valuemax={100}><div className="h-full transition-all" style={{ width: `${Math.round(level * 100)}%`, background: level > 0.85 ? '#b91c1c' : C.harbor }} /></div>
            <div className="flex gap-3 mt-6">
              {phase === 'idle' || phase === 'saved' || phase === 'error' ? <Btn size="xl" onClick={start} disabled={!support?.ok || !data.permissions.record || phase === 'error'} className="rounded-full !h-20 !w-20 !p-0" aria-label="Start recording"><Mic className="w-8 h-8" /></Btn> : null}
              {phase === 'recording' && <Btn size="lg" variant="secondary" onClick={pause} aria-label="Pause"><Pause className="w-5 h-5" /> Pause</Btn>}
              {phase === 'paused' && <Btn size="lg" variant="secondary" onClick={resume} aria-label="Resume"><Play className="w-5 h-5" /> Resume</Btn>}
              {(phase === 'recording' || phase === 'paused') && <Btn size="lg" variant="danger" onClick={stop} aria-label="Stop and save"><Square className="w-5 h-5" /> Stop & save</Btn>}
            </div>
            <p className="text-[11px] mt-4" style={{ color: C.slate }}>Uploaded {uploaded} piece(s){queued ? ` · ${queued} uploading` : ''}{failedUploads ? ` · ${failedUploads} waiting to retry` : ''}</p>
          </div>
          <div className="border-t pt-4" style={{ borderColor: C.mist }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.slate }}>Mark evidence (timestamp captured automatically)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">{MARKERS.map(([type, label, Icon]) => <Btn key={type} variant="secondary" size="sm" onClick={() => addMarker(type)} disabled={!busy}><Icon className="w-3.5 h-3.5" aria-hidden />{label}</Btn>)}</div>
            <div className="mt-4 flex gap-2 items-start"><Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Quick note — recording continues while you type" aria-label="Observation note" /><Btn onClick={saveNote} disabled={!note.trim()}><StickyNote className="w-4 h-4" aria-hidden />Add</Btn></div>
          </div>
          {phase === 'saved' && <div className="mt-5 flex gap-2"><Btn as={Link} to={`/ii/observations/${id}`}>Open observation → transcript</Btn><Btn variant="secondary" onClick={() => { setPhase('idle'); setElapsed(0); setMsg(null); }}>Record another segment</Btn></div>}
        </Card>
        <div className="space-y-4">
          <Card title="Observation context"><dl className="text-sm space-y-1">{[['Objective', o.objective], ['Success criteria', o.success_criteria], ['Phase', o.instructional_phase], ['Present', o.students_present]].map(([k, v]) => <div key={k}><dt className="text-[10px] uppercase tracking-wide" style={{ color: C.slate }}>{k}</dt><dd>{v || '–'}</dd></div>)}</dl></Card>
          <Card title={`Markers (${(o.markers || []).length})`}>{(o.markers || []).length === 0 ? <p className="text-xs" style={{ color: C.slate }}>None yet.</p> : <ul className="text-xs space-y-1 max-h-48 overflow-auto">{[...o.markers].reverse().map((m) => <li key={m.id}><span className="font-mono">{fmtTime(m.t)}</span> · {m.type.replace(/_/g, ' ')}</li>)}</ul>}</Card>
          <Card title={`Notes (${(o.notes || []).length})`}>{(o.notes || []).length === 0 ? <p className="text-xs" style={{ color: C.slate }}>None yet.</p> : <ul className="text-xs space-y-1.5 max-h-48 overflow-auto">{[...o.notes].reverse().map((n) => <li key={n.id}><span className="font-mono">{fmtTime(n.t)}</span> · {n.text}</li>)}</ul>}</Card>
        </div>
      </div>
    </>
  );
}
