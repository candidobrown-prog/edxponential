// Generic entity store + the Base44-style access rules (RLS) found in entities/*.jsonc
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { all, one, run, newId, now, T } from './db.js';
import { publicUser, createUser, getUserById, hashPassword } from './auth.js';

// ctx.user may be a Promise (resolved lazily so synchronous-looking SDK calls still work)
const resolveCtx = async (ctx) => ({ ...ctx, user: await ctx.user });

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'entities');

// ---------- schemas ----------
const stripJsonc = (s) => s.replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (m, str) => str || '');
export const schemas = {};
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.jsonc'))) {
  try {
    const s = JSON.parse(stripJsonc(fs.readFileSync(path.join(dir, f), 'utf8')));
    schemas[s.name || f.replace('.jsonc', '')] = s;
  } catch (e) { console.error(`[entities] could not parse ${f}:`, e.message); }
}

// ---------- query matching (Mongo-style subset Base44 supports) ----------
const get = (rec, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), rec);
const eq = (a, b) => (Array.isArray(a) && !Array.isArray(b) ? a.includes(b) : JSON.stringify(a) === JSON.stringify(b));
const cmp = (a, b) => (a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : 0);

function matchField(val, cond) {
  if (cond && typeof cond === 'object' && !Array.isArray(cond) && Object.keys(cond).some((k) => k.startsWith('$'))) {
    return Object.entries(cond).every(([op, v]) => {
      switch (op) {
        case '$eq': return eq(val, v);
        case '$ne': return !eq(val, v);
        case '$in': return v.some((x) => eq(val, x));
        case '$nin': return !v.some((x) => eq(val, x));
        case '$gt': return cmp(val, v) > 0;
        case '$gte': return cmp(val, v) >= 0;
        case '$lt': return cmp(val, v) < 0;
        case '$lte': return cmp(val, v) <= 0;
        case '$exists': return (val !== undefined && val !== null) === !!v;
        case '$regex': return new RegExp(v, cond.$options || '').test(String(val ?? ''));
        case '$options': return true;
        case '$contains': return Array.isArray(val) ? val.includes(v) : String(val ?? '').includes(v);
        default: throw new Error(`Unsupported query operator ${op}`);
      }
    });
  }
  return eq(val, cond);
}
export function matches(rec, q) {
  if (!q) return true;
  return Object.entries(q).every(([k, v]) => {
    if (k === '$or') return v.some((s) => matches(rec, s));
    if (k === '$and') return v.every((s) => matches(rec, s));
    if (k === '$nor') return !v.some((s) => matches(rec, s));
    return matchField(get(rec, k), v);
  });
}

function sortRows(rows, sort) {
  if (!sort) return rows;
  const desc = sort.startsWith('-'); const key = desc ? sort.slice(1) : sort;
  return [...rows].sort((a, b) => {
    const x = get(a, key), y = get(b, key);
    if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
    const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
    return desc ? -c : c;
  });
}

// ---------- RLS ----------
const tpl = (v, user) => (typeof v === 'string' && /^\{\{\s*user\.(\w+)\s*\}\}$/.test(v)
  ? (user ? user[v.match(/user\.(\w+)/)[1]] ?? null : null) : v);

function evalRule(rule, { user, rec }) {
  if (rule === undefined || rule === null) return !!user;           // no rule: any signed-in user
  return Object.entries(rule).every(([k, v]) => {
    if (k === '$or') return v.some((r) => evalRule(r, { user, rec }));
    if (k === '$and') return v.every((r) => evalRule(r, { user, rec }));
    if (k === 'user_condition') {
      return Object.entries(v).every(([uk, uv]) => uk === 'isAuthenticated' ? !!user === !!uv : user?.[uk] === uv);
    }
    const want = tpl(v, user);
    if (want === null) return false;
    const field = k.startsWith('data.') ? k.slice(5) : k;
    return matchField(get(rec, field), want);
  });
}
const rule = (entity, action) => schemas[entity]?.rls?.[action];
const allowed = (entity, action, ctx) => ctx.service || evalRule(rule(entity, action), ctx);

// ---------- row <-> record ----------
const toRec = (row) => ({ ...JSON.parse(row.data), id: row.id, created_by: row.created_by, created_date: row.created_date, updated_date: row.updated_date });
const forbid = (msg = 'Permission denied') => Object.assign(new Error(msg), { status: 403 });
const notFound = (msg = 'Not found') => Object.assign(new Error(msg), { status: 404 });

function applyDefaults(entity, data) {
  const props = schemas[entity]?.properties || {};
  const out = { ...data };
  for (const [k, p] of Object.entries(props)) if (out[k] === undefined && p.default !== undefined) out[k] = p.default;
  const missing = (schemas[entity]?.required || []).filter((k) => out[k] === undefined || out[k] === null || out[k] === '');
  if (missing.length) throw Object.assign(new Error(`Missing required field(s): ${missing.join(', ')}`), { status: 422 });
  return out;
}
const RESERVED = ['id', 'created_date', 'updated_date', 'created_by'];
const clean = (d) => Object.fromEntries(Object.entries(d || {}).filter(([k]) => !RESERVED.includes(k)));

