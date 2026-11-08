# Content model, SEO/AEO, analytics event map, media rights inventory

## 1. Content model (`src/content/`)

| Model | File / export | Fields | Lifecycle |
|---|---|---|---|
| Site config | `site.mjs › site` | name, legalName, url, tagline, description, email, phone, founded, shiIntakeUrl, contactEndpoint, primaryCta, secondaryCta | — |
| Navigation | `nav`, `footerNav` | label, href | — |
| Method stages | `method` | key, name, line, body, activities[], output | — |
| EdSolutions | `solutions` | slug, n, name, role, short, cta, contactType, hero, lead, why[], examine[[k,v]], work[], measures[], children, related[], intensive, caseStudy | Order is fixed and enforced by array order |
| MASTERY | `mastery` | l, name, text, behavior | — |
| SHI domains / bands | `shiDomains`, `shiBands` | n, name, looks, solution / range, name | — |
| Founder | `founder` | name, title, photo (null until M2), summary, story[], creds[] | — |
| Team | `team` | [name, title] | Review (CL-12) |
| Case studies | `caseStudies` | slug, status, school, title, summary, facts, solutions[], claims[], stages{condition, diagnosis, treatment, strengthening, sustainability} | draft → review → approved → published → archived |
| Insights | `insights` | slug, status, title, deck, category, author, date, readMinutes, related[], body[[type, text]], externalUrl | same; `external` = live on old site, not yet migrated |
| Claims | `claims.mjs › claims` | wording, value, unit, organization, metric, definition, baseline, endValue, dates, population, source, sourceLocation, type, percentVsPoints, role, attribution, verification, clientApproval, status, lastReview, pages[] | VERIFIED + APPROVED, PUBLIC DATA, OWNER STATED, CLIENT REPORTED · PREVIOUSLY PUBLISHED (publishable); VERIFIED PENDING, INTERNAL ONLY, UNVERIFIED, DO NOT PUBLISH (blocked) |

Guards enforced by the build (tested):
- `claim(id)` throws if the claim's status is not publishable → the build fails.
- Production build throws if any rendered page contains draft content ("Draft for owner review").
- Draft/review items are excluded from production routes, sitemap and structured data; preview articles carry `noindex`.

## 2. SEO / AEO implementation

- Unique `<title>` ("Page | BetterEd Solutions") and meta description on every route; canonical URLs on the non-www host with trailing slash.
- Open Graph + Twitter large card on every page; branded 1200×630 `og-default.png`.
- `sitemap.xml` (17 indexable routes, drafts excluded), `robots.txt` (disallows /api/).
- JSON-LD: Organization (home, about), WebSite (home), BreadcrumbList (all inner pages), Service (each EdSolution), Article (case study, insights), Person (founder, About). No review/rating markup (would misuse structured data).
- Heading hierarchy: one h1 per page, no skipped levels (axe `heading-order` clean).
- AEO: entity-first factual sentences that answer the likely questions directly, using the full name "BetterEd Solutions":
  - What is BetterEd Solutions? → Home hero kicker + About lead + Organization `description`.
  - What does it do / who does it serve? → About lead, Procurement overview table.
  - What are the EdSolutions? → /solutions/ intro and list; Service schema.
  - How does it approach improvement? → /approach/ (Diagnose → Treat → Strengthen → Sustain).
  - What is the School Health Index? → /school-health-index/ hero sentence.
  - Who founded BetterEd? → About founder section; Person schema.
  - What evidence does it report? → /results/ with definitions and limits.
  - How can a district work with BetterEd? → /approach/ "The first month, plainly"; /procurement/.
- Redirect map from the live site in `vercel.json` (preserves equity from old URLs).

## 3. Analytics event map

No analytics script is loaded today (privacy-first; M11). `main.js` exposes `betteredTrack(name, props)` and forwards to Plausible only if the owner installs it. Events (no personal data in props):

| Event | Trigger | Props | Funnel stage |
|---|---|---|---|
| `CTA primary` / `CTA header` / `CTA mobile menu` / `CTA solution` | Click on primary CTAs | label, path | Diagnosis intent |
| `SHI opened` | Any link to the School Health Index; SHI page view | label, path | Diagnosis intent |
| `School Health Index opened` | SHI page load | path | Evidence → Diagnosis |
| `SHI domain viewed` | Domain tab selected | domain | Engagement |
| `Diagnostic started` | "Start the School Health Index" click | path | Diagnosis |
| `Diagnostic completed` | To be fired by the SHI intake app on submit (M9) | — | Diagnosis |
| `EdSolution viewed` | EdSolution page load; list click | label | Understanding |
| `Results opened` | /results load | path | Evidence |
| `Case study viewed` | Case study load; links | path | Evidence |
| `Insight viewed` | Article card click / article load | label | Trust |
| `Procurement opened` / `Procurement inquiry` | Page load / CTA / successful procurement submission | — | Procurement |
| `Contact opened` | /contact load | path | Conversation |
| `Contact started` | First input in form | type | Conversation |
| `Contact completed` | Server confirmed delivery (`ok:true`) | type | Conversion |
| `Contact failed` | Delivery failed | — | Diagnostic |

Funnel view: Home → EdSolution viewed → Results/Case study viewed → SHI opened / Contact opened → Contact started → Contact completed (qualified inquiry is judged in the inbox, not the browser).

## 4. Media rights inventory

| File | Source | Owner / creator | License | Release status | Subject | Placement | Client association | Authenticity | Reviewed |
|---|---|---|---|---|---|---|---|---|---|
| logo-primary.svg | Brand Kit asset store | BetterEd Solutions | Owned | n/a | Logo | Header | None | Official | 2026-11-08 |
| logo-reversed.svg | Derived from official reversed SVG by removing its navy background panel only (geometry and colors untouched) | BetterEd | Owned | n/a | Logo | Footer | None | Official derivative — confirm with designer | 2026-11-08 |
| app-icon.svg / favicon.svg | Brand Kit (official small-size mark) | BetterEd | Owned | n/a | Mark | Favicon | None | Official | 2026-11-08 |
| apple-touch-icon.png | Rendered from app-icon.svg | BetterEd | Owned | n/a | Mark | iOS | None | Official render | 2026-11-08 |
| og-default.png | Generated from brand assets | BetterEd | Owned | n/a | Logo, headline, Vital Line | Social cards | None | Original | 2026-11-08 |
| fonts/*.woff2 | Libre Franklin, Newsreader (Fontsource 5.3.0) | Impallari Type; Production Type | SIL OFL 1.1 (licenses included) | n/a | — | All pages | — | — | 2026-11-08 |
| Photography | — | — | — | — | — | **None used** (M1, M2, M3) | — | No stock, no AI imagery | 2026-11-08 |

Rule for adding photographs: add a row here with a signed release reference before the file is committed; children appear only with documented consent.
