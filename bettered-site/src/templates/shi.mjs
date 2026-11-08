/* School Health Index app pages: account, sign-in, the index itself, and confirmation.
   The pages are static HTML; /assets/shi-app.js adds accounts (Supabase Auth), the bot check
   (Cloudflare Turnstile), school lookups, autosave and submission. */
import { site } from '../content/site.mjs';
import { ROLES, HEARD_FROM, BUDGETS, CALL_TIMES, INTERESTS, STATES, AGREE, CONTEXT, DOMAINS, OPEN, itemId, noteId } from '../content/shi-questions.mjs';
import { html, esc, layout, breadcrumb } from './lib.mjs';

const BASE = '/school-health-index/';
const crumbs = (label, href) => [{ label: 'Home', href: '/' }, { label: 'School Health Index', href: BASE }, { label, href }];

/* Browser config and scripts, only on app pages */
const config = () => `<script type="application/json" id="shi-config">${JSON.stringify({ url: site.shi.supabaseUrl, key: site.shi.supabaseKey, turnstile: site.shi.turnstileSiteKey, terms: site.shi.termsVersion, base: BASE }).replace(/</g, '\\u003c')}</script>`;
const head = (turnstile = false) => [
  '<script src="/assets/vendor/supabase-js-2.119.0.min.js" defer></script>',
  '<script src="/assets/shi-app.js" defer></script>',
  turnstile && site.shi.turnstileSiteKey ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>' : '',
].join('\n');

const opts = (list, placeholder = 'Select one') => `<option value="">${esc(placeholder)}</option>${list.map((o) => `<option>${esc(o)}</option>`).join('')}`;
const req = '<span class="req">(required)</span>';
const err = (id) => `<p class="error" id="${id}-err" aria-live="polite"></p>`;
function field(id, label, control, { hint = '', required = false, cls = '' } = {}) {
  return html`<div class="field ${cls}" data-field="${id}"><label for="${id}">${label}${required ? ` ${req}` : ''}${hint ? `<span class="hint" id="${id}-hint">${hint}</span>` : ''}</label>${control}${err(id)}</div>`;
}
const select = (id, name, list, { required = false, placeholder, describedby = '' } = {}) =>
  `<select id="${id}" name="${name}"${required ? ' required' : ''} aria-describedby="${id}-err${describedby ? ' ' + describedby : ''}">${opts(list, placeholder)}</select>`;
const input = (id, name, type, { required = false, autocomplete = '', max = 120, extra = '' } = {}) =>
  `<input id="${id}" name="${name}" type="${type}"${required ? ' required' : ''}${autocomplete ? ` autocomplete="${autocomplete}"` : ''} maxlength="${max}" aria-describedby="${id}-err" ${extra}>`;
const botCheck = () => `<div class="field"><div class="turnstile" data-turnstile></div><p class="error" data-turnstile-err aria-live="polite"></p></div>`;
const notReady = () => site.shi.supabaseUrl ? '' : `<div class="form-status is-error" role="status"><strong>School Health Index accounts open soon.</strong> In the meantime, <a href="/contact/?type=shi">contact us</a> and we will send you the index directly.</div>`;
const status = () => `<div class="form-status" data-status role="status" aria-live="polite" hidden></div>`;

