# Phase 2 — Audience, conversion, evidence and information architecture

## 1. Audience matrix

| Audience | Primary problem | Likely entry | Primary question | Secondary questions | Credibility needs | Objections | Evidence required | Best CTA | Next page | Conversion |
|---|---|---|---|---|---|---|---|---|---|---|
| Superintendent / deputy / chief | Schools stuck despite programs | Home, Whole-School Turnaround, referral | Can BetterEd handle a complex, political problem? | What happens after diagnosis? Who shows up? How is impact measured? Works with principals and central office? | Practitioner leadership; a method; honest evidence | "Another consultant deck"; "Is this just coaching?" | Method, case study with limitations, measurement approach | Start with the diagnosis | Approach → Results | Strategic conversation |
| Principal | Too much to fix, not enough time | Leadership Development, SHI, search | Will BetterEd understand my school and not add an initiative? | How intrusive? How fast will I know what matters? Will teachers trust it? | Former-principal founder; in-building coaching | Time, initiative fatigue, being judged | What the first weeks look like; what the SHI returns | Take the School Health Index | SHI → Contact | SHI start or consultation |
| Charter network executive / charter board | Renewal pressure, uneven campuses | Results, Whole-School Turnaround | Have they done this in charter settings? | Governance? Leadership pipeline? | Charter case study; network-leadership background | Cost, fit with model | Shining Stars case; founder's ten years in a charter network | Talk about turnaround | Case study → Contact | Conversation |
| School board member | Accountability for results | Results, About | Will they tell us the truth? | Who is accountable? | Evidence philosophy | Hype | Methodology, limitations printed beside numbers | See the evidence | Results → About | Referral to superintendent |
| State / improvement leader | Designated schools, ESSA CSI/TSI | Approach, Whole-School Turnaround, Insights | Is the approach evidence-aware? | Measurement, sustainability | Method; insight quality | Vendor overreach | Measurement plan, sustain stage | Start a conversation | Approach → Contact | Conversation |
| Philanthropic leader | Funding durable improvement | About, Results, Insights | Will gains last after funding ends? | Attribution? | "Year after year"; capacity transfer | Dependency on consultants | Sustain stage; what remained | Talk with BetterEd | Partner → Contact | Partnership inquiry |
| Procurement officer | Complete, compliant vendor file | Search "BetterEd Solutions RFP", /procurement | What do they provide and who receives an RFP? | Registrations, insurance, capability statement | Clear scope, accurate facts | Missing documents | Verified facts only | Request qualifications | Contact (Procurement) | Procurement inquiry |
| Aligned organization | Collaboration | Partner | How do we work together? | Fit, roles | Clarity, no implied endorsements | — | — | Propose a partnership | Contact (Partnership) | Partnership inquiry |

## 2. Jobs-to-be-done

- When my schools are not improving despite effort, I want someone to find the real cause, so I stop funding the wrong fix.
- When I am a principal carrying everything, I want practical help inside my week, so improvement does not become one more initiative.
- When I must justify a vendor to a board, I want honest evidence and a clear method, so I can defend the decision.
- When I issue an RFP, I want the vendor's facts in one place, so the file is complete.

## 3. Objection matrix

| Objection | Where answered |
|---|---|
| "This is just coaching." | Whole-School Turnaround; Approach ("Treat" intensity) |
| "You will prescribe your favorite program." | Home method section; Approach ("Diagnosis before prescription") |
| "Results are cherry-picked." | Results: evidence philosophy, limitations printed beside numbers |
| "The medical metaphor blames kids." | Approach: "The institution is the patient. Children are not the problem." |
| "We will depend on you forever." | Sustain stage; MASTERY Y; case-study "What remained" |
| "Too intrusive for my teachers." | Educator Development: coaching cycle, feedback that changes the next lesson |
| "Can't find what procurement needs." | /procurement |

## 4. Conversion architecture

Funnel: Attention → Understanding → Trust → Evidence → Diagnosis → Conversation.

