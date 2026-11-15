import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// load backend/.env without needing dotenv (must run before other modules read process.env)
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(root, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const { default: express } = await import('express');
const { default: multer } = await import('multer');
const { UPLOAD_DIR } = await import('./db.js');
const { createUser, getUserByEmail, checkPassword, signToken, publicUser, userFromRequest } = await import('./auth.js');
const { entityApi, schemas } = await import('./entities.js');
const { Core, saveUpload } = await import('./integrations.js');
const { invokeFunction } = await import('./functions-runtime.js');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Wrap async handlers: JSON-serialise the return value, map errors to {error,message} + status
const h = (fn) => async (req, res) => {
  try {
    const out = await fn(req, res);
    if (!res.headersSent && out !== undefined) res.json(out);
  } catch (e) {
    if (!e.status || (e.status >= 500 && e.status !== 501)) console.error(`[${req.method} ${req.path}]`, e);
    if (!res.headersSent) res.status(e.status || 500).json({ error: e.message || 'Server error', message: e.message || 'Server error' });
  }
};
const fail = (status, message) => Object.assign(new Error(message), { status });
const ctxOf = (req) => ({ user: userFromRequest(req) });   // user is a Promise, resolved lazily
const userOf = (req) => userFromRequest(req);

// ---- uploaded files ----
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }));

// ---- backend functions (raw body so the Stripe webhook can verify its signature) ----
app.post('/api/functions/:name', express.raw({ type: '*/*', limit: '10mb' }), h(async (req, res) => {
  const out = await invokeFunction(req.params.name, {
    headers: req.headers,
    body: req.body?.length ? req.body : undefined,
    origin: req.headers.origin || process.env.PUBLIC_URL,
  });
  res.status(out.status);
  out.headers.forEach((v, k) => res.setHeader(k, v));
  res.send(Buffer.from(await out.arrayBuffer()));
}));

app.use(express.json({ limit: '10mb' }));

// ---- auth ----
const attempts = new Map();
const throttle = (req) => {
  const t = Date.now();
  const recent = (attempts.get(req.ip) || []).filter((x) => t - x < 60_000);
  if (recent.length >= 10) throw fail(429, 'Too many attempts. Try again in a minute.');
  attempts.set(req.ip, [...recent, t]);
};
const session = (row) => ({ token: signToken({ sub: row.id }), user: publicUser(row) });

app.post('/api/auth/register', h(async (req) => {
  throttle(req);
  if (process.env.ALLOW_SIGNUP === 'false') throw fail(403, 'Sign-up is closed. Ask an administrator for access.');
  const { email, password, full_name } = req.body || {};
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw fail(422, 'Enter a valid email');
  if (!password || password.length < 8) throw fail(422, 'Password must be at least 8 characters');
  if (await getUserByEmail(email)) throw fail(409, 'An account with this email already exists');
  return session(await createUser({ email, password, full_name }));
}));

app.post('/api/auth/login', h(async (req) => {
  throttle(req);
  const { email, password } = req.body || {};
  const row = email && (await getUserByEmail(email));
  if (!row || !checkPassword(password || '', row.password_hash)) throw fail(401, 'Incorrect email or password');
  return session(row);
}));

app.get('/api/auth/me', h(async (req) => {
  const user = await userOf(req);
  if (!user) throw fail(401, 'Not authenticated');
  return user;
}));

app.put('/api/auth/me', h(async (req) => {
  const user = await userOf(req);
  if (!user) throw fail(401, 'Not authenticated');
  return entityApi('User', { user }).update(user.id, req.body || {});
}));

// ---- entities ----
const intOrUndef = (v) => (v === undefined || v === '' ? undefined : parseInt(v, 10));
app.get('/api/entities/:entity', h(async (req) => {
  const { sort, limit, skip } = req.query;
  return entityApi(req.params.entity, ctxOf(req)).list(sort, intOrUndef(limit), intOrUndef(skip));
}));
app.post('/api/entities/:entity/query', h(async (req) => {
  const { query, sort, limit, skip } = req.body || {};
  return entityApi(req.params.entity, ctxOf(req)).filter(query, sort, limit, skip);
}));
app.post('/api/entities/:entity/bulk', h(async (req) => entityApi(req.params.entity, ctxOf(req)).bulkCreate(req.body)));
app.post('/api/entities/:entity', h(async (req) => entityApi(req.params.entity, ctxOf(req)).create(req.body)));
app.get('/api/entities/:entity/:id', h(async (req) => entityApi(req.params.entity, ctxOf(req)).get(req.params.id)));
app.put('/api/entities/:entity/:id', h(async (req) => entityApi(req.params.entity, ctxOf(req)).update(req.params.id, req.body)));
app.delete('/api/entities/:entity/:id', h(async (req) => entityApi(req.params.entity, ctxOf(req)).delete(req.params.id)));

// ---- integrations ----
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
app.post('/api/integrations/core/UploadFile', upload.single('file'), h(async (req) => {
  if (!(await userOf(req))) throw fail(401, 'Not authenticated');
  if (!req.file) throw fail(422, 'No file received');
  return saveUpload(req.file, { baseUrl: `${req.protocol}://${req.get('host')}` });
}));
app.post('/api/integrations/core/:fn', h(async (req) => {
  if (!(await userOf(req))) throw fail(401, 'Not authenticated');
  const fn = Core[req.params.fn];
  if (!fn) throw fail(404, `Unknown integration ${req.params.fn}`);
  return fn(req.body || {});
}));

// Vercel Cron hits this daily (see vercel.json). Set CRON_SECRET in Vercel; Vercel sends it as a Bearer token.
app.get('/api/cron/reminders', h(async (req) => {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) throw fail(401, 'Unauthorized');
  const out = await invokeFunction('sendSessionReminders', { body: Buffer.from('{}') });
  return { status: out.status, result: await out.text() };
}));

app.get('/api/health', (_req, res) => res.json({ ok: true, entities: Object.keys(schemas).length }));
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// ---- serve the built frontend (production) ----
const dist = path.join(root, '..', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}


export default app;
