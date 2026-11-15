// Replacements for Base44's built-in "Core" integrations.
import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';
import Anthropic from '@anthropic-ai/sdk';
import { UPLOAD_DIR } from './db.js';

const MODEL = () => process.env.LLM_MODEL || 'claude-sonnet-5-5';
let _client;
const anthropic = () => {
  if (!process.env.ANTHROPIC_API_KEY) throw Object.assign(new Error('ANTHROPIC_API_KEY is not set on the server'), { status: 501 });
  return (_client ||= new Anthropic());
};

// ---- helpers ----
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.pdf': 'application/pdf' };
async function readFileUrl(url) {
  const u = new URL(url, process.env.PUBLIC_URL || 'http://localhost');
  if (u.pathname.startsWith('/uploads/')) {
    const p = path.join(UPLOAD_DIR, path.basename(u.pathname));
    return { buf: fs.readFileSync(p), name: path.basename(p) };
  }
  const r = await fetch(u); if (!r.ok) throw new Error(`Could not fetch ${url} (${r.status})`);
  return { buf: Buffer.from(await r.arrayBuffer()), name: path.basename(u.pathname) };
}
async function fileBlocks(urls = []) {
  const blocks = [];
  for (const url of urls) {
    const { buf, name } = await readFileUrl(url); const ext = path.extname(name).toLowerCase();
    if (MIME[ext]?.startsWith('image/')) blocks.push({ type: 'image', source: { type: 'base64', media_type: MIME[ext], data: buf.toString('base64') } });
    else if (ext === '.pdf') blocks.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: buf.toString('base64') } });
    else if (ext === '.xlsx') blocks.push({ type: 'text', text: `File ${name}:\n${await xlsxToText(buf)}` });
    else blocks.push({ type: 'text', text: `File ${name}:\n${buf.toString('utf8').slice(0, 200_000)}` });
  }
  return blocks;
}
async function xlsxToText(buf) {
  const { default: ExcelJS } = await import('exceljs');
  const wb = new ExcelJS.Workbook(); await wb.xlsx.load(buf);
  return wb.worksheets.map((ws) => {
    const lines = []; ws.eachRow((row) => lines.push(row.values.slice(1).map((v) => (v && typeof v === 'object' ? v.text ?? v.result ?? '' : v ?? '')).join(',')));
    return `# Sheet: ${ws.name}\n${lines.join('\n')}`;
  }).join('\n\n');
}
const asObjectSchema = (s) => (s?.type === 'object' ? [s, false] : [{ type: 'object', properties: { result: s }, required: ['result'] }, true]);

async function structured({ content, schema, system }) {
  const [input_schema, wrapped] = asObjectSchema(schema);
  const res = await anthropic().messages.create({
    model: MODEL(), max_tokens: 8000, ...(system ? { system } : {}),
    tools: [{ name: 'respond', description: 'Return the final structured answer.', input_schema }],
    tool_choice: { type: 'tool', name: 'respond' },
    messages: [{ role: 'user', content }],
  });
  const block = res.content.find((b) => b.type === 'tool_use');
  if (!block) throw new Error('Model returned no structured output');
  return wrapped ? block.input.result : block.input;
}

// ---- Core.InvokeLLM ----
async function InvokeLLM({ prompt, response_json_schema, add_context_from_internet, file_urls }) {
  let content = [...(await fileBlocks(file_urls)), { type: 'text', text: prompt }];
  if (add_context_from_internet) {
    try {   // research pass with Anthropic's web search tool, then answer using those notes
      const r = await anthropic().messages.create({
        model: MODEL(), max_tokens: 4000,
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
        messages: [{ role: 'user', content: `Research the web for what is needed to answer this, then write concise factual notes with source names:\n\n${prompt}` }],
      });
      const notes = r.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
      content = [...content, { type: 'text', text: `\n\nWeb research notes:\n${notes}` }];
    } catch (e) { console.warn('[InvokeLLM] web search step failed, continuing without it:', e.message); }
  }
  if (response_json_schema) return structured({ content, schema: response_json_schema });
  const res = await anthropic().messages.create({ model: MODEL(), max_tokens: 8000, messages: [{ role: 'user', content }] });
  return res.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
}

// ---- Core.ExtractDataFromUploadedFile ----
async function ExtractDataFromUploadedFile({ file_url, json_schema }) {
  try {
    const isArray = json_schema?.type === 'array';
    const rowSchema = isArray ? json_schema.items : json_schema;
    const out = await structured({
      schema: { type: 'object', properties: { rows: { type: 'array', items: rowSchema } }, required: ['rows'] },
      content: [...(await fileBlocks([file_url])), { type: 'text', text: 'Extract every record/row from this file into the schema. Preserve values exactly as written; leave unknown fields empty.' }],
    });
    return { status: 'success', output: isArray || out.rows.length !== 1 ? out.rows : out.rows[0] };
  } catch (e) { return { status: 'error', details: e.message }; }
}

// ---- Core.SendEmail ----
let _mailer;
async function SendEmail({ to, subject, body, from_name }) {
  const from = process.env.EMAIL_FROM || 'edXponential <no-reply@localhost>';
  if (!process.env.SMTP_URL) { console.log(`[email:not-sent — set SMTP_URL] to=${to} subject=${subject}`); return { success: true, delivered: false }; }
  _mailer ||= nodemailer.createTransport(process.env.SMTP_URL);
  await _mailer.sendMail({ from: from_name ? from.replace(/^[^<]*/, `${from_name} `) : from, to, subject, text: body, html: /<[a-z][\s\S]*>/i.test(body) ? body : undefined });
  return { success: true, delivered: true };
}

// ---- Core.UploadFile (called by the HTTP layer with the multer file) ----
// With BLOB_READ_WRITE_TOKEN set (Vercel Blob) files go there; with SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set, to a public Supabase Storage bucket ("uploads"),
// which is what you need on Vercel (no persistent disk). Otherwise they are written to the local data folder.
let bucketReady = false;
export async function saveUpload(file, { baseUrl = '' } = {}) {
  const safe = `${Date.now().toString(36)}-${file.originalname.replace(/[^\w.-]+/g, '_')}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {          // Vercel Blob (set automatically by the Vercel Blob store)
    const { put } = await import('@vercel/blob');
    const blob = await put(`uploads/${safe}`, file.buffer, { access: 'public', contentType: file.mimetype || 'application/octet-stream' });
    return { file_url: blob.url };
  }
  const sbUrl = process.env.SUPABASE_URL, sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (sbUrl && sbKey) {
    const auth = { Authorization: `Bearer ${sbKey}`, apikey: sbKey };
    if (!bucketReady) {
      await fetch(`${sbUrl}/storage/v1/bucket`, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: 'uploads', name: 'uploads', public: true }) }).catch(() => {});
      bucketReady = true;   // 409 "already exists" is fine
    }
    const res = await fetch(`${sbUrl}/storage/v1/object/uploads/${safe}`, { method: 'POST', headers: { ...auth, 'Content-Type': file.mimetype || 'application/octet-stream' }, body: file.buffer });
    if (!res.ok) throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
    return { file_url: `${sbUrl}/storage/v1/object/public/uploads/${safe}` };
  }
  fs.writeFileSync(path.join(UPLOAD_DIR, safe), file.buffer);
  return { file_url: `${(process.env.PUBLIC_URL || baseUrl).replace(/\/$/, '')}/uploads/${safe}` };
}

export const Core = { InvokeLLM, ExtractDataFromUploadedFile, SendEmail };