- **Primary CTA (all pages, header):** "Start with the diagnosis" → /contact?type=diagnostic. Chosen over "Start a conversation" because it says the method in four words and makes the first step concrete.
- **Secondary CTA:** "Take the School Health Index" → /school-health-index (then `SHI_INTAKE_URL`).
- **Contextual CTAs:** "Explore Culture & Climate", "Develop your leaders", "Strengthen teaching", "Talk about turnaround", "See the evidence", "Read the case study", "Request qualifications".
- **Closing prompt on key pages:** "What is keeping your school from getting better?"

Primary journeys (instrumented, see analytics map):
1. Home → Approach → EdSolution → Case study → SHI → Contact
2. Search → EdSolution → Results → Contact
3. Procurement search → Procurement → Contact (type=procurement)
4. Insight → related EdSolution → SHI → Contact

## 5. Information architecture

```
/                                   Home
/approach                           Our Approach (Diagnose → Treat → Strengthen → Sustain)
/solutions                          EdSolutions
  /solutions/culture-climate          1 Culture & Climate — where it starts
  /solutions/leadership-development   2 Leadership Development — the head
  /solutions/educator-development     3 Educator Development — the hands
  /solutions/whole-school-turnaround  4 Whole-School Turnaround — intensive care
/school-health-index                School Health Index™
/results                            Results — measured, not promised
  /results/shining-stars-montessori   Case study
/insights                           Insights
  /insights/[slug]                    Article
/about                              About (purpose, MASTERY, founder, team)
/partner                            Partner (footer)
/procurement                        Procurement (footer)
/contact                            Contact
/privacy  /accessibility  /404      Utility
```

Primary nav: Our Approach · EdSolutions · Results · Insights · About · [Start with the diagnosis]. Utility (footer): School Health Index, Partner, Procurement, Contact, Privacy, Accessibility.

