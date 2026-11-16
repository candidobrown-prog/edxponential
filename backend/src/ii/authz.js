// Instructional Intelligence authorization — deny by default.
// Evaluates organization/school membership, role, resource ownership, explicit sharing grants,
// consent/authorization status and account status. Every decision can be audited.
import { list, tryGet, create as storeCreate, httpError } from './store.js';

export const ROLES = ['district_admin', 'principal', 'coach', 'teacher', 'plc_facilitator', 'observer', 'reviewer'];

/** Load the caller's active memberships once per request. */
export async function loadContext(user) {
  if (!user) return { user: null, memberships: [], platformAdmin: false };
  const memberships = user.disabled ? [] : await list('IIMembership', { user_email: user.email, status: 'active' });
  return { user, memberships, platformAdmin: user.role === 'admin' };
}

const emailEq = (a, b) => !!a && !!b && a.toLowerCase() === b.toLowerCase();

/** Roles the caller holds at a given school (district_admin applies org-wide). */
export function rolesAt(ctx, { organization_id, school_id }) {
  return ctx.memberships
    .filter((m) => m.organization_id === organization_id && (m.role === 'district_admin' ? !m.school_id || m.school_id === school_id : m.school_id === school_id))
    .map((m) => m.role);
}
export const hasRole = (ctx, scope, ...roles) => rolesAt(ctx, scope).some((r) => roles.includes(r));
export const isDistrictAdmin = (ctx, organization_id) => ctx.memberships.some((m) => m.organization_id === organization_id && m.role === 'district_admin');

/** Active sharing grant for a resource to this user (by email or by role at the school). */
export async function hasGrant(ctx, resource_type, resource) {
  if (!ctx.user) return false;
  const grants = await list('IISharingGrant', { resource_type, resource_id: resource.id, status: 'active' });
  const myRoles = rolesAt(ctx, resource);
  return grants.some((g) => (g.grantee_email && emailEq(g.grantee_email, ctx.user.email)) || (g.grantee_role && myRoles.includes(g.grantee_role)));
}

