# Phase 1 — Red-team report: betteredsolutions.org as it stands

Reviewed 8 November 2026 from the rendered content of 9 pages and 4 follow-up pages. CSS, scripts and analytics were not inspectable from this session; visual findings rest on content, metadata and asset names, and are marked where inferred.

## Executive judgment

**If I were a superintendent deciding whether to place significant school-improvement work in BetterEd's hands, what would this website make me believe?**

That BetterEd is serious, ambitious and genuinely careful about evidence — and that it is trying to be everything at once. I would see a firm that sells sixteen services under four practice names, uses a six-step process on one page, a thirteen-step process on another, a "MIRACLE™" framework in an article, and a medical model that needs a disclaimer saying it is not medicine. I would see two strong numbers from one charter school, a third number whose source is not named, and a wall of logos that puts two state education agencies under "Partner organization". I would come away believing the people are credible and the evidence instincts are right, but I would not be able to say in one sentence what BetterEd does differently or what happens in month one. I would book the call only if someone had already recommended them.

**What currently prevents the website from feeling like a seven-figure professional-services brand?**

1. **No single idea.** The site has a strong idea (diagnosis before prescription) and buries it under taxonomy. Premium firms say one thing relentlessly.
2. **Taxonomy sprawl.** 16 services, 4 practices with names that differ between the homepage and services page, 15 cards on a page that promises 16. A buyer reads that as a firm still deciding what it is.
3. **Evidence that contradicts its own rules.** The methodology page is excellent — better than most firms in the sector. Then the homepage publishes "+406 ranking positions" with no named source, which the methodology says should stay unpublished, and labels internal checks "Publicly Verified".
4. **Borrowed credibility.** Government agencies and vendors as "partners" is the single most dangerous element on the site for a public buyer: procurement and legal teams check these.
5. **Visual identity predates the brand.** Two different navy theme colors, an old bar logo, orange and lime headshot backgrounds. None of it is the 7 November system.
6. **The CTA changes every page** ("Let's Get to Work", "Book a call", "Book a 30-minute call", "Start with a school diagnosis", "Begin Diagnostic"). The single most valuable asset — the School Health Index — competes with a calendar link.

## Findings

### P0 — launch or credibility blockers

| # | Issue | Evidence | Business impact | Recommendation |
|---|---|---|---|---|
| P0-1 | Government agencies and vendors displayed as "Partner organization" | Homepage logo strip: Louisiana Department of Education, DC OSSE, Amplify, Education Elements, Braintrust Tutors, etc. | A state or district reviewer who finds no partnership record will discount everything else; possible misuse of agency marks | Remove. Reintroduce only with written permission and an accurate label ("schools we have served", "we have worked alongside") |
| P0-2 | A published result fails BetterEd's own publication rule | "+406 ranking positions gained", Beginning With Children 2 MS: no named ranking, no baseline, no endpoint; methodology §A says a missing element keeps a result unpublished | Undermines the firm's strongest differentiator (evidence discipline) | Remove until source and positions can be named |
| P0-3 | Verification language overstates independence | Case study: "Verified for public use", "Publicly Verified"; methodology §D: internal verification is not an independent audit | A board member or reporter reading both pages sees a contradiction | Use "verified internally by BetterEd" and print the limitation beside the number |
| P0-4 | Old identity in production | Bar logo; theme colors #071E4A and #00183C; orange/lime headshot files | Brand launched 7 Nov is not visible anywhere the public looks | Replace with the Vital Line system (this build) |

### P1 — major issues

