# betteredsolutions.org — BetterEd Solutions website

Static site + one serverless function. No client framework. Built to the BetterEd Brand Guidelines (7 Nov 2026) and Brand Kit Ed. 1.0.

## Local setup

Requires Node 20+.

```bash
npm install            # dev tools only (axe-core, html-validate, lighthouse, fonts)
node build.mjs         # production build -> dist/
node build.mjs --preview   # private review build -> preview/ (flat files, includes drafts)
node scripts/serve.mjs dist 4173   # serve dist at http://localhost:4173
```

## Project architecture

```
build.mjs                  generator: renders routes, versions CSS/JS, writes sitemap/robots
src/content/site.mjs       all page content (structured)
src/content/claims.mjs     claims registry + publish guard
src/templates/lib.mjs      layout, header, footer, Diagnostic Cross artwork, shared components, JSON-LD helpers
src/templates/pages.mjs    one function per route
src/assets/                styles.css (design tokens at top), main.js (motion + UI), logos, fonts
api/contact.js             POST /api/contact (Vercel function)
vercel.json                clean URLs, redirects from the old site, security headers, caching
scripts/                   QA: serve, screenshots, axe + interaction tests, links, OG image generator
docs/                      phase deliverables (registers, red teams, strategy, design system, QA, launch)
```

## Content editing

- Page copy lives in `src/content/site.mjs`. Change text there, run the build.
- EdSolutions must stay in this order: Culture & Climate, Leadership Development, Educator Development, Whole-School Turnaround. The array order is the display order everywhere.
- The tagline is exactly "Happy. Healthy. High-performing." — it is rendered by `tagline()` in `lib.mjs`; do not retype it.
- Say "teachers", never "guides". Write "MASTERY", never "M.A.S.T.E.R.Y.".

## Publishing an article

Add an object to `insights` in `site.mjs`: `slug, status, title, deck, category, author, date (YYYY-MM-DD), readMinutes, related (EdSolution slugs), body` where body is a list of `['p', text]`, `['h2', text]` or `['quote', text]`. Set `status: 'review'` to see it in the preview build only; set `'published'` to ship it. Production builds refuse to render draft content.

## Adding a case study

Add to `caseStudies` with the seven-stage structure (`condition, diagnosis, treatment, strengthening, sustainability` + `claims` for the result and evidence table). Every number must be a claim ID.

## Updating claims

Edit `src/content/claims.mjs`. A claim prints only if its `status` is in `PUBLISHABLE`. Pages call `claim('CL-01')`; if someone sets a claim to `DO NOT PUBLISH` while a page still uses it, the build fails — which is the point. Update `lastReview` whenever you touch a claim.

## Adding photographs

1. Confirm the release/consent and add a row to the media inventory in `docs/05-…md`.
2. Export WebP/AVIF at 1x and 2x, under ~300 KB for mobile heroes.
3. Place in `src/assets/img/` and reference with explicit `width`/`height` and meaningful `alt` (empty alt only for decorative images).
4. Founder portrait: set `founder.photo` and render it inside `.portrait-card` in `founderSection()`.

## Updating team members

Edit `team` in `site.mjs` (`[name, title]`). No credential suffixes; use the person's preferred name.

## Analytics

`main.js` exposes `window.betteredTrack(name, props)` and auto-tracks `data-track` clicks and `data-page-event` page loads. Nothing is sent unless a provider is installed. To add Plausible: include its script in `layout()` and add its host to the CSP `script-src` and `connect-src` in `vercel.json`. Event map: `docs/05-…md`.

## Forms

`/contact/` posts JSON to `/api/contact`. The function validates server-side, checks a honeypot and minimum fill time, rate-limits per instance (add Vercel Firewall rate limiting for production), and sends via Resend. It returns `{ ok: true }` only when the provider accepts the message; the page never shows success otherwise.

Environment variables (Vercel → Project → Settings → Environment Variables):

| Name | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | yes | Email delivery |
| `CONTACT_TO` | no | Defaults to info@betteredsolutions.org |
| `CONTACT_FROM` | recommended | A sender on a verified domain, e.g. `BetterEd Website <website@betteredsolutions.org>` |

Never commit keys. `.env*` files are git-ignored.

## Brand system

- **Mark:** the Diagnostic Cross. Four navy blocks (one per EdSolution) around a gold core (the diagnosis). `crossArt()` in `lib.mjs` draws it as artwork; the blocks assemble in order, the school getting better. Logo files in `src/assets/` are outlined SVGs generated from the brand fonts, so they render identically everywhere.
- **Type:** Source Serif 4 for headlines and reading text, Work Sans for interface text (SIL OFL 1.1, self-hosted in `src/assets/fonts/`).
- **Color:** Navy `#0B1F3A`, Harbor `#1A5FB4`, Signal `#FFC20E`, Paper `#F6F4EE`. Accent points are squares, matching the mark.
- After changing the logo, run `node scripts/gen-images.mjs` to regenerate `og-default.png` and `apple-touch-icon.png`.

## Motion system

Tokens at the top of `styles.css` (`--m-*` durations, `--d-*` distances, `--e-*` easings). Behaviour in `main.js`:
- `.cross-art[data-draw="load"]` assembles once on load; `data-draw="scroll"` assembles when it enters the viewport.
- `[data-reveal]` fades/rises 16 px once. Content is visible without JavaScript.
- `[data-count]` counts once; the final value is already in the HTML.
- `.step[data-stage]` drives the method spine: the cross fills in stage by stage.
- `prefers-reduced-motion: reduce` shows every final state immediately.
Rule of thumb: one primary and one supporting motion per viewport; nothing loops.

## QA

```bash
node scripts/serve.mjs dist 4173 &
node scripts/qa-a11y.mjs        # axe on all routes + keyboard, form, motion tests
node scripts/qa-links.mjs       # internal links and anchors
node scripts/qa-shots.mjs       # screenshots to qa/shots
npx html-validate "dist/**/*.html"
```

## Deployment

1. Import the repository into Vercel (framework preset: Other). `vercel.json` sets the build command and output.
2. Add environment variables; deploy a **preview** and test the form end to end.
3. Clear the launch conditions in `docs/08-…md`.
4. Only with owner authorization: attach the domain and switch DNS. Keep the old host live 14 days for rollback.