// ---------- decisions ----------
// Each returns { allowed: boolean, reason }
export const decisions = {
  // Operational / tenant admin
  'org.manage': (ctx, org) => ctx.platformAdmin || isDistrictAdmin(ctx, org.id),
  'school.manage': (ctx, school) => ctx.platformAdmin || isDistrictAdmin(ctx, school.organization_id) || hasRole(ctx, { organization_id: school.organization_id, school_id: school.id }, 'principal'),
  'membership.manage': (ctx, scope) => ctx.platformAdmin || isDistrictAdmin(ctx, scope.organization_id) || (scope.school_id && hasRole(ctx, scope, 'principal')),
  'rubric.manage': (ctx) => ctx.platformAdmin || ctx.memberships.some((m) => m.role === 'district_admin'),
  'audit.read': (ctx, scope) => ctx.platformAdmin || isDistrictAdmin(ctx, scope.organization_id) || (scope.school_id && hasRole(ctx, scope, 'principal')),
  'policy.manage': (ctx, scope) => ctx.platformAdmin || isDistrictAdmin(ctx, scope.organization_id),

  // Observations — platform admins get NO automatic access to classroom evidence
  'observation.create': (ctx, scope) => hasRole(ctx, scope, 'coach', 'observer') || hasRole(ctx, scope, 'principal', 'district_admin') /* conditional: leadership may set up observations */,
  'observation.read': async (ctx, obs) => {
    if (!ctx.user) return false;
    if (emailEq(obs.observer_email, ctx.user.email)) return true;
    if (emailEq(obs.teacher_email, ctx.user.email)) return obs.shared_with_teacher === true;
    if (hasRole(ctx, obs, 'coach') && (obs.observer_email ? true : true)) return true;          // coaches at the school see observations there
    if (hasRole(ctx, obs, 'observer')) return await hasGrant(ctx, 'IIObservation', obs);
    if (hasRole(ctx, obs, 'principal', 'district_admin')) return obs.shared_with_leadership === true || await hasGrant(ctx, 'IIObservation', obs);
    if (hasRole(ctx, obs, 'reviewer', 'plc_facilitator')) return await hasGrant(ctx, 'IIObservation', obs);
    return false;
  },
  'observation.update': (ctx, obs) => emailEq(obs.observer_email, ctx.user?.email) || hasRole(ctx, obs, 'coach'),
  'observation.record': async (ctx, obs) => (emailEq(obs.observer_email, ctx.user?.email) || hasRole(ctx, obs, 'coach', 'observer')) && await authorizationValid(obs),
  'observation.share': (ctx, obs) => emailEq(obs.observer_email, ctx.user?.email) || hasRole(ctx, obs, 'coach'),
  'observation.delete_media': (ctx, obs) => emailEq(obs.observer_email, ctx.user?.email) || hasRole(ctx, obs, 'coach') || hasRole(ctx, obs, 'principal'),
  'transcript.edit': (ctx, obs) => emailEq(obs.observer_email, ctx.user?.email) || hasRole(ctx, obs, 'coach') || (emailEq(obs.teacher_email, ctx.user?.email) && obs.shared_with_teacher),
  'transcript.approve': (ctx, obs) => emailEq(obs.observer_email, ctx.user?.email) || hasRole(ctx, obs, 'coach'),
  'analysis.run': (ctx, obs) => emailEq(obs.observer_email, ctx.user?.email) || hasRole(ctx, obs, 'coach'),
  'analysis.review': (ctx, obs) => hasRole(ctx, obs, 'coach'),
  'analysis.approve': (ctx, obs) => hasRole(ctx, obs, 'coach'),
  'media.play': async (ctx, obs) => await decisions['observation.read'](ctx, obs),

  // Reflections — private to the teacher unless explicitly shared
  'reflection.read': (ctx, r) => emailEq(r.teacher_email, ctx.user?.email) || (r.shared_with || []).some((e) => emailEq(e, ctx.user?.email)),
  'reflection.write': (ctx, r) => emailEq(r.teacher_email, ctx.user?.email),

  // Coaching
  'coaching.read': (ctx, c) => emailEq(c.coach_email, ctx.user?.email) || emailEq(c.teacher_email, ctx.user?.email) || (hasRole(ctx, c, 'principal', 'district_admin') && c.shared_with_leadership === true),
  'coaching.write': (ctx, c) => emailEq(c.coach_email, ctx.user?.email),
  'coaching.acknowledge': (ctx, c) => emailEq(c.coach_email, ctx.user?.email) || emailEq(c.teacher_email, ctx.user?.email),
  'actionplan.read': (ctx, p) => emailEq(p.coach_email, ctx.user?.email) || emailEq(p.teacher_email, ctx.user?.email) || hasRole(ctx, p, 'principal', 'district_admin'),
  'actionplan.write': (ctx, p) => emailEq(p.coach_email, ctx.user?.email) || emailEq(p.teacher_email, ctx.user?.email),
  'evidence.write': (ctx, obs) => emailEq(obs.observer_email, ctx.user?.email) || hasRole(ctx, obs, 'coach') || emailEq(obs.teacher_email, ctx.user?.email),

  // Aggregates
  'school.aggregates': (ctx, scope) => hasRole(ctx, scope, 'principal', 'district_admin') || (hasRole(ctx, scope, 'coach') && true),
  'district.aggregates': (ctx, scope) => isDistrictAdmin(ctx, scope.organization_id),
  'plc.read': (ctx, p) => emailEq(p.facilitator_email, ctx.user?.email) || (p.participants || []).some((e) => emailEq(e, ctx.user?.email)) || hasRole(ctx, p, 'principal'),
  'plc.write': (ctx, p) => emailEq(p.facilitator_email, ctx.user?.email) || hasRole(ctx, p, 'plc_facilitator'),
  'plc.create': (ctx, scope) => hasRole(ctx, scope, 'plc_facilitator', 'coach', 'principal'),
};

export async function authorizationValid(obs) {
  if (!obs.authorization_id) return false;
  const a = await tryGet('IIRecordingAuthorization', obs.authorization_id);
  if (!a || a.consent_status !== 'valid') return false;
  if (a.expires_at && new Date(a.expires_at) < new Date()) return false;
  return true;
}

/** Throws 401/403 when not allowed; records an audit event either way for sensitive actions. */
export async function require(ctx, action, resource, { audit = true, req } = {}) {
  const fn = decisions[action];
  if (!fn) throw httpError(500, `Unknown authorization action ${action}`);
  const allowed = ctx.user ? !!(await fn(ctx, resource || {})) : false;
  if (audit || !allowed) {
    storeCreate('IIAuditEvent', {
      organization_id: resource?.organization_id || null, school_id: resource?.school_id || null,
      actor_email: ctx.user?.email || 'anonymous', action, resource_type: resource?.__type || null, resource_id: resource?.id || null,
      outcome: allowed ? 'allowed' : 'denied', ip: req?.ip || null, details: {},
    }).catch(() => {});
  }
  if (!ctx.user) throw httpError(401, 'Not authenticated');
  if (!allowed) throw httpError(403, 'You are not authorized to perform this action');
  return true;
}

export async function can(ctx, action, resource) {
  try { await require(ctx, action, resource, { audit: false }); return true; } catch { return false; }
}

/** Minimum group size suppression for aggregates. */
export function suppress(count, minGroup = 5) { return count < minGroup; }