/* ---------- Create account ---------- */
export function shiStart() {
  const body = html`${breadcrumb(crumbs('Create your account', `${BASE}start/`))}
  <section class="page-hero shi-hero" aria-labelledby="h"><div class="container grid grid-12">
    <div class="span-8"><h1 id="h">Create your free account.</h1>
    <p class="lead">One free School Health Index per person. It takes about 20 minutes, and you can stop and pick up where you left off. A BetterEd practitioner reads every one and sends your report within ${site.shi.reviewWindow}.</p>
    <p class="small muted" style="margin-top:1rem">Already have an account? <a href="${BASE}sign-in/">Sign in</a>.</p></div>
  </div></section>
  <section class="section-tight" aria-label="Create your account"><div class="container grid grid-12"><div class="span-8">
    ${notReady()}
    <form class="form shi-form" data-shi-form="signup" novalidate>
      <fieldset class="form-group"><legend>About you</legend>
        <div class="form-row two">
          ${field('s-first', 'First name', input('s-first', 'first_name', 'text', { required: true, autocomplete: 'given-name', max: 80 }), { required: true })}
          ${field('s-last', 'Last name', input('s-last', 'last_name', 'text', { required: true, autocomplete: 'family-name', max: 80 }), { required: true })}
        </div>
        ${field('s-email', 'Work email', input('s-email', 'email', 'email', { required: true, autocomplete: 'email', max: 200, extra: 'inputmode="email"' }), { required: true, hint: 'We send your report here.' })}
        ${field('s-password', 'Create a password', input('s-password', 'password', 'password', { required: true, autocomplete: 'new-password', max: 128, extra: 'minlength="10"' }) + '<button type="button" class="show-pw" data-show-pw="s-password">Show</button>', { required: true, hint: 'At least 10 characters.' })}
        ${field('s-role', 'Your role', select('s-role', 'role', ROLES, { required: true }), { required: true })}
        ${field('s-role-other', 'Your role, in your words', input('s-role-other', 'role_other', 'text', { max: 120 }), { cls: 'is-other', required: true })}
        <div class="form-row two">
          ${field('s-phone', 'Phone', input('s-phone', 'phone', 'tel', { autocomplete: 'tel', max: 40, extra: 'inputmode="tel"' }), { hint: 'Optional.' })}
          ${field('s-time', 'Best time to call', select('s-time', 'best_time', CALL_TIMES, { required: true }), { required: true, hint: 'Your local time.' })}
        </div>
      </fieldset>

      <fieldset class="form-group"><legend>Your school</legend>
        ${field('s-state', 'State', `<select id="s-state" name="state" required autocomplete="address-level1" aria-describedby="s-state-err"><option value="">Select your state</option>${STATES.map(([c, n]) => `<option value="${c}">${esc(n)}</option>`).join('')}</select>`, { required: true })}
        ${field('s-city', 'City', input('s-city', 'city', 'text', { required: true, autocomplete: 'off', max: 120, extra: 'list="s-city-list" disabled' }) + '<datalist id="s-city-list"></datalist>', { required: true, hint: 'Start typing, then pick from the list.' })}
        ${field('s-school', 'School', input('s-school', 'school', 'text', { required: true, autocomplete: 'off', max: 200, extra: 'list="s-school-list" disabled' }) + '<datalist id="s-school-list"></datalist><input type="hidden" name="school_nces_id" id="s-school-id">', { required: true, hint: 'Public and charter schools from the national NCES directory.' })}
        <div class="field check"><label><input type="checkbox" id="s-unlisted" name="school_unlisted"> <span>My school isn't listed</span></label></div>
        ${field('s-school-other', 'School name', input('s-school-other', 'school_other', 'text', { max: 200 }), { cls: 'is-other', required: true, hint: 'Private, new or renamed schools: type the name as you use it.' })}
      </fieldset>

      <fieldset class="form-group"><legend>A few more details</legend>
        ${field('s-heard', 'How did you hear about BetterEd?', select('s-heard', 'heard_from', HEARD_FROM, { required: true }), { required: true })}
        ${field('s-heard-other', 'Tell us where', input('s-heard-other', 'heard_other', 'text', { max: 200 }), { cls: 'is-other', required: true })}
        ${field('s-budget', 'Budget for school improvement support', select('s-budget', 'budget', BUDGETS, { required: true, placeholder: 'Select a range' }), { required: true, hint: 'A range is fine. It helps us recommend the right level of care.' })}
        ${field('s-interest', 'What are you most interested in?', select('s-interest', 'interest', INTERESTS, { placeholder: 'Select one (optional)' }), { hint: 'Optional.' })}
      </fieldset>

      <fieldset class="form-group"><legend>Agreement</legend>
        <div class="field check" data-field="s-terms"><label><input type="checkbox" id="s-terms" name="terms" required aria-describedby="s-terms-err"> <span>I agree to the <a href="${BASE}terms/">School Health Index terms</a> and the <a href="/privacy/">privacy policy</a>, and I agree that BetterEd may contact me about my results. ${req}</span></label>${err('s-terms')}</div>
        ${botCheck()}
      </fieldset>
      ${status()}
      <div><button class="btn btn-primary" type="submit"${site.shi.supabaseUrl ? '' : ' disabled'}><span class="label">Create account and start</span><span class="arrow" aria-hidden="true">→</span></button></div>
      <p class="notice">Please do not include student names or other confidential student information anywhere in the School Health Index.</p>
    </form>
  </div></div></section>
  ${config()}`;
  return layout({ path: `${BASE}start/`, title: 'Create your account · School Health Index', description: 'Create a free account to take the BetterEd School Health Index.', body, noindex: true, head: head(true) });
}

