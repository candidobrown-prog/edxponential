// Instructional Intelligence API client + media upload utilities.
import { getToken } from '@/api/base44Client';

const API = (import.meta.env.VITE_API_URL || '') + '/api/ii';

export class ApiError extends Error { constructor(message, status, data) { super(message); this.status = status; this.data = data; this.code = data?.code || null; } }

async function request(method, path, body, { raw = false, signal } = {}) {
  const headers = {}; const token = getToken(); if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined && !raw) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${path}`, { method, headers, body: raw ? body : body === undefined ? undefined : JSON.stringify(body), signal });
  const text = await res.text(); let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new ApiError(data?.message || data?.error || `Request failed (${res.status})`, res.status, data);
  return data;
}
const qs = (o = {}) => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => v !== undefined && v !== null && v !== '' && p.set(k, v)); const s = p.toString(); return s ? `?${s}` : ''; };

export const ii = {
  me: () => request('GET', '/me'),
  bootstrap: (b) => request('POST', '/bootstrap', b),
  dashboard: () => request('GET', '/dashboard'),
  orgs: () => request('GET', '/orgs'),
  schools: (q) => request('GET', `/schools${qs(q)}`),
  createSchool: (b) => request('POST', '/schools', b),
  updateSchool: (id, b) => request('PUT', `/schools/${id}`, b),
  memberships: (q) => request('GET', `/memberships${qs(q)}`),
  addMembership: (b) => request('POST', '/memberships', b),
  revokeMembership: (id) => request('DELETE', `/memberships/${id}`),
  rubric: () => request('GET', '/rubric'),
  saveRubric: (b) => request('PUT', '/rubric', b),
  audit: (q) => request('GET', `/audit${qs(q)}`),
  retention: (q) => request('GET', `/retention${qs(q)}`),
  saveRetention: (b) => request('PUT', '/retention', b),
  health: () => request('GET', '/system/health'),

  observations: (q) => request('GET', `/observations${qs(q)}`),
  createObservation: (b) => request('POST', '/observations', b),
  observation: (id) => request('GET', `/observations/${id}`),
  updateObservation: (id, b) => request('PUT', `/observations/${id}`, b),
  authorize: (id, b) => request('POST', `/observations/${id}/authorization`, b),
  withdrawAuthorization: (id) => request('POST', `/observations/${id}/authorization/withdraw`, {}),
  addNote: (id, b) => request('POST', `/observations/${id}/notes`, b),
  addMarker: (id, b) => request('POST', `/observations/${id}/markers`, b),
  share: (id, b) => request('POST', `/observations/${id}/share`, b),
  initMedia: (id, b) => request('POST', `/observations/${id}/media`, b),
  putChunk: (assetId, index, blob) => request('PUT', `/media/${assetId}/chunks/${index}`, blob, { raw: true }),
  mediaStatus: (assetId) => request('GET', `/media/${assetId}/status`),
  finalizeMedia: (assetId, b) => request('POST', `/media/${assetId}/finalize`, b),
  deleteMedia: (assetId) => request('DELETE', `/media/${assetId}`),
  mediaUrl: (assetId) => `${API}/media/${assetId}`,
  transcribe: (id, b) => request('POST', `/observations/${id}/transcribe`, b || {}),
  manualTranscript: (id, b) => request('POST', `/observations/${id}/transcripts/manual`, b),
  transcripts: (id) => request('GET', `/observations/${id}/transcripts`),
  transcript: (vid) => request('GET', `/transcripts/${vid}`),
  reviseTranscript: (vid, b) => request('POST', `/transcripts/${vid}/revise`, b),
  approveTranscript: (vid, b) => request('POST', `/transcripts/${vid}/approve`, b || {}),
  analyze: (id, b) => request('POST', `/observations/${id}/analyze`, b || {}),
  analysis: (id) => request('GET', `/observations/${id}/analysis`),
  reviewCfu: (aid, b) => request('PUT', `/analysis/${aid}/cfu`, b),
  reviewEngagement: (aid, b) => request('PUT', `/analysis/${aid}/engagement`, b),
  reviewPriorities: (aid, b) => request('PUT', `/analysis/${aid}/priorities`, b),
  approveAnalysis: (aid, b) => request('POST', `/analysis/${aid}/approve`, b || {}),
  addEvidence: (id, b) => request('POST', `/observations/${id}/evidence`, b),
  report: (id, level) => request('GET', `/observations/${id}/report${qs({ level })}`),
  jobs: (id) => request('GET', `/jobs${qs({ observation_id: id })}`),

  reflectionAreas: () => request('GET', '/reflections/areas'),
  reflections: () => request('GET', '/reflections'),
  createReflection: (b) => request('POST', '/reflections', b),
  reflection: (id) => request('GET', `/reflections/${id}`),
  saveReflection: (id, b) => request('PUT', `/reflections/${id}`, b),
  reflectionFollowUp: (id, b) => request('POST', `/reflections/${id}/followup`, b),
  shareReflection: (id, b) => request('POST', `/reflections/${id}/share`, b),
  revokeReflection: (id, b) => request('POST', `/reflections/${id}/revoke`, b),

  coachingList: (q) => request('GET', `/coaching${qs(q)}`),
  createCoaching: (b) => request('POST', '/coaching', b),
  coaching: (id) => request('GET', `/coaching/${id}`),
  saveCoaching: (id, b) => request('PUT', `/coaching/${id}`, b),
  acknowledge: (id, b) => request('POST', `/coaching/${id}/acknowledge`, b),
  actionPlans: (q) => request('GET', `/action-plans${qs(q)}`),
  createActionPlan: (b) => request('POST', '/action-plans', b),
  saveActionPlan: (id, b) => request('PUT', `/action-plans/${id}`, b),
  reassessments: () => request('GET', '/reassessments'),
  createReassessment: (b) => request('POST', '/reassessments', b),
  saveReassessment: (id, b) => request('PUT', `/reassessments/${id}`, b),

  plc: () => request('GET', '/plc'),
  createPlc: (b) => request('POST', '/plc', b),
  savePlc: (id, b) => request('PUT', `/plc/${id}`, b),
  schoolTrends: (id) => request('GET', `/trends/school/${id}`),
  districtTrends: (id) => request('GET', `/trends/district/${id}`),
};

// ---------- local chunk store (IndexedDB) so an interrupted recording can be recovered (F03/F05) ----------
const DB = 'ii-recorder'; const STORE = 'chunks';
function openDb() { return new Promise((res, rej) => { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: ['assetId', 'index'] }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
export const chunkStore = {
  async put(assetId, index, blob, meta = {}) { try { const db = await openDb(); await tx(db, 'readwrite', (s) => s.put({ assetId, index, blob, uploaded: false, ...meta, at: Date.now() })); } catch { /* storage may be unavailable; uploads still proceed */ } },
  async markUploaded(assetId, index) { try { const db = await openDb(); const rec = await tx(db, 'readonly', (s) => s.get([assetId, index])); if (rec) await tx(db, 'readwrite', (s) => s.put({ ...rec, uploaded: true })); } catch { /* ignore */ } },
  async pending() { try { const db = await openDb(); const all = await tx(db, 'readonly', (s) => s.getAll()); return all.filter((r) => !r.uploaded); } catch { return []; } },
  async forAsset(assetId) { try { const db = await openDb(); const all = await tx(db, 'readonly', (s) => s.getAll()); return all.filter((r) => r.assetId === assetId).sort((a, b) => a.index - b.index); } catch { return []; } },
  async clear(assetId) { try { const db = await openDb(); const all = await tx(db, 'readonly', (s) => s.getAll()); const d = await openDb(); for (const r of all.filter((x) => x.assetId === assetId)) await tx(d, 'readwrite', (s) => s.delete([r.assetId, r.index])); } catch { /* ignore */ } },
};
function tx(db, mode, fn) { return new Promise((res, rej) => { const t = db.transaction(STORE, mode); const req = fn(t.objectStore(STORE)); t.oncomplete = () => res(req?.result); t.onerror = () => rej(t.error); }); }

/** Upload a chunk with retries (idempotent on the server). */
export async function uploadChunk(assetId, index, blob, { attempts = 5, onRetry } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try { const out = await ii.putChunk(assetId, index, blob); await chunkStore.markUploaded(assetId, index); return out; }
    catch (e) { lastErr = e; if (e.status && e.status < 500 && e.status !== 408 && e.status !== 429) throw e; onRetry?.(i + 1, e); await new Promise((r) => setTimeout(r, Math.min(8000, 500 * 2 ** i))); }
  }
  throw lastErr;
}

/** Upload a File/Blob in 8 MB chunks with progress. */
export async function uploadFile(observationId, file, { kind, onProgress } = {}) {
  const CHUNK = 8 * 1024 * 1024;
  const { asset_id } = await ii.initMedia(observationId, { kind: kind || (file.type.startsWith('video') ? 'video' : 'audio'), mime: file.type || 'audio/webm', filename: file.name });
  const total = Math.ceil(file.size / CHUNK);
  for (let i = 0; i < total; i++) { await uploadChunk(asset_id, i, file.slice(i * CHUNK, (i + 1) * CHUNK)); onProgress?.({ done: i + 1, total }); }
  const duration = await mediaDuration(file).catch(() => null);
  return ii.finalizeMedia(asset_id, { expected_chunks: total, duration_seconds: duration });
}
export function mediaDuration(blob) {
  return new Promise((res, rej) => { const el = document.createElement(blob.type.startsWith('video') ? 'video' : 'audio'); el.preload = 'metadata'; el.onloadedmetadata = () => { const d = el.duration; URL.revokeObjectURL(el.src); res(Number.isFinite(d) ? Math.round(d) : null); }; el.onerror = () => rej(new Error('Could not read media metadata')); el.src = URL.createObjectURL(blob); });
}

export const fmtTime = (t) => { if (t === null || t === undefined || Number.isNaN(t)) return '–'; const s = Math.max(0, Math.floor(t)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`; };
