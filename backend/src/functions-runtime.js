// Runs the ported Base44 backend functions (backend/functions/*.js) on Node.
// Each function is still written as `Deno.serve(async (req) => Response)` and calls
// `createClientFromRequest(req)` — this file provides both.
// Functions are loaded on first use via literal import() paths so bundlers (Vercel) include them.
import { userFromRequest } from './auth.js';
import { entitiesFor } from './entities.js';
import { Core } from './integrations.js';

const loaders = {
  adminIssueRefund: () => import('../functions/adminIssueRefund.js'),
  computeMatchScores: () => import('../functions/computeMatchScores.js'),
  computePitchReadiness: () => import('../functions/computePitchReadiness.js'),
  createCheckout: () => import('../functions/createCheckout.js'),
  generateThesis: () => import('../functions/generateThesis.js'),
  getActivePullRequests: () => import('../functions/getActivePullRequests.js'),
  getFinancialSummary: () => import('../functions/getFinancialSummary.js'),
  sendSessionReminders: () => import('../functions/sendSessionReminders.js'),
  stripeWebhook: () => import('../functions/stripeWebhook.js'),
};
export const functionNames = Object.keys(loaders);

const handlers = new Map();
let loading = null;
let chain = Promise.resolve();   // load one function at a time so Deno.serve() knows whose handler it is

globalThis.Deno = {
  env: { get: (k) => process.env[k] },
  serve: (handler) => { if (loading) handlers.set(loading, handler); },
};

const wrapIntegrations = () => ({ Core });
const connectors = {
  async getConnection(name) {
    if (name === 'github' && process.env.GITHUB_TOKEN) return { accessToken: process.env.GITHUB_TOKEN };
    throw new Error(`Connector "${name}" is not configured (set GITHUB_TOKEN for github)`);
  },
};

export function createClientFromRequest(req) {
  const user = userFromRequest({ headers: req.headers });   // a Promise; resolved lazily by the entity layer
  return {
    auth: { me: async () => user, isAuthenticated: async () => !!(await user) },
    entities: entitiesFor({ user }),
    integrations: wrapIntegrations(),
    asServiceRole: { entities: entitiesFor({ service: true }), integrations: wrapIntegrations(), connectors },
  };
}

async function ensureLoaded(name) {
  if (handlers.has(name)) return;
  const run = chain.then(async () => {
    if (handlers.has(name)) return;
    loading = name;
    try { await loaders[name](); } finally { loading = null; }
  });
  chain = run.catch(() => {});
  await run;
}

export async function loadFunctions() { /* lazy — nothing to do at startup */ }

export async function invokeFunction(name, { headers = {}, body, origin } = {}) {
  if (!loaders[name]) throw Object.assign(new Error(`Function "${name}" not found`), { status: 404 });
  await ensureLoaded(name);
  const h = handlers.get(name);
  if (!h) throw new Error(`Function "${name}" did not register a handler`);
  const hdrs = new Headers(); for (const [k, v] of Object.entries(headers)) if (v !== undefined) hdrs.set(k, Array.isArray(v) ? v.join(',') : String(v));
  if (origin && !hdrs.has('origin')) hdrs.set('origin', origin);
  hdrs.delete('content-length');
  const req = new Request(`http://internal/api/functions/${name}`, { method: 'POST', headers: hdrs, body: body && body.length ? body : undefined });
  return h(req);
}
