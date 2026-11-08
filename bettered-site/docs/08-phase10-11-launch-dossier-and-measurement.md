# Phase 10 — Launch Readiness Dossier

## Verdict: READY WITH CONDITIONS

The site is built, tested and deployable. It should not replace betteredsolutions.org until the owner clears the conditions below. Nothing has been published, deployed, or sent. DNS is untouched.

### Launch conditions (must clear before DNS switch)

| # | Condition | Owner action | Why it blocks |
|---|---|---|---|
| L1 | Written approval on file for Shining Stars +15/+14 and Shawn Hardnett quote; name the assessment | Locate approvals; supply assessment name | Credibility; methodology §F |
| L2 | Confirm team spellings and titles (Furan/Fearon, Jhay/Jay; "Partner" titles) | Confirm list | Public accuracy |
| L3 | Form delivery live: create `RESEND_API_KEY`, verify sending domain (SPF/DKIM), set `CONTACT_FROM`; send one real test | Vercel env + DNS TXT records | Contact is the conversion |
| L4 | Keep the School Health Index intake running and set `site.shiIntakeUrl` to it (e.g., `/school-health-index/start`) | Point to existing app or supply its repo | Secondary conversion; until then the CTA routes to Contact (works, but weaker) |
| L5 | Migrate the three published article bodies or keep `/blog/*` served | Export articles | Otherwise three Insights cards 404 after cutover |
| L6 | Owner approval of all page copy, especially EdSolution "examine/work/measure" lists and the founder story | Read preview | Copy written for this build |
| L7 | Cross-browser pass on Safari (macOS + iOS), Firefox, Edge, Android Chrome | 20-minute manual check against `docs/06` risk list | Only Chromium tested here |

### Launch checklist

| Item | Status |
|---|---|
| Domain configuration plan | Ready: add project in Vercel, attach betteredsolutions.org + www (redirect www → apex), lower DNS TTL 24 h before, switch A/CNAME, keep old host live 14 days for rollback |
| Redirects | Ready (`vercel.json`): services, medical-model, founder, team, case studies, methodology, insights subpages, trust/terms |
| Canonical URLs | Ready (apex, trailing slash) |
| Production environment | Static + one function; env vars `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` |
| Sitemap / robots | Ready; submit sitemap in Google Search Console after cutover |
| Forms | Condition L3 |
| Analytics | Hooks ready; provider not chosen (Plausible recommended; add its host to CSP `script-src` and `connect-src`) |
| Privacy page | Written from the implementation; not legally reviewed |
| Accessibility page | Ready |
| 404 | Ready |
| Security headers | Configured |
| Metadata / social cards | Ready; validate with LinkedIn Post Inspector and Rich Results Test after deploy |
| Backup / rollback | Old site kept live on its host; Vercel instant rollback to previous deployment |
| Final content approval | L6 |
| Final claims approval | L1 |
| Media rights | Clear (no photography used) |
| Browser checks | L7 |
| Trademark search (Vital Line, School Health Index) | Recommended before heavy promotion |

## Quality scorecard (summary only; evidence is in docs/06)

| Area | Max | Score | Why not full |
|---|---|---|---|
| Brand fidelity | 15 | 15 | Official assets, palette, type, device, voice |
| Creative quality | 15 | 12 | Distinctive and ownable, but without authentic photography the site leans on typography; humanity is in the words, not yet the images |
| Visual execution | 15 | 13 | Clean and consistent; some repeated two-column callout rhythms; no designer optical pass yet |
| Motion | 10 | 9 | Meaningful, restrained, reduced-motion complete; untested on Safari |
| UX / conversion | 10 | 8 | Clear single CTA and journeys; SHI intake not yet wired (L4) |
| Content | 10 | 8 | Specific and on-voice; awaits owner approval; one case study |
| Evidence integrity | 5 | 5 | Registry + build guard; limits printed beside numbers |
| Mobile | 5 | 5 | Tested 320–430 px, no overflow |
| Accessibility | 5 | 5 | axe 0 violations, keyboard and reduced-motion tests pass; screen-reader pass with VoiceOver/NVDA still recommended |
| Performance | 5 | 5 | Lighthouse 98–100 mobile, CLS 0, 4 KB JS |
| Engineering | 5 | 4 | Simple and maintainable; live form delivery untested |
| **Total** | **100** | **89** | Below 95 because of missing photography, a single case study, the unwired SHI intake and untested browsers — all owner-dependent |

# Phase 11 — Post-launch measurement plan

No targets are set until a baseline exists.

**First 7 days**
- Daily: form submissions arrive in the inbox (compare `Contact completed` events to emails received); any `Contact failed` events investigated same day.
- Search Console: sitemap processed; coverage errors; old URLs redirecting (spot-check 20 from the redirect map).
- Field performance: LCP, CLS, INP from Vercel Speed Insights on real devices.
- Browser issues reported by early visitors; 404 log review.

**30 days**
- Top entry pages and exits; share of sessions reaching an EdSolution, Results or the SHI.
- CTA performance: primary vs secondary vs contextual CTAs (clicks per page view).
- Contact starts vs completions (form drop-off); SHI interest (`SHI opened`, `Diagnostic started`).
- Search queries and impressions for brand and category terms.

**90 days**
- Qualified inquiry rate (inquiries the owner rates as fit ÷ total), by entry page and inquiry type.
- Evidence engagement: do sessions that view Results/case study convert at a higher rate?
- Which EdSolution pages attract district vs charter visitors (from inquiry roles).
- Content opportunities from search queries; next case studies to commission.
- Decide on photography placement and a second creative pass with real images.

# Assumptions and open decisions log

| # | Decision / assumption | Choice made | Owner to confirm? |
|---|---|---|---|
| D1 | Primary CTA | "Start with the diagnosis" | Yes |
| D2 | Stack | Zero-dependency static generator + one Vercel function, not Next.js: no client framework is needed, and it keeps JS at 4 KB. Content stays structured and portable to a CMS later | Optional |
| D3 | Fonts | Self-hosted (performance, privacy, CSP) rather than Google Fonts | No |
| D4 | MIRACLE™ framework | Retired from public copy (conflicts with the four-stage method) | Yes |
| D5 | Shining Stars results and Hardnett quote | Carried forward with limits (they are already public) | Yes (L1) |
| D6 | Team list | Carried forward from current site | Yes (L2) |
| D7 | Photography rule "real Baltimore schools" | Read as "real BetterEd schools with consent" | Yes |
| D8 | Draft article | Written as "BetterEd Solutions", preview-only | Approve, edit or drop |
| D9 | Terms of use | No terms page yet; /terms redirects to privacy temporarily | Yes |
| D10 | Phone number 1-800-735-0953 | Carried from current site | Confirm it is monitored |
| D11 | Analytics provider | None loaded; Plausible recommended | Yes |
| D12 | Reversed logo for transparent use | Official reversed SVG with its background panel removed | Designer to confirm or supply a transparent file |
