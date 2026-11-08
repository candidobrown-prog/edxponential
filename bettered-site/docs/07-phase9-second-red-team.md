# Phase 9 — Second, independent red team (attacking the new build)

Approach: reviewed the built pages cold, as a superintendent, a procurement officer and an outside creative director, then fixed what could be fixed in this session.

| Question | Finding | Action |
|---|---|---|
| What still feels generic? | Method step kickers read "01 · Baseline / Signal / Rise / Hold" — our internal motion vocabulary, meaningless to a buyer | **Fixed:** "Stage 01–04" |
| Where is the medical model gimmicky? | Solution pages showed "intensity bars" of 2/4 for three EdSolutions while saying intensity is set by the diagnosis — a fake precision | **Fixed:** intensity shown only for Whole-School Turnaround ("highest intensity") |
| Where is yellow overused? | Navy evidence band had a yellow kicker, a yellow evidence-note rule and two yellow metric points in one viewport | **Fixed:** metric points removed; evidence-note rule white on navy. One signal per viewport |
| Where is Pulse misused? | "Intensive care" label in Pulse failed contrast (3.09:1) as small text | **Fixed:** Ink text with a Pulse square marker; Pulse now appears once, as a shape |
| What would a senior engineer simplify? | Immutable caching on unversioned assets; inline script blocking a strict CSP | **Fixed:** hashed `?v=` on CSS/JS, immutable only for fonts/CSS/JS; inline script moved into `main.js`; CSP `script-src 'self'` |
| What would an accessibility specialist reject? | Links with `role=listitem`; skipped heading levels on two pages; low-contrast kicker on founder card | **Fixed** (axe: 0 violations) |
| Which mobile section is compromised? | Hero Vital Line took ~300 px above the evidence on phones | **Fixed:** capped at 15 rem; evidence now begins within the second screen at 390 px |
| Where would a superintendent hesitate? | Only one case study, from one charter school, one year of results, unnamed assessment | **Not fixable without inputs.** Logged as launch condition L1 and post-launch priority: two more case studies, ideally one district |
| What evidence remains weak? | Same; plus testimonial from a different school than the case study | Disclosed honestly; quote attribution is explicit |
| What does procurement still need? | UEI/SAM, state vendor numbers, insurance, certifications, capability PDF | Page structured to receive them; nothing invented (L4) |
| Which page is weakest? | Partner — thin, no examples (by necessity) | Kept short and useful; not padded |
| What still feels like a template? | Repeated two-column "callout" pairs on several pages | Accepted: they carry real, distinct content (examine/measure; receive/bands; not/privacy). A designer pass with authentic photography (M1) is the biggest remaining lift |
| What would an elite creative director remove? | Nothing decorative remains besides the Vital Line and signature rule. Would push for photography to add humanity | M1 |
| Is the copy consulting filler? | Reviewed every EdSolution paragraph against "could another firm publish this unchanged?" Two lines rewritten during build (invented operational promises such as "second-practitioner review" and "reply within two business days" were removed because BetterEd has not committed to them) | Fixed |

**Exit:** strongest criticisms addressed in code; the remaining ones depend on owner inputs and are listed as conditions, not hidden.
