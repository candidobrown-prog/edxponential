// Postgres layer.
//  - Production (Vercel + Supabase): set DATABASE_URL (or POSTGRES_URL — the Vercel/Supabase integration sets it).
//  - Local dev with nothing installed: falls back to an embedded Postgres (PGlite) stored in DATA_DIR/pgdata.
// Tables are created automatically on first use, so there is no separate migration step.
import fs from 'node:fs';
import path from 'node:path';

export const DATA_DIR = path.resolve(process.env.DATA_DIR || (process.env.VERCEL ? '/tmp' : './data'));
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    email         TEXT NOT NULL,
    password_hash TEXT,
    role          TEXT NOT NULL DEFAULT 'user',
    full_name     TEXT,
    data          TEXT NOT NULL DEFAULT '{}',
    created_date  TEXT NOT NULL,
    updated_date  TEXT NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower ON users (lower(email));
  CREATE TABLE IF NOT EXISTS records (
    id           TEXT PRIMARY KEY,
    entity       TEXT NOT NULL,
    data         TEXT NOT NULL,
    created_by   TEXT,
    created_date TEXT NOT NULL,
    updated_date TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_records_entity ON records (entity, created_date);
`;

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
let exec;   // (sql, params) => Promise<rows[]>

if (url) {
  const { default: pg } = await import('pg');
  const local = /localhost|127\.0\.0\.1/.test(url);
  // strip sslmode from the URL so our explicit ssl option wins (Supabase uses a managed cert chain)
  const pool = new pg.Pool({
    connectionString: url.replace(/[?&]sslmode=[^&]*/g, ''),
    ssl: local ? false : { rejectUnauthorized: false },
    max: process.env.VERCEL ? 3 : 10,
  });
  exec = async (sql, params = []) => (await pool.query(sql, params)).rows;
  console.log('[db] using Postgres via DATABASE_URL');
} else {
  const { PGlite } = await import('@electric-sql/pglite');
  const lite = new PGlite(path.join(DATA_DIR, 'pgdata'));
  exec = async (sql, params = []) => (await lite.query(sql, params)).rows;
  console.log('[db] DATABASE_URL not set — using embedded local Postgres in', DATA_DIR);
}

// Run the schema once (statements separated so every driver accepts them)
const ready = (async () => {
  for (const stmt of SCHEMA.split(';').map((s) => s.trim()).filter(Boolean)) await exec(stmt);
})();

export const all = async (sql, params) => { await ready; return exec(sql, params); };
export const one = async (sql, params) => (await all(sql, params))[0];
export const run = async (sql, params) => { await all(sql, params); };

export const newId = () => {
  const b = new Uint8Array(12); crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
};
export const now = () => new Date().toISOString();
