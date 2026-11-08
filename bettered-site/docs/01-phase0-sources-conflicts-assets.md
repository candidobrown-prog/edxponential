# Phase 0 — Source ingestion and conflict resolution

Reviewed: 8 November 2026. Reviewer: Claude (Cowork), acting for BetterEd Solutions.

## 1. Source register

| # | Source | Date | Authority level | Purpose | Conflicts found | Current relevance |
|---|---|---|---|---|---|---|
| S1 | Owner's master prompt ("Million-Dollar Website") | 8 Nov 2026 | L1 | Assignment, rules, IA, motion, evidence governance | None internal | Controlling |
| S2 | BetterEd Brand Guidelines (Claude Docs, rev 10) | 7 Nov 2026 | L2 | Positioning, voice, MASTERY text, EdSolutions table, palette, type, signature device, photography | Minor wording differences vs S1 MASTERY copy (S1 wins on wording; meaning identical) | Controlling for brand |
| S3 | BetterEd Brand Kit, Edition 1.0 (Design artifact, 7 boards) | Nov 2026 | L3 | Logo system, clear space, minimum sizes, applications | Brand Kit overview uses pill-shaped "feel" tags (internal board only, not a web pattern) | Controlling for identity application |
| S4 | Official logo SVGs (primary, reversed, mono, app icon) pulled from the Brand Kit asset store | 7 Nov 2026 | L4 | Logo files used unmodified in the build | None | Used as-is (`src/assets/logo-*.svg`) |
| S5 | Owner-stated facts held in Claude memory (career, education, mission, MASTERY "Year after year") | Nov 2026 | L5 (owner-stated, not independently verified) | Founder biography | Live site lists "Ed.M."; owner states master's from HGSE: consistent | Used, flagged for final owner sign-off |
| S6 | Live site betteredsolutions.org (9 pages read in full, 4 follow-ups) | Read 8 Nov 2026 | L6 / L8 | Current content, claims, team, SHI, methodology, case study | Many (see Conflict register) | Content selectively carried forward |
| S7 | Earlier Claude artifacts: "BetterEd Website" (pinned), "BetterEd Solutions Website", homepage review preview, "Better Ed Design System" | 4–7 Nov 2026 | L7 | Prior concepts | Pre-date the 7 Nov brand system | Not used as visual reference; superseded |
| S8 | Baltimore Rising proposal materials (memory) | Nov 2026 | L5 (internal, not public) | Context only | Program is a proposal, not an engagement | Not published (no claim that it is funded or underway) |

Not available in this session: website repository, analytics, real photography, signed client approvals, procurement registrations, capability statement, team bios beyond name and title. The linked computer did not respond, so no local files could be inspected.

## 2. Conflict register

