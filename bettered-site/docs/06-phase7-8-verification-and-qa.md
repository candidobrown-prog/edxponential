# Phase 7 — Evidence and content verification

Every public claim was traced to `src/content/claims.mjs`. Result:

| Item | On site? | Basis | Treatment |
|---|---|---|---|
| +15 pts reading, +14 pts math (CL-01/02) | Yes | Previously published by BetterEd; marked approved on current site | Labelled percentage points; baseline undisclosed; source not named; internal verification; shared attribution — printed beside every instance. **Launch condition:** locate written approval and name the assessment. |
| +406 ranking positions (CL-03) | **No** | No ranking source | Blocked by build (DO NOT PUBLISH) |
| Shawn Hardnett quote (CL-04) | Yes | Previously published | Launch condition: written permission on file |
| Other testimonials (CL-05) | No | Generic | Internal only |
| Client and partner logos (CL-06/07) | **No** | No permissions; includes state agencies | Removed |
| Founded 2019, New Jersey (CL-08) | Yes | Owner / current site | — |
| Founder education and career (CL-09/10) | Yes | Owner-stated | No "Dr."; no institutional endorsement implied; no Ed.M. suffix |
| SHI 12 domains, bands, 48-hour review (CL-11) | Yes | Current site | 48-hour promise must remain operationally true |
| Team names/titles (CL-12) | Yes | Current site | Launch condition: confirm "Ashley Furan" vs "Fearon", "Jhay" vs "Jay", and titles |
| Phone 1-800-735-0953, info@ email | Yes | Current site | Confirm both are monitored |
| Procurement registrations, certifications, insurance | **Not stated** | None verified | "Registration and certification details, where held" only |
| Partnerships | **None claimed** | — | Partner page explains how, implies no existing partners |
| Downloadable resources | None | — | Capability statement is "on request", not a dead link |
| MASTERY behaviour lines | Yes | Brand Guidelines wording (+ owner prompt's Accountability example) | — |
| EdSolution "what we examine / measure" copy | Yes | Written for this build from guidelines and current-site themes | Owner content approval required (launch condition) |
| Draft article "Diagnosis before prescription" | Preview only | Written for this build | Excluded from production by build guard |

**Phase 7 exit:** no unsupported public claim remains. Two classes of claim are carried forward with written conditions (CL-01/02/04/12).

# Phase 8 — Technical QA (evidence)

All tests run 8 Nov 2026 against the production build (`dist/`) served locally. Scripts are in `scripts/`; raw output in `qa/`.

| Requirement | Result | Evidence |
|---|---|---|
| Production build | **PASS** | `node build.mjs` → "dist: 18 routes written" (17 indexable + 404) |
| HTML validity | **PASS** | `html-validate` (recommended ruleset; lowercase doctype and inline-style rules off) → 0 errors on 18 files |
| Internal links and anchors | **PASS** | `scripts/qa-links.mjs` → 795 internal links checked, 0 broken. External: 3 live-site article URLs (see launch condition L5) |
| Automated accessibility | **PASS** | axe-core 4.10.2, WCAG 2.0/2.1/2.2 A+AA + best-practice, 18 routes × 2 widths = 36 runs → **0 violations** (`qa/a11y-results.json`). Initial run found 4 issues (Pulse text contrast, kicker contrast on portrait card, `role=listitem` on links, heading order) — all fixed |
| Keyboard | **PASS** | Skip link first and functional; mobile menu opens with Enter, focus moves in and is contained, Escape closes and restores focus, closed menu is `inert`; SHI tabs operate with Arrow/Home/End; all controls reachable |
| Forms | **PASS** | Empty submit → errors announced, focus to first invalid field, nothing sent; invalid email rejected; delivery failure shows "Your message was not sent" (never false success); one request on double-click; text preserved; `?type=` preselects inquiry |
| Reduced motion | **PASS** | With `prefers-reduced-motion: reduce`: Vital Line complete on load (dashoffset 0), metrics show final values, 0 hidden reveal elements |
| Motion | **PASS** | Hero headline opacity 1 at first paint; Vital Line draws once and settles (offset 0, no loop) |
| Responsive / overflow | **PASS** | 15 routes at 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920 px → no horizontal overflow (one 23px overflow at 320 px on the case-study table found and fixed) |
| Console | **PASS** | No console errors on any route (Chromium) |
| Lighthouse (mobile, simulated slow 4G, Moto G-class CPU) | **PASS** | Home: Perf 98 · A11y 100 · BP 100 · SEO 100 · LCP 2.2 s · CLS 0 · TBT 0 ms. SHI: 99/100/100/100, LCP 2.0 s. Case study: 98/100/100/100, LCP 2.2 s. Contact: 100/100/100/100, LCP 1.8 s |
| INP | **Not measurable in lab** | TBT 0–20 ms is the lab proxy. Measure field INP after launch (Vercel Speed Insights or CrUX) |
| Weight | **PASS** | First-party JS 12.5 KB raw / 4.3 KB gzip (budget 170 KB). CSS 38.8 KB / 8.2 KB gzip. Fonts 95 KB (Latin WOFF2, 2 preloaded). Home HTML 7.0 KB gzip. Total home transfer 179 KB uncompressed (local server, no gzip). No third-party scripts. No images on content routes |
| Metadata / sitemap / structured data | **PASS (generated)** | Unique titles/descriptions; 17 URLs in sitemap; JSON-LD present on every route. **Not yet validated** in Google's Rich Results Test (needs public URL) |
| Security headers | **Configured, not live-tested** | `vercel.json`: HSTS, CSP (`script-src 'self'`), nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options DENY |
| Contact function | **Partially tested** | Client path tested against a 503 stub. `api/contact.js` server validation, honeypot, timing and rate-limit logic reviewed; live delivery **untested** until `RESEND_API_KEY` exists |
| Browsers | **Chromium only** | Safari (macOS, iOS), Firefox, Edge and Android Chrome **UNRESOLVED** — not available in this environment. Risk areas to check: sticky header + `inert`, `text-wrap: balance` (progressive), SVG `transform-box`, `size-adjust` fallback |
| Image integrity | **PASS** | Official logo SVGs used unmodified (reversed variant: background panel removed only) |

## Screenshots

`qa/shots/` (1440 + 390, 15 routes), `qa/widths/` (9 widths × 15 routes). Reviewed visually; issues found and fixed during review: hero label collision, Vital Line dash rendering bug with non-scaling strokes, grid column offsets collapsing, MASTERY list layout, founder card overlap, stray commas in two templates, case-study label alignment, 320 px table overflow.
