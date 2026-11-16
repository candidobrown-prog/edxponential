# Permission Matrix — as implemented in `backend/src/ii/authz.js`

Roles are memberships (`IIMembership`) scoped to an organization and a school (district_admin is org-wide). A user may hold several. Platform administrators (`users.role = admin`) get operational permissions only. **Deny by default.** "Conditional" means a further resource condition applies (ownership, sharing grant, authorization/consent status).

| Resource / action | Teacher | Coach | Observer | Principal | District admin | PLC facilitator | Reviewer | Platform admin |
|---|---|---|---|---|---|---|---|---|
| Own private reflection (read/write/share/revoke) | Full | No | No | No | No | No | No | No |
| Shared reflection (read) | Owner | Conditional (grant) | Conditional | Conditional | Conditional | Conditional | Conditional | No |
| Create observation | No | Yes | Yes | Yes* | Yes* | No | No | No |
| Read observation | Conditional (shared_with_teacher) | Yes (same school) | Conditional (grant) | Conditional (shared_with_leadership or grant) | Conditional | Conditional (grant) | Conditional (grant) | No |
| Record / upload media | No | Conditional (authorization valid) | Conditional | No | No | No | No | No |
| Play recording | Same as read | Same as read | Same as read | Same as read | Same as read | Same as read | Same as read | No |
| Edit transcript | Conditional (shared) | Yes | Owner | No | No | No | No | No |
| Approve transcript / run analysis | No | Yes | Owner | No | No | No | No | No |
| Review / approve CFU findings | No | Yes | No | No | No | No | No | No |
| Add student-work evidence | Conditional (own lesson, shared) | Yes | Owner | No | No | No | No | No |
| Coaching session read | Own | Own | No | Conditional (shared_with_leadership) | Conditional | No | No | No |
| Coaching session write | No | Own | No | No | No | No | No | No |
| Acknowledge commitments | Own | Own | No | No | No | No | No | No |
| Action plan read / add evidence | Own | Own | No | Yes (school) | Yes (org) | No | No | No |
| School aggregates | No | Yes | No | Yes | Yes | No | No | No |
| District aggregates | No | No | No | No | Yes | No | No | No |
| PLC create | No | Yes | No | Yes | No | Yes | No | No |
| PLC read | Participant | Participant | Participant | Yes (school) | No | Facilitator | No | No |
| Manage school users (memberships) | No | No | No | Yes (school) | Yes (org) | No | No | Yes |
| Create schools / org settings | No | No | No | No | Yes | No | No | Yes |
| Configure CFU-100 rubric | No | No | No | No | Yes | No | No | Yes |
| Retention policy | No | No | No | No | Yes | No | No | Yes |
| Audit log | No | No | No | Yes (school) | Yes (org) | No | No | Yes |
| System health | — | — | — | — | — | — | — | Yes (any signed-in user sees provider status only) |
| Override privacy / consent controls | No | No | No | No | No | No | No | No |

\* Leadership may set up an observation (e.g. assign an observer); recording still requires the coach/observer role and a valid authorization.

Enforcement points: every `/api/ii` route calls `authz.require` on the resource; media playback is a route (no public URL); `II*` entities are blocked at `/api/entities`; aggregates apply `min_group_size` suppression; audit events are written for every sensitive decision (allowed and denied).