| # | Conflict | Source A | Source B | Resolution |
|---|---|---|---|---|
| C1 | Service taxonomy: "16 services across four practices" (School Transformation; Leadership and Instruction; Talent and Growth; Innovation and Intelligence) | Live site | Guidelines: four EdSolutions | Superseded. Four EdSolutions, fixed order. Old service URLs redirect to /solutions. |
| C2 | Method: "Diagnose. Prescribe. Implement. Monitor. Adjust. Sustain." (6 steps), 13-step process, MIRACLE™ framework | Live site | Guidelines: Diagnose → Treat → Strengthen → Sustain | Superseded. Four-step method everywhere. MIRACLE™ retired from public copy (open decision D4). |
| C3 | Primary CTA: "Let's Get to Work" / "Book a call" / "Book a 30-minute call" | Live site | S1 §35 | Replaced with "Start with the diagnosis"; the 30-minute first call survives as the description of what happens next. |
| C4 | Two theme colors (#071E4A, #00183C), headshot files named "orange"/"lime" | Live site | Guidelines palette | Superseded. Ink Navy #0B1F3A only. Headshots not reused until reshot or recolored on Paper/Navy (Missing asset M3). |
| C5 | Old bar logo | Live site | Guidelines §Next steps: replace with Vital Line | Superseded. Official Vital Line SVGs only. |
| C6 | MASTERY copy wording | Guidelines | S1 §12 | S1 wording used (Level 1). Guidelines wording kept where it adds behaviour detail on the About page. |
| C7 | "Partners": Louisiana Department of Education, DC OSSE, Amplify, etc. shown as "Partner organization" logos | Live site | S1 §56, §62 | Removed. No partner logos until written permission and relationship type are confirmed (P0 in red team). |
| C8 | Result "+406 ranking positions gained" with no named ranking source | Live site | Live site's own methodology §A (a result with a missing element stays unpublished) | Not published. Fails BetterEd's own rule. |
| C9 | Case study labelled "Verified for public use" / "Publicly Verified" while the methodology says internal verification is not independent | Live site case study | Live site methodology §D | New copy says "Verified internally by BetterEd" and "not an independent audit". |
| C10 | SHI says evidence uploads unavailable, while step 01 lists "evidence upload" | Live site | Live site | New SHI page describes only what works today; upload is described as optional and "when available". |
| C11 | Founder named "Candido Brown, Ed.M." on team list; S1 says do not call him Dr. | Live site | S1 §54 | Shown as "Candido Brown, Founder and CEO". Degree stated in prose, not as a suffix. |
| C12 | Team names: "Ashley Furan" vs file "ashley-fearon"; "Jhay Tamayo" vs file "jay-tamayo"; longer vs shorter titles on two pages | Live site | Live site | Short titles from /about/team used. Spellings flagged (D6) — must be confirmed before launch. |
| C13 | Testimonial links "Read more client perspectives" point to a page with no testimonials | Live site | — | Fixed by design: one attributed quote, placed beside the evidence it supports. |
| C14 | Prior concepts (orange-led, cream-heavy, serif headlines) | S7 | S2/S3 | Superseded. Not referenced. |
| C15 | Photography rule says "real Baltimore schools"; BetterEd work also spans DC, NJ, NY | Guidelines | Live site client list | Rule interpreted as "real BetterEd schools, with consent". Logged as D7. |

## 3. Missing asset register

| # | Missing item | Impact | Temporary treatment in the build | Owner action |
|---|---|---|---|---|
| M1 | Authentic BetterEd photography with releases | High (humanity) | Typographic, evidence-led layouts; Vital Line; image slots are designed but empty, never filled with stock | Commission a one-day shoot in two partner schools with consent forms |
| M2 | Founder portrait on Paper or Navy | High (About, homepage) | Founder section uses a typographic portrait card with a Vital Line; `founder.photo` field ready | Supply an approved photo (the live-site "orange" background files conflict with the palette) |
| M3 | Team headshots (on-brand) | Medium | Names and titles only, no headshots | Supply or reshoot |
| M4 | Signed publication approval for Shining Stars results and Shawn Hardnett quote | High (credibility) | Carried forward because already public on the current site; labelled with limitations; flagged CONDITION in launch dossier | Locate written approvals |
| M5 | Assessment/source name for Shining Stars reading and math figures | High | Copy states "source not publicly named" | Name the assessment (e.g., state test, i-Ready) |
| M6 | Procurement facts: UEI, SAM.gov, state vendor numbers, insurance, certifications | High for public buyers | Procurement page lists what to request and what is "available on request"; no numbers invented | Supply verified registrations |
| M7 | Capability statement PDF | Medium | Request-by-form path, not a dead download link | Produce PDF from the brand system |
| M8 | Full text of the three published insight articles | Medium | Listed on Insights linking to the live URLs until migrated; one new article included as DRAFT | Export article bodies for migration |
| M9 | SHI intake application (the five-step intake and Health Portal) | High (diagnostic conversion) | New SHI page sends to `SHI_INTAKE_URL` (config). Default is the contact form pre-set to "School Health Index" | Keep the existing intake running at /school-health-index/start or supply its repo |
| M10 | Form delivery service and domain email (SPF/DKIM) | High | `api/contact.js` validates and sends through Resend when `RESEND_API_KEY` is set; otherwise returns an honest failure | Create the key; verify sending domain |
| M11 | Analytics account | Low | Privacy-light event hooks, no tracker loaded | Choose a cookieless provider (Plausible recommended) |
| M12 | Legal review of privacy/accessibility statements | Medium | Statements describe the actual implementation and say they have not been legally reviewed | Counsel review |
| M13 | Trademark search for the Vital Line and "School Health Index" | Medium | ™ symbol kept on School Health Index as on the current site | Counsel search (Class 41) |

## 4. Phase 0 exit statement

- **Current brand:** Ink Navy + Paper, Harbor Blue for action, one Signal Yellow point, Pulse at most once. Libre Franklin carries the voice; Newsreader carries the story. The Vital Line and the navy-rule-with-yellow-point are the only decoration. Method: Diagnose → Treat → Strengthen → Sustain. Four EdSolutions in fixed order. MASTERY with Y = Year after year.
- **Obsolete:** 16 services / four practices, the six- and thirteen-step processes, MIRACLE™ in public copy, orange/lime headshot backgrounds, the bar logo, "Let's Get to Work", partner logo walls.
- **Safe evidence:** BetterEd's own method, founder biography as stated by the owner, the 12 SHI domains and bands, the methodology principles, and (conditionally) the Shining Stars +15/+14 percentage-point figures with limitations.
- **Missing:** photography, founder portrait, written approvals, assessment source, procurement registrations, capability PDF, article bodies, SHI intake handoff, form delivery key.
