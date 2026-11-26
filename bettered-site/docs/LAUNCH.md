# Launch checklist

Status as of 26 November 2026. The site is on the working branch `claude/new-session-83bk98`, and the pull request `claude/bettered-launch-fixes` brings it into `main`.

## Done

- Website redesign: 25 pages, institutional medical style, locked brand (version 2.5).
- Brand toolkit and brand lock; logo files; email signature builder (`brand/email-signature.html`).
- EdSolutions renamed, body metaphor, levels of intervention, six-step approach.
- School Health Index app built and tested against a stand-in backend: account sign-up, bot check, state/city/school lookups (100,063 schools), autosave, submission, staff inbox, notification emails.
- Background video hero, ready for a clip (`scripts/encode-hero-video.sh`).
- Old page addresses redirect correctly: the redirect rules now end in a slash, so they match once Vercel adds its trailing slash (before this fix every old address would have shown a 404).
- Checks: 23 accessibility and interaction checks pass; HTML validates; 0 broken internal links; no horizontal overflow at phone, laptop and desktop widths.

## Needs the owner

| # | What | Why it is needed | Where |
|---|---|---|---|
| 1 | Free a Supabase project slot (delete or pause an unused project, or upgrade to Pro) | School Health Index accounts cannot be switched on until a BetterEd project exists | supabase.com/dashboard/projects |
| 2 | Cloudflare Turnstile widget for betteredsolutions.org | The "I'm not a robot" check on sign-up | dash.cloudflare.com, Turnstile |
| 3 | Resend account, domain verified by DNS | Account confirmation emails, submission notices, and the contact form | resend.com/domains |
| 4 | Vercel project with **Root Directory** set to `bettered-site` and environment variables (`SHI_SUPABASE_URL`, `SHI_SUPABASE_KEY`, `SHI_TURNSTILE_SITE_KEY`, `RESEND_API_KEY`) | Hosting the new site | vercel.com |
| 5 | Point betteredsolutions.org at the new site | Go live; old page addresses already redirect | Domain DNS |
| 6 | LinkedIn (personal and company), Instagram, Facebook links and mailing address | Email signature | Paste into the signature page |
| 7 | Photos and a hero video clip, with model releases | The site has no photography yet | Licensed stock (releases included) or a shoot |
| 8 | Legal review of the privacy policy and School Health Index terms | The site collects personal information | Counsel |
| 9 | Read the School Health Index questions | They were drafted for you | `src/content/shi-questions.mjs` |
| 10 | Merge the working branch into `main` | So the brand lock and site are the default | Pull request |
| 11 | Send the text of the three published articles, or say to drop them | The Insights cards link to `betteredsolutions.org/blog/…` on the old site; after the switch those addresses 404 | `insights` in `src/content/site.mjs` |

## Order to go live

1 → run `supabase/schema.sql` → 2 and 3 → deploy the notification function and run `supabase/notify.sql` → 4 → test a real sign-up and submission → 5.

Details for steps 1 to 4: `../supabase/README.md`.