| # | Issue | Evidence | Business impact | Recommendation |
|---|---|---|---|---|
| P1-1 | Positioning diluted by taxonomy | "Sixteen services across four practices"; practice names differ by page; 15 vs 16 cards | Buyer cannot self-identify; reads as a generalist | Four EdSolutions, fixed order, each with a medical-model role |
| P1-2 | Method inconsistency | 6-step, 13-step, 30/60/90, MIRACLE™ | "Which one will you use on us?" | One method: Diagnose → Treat → Strengthen → Sustain |
| P1-3 | Generic hero | "Turning Schools Around Is Hard. Let Us Make It Easier." | Could belong to any firm; promises ease, not rigor | "Schools can get well." with the medical-model support line |
| P1-4 | CTA fragmentation | Five different primary CTAs | Lower conversion; no measurable funnel | One primary ("Start with the diagnosis"), one secondary (School Health Index) |
| P1-5 | School Health Index is under-sold and partly broken | Evidence upload listed then said to be unavailable; no domain descriptions ("Scored 0–100 with expert commentary" ×12) | The firm's main IP reads like a form | Explain what each domain examines, what you receive, what it does not do, privacy |
| P1-6 | Medical model needs a disclaimer to function | "BetterEd does not provide healthcare…" | Signals the metaphor is over-extended (13-step clinical comparison, body-system anatomy) | Use the metaphor at the institutional level only; state plainly that the institution is the patient and children are not the problem |
| P1-7 | No procurement path | No page for RFPs, registrations, capability statement | Public buyers leave or email blind | Dedicated /procurement route |
| P1-8 | Testimonials are thin and orphaned | "Their work was transformative." (no organization); "We have had a great experience…"; links to a page with no testimonials | Weak quotes read as filler | Keep the one specific, attributed quote; place it beside the evidence |

### P2 — important improvements

| # | Issue | Evidence | Recommendation |
|---|---|---|---|
| P2-1 | Navigation differs between homepage and subpages | "What We Do / Our Approach…" vs "Solutions / Results / School Health Index / About" | One header everywhere |
| P2-2 | Title tag pattern inconsistent | "School Improvement Solutions \| BetterEd" vs "… \| BetterEd Solutions"; "Contact — BetterEd Solutions" | One pattern: "Page \| BetterEd Solutions" |
| P2-3 | Duplicate logo list with empty alt text; testimonial photo with empty alt | Homepage | Fixed by removal; all meaningful images need alt |
| P2-4 | Date formats vary ("2025–26" / "2025–2026") | Results, case study | One format: 2025–26 school year |
| P2-5 | Insight articles have no visible publication date | All three /blog/ pages | Dates on every article; Article schema |
| P2-6 | Team titles: 12 of 14 people are "Partner" | /about/team | A buyer may read it as inflated; confirm roles and employment type before relaunch (D6) |
| P2-7 | "Multi-year partnership" with one year of results | Case study | Name the engagement years and the result year separately |
| P2-8 | Client log-in link in public nav (/auth) | Footer | Move to footer utility; the public site is not a portal |

### P3 — enhancements

| # | Issue | Recommendation |
|---|---|---|
| P3-1 | No Vital Line motion or signature interaction | Vital Motion system (this build) |
| P3-2 | Structured data not confirmed | Organization, WebSite, Service, Article, BreadcrumbList |
| P3-3 | No answer-ready "What is BetterEd" copy | Factual entity paragraphs on Home, About, Solutions, SHI |
| P3-4 | Contact form has a "Company website" field | If it is a honeypot, hide it from assistive technology too; if not, remove |

### By lens

- **Superintendent:** wants to know what happens after diagnosis and who shows up. Site answers with process diagrams, not people or the first 90 days. → Approach page answers "What actually happens if we hire BetterEd?"
- **Principal:** wants to know whether this is another initiative. Nothing on the current site speaks to the principal's week. → Leadership Development and Approach pages speak directly to principals.
- **Procurement:** no capability statement, no registrations, no RFP contact. → /procurement.
- **Creative director:** the strongest brand asset (the Vital Line) does not appear. → Build the site around it.
- **UX:** five CTAs, two navs, 30+ links in nav/footer. → Five nav items, one CTA.
- **Accessibility (from content):** empty alt on meaningful photos; multi-step form accessibility not verifiable. → WCAG 2.2 AA build.
- **Performance:** not measured from this session (platform not identifiable; hashed assets suggest a Vite build). → New build measured in Phase 8.
- **SEO/AEO:** good titles and descriptions exist; entity definitions do not.
- **Parent / board member:** "our nation's most underserved communities" and "broken systems" are strong; the site never says what a child will notice. → Every EdSolution page ends in "What changes for children".

## What deserves to survive

- The methodology principles (percentage points vs percent; attribution; publication permission). They are genuinely differentiating; they become the Results page's evidence philosophy.
- "Children are not the problem. Broken systems are." → kept in spirit: "The institution is the patient. Children are not the problem."
- The School Health Index: 12 domains, 0–100 score, bands, expert review in 48 hours, strong privacy design.
- "Measured, not promised." and the Shining Stars case-study structure.
- The founder story (Baltimore, City College, Hopkins, Harvard, classroom to network leadership).
- The 30-minute first conversation and "a BetterEd partner reads every message".