Redirects from the live site (vercel.json): /services → /solutions; /services/* → /solutions; /about/medical-model → /approach; /about/candido-brown → /about#founder; /about/team → /about#team; /case-studies → /results; /case-studies/shining-stars-montessori → /results/shining-stars-montessori; /results/methodology → /results#methodology; /insights/research and /insights/in-the-news → /insights; /trust → /privacy; /terms → /privacy (until terms are written — D9). /blog/* is preserved until article bodies are migrated (M8).

## 6. Page-purpose map

| Page | Primary audience | Primary question | Core message | Proof | CTA | Next |
|---|---|---|---|---|---|---|
| Home | Superintendent, principal | Who are you and why you? | Schools can get well. Diagnosis before prescription. | Method; case-study numbers with limits; founder | Start with the diagnosis | Approach / SHI |
| Approach | Superintendent, state leader | What actually happens if we hire you? | Four stages, concrete activities, measurement | Stage outputs, first-90-day shape | Start with the diagnosis | EdSolutions |
| EdSolutions | All | Which kind of help do we need? | Four treatments in the order we work; diagnosis decides the mix | Self-identification prompts | Explore each | Detail pages |
| Culture & Climate | Principal, district | Why start with conditions? | Conditions come first, for adults and children | What we examine; measures | Explore Culture & Climate | Leadership |
| Leadership Development | Principal, chief | Can you make our leaders stronger? | Heavy is the head that wears the crown | Leader moves; founder's leadership path | Develop your leaders | SHI |
| Educator Development | Principal, academic officer | Will teaching actually change? | Teachers are where learning happens | Coaching cycle; evidence of implementation | Strengthen teaching | Results |
| Whole-School Turnaround | Superintendent, charter board | Can you handle everything at once? | Intensive care, integrated, until the school holds on its own | Case study; phases | Talk about turnaround | Case study |
| School Health Index | Principal | What is really wrong? | A 12-domain exam, expert-reviewed | Domains, bands, what you receive, privacy | Take the School Health Index | Intake / Contact |
| Results | Board, superintendent | Do you tell the truth about results? | Measured, not promised | Philosophy, case study, limits | See the evidence / Contact | Case study |
| Case study | Charter/district exec | Did it work somewhere like us? | Condition → Diagnosis → Treatment → Strengthening → Result → Sustainability → Evidence | Numbers with definitions and limits | Talk about turnaround | Contact |
| Insights | Leaders, AEO | Do they think clearly? | Executive publication | Articles | Read | EdSolution |
| About | All | Who are you? | Practitioners; MASTERY; Candido Brown | Biography; team | Start with the diagnosis | Contact |
| Partner | Organizations | Can we work together? | Clear roles, no implied endorsements | Criteria | Propose a partnership | Contact |
| Procurement | Procurement | What do I need for the file? | Facts, scope, how to request | Verified facts only | Request qualifications | Contact |
| Contact | All | How do I start? | The first call is 30 minutes and diagnostic | What happens next | Send | — |

## 7. Search intent map

| Intent | Example query | Landing page |
|---|---|---|
| Category | "school turnaround consulting firm" | /solutions/whole-school-turnaround |
| Problem | "how to improve school culture and climate" | /solutions/culture-climate |
| Role | "principal leadership coaching" | /solutions/leadership-development |
| Instruction | "instructional coaching reading math" | /solutions/educator-development |
| Diagnostic | "school health assessment", "school improvement diagnostic" | /school-health-index |
| Brand / entity | "BetterEd Solutions", "Candido Brown" | / , /about |
| Procurement | "BetterEd Solutions RFP", "capability statement" | /procurement |
| Evidence | "BetterEd results" | /results |

## 8. Internal linking strategy

Every EdSolution page links: previous/next EdSolution (order preserved), the Approach stage it most depends on, the SHI, the case study, and Contact with the inquiry type pre-selected. Insights link to one EdSolution and the SHI. The case study links to the EdSolutions it used. Results link to the case study and Approach (Sustain). Footer links every public route.

## 9. Claims registry

The authoritative registry is `src/content/claims.mjs`. Pages cannot print a number directly: they call `claim(id)`, and the build fails if the claim's status is not publishable. Summary:

| ID | Wording (public) | Status | Notes |
|---|---|---|---|
| CL-01 | Reading proficiency +15 percentage points, Shining Stars Montessori Academy PCS, 2025–26 | CLIENT REPORTED · PREVIOUSLY PUBLISHED (publishable with limitations; launch condition: locate written approval) | Baseline/endpoint not disclosed; source not named; verified internally; shared attribution |
| CL-02 | Math proficiency +14 percentage points, same | Same as CL-01 | Same |
| CL-03 | "+406 ranking positions", Beginning With Children 2 MS | DO NOT PUBLISH | Ranking source not named; fails methodology §A |
| CL-04 | Shawn Hardnett testimonial | CLIENT REPORTED · PREVIOUSLY PUBLISHED | Confirm written permission |
| CL-05 | Aliss Williams, Eloise Cummings testimonials | INTERNAL ONLY | Too generic / no organization |
| CL-06 | Client logo list (10 organizations) | UNVERIFIED | Need per-client permission |
| CL-07 | Partner logos (7) | DO NOT PUBLISH | Includes state agencies |
| CL-08 | Founded 2019 in New Jersey | PUBLIC (current site, owner) | |
| CL-09 | Founder: Baltimore City College; BA Sociology, Johns Hopkins; master's (Ed.M.) Education Policy and Management, Harvard Graduate School of Education | OWNER STATED | No endorsement implied |
| CL-10 | Founder: ten years at Success Academy — teacher, principal, principal director, network director, managing director of schools; joined when the network had three schools | OWNER STATED | Final owner sign-off |
| CL-11 | SHI: 12 domains, 0–100 score, five bands, expert review within 48 hours | PUBLIC (current site) | 48-hour commitment must stay operationally true |
| CL-12 | Team names and titles (14) | PUBLIC (current site) · REVIEW | Spellings and titles to confirm (D6) |
