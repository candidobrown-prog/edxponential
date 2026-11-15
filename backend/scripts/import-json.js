// Import records exported from Base44 into this backend.
// Usage:  node scripts/import-json.js <EntityName> <file.json|file.csv>
//   - JSON: an array of records (Base44 "export" / API output). id, created_date, created_by are preserved.
//   - CSV : first row = column names. Values that look like JSON (arrays/objects/true/false/numbers) are parsed.
// The special name "User" creates login accounts (no password — use "Forgot password"/admin reset, or pass --password=xxxx).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(root, '.env');
if (fs.existsSync(envFile)) for (const l of fs.readFileSync(envFile, 'utf8').split('\n')) { const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }

const { one, run, newId, now } = await import('../src/db.js');
const { createUser, getUserByEmail } = await import('../src/auth.js');
const [entity, file, ...flags] = process.argv.slice(2);
if (!entity || !file) { console.error('usage: node scripts/import-json.js <Entity> <file.json|csv> [--password=xxxx]'); process.exit(1); }
const pw = flags.find((f) => f.startsWith('--password='))?.split('=')[1];

function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((x) => x !== ''));
  return body.map((r) => Object.fromEntries(head.map((k, i) => {
    let v = r[i] ?? ''; if (v === '') return [k, undefined];
    if (/^[\[{]/.test(v) || /^(true|false)$/.test(v) || /^-?\d+(\.\d+)?$/.test(v)) { try { v = JSON.parse(v); } catch {} }
    return [k, v];
  })));
}

const text = fs.readFileSync(file, 'utf8');
const items = file.endsWith('.csv') ? parseCsv(text) : JSON.parse(text);
let n = 0, skipped = 0;
for (const item of Array.isArray(items) ? items : [items]) {
  const { id, created_date, updated_date, created_by, ...data } = Object.fromEntries(Object.entries(item).filter(([, v]) => v !== undefined));
  if (entity === 'User') {
    if (!data.email || (await getUserByEmail(data.email))) { skipped++; continue; }
    await createUser({ ...data, password: pw }); n++; continue;
  }
  const rid = id || newId(); const t = now();
  const exists = await one('SELECT 1 AS x FROM records WHERE id=$1', [rid]);
  if (exists) { skipped++; continue; }
  await run('INSERT INTO records (id,entity,data,created_by,created_date,updated_date) VALUES ($1,$2,$3,$4,$5,$6)',
    [rid, entity, JSON.stringify(data), created_by ?? null, created_date || t, updated_date || created_date || t]);
  n++;
}
console.log(`Imported ${n} ${entity} record(s)${skipped ? `, skipped ${skipped} (already present / no email)` : ''}.`);

process.exit(0);
