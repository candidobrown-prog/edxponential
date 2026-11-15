// Drop-in replacement for the Base44 SDK client.
// Same surface the app already uses (base44.entities.X.*, base44.auth.*, base44.integrations.Core.*,
// base44.functions.invoke) — but it talks to this project's own backend (/api/*) instead of Base44.
// The file keeps its old name so the ~180 files that import it did not have to change.

const TOKEN_KEY = 'edx_token';
const API = (import.meta.env.VITE_API_URL || '') + '/api';

export const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
export const setToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ } };

async function request(method, path, body, { form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined && !form) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${path}`, { method, headers, body: form ? body : body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const err = new Error((data && (data.message || data.error)) || `Request failed (${res.status})`);
    err.status = res.status; err.data = data;
    throw err;
  }
  return data;
}

const qs = (o) => {
  const p = new URLSearchParams();
  Object.entries(o).forEach(([k, v]) => v !== undefined && v !== null && p.set(k, v));
  const s = p.toString(); return s ? `?${s}` : '';
};

const entity = (name) => ({
  list: (sort, limit, skip) => request('GET', `/entities/${name}${qs({ sort, limit, skip })}`),
  filter: (query, sort, limit, skip) => request('POST', `/entities/${name}/query`, { query, sort, limit, skip }),
  get: (id) => request('GET', `/entities/${name}/${id}`),
  create: (data) => request('POST', `/entities/${name}`, data),
  bulkCreate: (items) => request('POST', `/entities/${name}/bulk`, items),
  update: (id, data) => request('PUT', `/entities/${name}/${id}`, data),
  delete: (id) => request('DELETE', `/entities/${name}/${id}`),
});

const auth = {
  me: () => request('GET', '/auth/me'),
  updateMe: (data) => request('PUT', '/auth/me', data),
  isAuthenticated: async () => { if (!getToken()) return false; try { await auth.me(); return true; } catch { return false; } },
  async login(email, password) { const r = await request('POST', '/auth/login', { email, password }); setToken(r.token); return r.user; },
  async register(email, password, full_name) { const r = await request('POST', '/auth/register', { email, password, full_name }); setToken(r.token); return r.user; },
  logout(redirectUrl) { setToken(null); window.location.href = redirectUrl ? '/' : '/'; },
  redirectToLogin() { setToken(null); window.location.href = '/'; },
};

const core = new Proxy({}, {
  get: (_, fn) => (params = {}) => {
    if (fn === 'UploadFile') {
      const form = new FormData(); form.append('file', params.file);
      return request('POST', '/integrations/core/UploadFile', form, { form: true });
    }
    return request('POST', `/integrations/core/${String(fn)}`, params);
  },
});

export const base44 = {
  entities: new Proxy({}, { get: (_, name) => (typeof name === 'string' ? entity(name) : undefined) }),
  auth,
  integrations: { Core: core },
  functions: {
    // axios-style result ({ data }) because the app reads `res.data.*`
    invoke: async (name, payload = {}) => ({ data: await request('POST', `/functions/${name}`, payload), status: 200 }),
  },
  connectors: {
    connectAppUser: async () => { throw new Error('LinkedIn sign-in is not enabled in this deployment.'); },
  },
};
