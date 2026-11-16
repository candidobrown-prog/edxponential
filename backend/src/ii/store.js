// Service-role access to II entities. Authorization is NOT done here — see authz.js and routes.js.
import { entitiesFor } from '../entities.js';

const svc = entitiesFor({ service: true });
export const E = (name) => svc[name];

export const get = (entity, id) => E(entity).get(id);
export const list = (entity, query = {}, sort = '-created_date', limit, skip) => E(entity).filter(query, sort, limit, skip);
export const create = (entity, data, actorEmail) => E(entity).create({ ...data, created_by_actor: actorEmail || null });
export const update = (entity, id, patch) => E(entity).update(id, patch);
export const remove = (entity, id) => E(entity).delete(id);
export async function tryGet(entity, id) { try { return await get(entity, id); } catch { return null; } }

export const httpError = (status, message, extra = {}) => Object.assign(new Error(message), { status, ...extra });
