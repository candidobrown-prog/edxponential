import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ii, fmtTime } from '@/api/ii';
import { Btn, State, Select, Textarea, Pill, C, useErr, ErrorNote } from './ui';

const SPEAKER_STYLE = { teacher: { bg: '#eef4fc', label: 'Teacher' }, student: { bg: '#f0fdf4', label: 'Student' }, group: { bg: '#fefce8', label: 'Group' }, unknown: { bg: '#f3f4f6', label: 'Unknown' } };

export default function TranscriptReview({ obsData, mediaRef, onSeek, currentTime }) {
  const qc = useQueryClient(); const { observation: o, permissions: perm, media } = obsData;
  const versions = obsData.transcripts || [];
  const [vid, setVid] = useState(o.current_transcript_version_id || versions.at(-1)?.id || null);
  useEffect(() => { if (!vid && versions.length) setVid(o.current_transcript_version_id || versions.at(-1).id); }, [versions, o.current_transcript_version_id, vid]);
  const { data: t, isLoading } = useQuery({ queryKey: ['ii-transcript', vid], queryFn: () => ii.transcript(vid), enabled: !!vid });
  const [edits, setEdits] = useState({}); const [compare, setCompare] = useState(false); const [manual, setManual] = useState(''); const [err, run] = useErr(); const [busy, setBusy] = useState(null);
  const listRef = useRef(null);
  const segments = useMemo(() => (t?.segments || []).map((s) => ({ ...s, ...(edits[s.id] || {}) })), [t, edits]);
  const activeId = useMemo(() => segments.find((s) => currentTime >= s.start && currentTime < s.end)?.id, [segments, currentTime]);
  useEffect(() => { if (activeId && listRef.current) listRef.current.querySelector(`[data-seg="${activeId}"]`)?.scrollIntoView({ block: 'nearest' }); }, [activeId]);
  const { data: parent } = useQuery({ queryKey: ['ii-transcript', t?.parent_version_id], queryFn: () => ii.transcript(t.parent_version_id), enabled: !!(compare && t?.parent_version_id) });
  const dirty = Object.keys(edits).length > 0;
  const setSeg = (id, patch) => setEdits((e) => ({ ...e, [id]: { ...(e[id] || {}), ...patch } }));
  const relabel = (from, to) => segments.filter((s) => (s.speaker_label || '') === from).forEach((s) => setSeg(s.id, { speaker_label: to, speaker: /^teacher$/i.test(to) ? 'teacher' : /^group$/i.test(to) ? 'group' : /^student/i.test(to) ? 'student' : 'unknown' }));
  const labels = [...new Set(segments.map((s) => s.speaker_label).filter(Boolean))];

  const act = async (name, fn) => { setBusy(name); try { await run(fn); qc.invalidateQueries(['ii-observation', o.id]); } catch { /* shown */ } finally { setBusy(null); } };
  const saveRevision = () => act('save', async () => { const v = await ii.reviseTranscript(t.id, { segments, change_summary: `${Object.keys(edits).length} segment(s) corrected` }); setEdits({}); setVid(v.id); });
  const approve = (force) => act('approve', async () => { try { await ii.approveTranscript(vid, { force }); } catch (e) { if (e.status === 422 && !force && window.confirm(`${e.message}\n\nApprove anyway?`)) return ii.approveTranscript(vid, { force: true }); throw e; } });
  const transcribe = () => act('transcribe', async () => { const r = await ii.transcribe(o.id, {}); if (r.transcript_version_id) setVid(r.transcript_version_id); });
  const saveManual = () => act('manual', async () => { const v = await ii.manualTranscript(o.id, { text: manual }); setManual(''); setVid(v.id); });

  const readyMedia = media.find((m) => m.status === 'ready');
  const providers = obsData.providers;
  return (
    <div className="space-y-4">
      <ErrorNote error={err} />
      {!versions.length && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4 bg-white" style={{ borderColor: C.mist }}>
            <h3 className="font-bold text-sm mb-1" style={{ color: C.navy }}>Automatic transcription</h3>
            {!readyMedia ? <p className="text-sm" style={{ color: C.slate }}>No verified recording yet.</p> : !providers?.transcription?.configured ? <State kind="warning" title="No transcription provider configured" detail="Set DEEPGRAM_API_KEY (speaker separation) or OPENAI_API_KEY on the server. Until then, paste a transcript." /> : <><p className="text-sm mb-3" style={{ color: C.slate }}>Provider: {providers.transcription.provider}{providers.transcription.diarization ? ' (separates voices into anonymous slots)' : ' (no speaker separation — label speakers in review)'}.</p><Btn onClick={transcribe} disabled={!perm.analysis_run || busy === 'transcribe'}>{busy === 'transcribe' ? 'Transcribing…' : 'Transcribe recording'}</Btn></>}
          </div>
          <div className="rounded-xl border p-4 bg-white" style={{ borderColor: C.mist }}>
            <h3 className="font-bold text-sm mb-1" style={{ color: C.navy }}>Paste or type a transcript</h3>
            <p className="text-[11px] mb-2" style={{ color: C.slate }}>One line per turn: <code>[mm:ss] Teacher: …</code>, <code>Student 1: …</code>, <code>Group: …</code>. Use [inaudible] where speech is unclear.</p>
            <Textarea rows={6} value={manual} onChange={(e) => setManual(e.target.value)} aria-label="Manual transcript" />
            <Btn className="mt-2" variant="secondary" onClick={saveManual} disabled={!manual.trim() || !perm.transcript_edit || busy === 'manual'}>Save transcript</Btn>
          </div>
        </div>
      )}
      {versions.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <label className="flex items-center gap-2">Version <Select className="w-auto h-8" value={vid || ''} onChange={(e) => { setVid(e.target.value); setEdits({}); }}>{versions.map((v) => <option key={v.id} value={v.id}>v{v.version} · {v.source}{v.approved ? ' · approved' : ''}</option>)}</Select></label>
            {t && <><Pill tone={t.approved ? 'good' : 'warn'}>{t.approved ? `Approved by ${t.approved_by}` : 'Not approved'}</Pill>{t.provider && <Pill>{t.provider}</Pill>}{t.confidence_mean !== null && t.confidence_mean !== undefined && <Pill>mean confidence {Math.round(t.confidence_mean * 100)}%</Pill>}<Pill>{segments.filter((s) => s.speaker === 'unknown').length} unknown speaker(s)</Pill></>}
            {t?.parent_version_id && <label className="flex items-center gap-1 ml-auto text-xs"><input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} /> Compare with v{t.version - 1}</label>}
          </div>
          {labels.length > 0 && perm.transcript_edit && (
            <div className="rounded-lg border p-3 text-xs flex flex-wrap gap-2 items-center" style={{ borderColor: C.mist, background: '#fff' }}>
              <span className="font-semibold" style={{ color: C.navy }}>Rename speaker slot:</span>
              {labels.map((l) => <span key={l} className="inline-flex items-center gap-1">{l} → <Select className="h-7 w-32 text-xs" defaultValue="" onChange={(e) => e.target.value && relabel(l, e.target.value)}><option value="">choose…</option><option>Teacher</option><option>Group</option>{Array.from({ length: 12 }, (_, i) => `Student ${i + 1}`).map((s) => <option key={s}>{s}</option>)}</Select></span>)}
            </div>
          )}
          {isLoading ? <State kind="loading" title="Loading transcript…" /> : (
            <div ref={listRef} className="rounded-xl border bg-white max-h-[60vh] overflow-auto" style={{ borderColor: C.mist }} role="list" aria-label="Transcript">
              {segments.map((s) => {
                const st = SPEAKER_STYLE[s.speaker] || SPEAKER_STYLE.unknown; const old = parent?.segments?.find((x) => x.id === s.id);
                return (
                  <div key={s.id} data-seg={s.id} role="listitem" className="grid grid-cols-[64px_120px_1fr] gap-2 px-3 py-2 border-b items-start" style={{ borderColor: C.mist, background: activeId === s.id ? '#fff7d6' : st.bg }}>
                    <button onClick={() => onSeek?.(s.start)} className="font-mono text-[11px] text-left hover:underline" style={{ color: C.harbor }} aria-label={`Jump to ${fmtTime(s.start)}`}>{fmtTime(s.start)}</button>
                    <div className="text-xs">
                      {perm.transcript_edit ? <Select className="h-7 text-xs" value={s.speaker} onChange={(e) => setSeg(s.id, { speaker: e.target.value, speaker_label: e.target.value === 'teacher' ? 'Teacher' : e.target.value === 'group' ? 'Group' : s.speaker_label })}>{Object.entries(SPEAKER_STYLE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</Select> : <span className="font-semibold">{st.label}</span>}
                      <div className="text-[10px] mt-0.5" style={{ color: C.slate }}>{s.speaker_label || ''}{s.overlap && <Pill tone="warn">overlap</Pill>}{s.inaudible && <Pill>inaudible</Pill>}{(s.flags || []).includes('estimated_timestamp') && <span title="Timestamp estimated from word count"> ~t</span>}</div>
                    </div>
                    <div>
                      {perm.transcript_edit ? <textarea className="w-full text-sm bg-transparent border-0 focus:ring-1 focus:ring-[#1A5FB4] rounded p-1 resize-none" rows={Math.max(1, Math.ceil((s.text || '').length / 90))} value={s.text} onChange={(e) => setSeg(s.id, { text: e.target.value })} aria-label={`Transcript text at ${fmtTime(s.start)}`} /> : <p className="text-sm">{s.text}</p>}
                      {compare && old && old.text !== s.text && <p className="text-[11px] line-through mt-1" style={{ color: C.slate }}>{old.text}</p>}
                      {perm.transcript_edit && <div className="flex gap-3 text-[10px] mt-1" style={{ color: C.slate }}><label><input type="checkbox" checked={!!s.inaudible} onChange={(e) => setSeg(s.id, { inaudible: e.target.checked })} /> inaudible</label><label><input type="checkbox" checked={!!s.overlap} onChange={(e) => setSeg(s.id, { overlap: e.target.checked })} /> overlapping</label><label><input type="checkbox" checked={(s.flags || []).includes('uncertain')} onChange={(e) => setSeg(s.id, { flags: e.target.checked ? [...(s.flags || []), 'uncertain'] : (s.flags || []).filter((f) => f !== 'uncertain') })} /> flag uncertain</label></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex flex-wrap gap-2 items-center">
            {perm.transcript_edit && <Btn onClick={saveRevision} disabled={!dirty || busy === 'save'}>{busy === 'save' ? 'Saving…' : `Save as new version${dirty ? ` (${Object.keys(edits).length} changed)` : ''}`}</Btn>}
            {perm.transcript_approve && t && !t.approved && <Btn variant="accent" onClick={() => approve(false)} disabled={dirty || busy === 'approve'}>{dirty ? 'Save changes before approving' : 'Approve for analysis'}</Btn>}
            {perm.transcript_edit && readyMedia && providers?.transcription?.configured && <Btn variant="ghost" onClick={transcribe} disabled={busy === 'transcribe'}>Re-transcribe</Btn>}
            <span className="text-[11px]" style={{ color: C.slate }}>Original machine text and every revision are kept. Changing a transcript marks existing analyses stale.</span>
          </div>
        </>
      )}
    </div>
  );
}