/* ---------- Sign in (and forgot password) ---------- */
export function shiSignIn() {
  const body = html`${breadcrumb(crumbs('Sign in', `${BASE}sign-in/`))}
  <section class="page-hero shi-hero" aria-labelledby="h"><div class="container"><h1 id="h">Sign in.</h1>
    <p class="lead">Pick up your School Health Index where you left off. New here? <a href="${BASE}start/">Create a free account</a>.</p></div></section>
  <section class="section-tight" aria-label="Sign in"><div class="container grid grid-12"><div class="span-6">
    ${notReady()}
    <form class="form shi-form" data-shi-form="signin" novalidate>
      ${field('i-email', 'Work email', input('i-email', 'email', 'email', { required: true, autocomplete: 'email', max: 200, extra: 'inputmode="email"' }), { required: true })}
      ${field('i-password', 'Password', input('i-password', 'password', 'password', { required: true, autocomplete: 'current-password', max: 128 }) + '<button type="button" class="show-pw" data-show-pw="i-password">Show</button>', { required: true })}
      ${botCheck()}
      ${status()}
      <div class="btn-row"><button class="btn btn-primary" type="submit"${site.shi.supabaseUrl ? '' : ' disabled'}><span class="label">Sign in</span><span class="arrow" aria-hidden="true">→</span></button>
      <button class="btn btn-secondary" type="button" data-forgot>Forgot your password?</button></div>
    </form>
  </div></div></section>
  ${config()}`;
  return layout({ path: `${BASE}sign-in/`, title: 'Sign in · School Health Index', description: 'Sign in to the BetterEd School Health Index.', body, noindex: true, head: head(true) });
}

export function shiCheckEmail() {
  const body = html`<section class="page-hero shi-hero" aria-labelledby="h"><div class="container grid grid-12"><div class="span-8">
    <h1 id="h">Check your email.</h1>
    <p class="lead">We sent a link to <strong data-email>your inbox</strong>. Open it to confirm your account, and you will go straight to your School Health Index.</p>
    <p class="small muted" style="margin-top:1rem">Nothing there after a few minutes? Check your spam folder, or <a href="${BASE}sign-in/">sign in</a> if you have already confirmed.</p>
  </div></div></section>${config()}`;
  return layout({ path: `${BASE}check-email/`, title: 'Check your email · School Health Index', description: 'Confirm your School Health Index account.', body, noindex: true, head: head() });
}

