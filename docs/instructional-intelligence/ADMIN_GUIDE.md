# Administrator Guide — Instructional Intelligence

**Who this is for:** BetterEd platform administrators, district administrators and principals.

## First run
1. Open **Instructional Intelligence** from the platform sidebar (it appears only when the module is enabled and you have a role).
2. As platform admin, click **Create pilot organization**. You receive district administrator and coach roles.
3. **Administration → Schools & roles**: add schools; grant roles by account email (the person must already have an EDXPONTENTIAL account). Roles: district_admin (org-wide), principal, coach, teacher, plc_facilitator, observer, reviewer.
4. **Administration → CFU-100 rubric**: the ten dimensions and weights are built in with Distinguished = 100 % and Proficient = 80 %. Enter the approved **Basic** and **Unsatisfactory** multipliers and the source document, tick *authoritative*, save. Until this is done, CFU-100 scores stay provisional and cannot be finalized.
5. **Privacy, consent & retention**: set retention days and the policy text users see. Each school's recording policy decides whether per-observation authorization is required (default: yes).

## What administrators can and cannot see
- Platform administrators configure the system and read audit logs but **cannot open recordings, transcripts, analyses or teacher reflections** unless they also hold a school role.
- Principals see schoolwide aggregates (suppressed under the school's minimum group size), observations explicitly shared for leadership, and the school audit log. Private teacher reflections are never visible to leadership.
- District administrators see district aggregates and manage schools/roles; no student-level evidence.

## Audit & system health
`Audit & System Health` lists provider configuration (transcription, AI, media storage), recent job failures and the audit log (who did what, allowed or denied). Export is via the API (`GET /api/ii/audit`).

## Removing access
Remove a membership in Administration; the change applies on the user's next request. Observations they created remain readable by them as the record owner (audited) — delete or reassign if that is not desired.

## Support
Issues and feature requests: security@betteredsolutions.org (security) or the BetterEd help desk.