// ---------- the User entity (backed by the users table) ----------
const userRecs = async () => (await all(`SELECT * FROM ${T.users}`)).map(publicUser);
function userApi(ctx0) {
  const setup = async () => { const ctx = await resolveCtx(ctx0); const isAdmin = ctx.service || ctx.user?.role === 'admin'; return { ctx, isAdmin }; };
  const visible = async ({ ctx, isAdmin }) => { const u = await userRecs(); return isAdmin ? u : ctx.user ? u.filter((x) => x.id === ctx.user.id) : []; };
  const finish = (rows, { sort = '-created_date', limit, skip = 0 } = {}) => sortRows(rows, sort).slice(skip, limit ? skip + limit : undefined);
  const api = {
    list: async (sort, limit, skip) => finish(await visible(await setup()), { sort, limit, skip }),
    filter: async (q, sort, limit, skip) => finish((await visible(await setup())).filter((r) => matches(r, q)), { sort, limit, skip }),
    get: async (id) => { const u = (await visible(await setup())).find((x) => x.id === id); if (!u) throw notFound(); return u; },
    create: async (d) => { const { isAdmin } = await setup(); if (!isAdmin) throw forbid(); return publicUser(await createUser(d)); },
    update: async (id, d) => {
      const { ctx, isAdmin } = await setup();
      if (!isAdmin && ctx.user?.id !== id) throw forbid();
      const row = await getUserById(id); if (!row) throw notFound();
      const { email, role, full_name, password, ...extra } = clean(d);
      const data = { ...JSON.parse(row.data), ...extra };
      await run(`UPDATE ${T.users} SET full_name=$1, role=$2, data=$3, password_hash=$4, updated_date=$5 WHERE id=$6`,
        [full_name ?? row.full_name, isAdmin && role ? role : row.role, JSON.stringify(data), password ? hashPassword(password) : row.password_hash, now(), id]);
      return publicUser(await getUserById(id));
    },
    delete: async (id) => { const { isAdmin } = await setup(); if (!isAdmin) throw forbid(); await run(`DELETE FROM ${T.users} WHERE id=$1`, [id]); return { success: true }; },
    bulkCreate: async (arr) => { const out = []; for (const d of arr) out.push(await api.create(d)); return out; },
  };
  return api;
}

// ---------- the generic entity API ----------
export function entityApi(entity, ctx0) {
  if (entity === 'User') return userApi(ctx0);
  const load = async () => (await all(`SELECT * FROM ${T.records} WHERE entity = $1`, [entity])).map(toRec);
  const readable = (rows, ctx) => rows.filter((rec) => allowed(entity, 'read', { ...ctx, rec }));
  const finish = (rows, { sort = '-created_date', limit, skip = 0 } = {}) => sortRows(rows, sort).slice(skip, limit ? skip + limit : undefined);
  const fetchRow = async (id) => { const row = await one(`SELECT * FROM ${T.records} WHERE entity=$1 AND id=$2`, [entity, id]); if (!row) throw notFound(`${entity} ${id} not found`); return row; };

  const api = {
    list: async (sort, limit, skip) => finish(readable(await load(), await resolveCtx(ctx0)), { sort, limit, skip }),
    filter: async (q, sort, limit, skip) => finish(readable(await load(), await resolveCtx(ctx0)).filter((r) => matches(r, q)), { sort, limit, skip }),
    get: async (id) => {
      const ctx = await resolveCtx(ctx0); const rec = toRec(await fetchRow(id));
      if (!allowed(entity, 'read', { ...ctx, rec })) throw forbid();
      return rec;
    },
    create: async (input) => {
      const ctx = await resolveCtx(ctx0);
      const data = applyDefaults(entity, clean(input));
      if (!allowed(entity, 'create', { ...ctx, rec: data })) throw forbid();
      const id = newId(), t = now();
      await run(`INSERT INTO ${T.records} (id,entity,data,created_by,created_date,updated_date) VALUES ($1,$2,$3,$4,$5,$6)`,
        [id, entity, JSON.stringify(data), ctx.user?.email ?? null, t, t]);
      return { ...data, id, created_by: ctx.user?.email ?? null, created_date: t, updated_date: t };
    },
    bulkCreate: async (arr) => { const out = []; for (const d of arr) out.push(await api.create(d)); return out; },
    update: async (id, patch) => {
      const ctx = await resolveCtx(ctx0); const row = await fetchRow(id);
      if (!allowed(entity, 'update', { ...ctx, rec: toRec(row) })) throw forbid();
      const data = { ...JSON.parse(row.data), ...clean(patch) }; const t = now();
      await run(`UPDATE ${T.records} SET data=$1, updated_date=$2 WHERE id=$3`, [JSON.stringify(data), t, id]);
      return { ...data, id, created_by: row.created_by, created_date: row.created_date, updated_date: t };
    },
    delete: async (id) => {
      const ctx = await resolveCtx(ctx0); const row = await fetchRow(id);
      if (!allowed(entity, 'delete', { ...ctx, rec: toRec(row) })) throw forbid();
      await run(`DELETE FROM ${T.records} WHERE id=$1`, [id]);
      return { success: true };
    },
  };
  return api;
}

export const entitiesFor = (ctx) => new Proxy({}, { get: (_, name) => (typeof name === 'string' ? entityApi(name, ctx) : undefined) });