export function shiReset() {
  const body = html`<section class="page-hero shi-hero" aria-labelledby="h"><div class="container"><h1 id="h">Choose a new password.</h1></div></section>
  <section class="section-tight" aria-label="New password"><div class="container grid grid-12"><div class="span-6">
    <form class="form shi-form" data-shi-form="reset" novalidate>
      ${field('r-password', 'New password', input('r-password', 'password', 'password', { required: true, autocomplete: 'new-password', max: 128, extra: 'minlength="10"' }) + '<button type="button" class="show-pw" data-show-pw="r-password">Show</button>', { required: true, hint: 'At least 10 characters.' })}
      ${status()}
      <div><button class="btn btn-primary" type="submit"><span class="label">Save and continue</span><span class="arrow" aria-hidden="true">→</span></button></div>
    </form></div></div></section>${config()}`;
  return layout({ path: `${BASE}reset/`, title: 'New password · School Health Index', description: 'Reset your School Health Index password.', body, noindex: true, head: head() });
}

/* ---------- The index ---------- */
const agree = (name, label) => html`<fieldset class="likert" data-q="${name}"><legend>${esc(label)}</legend><div class="likert-opts">
  ${AGREE.map((a, i) => `<label><input type="radio" name="${name}" value="${i + 1}"><span>${esc(a)}</span></label>`)}
  <label class="dk"><input type="radio" name="${name}" value="0"><span>Don't know</span></label></div></fieldset>`;
const choice = (q) => html`<fieldset class="choice" data-q="${q.id}"><legend>${esc(q.label)}${q.required ? ` ${req}` : ''}</legend><div class="choice-opts">
  ${q.options.map((o) => `<label><input type="radio" name="${q.id}" value="${esc(o)}"${q.required ? ' data-required' : ''}><span>${esc(o)}</span></label>`)}</div></fieldset>`;

export function shiExam() {
  const steps = [
    { title: 'About your school', intro: 'Six quick questions so we read your answers in context.', html: CONTEXT.map(choice).join('') },
    ...DOMAINS.map((d) => ({ title: d.name, n: d.n, intro: 'How true is each statement for your school today? Go with your first instinct.', html: d.items.map((t, i) => agree(itemId(d, i), t)).join('') + html`<details class="note"><summary>Add a note about ${esc(d.name.toLowerCase())} (optional)</summary>${field(noteId(d), 'Anything we should know?', `<textarea id="${noteId(d)}" name="${noteId(d)}" maxlength="1000" rows="3" aria-describedby="${noteId(d)}-err"></textarea>`)}</details>` })),
    { title: 'In your own words', intro: 'This is the part we read most closely.', html: OPEN.map((q) => q.options ? choice(q) : field(q.id, esc(q.label), `<textarea id="${q.id}" name="${q.id}" maxlength="${q.max}" rows="5"${q.required ? ' data-required' : ''} aria-describedby="${q.id}-err ${q.id}-hint"></textarea>`, { required: q.required, hint: q.hint })).join('') },
  ];
  const body = html`<section class="shi-exam-head" aria-labelledby="h"><div class="container">
    <div class="exam-top"><p class="small muted"><span data-greet>Your School Health Index</span> · <span data-school></span></p><p class="small"><span class="save-state" data-save aria-live="polite"></span> <button type="button" class="link-btn" data-signout>Sign out</button></p></div>
    <h1 id="h" class="h2">The School Health Index™</h1>
    <div class="exam-progress" aria-hidden="true"><div class="bar"><span data-progress-bar></span></div></div>
    <p class="small muted" data-step-label aria-live="polite"></p>
  </div></section>
  <section class="section-tight shi-exam" aria-label="Questions"><div class="container grid grid-12"><div class="span-8">
    <div data-gate class="form-status" role="status">Loading your School Health Index…</div>
    <form class="form" data-shi-form="exam" novalidate hidden>
      ${steps.map((s, i) => html`<fieldset class="shi-step" data-step="${i}" ${i ? 'hidden' : ''}><legend class="step-title">${s.n ? `<span class="step-n">${s.n}</span>` : ''}${esc(s.title)}</legend><p class="muted">${esc(s.intro)}</p>${s.html}</fieldset>`)}
      <div class="form-status is-error" data-step-err role="alert" hidden></div>
      <div class="exam-nav btn-row"><button type="button" class="btn btn-secondary" data-prev hidden><span aria-hidden="true">←</span> <span>Back</span></button>
        <button type="button" class="btn btn-primary" data-next><span>Next</span> <span class="arrow" aria-hidden="true">→</span></button>
        <button type="submit" class="btn btn-primary" data-submit hidden><span class="label">Submit my School Health Index</span> <span class="arrow" aria-hidden="true">→</span></button></div>
      <p class="notice">Your answers save automatically. Once you submit, they are locked and a BetterEd practitioner begins reading.</p>
    </form>
  </div></div></section>
  ${config()}`;
  return layout({ path: `${BASE}exam/`, title: 'Your School Health Index', description: 'Complete your BetterEd School Health Index.', body, noindex: true, head: head() });
}

