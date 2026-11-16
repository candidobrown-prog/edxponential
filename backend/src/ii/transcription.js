// Transcription provider abstraction. Output: normalised segments
//   { id, start, end, speaker: 'teacher'|'student'|'group'|'unknown', speaker_label, text, confidence, inaudible, overlap, flags[] }
// Providers: 'deepgram' (diarization), 'openai' (Whisper; no diarization → all 'unknown' until reviewed), 'none'.
// Speaker *identity* is never inferred biometrically; diarization only separates voices into anonymous slots.

export function providerStatus() {
  const p = (process.env.TRANSCRIPTION_PROVIDER || '').toLowerCase();
  if (p === 'deepgram' && process.env.DEEPGRAM_API_KEY) return { provider: 'deepgram', configured: true, diarization: true };
  if (p === 'openai' && process.env.OPENAI_API_KEY) return { provider: 'openai', configured: true, diarization: false };
  if (!p && process.env.DEEPGRAM_API_KEY) return { provider: 'deepgram', configured: true, diarization: true };
  if (!p && process.env.OPENAI_API_KEY) return { provider: 'openai', configured: true, diarization: false };
  return { provider: 'none', configured: false, diarization: false, message: 'No transcription provider configured (set DEEPGRAM_API_KEY or OPENAI_API_KEY). Transcripts can be entered manually.' };
}

const sid = () => Math.random().toString(36).slice(2, 10);

export async function transcribe(buffer, mime) {
  const st = providerStatus();
  if (!st.configured) throw Object.assign(new Error(st.message), { status: 501, code: 'transcription_not_configured' });
  if (st.provider === 'deepgram') return deepgram(buffer, mime);
  return openaiWhisper(buffer, mime);
}

async function deepgram(buffer, mime) {
  const url = 'https://api.deepgram.com/v1/listen?model=nova-3&diarize=true&punctuate=true&utterances=true&smart_format=false&filler_words=true';
  const res = await fetch(url, { method: 'POST', headers: { Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`, 'Content-Type': mime || 'audio/webm' }, body: buffer });
  if (!res.ok) throw new Error(`Deepgram error ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  const utts = json.results?.utterances || [];
  const segments = utts.map((u) => ({
    id: sid(), start: round(u.start), end: round(u.end), speaker: 'unknown',
    speaker_label: `Speaker ${(u.speaker ?? 0) + 1}`, text: u.transcript || '', confidence: u.confidence ?? null,
    inaudible: !(u.transcript || '').trim(), overlap: false, flags: [],
  }));
  return { provider: 'deepgram', segments: markOverlaps(segments), raw_duration: json.metadata?.duration ?? null };
}

async function openaiWhisper(buffer, mime) {
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mime || 'audio/webm' }), `audio.${(mime || 'audio/webm').split('/')[1].split(';')[0]}`);
  form.append('model', 'whisper-1'); form.append('response_format', 'verbose_json'); form.append('timestamp_granularities[]', 'segment');
  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: form });
  if (!res.ok) throw new Error(`OpenAI transcription error ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  const segments = (json.segments || []).map((s) => ({
    id: sid(), start: round(s.start), end: round(s.end), speaker: 'unknown', speaker_label: null, text: s.text?.trim() || '',
    confidence: s.avg_logprob != null ? round(Math.min(1, Math.max(0, 1 + s.avg_logprob))) : null, inaudible: !(s.text || '').trim() || (s.no_speech_prob ?? 0) > 0.6,
    overlap: false, flags: s.no_speech_prob > 0.6 ? ['low_speech_probability'] : [],
  }));
  return { provider: 'openai', segments, raw_duration: json.duration ?? null, note: 'Whisper does not separate speakers; assign teacher/student labels in Transcript Review.' };
}

/** Flag segments whose time ranges intersect another speaker's (F11). */
export function markOverlaps(segments) {
  const s = [...segments].sort((a, b) => a.start - b.start);
  for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length && s[j].start < s[i].end; j++) {
    if (s[j].speaker_label !== s[i].speaker_label) { s[i].overlap = true; s[j].overlap = true; }
  }
  return s;
}

/** Parse a manually pasted transcript. Lines like "[00:12] Teacher: text" or "T: text" / "S1: text". */
export function parseManualTranscript(text) {
  const lines = String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const segs = []; let t = 0;
  for (const line of lines) {
    const m = /^(?:\[?(\d{1,2}):(\d{2})(?::(\d{2}))?\]?\s*)?(?:([A-Za-z][\w .'-]{0,30}?)\s*:\s*)?(.*)$/.exec(line);
    if (!m) continue;
    const [, h, mnt, sec, who, body] = m;
    if (h !== undefined) t = sec !== undefined ? +h * 3600 + +mnt * 60 + +sec : +h * 60 + +mnt;
    const label = (who || '').trim();
    const lower = label.toLowerCase();
    let speaker = 'unknown', speaker_label = label || null;
    if (/^(t|teacher|ms\.?|mr\.?|mrs\.?)/.test(lower)) { speaker = 'teacher'; speaker_label = 'Teacher'; }
    else if (/^(students|class|group|all|several)/.test(lower)) { speaker = 'group'; speaker_label = 'Group'; }
    else if (/^(s\d*|student\s*\d*)$/.test(lower)) { speaker = 'student'; speaker_label = label.replace(/^s(\d*)$/i, (_, n) => `Student ${n || 1}`).replace(/^student\s*(\d*)$/i, (_, n) => `Student ${n || 1}`); }
    const words = body.split(/\s+/).filter(Boolean).length;
    const dur = Math.max(1, Math.round(words / 2.5));       // ~150 wpm estimate when no timestamps given
    const inaudible = /\[(inaudible|unintelligible)\]/i.test(body);
    segs.push({ id: sid(), start: t, end: t + dur, speaker, speaker_label, text: body, confidence: null, inaudible, overlap: /\[(overlap|crosstalk)\]/i.test(body), flags: h === undefined ? ['estimated_timestamp'] : [] });
    t += dur;
  }
  return segs;
}

const round = (n) => Math.round(n * 100) / 100;
