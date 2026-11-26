# Phase 3 — Creative Direction Decision Memo

Three internal directions were developed against the 7 November system. All used the same palette, type and logo; they differed in density, the Vital Line's role, evidence treatment and motion.

| | A. "Clinical Chart" | B. "The Practitioner's Journal" | C. "The Vital Line" (selected) |
|---|---|---|---|
| Idea | The site as a patient chart: Mist panels, data tables, monospace-feeling labels, dense grids | Editorial: Newsreader-led long reading, founder letter up front, quiet type, Paper everywhere | The site as one continuous trace: Navy and Paper bands, Libre Franklin ExtraBold statements, the Vital Line as hero, progress bar, method spine and section punctuation |
| Strengths | Rigor; evidence-forward; distinctive | Humanity; depth; reads like a serious publication | Unmistakably BetterEd without the logo; turns the method into motion; scales from a phone to a board-room screen |
| Weaknesses | Cold; edges toward "clinical" which the brand says to avoid; would read as SaaS dashboard | Slow to the point; looks like many think-tank sites; Newsreader would dominate the interface (prohibited) | Risk of over-using the device — mitigated by the motion concurrency rule and "one signal per viewport" |
| Executive credibility | High | High | High |
| Humanity | Low | High | Medium-high (voice, children-first copy, Newsreader in narrative moments) |
| Conversion | Medium | Low | High: one CTA, method → diagnosis path |
| Mobile | Poor (tables) | Good | Good: the trace stacks vertically |
| Performance | Good | Good | Good: SVG + CSS, ~6 KB JS |
| Motion potential | Low | Low | High, and meaningful (Baseline → Signal → Decision → Rise → Hold) |

**Selected: C, "The Vital Line", with B's editorial moments** (founder story, case-study narrative and articles in Newsreader) and **A's evidence discipline** (Mist evidence notes beside every number).

**Why it won:** it is the only direction where the brand's core asset carries the strategy. The line that is flat, spikes, and rises into a yellow point is literally Diagnose → Treat → Strengthen → Sustain. Remove the logo and the site is still BetterEd.

# Phase 4 — Design system