export function shiSubmitted() {
  const body = html`<section class="page-hero shi-hero" aria-labelledby="h"><div class="container grid grid-12"><div class="span-8">
    <h1 id="h">Thank you. We're reading it now.</h1>
    <p class="lead">A BetterEd practitioner reads every School Health Index. You'll receive your report by email within ${site.shi.reviewWindow}, and we'll reach out at the time you chose to set up a conversation about what we found.</p>
    <ol class="next-steps" role="list" style="margin-top:2.5rem">
      <li><div><strong>Review.</strong> A practitioner reads your answers, scores each of the 12 domains and looks for the few root causes that explain the most.</div></li>
      <li><div><strong>Your report.</strong> Your School Health Score, strengths, risks and recommended next steps, sent to your email.</div></li>
      <li><div><strong>A conversation.</strong> We call at your preferred time to walk through it and answer questions. No obligation.</div></li>
    </ol>
    <div class="btn-row" style="margin-top:2rem"><a class="btn btn-secondary" href="/approach/">How the diagnosis works <span class="arrow" aria-hidden="true">→</span></a></div>
  </div></div></section>`;
  return layout({ path: `${BASE}submitted/`, title: 'Submitted · School Health Index', description: 'Your School Health Index has been submitted.', body, noindex: true });
}

export function shiTerms() {
  const body = html`${breadcrumb(crumbs('Terms', `${BASE}terms/`))}
  <section class="page-hero" aria-labelledby="h"><div class="container"><h1 id="h">School Health Index terms</h1><p class="lead">Plain-language terms for the free School Health Index. Version ${site.shi.termsVersion}.</p></div></section>
  <div class="container section-tight" style="padding-top:0"><div class="prose">
    <p><em>These terms have not yet been reviewed by legal counsel.</em></p>
    <h2>What the School Health Index is</h2>
    <p>A free diagnostic questionnaire about the conditions around learning in your school. A BetterEd practitioner reviews your answers and sends you a written report by email, usually within ${site.shi.reviewWindow}. The report is a professional opinion based on what you tell us; it is not an audit, an evaluation of any individual, or a guarantee of results.</p>
    <h2>One per person</h2>
    <p>Each person may complete one free School Health Index. Please use your own work email and answer for one school.</p>
    <h2>What you agree to</h2>
    <ul><li>The information you provide is accurate to the best of your knowledge, and you are authorized to share it.</li>
    <li>You will not include student names, student records or other confidential student information.</li>
    <li>BetterEd may contact you by email, and by phone if you give a number, about your results and how we could help. You can ask us to stop at any time.</li></ul>
    <h2>How we use your information</h2>
    <p>We use your account details and answers to prepare your report, to contact you about it, and to improve the School Health Index. We may use answers in aggregate, with names and schools removed. We do not sell personal information. See the <a href="/privacy/">privacy policy</a> for details, including how to see, correct or delete what we hold.</p>
    <h2>Questions</h2>
    <p>Email <a href="mailto:${site.email}">${site.email}</a>.</p>
  </div></div>`;
  return layout({ path: `${BASE}terms/`, title: 'School Health Index terms', description: 'Terms for the free BetterEd School Health Index.', body });
}
