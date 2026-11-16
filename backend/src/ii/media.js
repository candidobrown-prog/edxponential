// Private classroom media: chunked resumable uploads, integrity check, authorized streaming.
// Storage: Vercel Blob (access: 'private') when BLOB_READ_WRITE_TOKEN is set, else local disk under DATA_DIR/ii-media.
// Media is never exposed by URL; playback goes through /api/ii/media/:id after authorization.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DATA_DIR } from '../db.js';

export const CHUNK_LIMIT = 8 * 1024 * 1024;         // 8 MB per chunk request
export const MAX_ASSET_BYTES = 1.5 * 1024 * 1024 * 1024; // 1.5 GB (≈ 90 min video at modest bitrate)
export const ALLOWED_MIME = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/aac', 'video/webm', 'video/mp4', 'video/quicktime'];

const LOCAL_DIR = path.join(DATA_DIR, 'ii-media');
const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;
const key = (assetId, index) => `ii-media/${assetId}/${String(index).padStart(5, '0')}`;

export async function putChunk(assetId, index, buffer) {
  if (buffer.length > CHUNK_LIMIT) throw Object.assign(new Error(`Chunk exceeds ${CHUNK_LIMIT} bytes`), { status: 413 });
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
  if (useBlob()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(key(assetId, index), buffer, { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/octet-stream' });
    return { index, size: buffer.length, sha256, ref: blob.pathname || key(assetId, index), storage: 'blob' };
  }
  const dir = path.join(LOCAL_DIR, assetId); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, String(index).padStart(5, '0')), buffer);
  return { index, size: buffer.length, sha256, ref: path.join(assetId, String(index).padStart(5, '0')), storage: 'local' };
}

export async function readChunk(chunk) {
  if (chunk.storage === 'blob') {
    const { get } = await import('@vercel/blob');
    const res = await get(chunk.ref, { access: 'private' });
    if (!res) throw Object.assign(new Error('Chunk missing in storage'), { status: 404 });
    return Buffer.from(await new Response(res.stream).arrayBuffer());
  }
  return fs.readFileSync(path.join(LOCAL_DIR, chunk.ref));
}

export async function deleteChunks(chunks = []) {
  for (const c of chunks) {
    try {
      if (c.storage === 'blob') { const { del } = await import('@vercel/blob'); await del(c.ref); }
      else fs.rmSync(path.join(LOCAL_DIR, c.ref), { force: true });
    } catch { /* best effort */ }
  }
}

/** Verify the chunk list is contiguous and sizes/hashes are intact. */
export async function verifyAsset(asset) {
  const chunks = [...(asset.chunks || [])].sort((a, b) => a.index - b.index);
  const problems = [];
  chunks.forEach((c, i) => { if (c.index !== i) problems.push(`Missing chunk ${i}`); });
  let total = 0;
  for (const c of chunks) {
    try {
      const buf = await readChunk(c); total += buf.length;
      if (buf.length !== c.size) problems.push(`Chunk ${c.index} size mismatch`);
      if (crypto.createHash('sha256').update(buf).digest('hex') !== c.sha256) problems.push(`Chunk ${c.index} hash mismatch`);
    } catch (e) { problems.push(`Chunk ${c.index} unreadable: ${e.message}`); }
  }
  if (!chunks.length) problems.push('No media data was received');
  return { ok: problems.length === 0, problems, total_bytes: total, chunk_count: chunks.length };
}

/** Whole-file buffer (for transcription providers). */
export async function assembleBuffer(asset) {
  const chunks = [...(asset.chunks || [])].sort((a, b) => a.index - b.index);
  const parts = []; for (const c of chunks) parts.push(await readChunk(c));
  return Buffer.concat(parts);
}

/** Stream to an HTTP response with Range support (needed by <audio>/<video>). */
export async function streamToResponse(asset, req, res) {
  const chunks = [...(asset.chunks || [])].sort((a, b) => a.index - b.index);
  const total = chunks.reduce((a, c) => a + c.size, 0);
  let start = 0, end = total - 1;
  const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  if (range) {
    if (range[1]) start = parseInt(range[1], 10);
    if (range[2]) end = Math.min(parseInt(range[2], 10), total - 1);
    if (!range[1] && range[2]) { start = Math.max(0, total - parseInt(range[2], 10)); end = total - 1; }
    if (start > end || start >= total) { res.status(416).set('Content-Range', `bytes */${total}`).end(); return; }
    res.status(206).set('Content-Range', `bytes ${start}-${end}/${total}`);
  } else res.status(200);
  res.set({ 'Content-Type': asset.mime || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Content-Length': String(end - start + 1), 'Cache-Control': 'private, no-store', 'Content-Disposition': 'inline' });
  if (req.method === 'HEAD') return res.end();
  let offset = 0;
  for (const c of chunks) {
    const cStart = offset, cEnd = offset + c.size - 1; offset += c.size;
    if (cEnd < start) continue; if (cStart > end) break;
    const buf = await readChunk(c);
    const from = Math.max(0, start - cStart), to = Math.min(c.size - 1, end - cStart);
    if (!res.write(buf.subarray(from, to + 1))) await new Promise((r) => res.once('drain', r));
  }
  res.end();
}
