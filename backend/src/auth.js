import crypto from 'node:crypto';
import { one, run, newId, now } from './db.js';

// Token-signing secret: JWT_SECRET if set; otherwise derived from the (secret) database URL so production
// works with zero extra config; otherwise an insecure dev-only default.
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const SECRET = process.env.JWT_SECRET
  || (dbUrl ? crypto.createHash('sha256').update(`edx-jwt:${dbUrl}`).digest('hex') : 'dev-insecure-secret');
if (SECRET === 'dev-insecure-secret') console.warn('[auth] No JWT_SECRET or DATABASE_URL — using an insecure dev secret (fine for local use only)');

const b64 = (b) => Buffer.from(b).toString('base64url');
export function signToken(payload, ttlSec = 60 * 60 * 24 * 30) {
  const head = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSec }));
  const sig = crypto.createHmac('sha256', SECRET).update(`${head}.${body}`).digest('base64url');
  return `${head}.${body}.${sig}`;
}
export function verifyToken(token) {
  try {
    const [h, p, s] = token.split('.');
    const expect = crypto.createHmac('sha256', SECRET).update(`${h}.${p}`).digest('base64url');
    if (s.length !== expect.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expect))) return null;
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString());
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch { return null; }
}

export function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${crypto.scryptSync(pw, salt, 64).toString('hex')}`;
}
export function checkPassword(pw, stored) {
  if (!stored) return false;
  const [salt, hash] = stored.split(':');
  const test = crypto.scryptSync(pw, salt, 64).toString('hex');
  return test.length === hash.length && crypto.timingSafeEqual(Buffer.from(test), Buffer.from(hash));
}

const adminEmails = () => (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

// A user as the frontend sees it: custom fields flattened onto the object, no secrets.
export function publicUser(row) {
  if (!row) return null;
  const { password_hash, data, ...rest } = row;
  return { ...JSON.parse(data || '{}'), ...rest };
}
export const getUserByEmail = (email) => one('SELECT * FROM users WHERE lower(email) = lower($1)', [email]);
export const getUserById = (id) => one('SELECT * FROM users WHERE id = $1', [id]);

export async function createUser({ email, password, full_name, role, ...extra }) {
  const count = Number((await one('SELECT COUNT(*) AS c FROM users')).c);
  const isAdmin = count === 0 || adminEmails().includes(email.toLowerCase());
  const id = newId(); const t = now();
  await run(`INSERT INTO users (id,email,password_hash,role,full_name,data,created_date,updated_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [id, email, password ? hashPassword(password) : null, role || (isAdmin ? 'admin' : 'user'), full_name || email.split('@')[0], JSON.stringify(extra), t, t]);
  return getUserById(id);
}

export async function userFromRequest(req) {
  const h = req.headers.authorization || req.headers.Authorization || (typeof req.headers.get === 'function' ? req.headers.get('authorization') : '');
  const token = h?.startsWith('Bearer ') ? h.slice(7) : null;
  const payload = token && verifyToken(token);
  const row = payload && (await getUserById(payload.sub));
  return row ? publicUser(row) : null;
}