Implemented in `src/assets/styles.css` (tokens at the top). Summary:

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--ink` | #0B1F3A | Structure, headings, navy bands, body text on Paper |
| `--harbor` | #1A5FB4 | Links, buttons, focus ring, active nav |
| `--signal` | #FFC20E | The point: one per viewport moment; never text on light grounds |
| `--pulse` | #E8603C | Max once per page (Whole-School Turnaround "intensive care" marker; error states) |
| `--paper` | #F6F4EE | Page ground |
| `--mist` | #E3E9F1 | Evidence notes, rules, table tints |
| `--slate` | #4F5B6D | Secondary text (7.0:1 on Paper — passes AA) |
| `--white` | #FFFFFF | Form fields only |

Derived (not new hues): `--ink-80` text on navy uses white at 82% for secondary copy (≥ 9:1).

Contrast (computed, WCAG 2.x): Ink on Paper 15.02:1; Slate on Paper 6.26:1; Harbor on Paper 5.72:1; Harbor on Mist 5.15:1; White on Ink 16.52:1; Signal on Ink 10.21:1; White on Harbor 6.29:1. Fails, so never used for text: Harbor on Ink 2.63:1; Pulse on Paper 3.09:1 (Pulse appears only as a non-text marker).

## Typography

- Libre Franklin 400 / 600 / 800; Newsreader 400 + 400 italic. Self-hosted WOFF2, Latin subset (95 KB total; Newsreader loads only on pages that use it), `font-display: swap`, the two critical Franklin weights preloaded, and a metric-adjusted Arial fallback to limit layout shift. No third-party font requests.
- Scale (fluid, `clamp`): display 2.6–5.4rem / 800 / -0.03em / 1.0; h1 2.2–3.8rem; h2 1.8–2.8rem; h3 1.25–1.5rem; body 1.0625–1.125rem / 1.6; small 0.875rem; kicker 0.75rem / 800 / 0.2em uppercase.
- Light (300) is not loaded: ExtraBold + Regular contrast does the work, saving one font file.
- Sentence case; left-aligned; measure capped at 68ch for prose, 34ch for statements.

## Space, grid, breakpoints

- Space scale (rem): 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8.
- Container: 76rem max, 1.25rem gutters on phones (≥16px), 2.5rem from 48rem.
- Grid: 12 columns ≥ 64rem; 6 at 48–64rem; single column below 48rem.
- Breakpoints: 30rem (480), 48rem (768), 64rem (1024), 80rem (1280).
- Section rhythm: 4rem phone / 6–8rem desktop.

## Shape

- Radius 0 everywhere except the yellow point (circle) and focus outlines.
- Rules 1px Mist on Paper, 1px rgba(255,255,255,.18) on Ink; the signature rule is 3px Ink ending in a 10px Signal point.
- No shadows. No gradients. No cards unless the content is a discrete object (EdSolution, article, case study).

## Components

Header · nav · mobile menu (dialog pattern) · footer · `vitalLine()` SVG · signature rule · hero · kicker · section heading · CTA (primary/secondary/text) · metric · evidence note · EdSolution row · method step · MASTERY letter · SHI domain explorer · case-study preview · case-study evidence table · quote · article card · founder feature · team list · contact form · procurement callout · breadcrumb · related links · accessible disclosure (`<details>`) · error / empty states.

# Vital Motion specification

**Grammar:** Baseline → Signal → Decision → Rise → Hold, mapped to Diagnose → Treat → Strengthen → Sustain. Motion moves left to right and upward, settles, and does not loop.

## Tokens (CSS custom properties)

| Token | Duration | Use |
|---|---|---|
| `--m-instant` | 120ms | Active/pressed |
| `--m-fast` | 200ms | Links, buttons, hovers |
| `--m-standard` | 300ms | Menu, disclosures, domain panel |
| `--m-section` | 560ms | Section reveal |
| `--m-signature` | 1000ms | Vital Line trace, metric rule |
| `--m-hero` | 1400ms | Full hero choreography (content readable from 0ms) |

Distances: micro 3px, standard 8px, section 16px. Easing: `--e-enter: cubic-bezier(.16,1,.3,1)` (confident deceleration), `--e-exit: cubic-bezier(.4,0,1,1)`, `--e-ui: cubic-bezier(.2,0,0,1)`, Vital Line: `linear` then `--e-enter` on the final segment. No springs, no overshoot.

## Signature interactions

1. **Hero Vital Line** — the trace draws once (stroke-dashoffset, 1000ms), the yellow point lands (scale 0 → 1, 200ms) at 1000ms. Headline and CTAs are visible immediately (no hidden LCP).
2. **Scroll progress** — a 2px Ink rule under the header grows with page progress; the Signal point rides its leading edge. Transform-only, rAF-throttled, passive listener. No scroll-jacking.
3. **Method spine** — on ≥64rem, a sticky Vital Line with four nodes; the Signal point moves to the active stage as each stage enters the viewport (IntersectionObserver). On phones, a vertical rule with the four stages stacked; the active node fills.
4. **SHI domain explorer** — selecting a domain moves a single Signal marker to it and swaps the detail panel (300ms fade + 8px rise). Keyboard: arrow keys move between domains (tablist pattern).
5. **Metrics** — numbers count once (900ms), the rule beneath extends and the point lands. Final values are in the HTML; counting is cosmetic and skipped for reduced motion.
6. **MASTERY** — the seven letters rise 8px in sequence (70ms stagger), then hold as one word.
7. **Section reveal** — opacity .0 → 1 and 16px rise, once per section, only for elements marked `data-reveal`. Content is visible without JS (the hiding class is added by JS only).

Concurrency: one primary + one supporting event per viewport. No ambient motion after load.

## Reduced motion

`@media (prefers-reduced-motion: reduce)` and the JS guard: all `data-reveal` content shown immediately, Vital Lines render complete, the point is placed, counters show final values, smooth scrolling is off, transitions are reduced to color/opacity under 1ms. Meaning and hierarchy are unchanged.

## Prohibitions honored

No scroll hijack, particles, blobs, parallax, tilt, marquees, looping pulses, glows, autoplay video, loading screens, or page transitions that delay navigation.
