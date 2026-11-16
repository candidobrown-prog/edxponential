import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ii, uploadFile } from '@/api/ii';
import { PageHeader, Card, Btn, State, Select, Field, C } from '@/components/ii/ui';

const ACCEPT = 'audio/webm,audio/ogg,audio/mp4,audio/mpeg,audio/wav,audio/x-m4a,audio/aac,video/webm,video/mp4,video/quicktime,.m4a,.mp3,.wav,.mp4,.mov,.webm';

export default function IIUpload() {
  const [sp] = useSearchParams(); const [obsId, setObsId] = useState(sp.get('observation') || '');
  const { data: observations = [] } = useQuery({ queryKey: ['ii-observations', '', ''], queryFn: () => ii.observations({}) });
  const { data: detail } = useQuery({ queryKey: ['ii-observation', obsId], queryFn: () => ii.observation(obsId), enabled: !!obsId });
  const [file, setFile] = useState(null); const [progress, setProgress] = useState(null); const [msg, setMsg] = useState(null); const [busy, setBusy] = useState(false);
  const go = async () => {
    if (!file || !obsId) return; setBusy(true); setMsg(null); setProgress({ done: 0, total: 1 });
    try { const r = await uploadFile(obsId, file, { onProgress: setProgress }); setMsg({ kind: 'success', title: 'Upload verified and saved', detail: `${(r.size_bytes / 1024 / 1024).toFixed(1)} MB in ${r.verified.chunk_count} piece(s). Next: transcript.` }); }
    catch (e) { setMsg({ kind: 'error', title: 'Upload did not complete', detail: `${e.message}. Nothing was marked as saved. You can retry the same file; already-received pieces are reused.` }); }
    finally { setBusy(false); }
  };
  const canRecord = detail?.permissions?.record;
  return (
    <>
      <PageHeader title="Audio & Video Uploads" subtitle="Attach an existing recording to an observation. Files are uploaded in 8 MB pieces so an interrupted upload can resume." crumbs={[{ label: 'Instructional Intelligence', to: '/ii' }, { label: 'Uploads' }]} />
      <Card>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Observation" required><Select value={obsId} onChange={(e) => setObsId(e.target.value)}><option value="">Select…</option>{observations.map((o) => <option key={o.id} value={o.id}>{o.teacher_name || o.teacher_email} · {o.subject || ''} · {o.date || ''} ({o.status})</option>)}</Select></Field>
          <Field label="Recording file" hint="Supported: m4a, mp3, wav, webm, ogg, mp4, mov. Up to 1.5 GB."><input type="file" accept={ACCEPT} onChange={(e) => setFile(e.target.files?.[0] || null)} className="block text-sm" /></Field>
        </div>
        {obsId && detail && !canRecord && <State className="mt-4" kind="denied" title="Upload not permitted for this observation" detail={!detail.authorization_valid ? 'Recording authorization is missing, expired or withdrawn.' : 'Only the observer or a coach at this school can upload.'} action={<Btn size="sm" as={Link} to={`/ii/observations/${obsId}`}>Open observation</Btn>} />}
        {file && <p className="text-xs mt-3" style={{ color: C.slate }}>{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB · {file.type || 'unknown type'}</p>}
        {progress && busy && <div className="mt-3" role="progressbar" aria-valuenow={progress.done} aria-valuemax={progress.total}><div className="h-2 rounded-full" style={{ background: C.mist }}><div className="h-full rounded-full transition-all" style={{ width: `${Math.round(progress.done / progress.total * 100)}%`, background: C.harbor }} /></div><p className="text-xs mt-1" style={{ color: C.slate }}>Uploading piece {progress.done} of {progress.total}…</p></div>}
        {msg && <State className="mt-4" kind={msg.kind} title={msg.title} detail={msg.detail} action={msg.kind === 'success' && <Btn size="sm" as={Link} to={`/ii/observations/${obsId}`}>Open observation</Btn>} />}
        <Btn className="mt-4" onClick={go} disabled={!file || !obsId || busy || !canRecord}>{busy ? 'Uploading…' : 'Upload and verify'}</Btn>
      </Card>
    </>
  );
}
