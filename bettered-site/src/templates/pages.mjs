import { site, method, solutions, mastery, shiDomains, shiBands, founder, team, caseStudies, insights } from '../content/site.mjs';
import { claim } from '../content/claims.mjs';
import { icon } from './icons.mjs';
import { existsSync } from 'node:fs';

/* Background video hero: switches on when src/assets/video/hero.mp4 exists (see scripts/encode-hero-video.sh). */
const HERO_VIDEO = existsSync('src/assets/video/hero.mp4');
const HERO_WEBM = existsSync('src/assets/video/hero.webm');
import { html, esc, layout, crossArt, methodSpine, stageStrip, rulePoint, kicker, tagline, btn, linkArrow, ctaPair, breadcrumb, closing, evidenceNote, metric, ldOrg, ldBreadcrumb } from './lib.mjs';

const sol = (slug) => solutions.find((s) => s.slug === slug);
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

/* ---------- shared sections ---------- */
function methodSection({ id = 'method', heading = 'Diagnosis before prescription.', intro = 'Every BetterEd engagement follows the same six steps, from intake to discharge. Not because every school is the same, but because no school should be treated before it is examined.', detailed = false } = {}) {
  return html`<section class="section" id="${id}" aria-labelledby="${id}-h">
    <div class="container">
      <div class="section-head split">
        <div>${kicker('The BetterEd method')}<h2 id="${id}-h">${esc(heading)}</h2>${rulePoint()}</div>
        <p class="lead">${esc(intro)}</p>
      </div>
      <div class="method">
        ${methodSpine()}
        <ol class="steps" role="list">
          ${method.map((m, i) => html`<li class="step" data-stage="${i}">
            <span class="step-n">0${i + 1}</span>
            <h3>${esc(m.name)}</h3>
            <p class="step-line">${esc(m.line)}</p>
            <p class="muted">${esc(m.body)}</p>
            ${detailed ? html`<p><strong>What happens</strong></p><ul>${m.activities.map((a) => `<li>${esc(a)}</li>`)}</ul><p><strong>What you have at the end:</strong> ${esc(m.output)}</p>` : ''}
          </li>`)}
        </ol>
      </div>
    </div></section>`;
}

/* The BetterEd Model: the cross as a diagram. Each arm is an EdSolution; the gold core is the diagnosis. */
function modelFigure({ caption = true } = {}) {
  const pos = { 'school-health': 'l', 'leader-development': 't', 'teacher-development': 'r', 'intensive-care': 'b' };
  return html`<div class="model">
    <ul class="model-grid" role="list" aria-label="The BetterEd Model">
      ${solutions.map((s) => `<li class="m-${pos[s.slug]}"><a href="/solutions/${s.slug}/">${icon(s.icon)}<span class="m-name">${esc(s.name)}</span><span class="m-role">${esc(s.role)}</span></a></li>`)}
      <li class="m-c"><a href="/approach/#stages"><span class="m-name">Diagnosis</span></a></li>
    </ul>
    ${caption ? html`<div class="model-copy stack"><h3>The BetterEd Model</h3><p>Each arm of the cross is one EdSolution. The gold center is the diagnosis, and it decides which arms a school needs, in what order, and at what level of care.</p>${linkArrow('How the diagnosis works', '/approach/#stages')}</div>` : ''}
  </div>`;
}

function solutionsList({ dark = false, heading = true } = {}) {
  return html`<ul class="solutions-list" role="list">
    ${solutions.map((s) => html`<li><a class="solution-row${s.intensive ? ' is-intensive' : ''}" href="/solutions/${s.slug}/" data-track="EdSolution viewed" data-track-label="${esc(s.name)}" data-reveal>
      <span class="num">${s.n}</span>
      <h3>${esc(s.name)}<span class="sol-sub">${esc(s.sub)}</span></h3>
      <span class="role">${icon(s.icon)}<span>${esc(s.role)}</span></span>
      <span class="desc">${esc(s.short)}</span>
      <span class="go" aria-hidden="true">→</span>
    </a></li>`)}
  </ul>`;
}

function masterySection({ behaviors = false, dark = true } = {}) {
  return html`<section class="section ${dark ? 'band-ink' : ''}" id="mastery" aria-labelledby="mastery-h">
    <div class="container">
      <div class="section-head split">
        <div>${kicker('How we work')}<h2 id="mastery-h" class="visually-hidden">MASTERY: our values</h2>
          <p class="mastery-word" data-mastery aria-hidden="true">${'MASTERY'.split('').map((l, i) => `<span style="--i:${i}"${l === 'Y' && i === 6 ? ' class="y"' : ''}>${l}</span>`)}</p></div>
        <p class="lead">These are not words on a wall. They describe how BetterEd shows up inside the work, and what we ask the adults we serve to hold with us.</p>
      </div>
      <ul class="values${behaviors ? ' has-behaviors' : ''}" role="list">
        ${mastery.map((v) => html`<li class="value" data-reveal><span class="letter" aria-hidden="true">${v.l}</span><h3>${esc(v.name)}</h3><p>${esc(v.text)}</p>${behaviors ? `<p class="behavior">${esc(v.behavior)}</p>` : ''}</li>`)}
      </ul>
    </div></section>`;
}

function founderSection({ full = false } = {}) {
  return html`<section class="section ${full ? '' : 'band-mist'}" id="founder" aria-labelledby="founder-h">
    <div class="container founder">
      <div class="portrait-card" data-reveal>
        <div class="portrait-art">${crossArt()}</div>
        <div><p class="name">Candido<br>Brown</p><p class="role">${esc(founder.title)}, BetterEd Solutions</p>
          <ul class="creds" role="list">${founder.creds.map(([a, b]) => `<li><strong>${esc(a)}</strong>${esc(b)}</li>`)}</ul></div>
      </div>
      <div class="stack">
        ${kicker('Who is doing the work')}
        <h2 id="founder-h">${full ? 'A practitioner, not a pundit.' : 'Built by someone who has run schools.'}</h2>
        <div class="editorial measure">${(full ? founder.story : [founder.summary]).map((p) => `<p>${esc(p)}</p>`)}</div>
        ${full ? '' : linkArrow('Read Candido Brown\'s story', '/about/#founder')}
      </div>
    </div></section>`;
}

function quoteBlock() {
  const q = claim('CL-04');
  return html`<figure class="quote" data-reveal><blockquote><p>“${esc(q.wording)}”</p></blockquote>
    <figcaption><strong>${esc(q.person)}</strong>${esc(q.title)}, ${esc(q.organization)}</figcaption></figure>`;
}

function evidenceStrip({ dark = false } = {}) {
  const r = claim('CL-01'), m = claim('CL-02');
  return html`<div class="metrics has-3">${metric(r)}${metric(m)}
    <div class="stack-sm">${evidenceNote(r, { compact: true })}<p class="small muted">Reported during a multi-year BetterEd engagement. Baseline and endpoint not publicly disclosed. Verified internally, not by an independent auditor. Shared attribution.</p>${linkArrow('Read the case study', '/results/shining-stars-montessori/', 'Case study viewed')}</div>
  </div>`;
}

/* ---------- pages ---------- */
export function home(latest = []) {
  const body = html`
  ${HERO_VIDEO ? html`<section class="hero hero-video band-ink" aria-labelledby="hero-h">
    <div class="hero-media" aria-hidden="true">
      <video class="hero-vid" muted loop playsinline preload="metadata" poster="/assets/video/hero-poster.jpg" data-hero-video>
        ${HERO_WEBM ? '<source src="/assets/video/hero.webm" type="video/webm">' : ''}<source src="/assets/video/hero.mp4" type="video/mp4">
      </video>
    </div>
    <div class="container hero-video-inner">
      <div class="hero-masthead" aria-hidden="true"><span class="vol">The BetterEd Method</span><span>Intake · Diagnose · Plan · Treat · Strengthen · Discharge</span></div>
      <div class="hero-video-copy">
        <h1 id="hero-h" class="display">Schools can get well. <em>Fast.</em></h1>
        <p class="lead">Every year a school struggles is a year children don't get back. We diagnose honestly, treat urgently, and stay until the results hold.</p>
        ${ctaPair()}
        ${tagline('hero-tagline')}
      </div>
    </div>
    <button class="video-toggle" type="button" data-video-toggle><span class="vt-icon" aria-hidden="true"></span><span class="vt-label">Pause background video</span></button>
  </section>
  <section class="hero-index-band" aria-label="Where to start"><div class="container">
    <ul class="hero-index" role="list">
      <li><a href="/school-health-index/" data-track="SHI opened"><span class="n">01 · Intake</span><strong>The School Health Index™</strong><span class="d">A 12-domain exam of the conditions around learning.</span></a></li>
      <li><a href="/solutions/"><span class="n">02 · Treat</span><strong>Four EdSolutions</strong><span class="d">School Health, leaders, teachers and Intensive Care.</span></a></li>
      <li><a href="/results/"><span class="n">03 · Measure</span><strong>Measured, not promised</strong><span class="d">Results reported with their limits.</span></a></li>
    </ul>
  </div></section>` : html`<section class="hero" aria-labelledby="hero-h">
    <div class="container">
    <div class="hero-masthead" aria-hidden="true"><span class="vol">The BetterEd Method</span><span>Intake · Diagnose · Plan · Treat · Strengthen · Discharge</span></div>
    <div class="hero-grid">
      <div>
        <h1 id="hero-h" class="display">Schools can get well. <em>Fast.</em></h1>
        <p class="lead">Every year a school struggles is a year children don't get back. We diagnose honestly, treat urgently, and stay until the results hold.</p>
        ${ctaPair()}
        ${tagline('hero-tagline')}
      </div>
      <div class="hero-trace">${crossArt({ draw: 'load', decorative: false })}</div>
    </div>
    <ul class="hero-index" role="list">
      <li><a href="/school-health-index/" data-track="SHI opened"><span class="n">01 · Intake</span><strong>The School Health Index™</strong><span class="d">A 12-domain exam of the conditions around learning.</span></a></li>
      <li><a href="/solutions/"><span class="n">02 · Treat</span><strong>Four EdSolutions</strong><span class="d">School Health, leaders, teachers and Intensive Care.</span></a></li>
      <li><a href="/results/"><span class="n">03 · Measure</span><strong>Measured, not promised</strong><span class="d">Results reported with their limits.</span></a></li>
    </ul>
    </div>
  </section>`}

  <section class="section-tight band-ink" aria-labelledby="ev-h">
    <div class="container">
      <div class="section-head split" style="margin-bottom:2.5rem">
        <div>${kicker('Results')}<h2 id="ev-h">Measured, not promised.</h2></div>
        <p class="lead">We name the measures before the work starts and report them whatever they show. When a number appears on this site, so do its limits.</p>
      </div>
      ${evidenceStrip({ dark: true })}
    </div>
  </section>

  <section class="section" aria-labelledby="problem-h">
    <div class="container grid grid-12">
      <div class="span-5">${kicker('The problem')}<h2 id="problem-h">The institution is the patient. Children are not the problem.</h2>${rulePoint()}</div>
      <div class="span-6 start-7 stack">
        <p class="lead" style="color:var(--ink)">When a school is struggling, it is usually not for lack of effort. It is because the conditions around learning have stopped working, and the fixes have been prescribed before anyone examined the school.</p>
        <ol class="symptoms" role="list">
          <li><span class="n">01</span><span><strong>Programs stack up.</strong>A new curriculum, a new platform, a new initiative, each added before the last one took hold.</span></li>
          <li><span class="n">02</span><span><strong>Leaders are carrying everything.</strong>Principals spend their days on incidents and compliance instead of classrooms.</span></li>
          <li><span class="n">03</span><span><strong>Teaching varies room to room.</strong>Strong teachers and struggling ones work side by side without a shared standard.</span></li>
          <li><span class="n">04</span><span><strong>Gains do not hold.</strong>A good year is followed by a hard one, because nothing was built to last.</span></li>
        </ol>
      </div>
    </div>
  </section>

  ${methodSection()}

  <section class="section band-ink" aria-labelledby="shi-h">
    <div class="container grid grid-12">
      <div class="span-6 stack">${kicker('Start with the diagnosis')}<h2 id="shi-h">The School Health Index™</h2>
        <p class="lead">A 12-domain exam of the conditions around learning, from leadership and culture to finance, facilities and family trust. Every result is reviewed by a BetterEd expert before recommendations are issued.</p>
        <div class="btn-row">${btn('Take the School Health Index', '/school-health-index/', { track: 'SHI opened' })}</div>
      </div>
      <div class="span-5 start-8">
        <ul class="fact-list" role="list">
          <li><strong>12 domains</strong><span class="muted">Leadership to strategic planning</span></li>
          <li><strong>A score from 0 to 100</strong><span class="muted">Placed in one of five health bands</span></li>
          <li><strong>Expert review within 48 hours</strong><span class="muted">Before any recommendation reaches you</span></li>
          <li><strong>No cost, no login</strong><span class="muted">For the public intake</span></li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="sol-h">
    <div class="container">
      <div class="section-head split">
        <div>${kicker('EdSolutions')}<h2 id="sol-h">Four treatments, in the order we work.</h2>${rulePoint()}</div>
        <p class="lead">Every child deserves an excellent classroom, in an excellent school, with excellent teachers and leaders, in an excellent culture. The diagnosis decides which of these a school needs, and how much.</p>
      </div>
      ${modelFigure()}
      ${solutionsList()}
      <p style="margin-top:2rem">${linkArrow('How the EdSolutions fit together', '/solutions/')}</p>
    </div>
  </section>

  <section class="section band-mist" aria-labelledby="case-h">
    <div class="container case-preview">
      <div class="stack">${kicker('Case study')}<h2 id="case-h">Treating the whole school, not one symptom.</h2>
        <p>Shining Stars Montessori Academy PCS faced pressure on enrollment, culture, staffing, instruction, leadership and facilities at once. A multi-year engagement treated them together.</p>
        ${linkArrow('Read the case study', '/results/shining-stars-montessori/', 'Case study viewed')}</div>
      <div>${quoteBlock()}</div>
    </div>
  </section>

  ${masterySection()}
  ${founderSection()}

  <section class="section" aria-labelledby="ins-h">
    <div class="container">
      <div class="section-head split"><div>${kicker('Insights')}<h2 id="ins-h">How we think about the work.</h2></div><p class="lead">Short, practical writing for school and system leaders.</p></div>
      ${articleCards(latest.slice(0, 3))}
      <p style="margin-top:2rem">${linkArrow('All insights', '/insights/')}</p>
    </div>
  </section>

  ${closing()}`;
  return layout({ path: '/', title: 'BetterEd Solutions', description: 'BetterEd Solutions is a school improvement, turnaround and transformation firm. Schools can get well, fast: we diagnose honestly, treat urgently, and stay until the results hold.', body, jsonld: [ldOrg(), { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.name, publisher: { '@id': `${site.url}/#org` } }] });
}

export function approach() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Our Approach', href: '/approach/' }];
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero" aria-labelledby="h">
    <div class="container">${kicker('Our Approach')}<h1 id="h">Diagnosis before prescription.</h1>
      <p class="lead">What actually happens when a school or district works with BetterEd: six steps, from intake to discharge, the same every time, at the level of care your school needs.</p>
      <div class="page-hero-trace">${stageStrip()}</div>
    </div>
  </section>

  <section class="section-tight band-mist" aria-labelledby="model-h">
    <div class="container grid grid-12">
      <div class="span-5">${kicker('The medical model')}<h2 id="model-h">The institution is the patient.</h2></div>
      <div class="span-7 editorial measure">
        <p>When a school is failing, the institution is unwell. Its systems are not doing what the mission needs, and the people inside it cannot do their best work. So we work like good medicine: examine before we treat, treat at the right intensity, and stay until the patient is well on its own.</p>
        <p>The metaphor has limits, and we keep to them. Children are not the patient. Families are not the problem. We examine the conditions adults build around learning: culture, leadership, instruction, systems, decisions and execution. BetterEd does not provide health or clinical services.</p>
      </div>
    </div>
  </section>

  ${methodSection({ id: 'stages', heading: 'Six steps. The same order every time.', intro: 'Here is what each step involves, and what you hold at the end of it.', detailed: true })}

  <section class="section band-mist" aria-labelledby="care-h">
    <div class="container">
      <div class="section-head split"><div><h2 id="care-h">Three levels of care.</h2></div><p class="lead">The diagnosis sets the level of care. Not more than the school needs, and not less than the problem requires.</p></div>
      <ol class="care-levels" role="list">
        <li><span class="care-n">01</span><h3>Check-up</h3><p>The School Health Index and a written diagnosis. For schools that want an honest read before deciding anything.</p><p class="care-link">${linkArrow('The School Health Index', '/school-health-index/', 'SHI opened')}</p></li>
        <li><span class="care-n">02</span><h3>Targeted care</h3><p>One or two EdSolutions aimed at the conditions the diagnosis found: School Health, Leader Development or Teacher Development.</p><p class="care-link">${linkArrow('See the EdSolutions', '/solutions/')}</p></li>
        <li class="is-intensive"><span class="care-n">03</span><h3>Intensive care</h3><p>Whole-school turnaround, when it is everything at once. More time in the building, more intensity, every area treated together.</p><p class="care-link">${linkArrow('Intensive Care', '/solutions/intensive-care/')}</p></li>
      </ol>
    </div>
  </section>


  <section class="section" aria-labelledby="evidence-h">
    <div class="container grid grid-2">
      <div class="callout"><h2 id="evidence-h" class="h3">What evidence we review</h2>
        <ul class="check-list"><li>Attendance, chronic absence and enrollment</li><li>Reading, writing and math results, including growth and gaps between groups</li><li>Discipline and lost instructional time</li><li>Staffing, vacancies and retention</li><li>Schedules, meeting structures and data cycles</li><li>What we see in classrooms, hallways and leadership meetings</li><li>What teachers, students and families tell us</li></ul></div>
      <div class="callout"><h2 class="h3">How we measure progress</h2>
        <ul class="check-list"><li>Measures are named in the treatment plan, before the work begins</li><li>Leading indicators (adult practice we can observe) and lagging indicators (student outcomes)</li><li>Monthly progress reviews with school and system leaders</li><li>Percentage points and percent change are never confused</li><li>Results are reported whatever they show, with their limits</li></ul>
        <p style="margin-top:1.5rem">${linkArrow('How we report results', '/results/#methodology')}</p></div>
    </div>
  </section>

  <section class="section-tight band-mist" aria-labelledby="with-h">
    <div class="container grid grid-12">
      <div class="span-5">${kicker('Alongside, not around')}<h2 id="with-h">We work with your leaders and teachers, inside the building.</h2></div>
      <div class="span-7 stack">
        <p>We do not write a plan and leave. We coach principals on the decisions in front of them that week, and we work with teachers in their classrooms. Every routine is rehearsed before it goes live and handed to the school team as it takes hold.</p>
        <p>We do not replace your leaders, and we do not bring a program in a box. The aim is a school that can diagnose and correct itself, year after year.</p>
        <p>${linkArrow('See the four EdSolutions', '/solutions/')}</p>
      </div>
    </div>
  </section>
  ${closing()}`;
  return layout({ path: '/approach/', title: 'Our Approach', description: 'How BetterEd works: Diagnose, Treat, Strengthen, Sustain. What happens in the first month, what evidence we review, and how progress is measured.', body, jsonld: [ldBreadcrumb(crumbs)] });
}

export function solutionsIndex() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'EdSolutions', href: '/solutions/' }];
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero" aria-labelledby="h"><div class="container">${kicker('EdSolutions')}<h1 id="h">Four treatments. One diagnosis decides the mix.</h1>
    <p class="lead">We call them EdSolutions because each one treats a specific condition in a school, the way a hospital organizes care by department. They always appear in this order, because this is the order we work in.</p></div></section>
  <section class="section-tight" aria-labelledby="four-h"><div class="container"><h2 id="four-h" class="visually-hidden">The four EdSolutions</h2>${modelFigure()}${solutionsList()}</div></section>
  <section class="section band-mist" aria-labelledby="which-h">
    <div class="container">
      <div class="section-head split"><div>${kicker('Which do we need?')}<h2 id="which-h">Start with what you are seeing.</h2></div><p class="lead">Most schools need more than one. The diagnosis tells us which, in what order, and at what intensity.</p></div>
      <ul class="fact-list cols-2" role="list">
        <li><strong>“Our hallways and classrooms do not feel safe or calm.”</strong><a href="/solutions/school-health/">School Health →</a></li>
        <li><strong>“Our principal is carrying everything alone.”</strong><a href="/solutions/leader-development/">Leader Development →</a></li>
        <li><strong>“Teaching quality varies from room to room.”</strong><a href="/solutions/teacher-development/">Teacher Development →</a></li>
        <li><strong>“It is all of the above, and the clock is running.”</strong><a href="/solutions/intensive-care/">Intensive Care →</a></li>
      </ul>
    </div>
  </section>
  <section class="section" aria-labelledby="rel-h"><div class="container grid grid-12">
    <div class="span-5">${kicker('How they relate')}<h2 id="rel-h">Heart, head, hands. Or the whole body.</h2></div>
    <div class="span-7 stack"><p>School Health is the heart: culture and climate, where every treatment starts. If a school has a culture and climate problem, it has a heart condition, and nothing else holds until it is treated. Leader Development strengthens the head: the people who decide and develop others. Teacher Development strengthens the hands: the teachers where learning happens. Intensive Care is the whole body: whole-school turnaround, when the problem is not one condition but all of them, and heart, head and hands are treated together with more time and attention.</p>
    <p>None of them is a product in a box. Each is shaped by the diagnosis.</p>
    <div class="btn-row">${btn('Start with the diagnosis', site.primaryCta.href, { track: 'CTA primary' })}${btn('Take the School Health Index', '/school-health-index/', { variant: 'secondary', track: 'SHI opened' })}</div></div>
  </div></section>
  ${closing()}`;
  return layout({ path: '/solutions/', title: 'EdSolutions', description: 'BetterEd\'s four EdSolutions: School Health, Leader Development, Teacher Development and Intensive Care. The diagnosis decides the mix.', body, jsonld: [ldBreadcrumb(crumbs)] });
}

export function solutionPage(s) {
  const i = solutions.indexOf(s);
  const prev = solutions[i - 1], next = solutions[i + 1];
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'EdSolutions', href: '/solutions/' }, { label: s.name, href: `/solutions/${s.slug}/` }];
  const intensity = s.intensive ? html`<div style="display:flex;align-items:center;gap:1rem;margin-top:1.75rem"><div class="intensity" role="img" aria-label="Highest intensity">${[1, 2, 3, 4].map(() => `<span class="on"></span>`)}</div><span class="small muted">Highest intensity: more time, more attention</span></div>` : '';
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero ${s.intensive ? 'band-ink' : ''}" aria-labelledby="h">
    <div class="container grid grid-12">
      <div class="span-8"><p class="sol-name">${icon(s.icon)}<span><span class="sol-n">${s.n}</span>${esc(s.name)}<span class="sol-sub">${esc(s.sub)} · ${esc(s.role)}</span></span></p><h1 id="h">${esc(s.hero)}</h1><p class="lead">${esc(s.lead)}</p>${intensity}
        <div class="btn-row" style="margin-top:2rem">${btn(s.cta, `/contact/?type=${s.contactType}`, { track: 'CTA solution', })}${btn('Take the School Health Index', '/school-health-index/', { variant: 'secondary', track: 'SHI opened' })}</div></div>
    </div>
  </section>
  <section class="section" aria-labelledby="why-h"><div class="container grid grid-12">
    <div class="span-5">${kicker('Why it matters')}<h2 id="why-h">${esc(s.name)}</h2>${rulePoint()}</div>
    <div class="span-7 editorial measure">${s.why.map((p) => `<p>${esc(p)}</p>`)}</div>
  </div></section>
  <section class="section band-mist" aria-labelledby="ex-h"><div class="container">
    <div class="section-head split"><div>${kicker('Diagnose')}<h2 id="ex-h">What we examine</h2></div><p class="lead">Before recommending anything, we look at the conditions behind what you are seeing.</p></div>
    <dl class="fact-list cols-2">${s.examine.map(([a, b]) => `<div><dt><strong>${esc(a)}</strong></dt><dd class="muted">${esc(b)}</dd></div>`)}</dl>
  </div></section>
  <section class="section" aria-labelledby="work-h"><div class="container grid grid-2">
    <div class="callout">${kicker('Treat and strengthen')}<h2 id="work-h" class="h3" style="margin-top:.5rem">What the work looks like</h2><ul class="check-list" style="margin-top:1rem">${s.work.map((w) => `<li>${esc(w)}</li>`)}</ul></div>
    <div class="callout">${kicker('How we will know')}<h2 class="h3" style="margin-top:.5rem">What we measure</h2><ul class="check-list" style="margin-top:1rem">${s.measures.map((w) => `<li>${esc(w)}</li>`)}</ul><p class="small muted" style="margin-top:1rem">Measures are agreed in the treatment plan, before the work starts.</p></div>
  </div></section>
  ${s.caseStudy ? html`<section class="section-tight band-ink" aria-labelledby="ev-h"><div class="container"><div class="section-head split" style="margin-bottom:2.5rem"><div>${kicker('Evidence')}<h2 id="ev-h">Measured, not promised.</h2></div><p class="lead">Results reported during a multi-year whole-school engagement, with their limits.</p></div>${evidenceStrip()}</div></section>` : ''}
  <section class="section ${s.caseStudy ? '' : 'band-ink'}" aria-labelledby="kids-h"><div class="container grid grid-12">
    <div class="span-4">${kicker('The child remains the reason')}</div>
    <div class="span-8"><h2 id="kids-h" class="statement" style="max-width:28ch">${esc(s.children)}</h2></div>
  </div></section>
  <section class="section-tight" aria-label="More EdSolutions"><div class="container">
    <nav class="pager" aria-label="EdSolutions">${prev ? `<a href="/solutions/${prev.slug}/" rel="prev"><span>Previous · ${prev.n}</span>${esc(prev.name)}</a>` : `<a href="/solutions/"><span>All</span>EdSolutions</a>`}${next ? `<a href="/solutions/${next.slug}/" rel="next" style="text-align:right"><span>Next · ${next.n}</span>${esc(next.name)}</a>` : `<a href="/approach/" style="text-align:right"><span>Next</span>Our Approach</a>`}</nav>
    <div class="related" style="margin-top:3rem">
      <a href="/approach/"><span>Method</span><strong>Intake → Diagnose → Plan → Treat → Strengthen → Discharge</strong></a>
      <a href="/school-health-index/" data-track="SHI opened"><span>Diagnostic</span><strong>The School Health Index</strong></a>
      <a href="/results/shining-stars-montessori/" data-track="Case study viewed"><span>Case study</span><strong>Shining Stars Montessori Academy</strong></a>
    </div>
  </div></section>
  ${closing({ heading: s.intensive ? 'Is it one thing, or is it everything?' : undefined })}`;
  const service = { '@context': 'https://schema.org', '@type': 'Service', name: s.name, serviceType: 'School improvement consulting', description: s.lead, provider: { '@type': 'Organization', name: site.name, url: site.url }, areaServed: 'US', audience: { '@type': 'Audience', audienceType: 'School and district leaders' } };
  return layout({ path: `/solutions/${s.slug}/`, title: s.name, description: `${s.name} (${s.role.toLowerCase()}): ${s.short}`, body, jsonld: [ldBreadcrumb(crumbs), service], pageEvent: 'EdSolution viewed' });
}

export function shi() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'School Health Index', href: '/school-health-index/' }];
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero" aria-labelledby="h"><div class="container grid grid-12">
    <div class="span-8">${kicker('Diagnostic')}<h1 id="h">The School Health Index™</h1>
      <p class="lead">An honest exam of the conditions around learning in your school, across 12 domains, reviewed by a BetterEd expert before any recommendation reaches you.</p>
      <div class="btn-row" style="margin-top:2rem">${btn('Start the School Health Index', site.shiIntakeUrl, { track: 'Diagnostic started' })}${btn('Talk to us first', '/contact/?type=shi', { variant: 'secondary' })}</div></div>
  </div></section>
  <section class="section-tight band-mist" aria-labelledby="why-h"><div class="container grid grid-12">
    <div class="span-5">${kicker('Why diagnose first')}<h2 id="why-h">Most schools are prescribed something before anyone examines them.</h2></div>
    <div class="span-7 stack"><p>Low reading scores can be an instruction problem. They can also be a staffing, schedule or culture problem. Treating the symptom without finding the cause wastes money and, worse, a year of children's learning. The School Health Index looks across the whole institution so the treatment fits the school.</p>
    <p><strong>Who it is for:</strong> principals, school leadership teams, charter leaders and boards, and district leaders responsible for a school or group of schools.</p></div>
  </div></section>
  <section class="section band-ink" aria-labelledby="dom-h"><div class="container">
    <div class="section-head split"><div>${kicker('What is assessed')}<h2 id="dom-h">Twelve domains. One picture of institutional health.</h2></div><p class="lead">Each domain is scored from 0 to 100 with expert commentary. Select a domain to see what we look at.</p></div>
    <div class="shi" data-tabs>
      <div class="shi-tabs" role="tablist" aria-label="School Health Index domains">
        ${shiDomains.map((d, i) => `<button type="button" class="shi-tab" role="tab" id="tab-${d.n}" aria-controls="panel-${d.n}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-domain="${esc(d.name)}"><span class="n">${d.n}</span>${esc(d.name)}</button>`)}
      </div>
      <div>${shiDomains.map((d, i) => { const s = sol(d.solution); return html`<div class="shi-panel" role="tabpanel" id="panel-${d.n}" aria-labelledby="tab-${d.n}" tabindex="0"${i === 0 ? '' : ' hidden'}>
        <h3>${esc(d.name)}</h3><p class="lead" style="margin-top:1rem;color:#fff">${esc(d.looks)}</p>
        <p class="ed-link">Most often treated through <a href="/solutions/${s.slug}/">${esc(s.name)}</a></p></div>`; })}</div>
    </div>
  </div></section>
  <section class="section" aria-labelledby="get-h"><div class="container grid grid-2">
    <div class="callout"><h2 id="get-h" class="h3">What you receive</h2><ul class="check-list" style="margin-top:1rem">
      <li>A preliminary School Health Score from 0 to 100</li><li>Strengths across the 12 domains</li><li>Risks and early warning signs</li><li>Opportunities for near-term wins</li><li>Recommended next steps, after expert review</li><li>An invitation to a health review call</li></ul></div>
    <div class="callout"><h2 class="h3">Health bands</h2>
      <div class="bands" role="list">${shiBands.map((b) => `<div class="band-row" role="listitem"><span class="range">${b.range}</span><span>${esc(b.name)}</span></div>`)}</div></div>
  </div></section>
  <section class="section-tight band-mist" aria-labelledby="next-h"><div class="container grid grid-12">
    <div class="span-5">${kicker('What happens next')}<h2 id="next-h">From intake to conversation.</h2></div>
    <ol class="next-steps span-7" role="list">
      <li><div><strong>Complete the intake.</strong> Five short sections about your school. No login and no cost for the public intake.</div></li>
      <li><div><strong>Receive a preliminary score.</strong> Calculated when you submit, and yours immediately.</div></li>
      <li><div><strong>Expert review within 48 hours.</strong> A BetterEd expert reviews the results before any recommendation is issued.</div></li>
      <li><div><strong>Health review call.</strong> We walk through the findings with you and talk about what, if anything, to do next.</div></li>
    </ol>
  </div></section>
  <section class="section" aria-labelledby="not-h"><div class="container grid grid-2">
    <div class="callout"><h2 id="not-h" class="h3">What it does not do</h2><ul class="check-list not-list" style="margin-top:1rem">
      <li>It does not replace a full diagnostic visit to your school</li><li>It does not rank or compare your school publicly</li><li>It does not ask for student-level records</li><li>It is not a sales quiz: the review is real, and the findings are yours</li></ul></div>
    <div class="callout"><h2 class="h3">Your privacy</h2><ul class="check-list" style="margin-top:1rem">
      <li>Your results are visible only to your organization and the BetterEd reviewers assigned to them</li><li>Never upload student-level records or identifiable personnel files</li><li>You can ask us to archive or delete your diagnostic records</li><li>Activity history is not used for marketing profiling</li></ul>
      <p style="margin-top:1rem">${linkArrow('Read the privacy policy', '/privacy/')}</p></div>
  </div></section>
  ${closing({ heading: 'Find out what is really keeping your school from getting better.', body: 'Start the School Health Index, or talk with BetterEd first. Either way, it starts with the diagnosis.' })}`;
  return layout({ path: '/school-health-index/', title: 'School Health Index', description: 'The BetterEd School Health Index: a 12-domain diagnostic of the conditions around learning, scored 0–100 and reviewed by a BetterEd expert within 48 hours.', body, jsonld: [ldBreadcrumb(crumbs)], pageEvent: 'School Health Index opened' });
}

export function results() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Results', href: '/results/' }];
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero" aria-labelledby="h"><div class="container">${kicker('Results')}<h1 id="h">Measured, not promised.</h1>
    <p class="lead">We name the measures before the work starts, report them whatever they show, and print the limits beside every number. Credibility is worth more than a bigger claim.</p></div></section>
  <section class="section-tight band-ink" aria-labelledby="m-h"><div class="container">
    <h2 id="m-h" class="visually-hidden">Reported results</h2>
    ${evidenceStrip()}
  </div></section>
  <section class="section" aria-labelledby="case-h"><div class="container case-preview">
    <div class="stack">${kicker('Case study')}<h2 id="case-h">Shining Stars Montessori Academy PCS</h2><p>Connected pressures across enrollment, culture, staffing, instruction, leadership and facilities, treated together through a multi-year engagement.</p>${linkArrow('Read the case study', '/results/shining-stars-montessori/', 'Case study viewed')}</div>
    <div>${quoteBlock()}</div>
  </div></section>
  <section class="section band-mist" id="methodology" aria-labelledby="meth-h"><div class="container">
    <div class="section-head split"><div>${kicker('Evidence philosophy')}<h2 id="meth-h">How BetterEd reports results.</h2></div><p class="lead">These rules decide what appears on this site. When a result is missing any of them, it stays unpublished.</p></div>
    <ol class="fact-list cols-2" role="list">
      <li><strong>Every element, or nothing.</strong><span class="muted">A public result names the measure, school, timeframe, source, verification and permission. A missing element keeps it unpublished, not estimated.</span></li>
      <li><strong>Comparable periods only.</strong><span class="muted">If the assessment, grades or population change mid-engagement, the movement is not reported as one figure.</span></li>
      <li><strong>Points are not percents.</strong><span class="muted">A move from 40% to 55% proficient is 15 percentage points, or a 37.5% relative increase. We say which. (Illustration, not a BetterEd result.)</span></li>
      <li><strong>Internal verification is called internal.</strong><span class="muted">We reproduce the calculation from the source record. That is not an independent audit, and we do not describe it as one.</span></li>
      <li><strong>Attribution is shared.</strong><span class="muted">A result during an engagement does not by itself show BetterEd caused it. Schools, leaders and teachers do the work. We say "reported during the engagement".</span></li>
      <li><strong>Permission is separate.</strong><span class="muted">A verified result without the school's written permission stays unpublished.</span></li>
      <li><strong>Limits travel with the number.</strong><span class="muted">Undisclosed baselines, partial populations and short windows are printed beside the result.</span></li>
      <li><strong>Corrections are made promptly.</strong><span class="muted">Corrected results carry a new review date.</span></li>
    </ol>
  </div></section>
  <section class="section" aria-labelledby="mon-h"><div class="container grid grid-12">
    <div class="span-5">${kicker('During the work')}<h2 id="mon-h">How we monitor an engagement.</h2></div>
    <div class="span-7 stack"><p>Measures are named in the treatment plan. We track leading indicators we can observe (adult practice in classrooms and leadership routines) alongside lagging indicators (attendance, culture and student outcomes), and review them monthly with school and system leaders. When something is not working, we say so and adjust.</p>
    <p>${linkArrow('See how the method works', '/approach/')}</p></div>
  </div></section>
  ${closing({ heading: 'Let\'s talk about the challenge in front of you.' })}`;
  return layout({ path: '/results/', title: 'Results', description: 'BetterEd results, measured not promised: reported outcomes with their definitions and limits, and the rules that decide what BetterEd publishes.', body, jsonld: [ldBreadcrumb(crumbs)], pageEvent: 'Results opened' });
}

export function caseStudy(cs) {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Results', href: '/results/' }, { label: cs.school, href: `/results/${cs.slug}/` }];
  const cl = cs.claims.map(claim);
  const stage = (key, label, content, cls = '') => html`<section class="case-stage ${cls}" aria-labelledby="st-${key}"><div class="stage-label"><span class="dot" aria-hidden="true"></span><h2 id="st-${key}" class="stage-title">${label}</h2></div><div>${content}</div></section>`;
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero band-ink" aria-labelledby="h"><div class="container">
    ${kicker(`Case study · ${cs.school}`)}<h1 id="h">${esc(cs.title)}</h1><p class="lead">${esc(cs.summary)}</p>
    <dl class="facts" style="margin-top:2.5rem">${cs.facts.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`)}</dl>
  </div></section>
  <div class="section-tight"><div class="container">
    ${stage('condition', 'Condition', `<p class="lead" style="color:var(--ink)">${esc(cs.stages.condition)}</p>`)}
    ${stage('diagnosis', 'Diagnosis', `<p>${esc(cs.stages.diagnosis)}</p>`)}
    ${stage('treatment', 'Treatment', `<p>${esc(cs.stages.treatment)}</p>`)}
    ${stage('strengthening', 'Strengthening', `<p>${esc(cs.stages.strengthening)}</p>`)}
    ${stage('result', 'Result', html`<div class="metrics">${cl.map(metric)}</div>`, 'is-result')}
    ${stage('sustainability', 'Sustainability', `<p>${esc(cs.stages.sustainability)}</p>`)}
    ${stage('evidence', 'Evidence', html`<div class="table-wrap"><table class="data-table"><caption>How these results were measured</caption>
      <thead><tr><th scope="col">Field</th>${cl.map((c) => `<th scope="col">${esc(c.label)}</th>`)}</tr></thead><tbody>
      ${[['Measure', 'metric'], ['Definition', 'definition'], ['Period', 'dates'], ['Baseline / endpoint', 'baseline'], ['Population', 'population'], ['Source', 'source'], ['Verification', 'verification'], ['Attribution', 'attribution'], ['Last reviewed', 'lastReview']].map(([lab, k]) => `<tr><th scope="row">${lab}</th>${cl.map((c) => `<td>${esc(c[k])}</td>`).join('')}</tr>`)}
      </tbody></table></div><p class="small muted" style="margin-top:1rem">Only evidence approved for public disclosure appears here. Other engagement records are confidential.</p>`)}
  </div></div>
  <section class="section band-mist" aria-labelledby="q-h"><div class="container grid grid-12"><h2 id="q-h" class="visually-hidden">What a school leader said</h2><div class="span-8">${quoteBlock()}</div></div></section>
  <section class="section-tight" aria-label="EdSolutions used"><div class="container"><div class="related">${cs.solutions.slice(0, 3).map((slug) => { const s = sol(slug); return `<a href="/solutions/${s.slug}/"><span>EdSolution ${s.n}</span><strong>${esc(s.name)}</strong></a>`; })}</div></div></section>
  ${closing({ heading: 'What could better look like at your school?' })}`;
  const article = { '@context': 'https://schema.org', '@type': 'Article', headline: `${cs.school}: ${cs.title}`, about: 'School improvement case study', author: { '@type': 'Organization', name: site.name }, publisher: { '@id': `${site.url}/#org`, '@type': 'Organization', name: site.name }, mainEntityOfPage: `${site.url}/results/${cs.slug}/` };
  return layout({ path: `/results/${cs.slug}/`, title: `${cs.school} case study`, description: `${cs.school}: condition, diagnosis, treatment, strengthening, result and sustainability, with the evidence and its limits.`, body, jsonld: [ldBreadcrumb(crumbs), article], ogType: 'article', pageEvent: 'Case study viewed' });
}

function articleCards(list) {
  return html`<div class="articles">${list.map((a) => {
    const href = a.status === 'external' ? a.externalUrl : `/insights/${a.slug}/`;
    return html`<article class="article-card" data-reveal>
      ${a.status === 'review' ? '<p><span class="tag-draft">Draft for owner review</span></p>' : ''}
      <h3><a href="${href}" data-track="Insight viewed">${esc(a.title)}</a></h3>
      <p>${esc(a.deck)}</p>
      <p class="meta">${esc(a.category)} · ${esc(a.author)} · ${a.readMinutes} min read${a.date ? ` · ${fmtDate(a.date)}` : ''}</p>
    </article>`;
  })}</div>`;
}

export function insightsIndex(list) {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Insights', href: '/insights/' }];
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero" aria-labelledby="h"><div class="container">${kicker('Insights')}<h1 id="h">Clear thinking for leaders doing hard work.</h1>
    <p class="lead">On school turnaround, leadership, culture and climate, instruction, evidence and execution. Written by practitioners, for school and system leaders.</p></div></section>
  <section class="section-tight" aria-labelledby="art-h"><div class="container"><h2 id="art-h" class="visually-hidden">Articles</h2>${list.length ? articleCards(list) : '<p class="lead">New writing is on its way. In the meantime, <a href="/approach/">see how we work</a>.</p>'}</div></section>
  ${closing()}`;
  return layout({ path: '/insights/', title: 'Insights', description: 'BetterEd Insights: practical writing on school turnaround, leadership, culture and climate, instruction and evidence for school and system leaders.', body, jsonld: [ldBreadcrumb(crumbs)] });
}

export function article(a) {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Insights', href: '/insights/' }, { label: a.title, href: `/insights/${a.slug}/` }];
  const block = ([t, c]) => t === 'h2' ? `<h2>${esc(c)}</h2>` : t === 'quote' ? `<blockquote><p>${esc(c)}</p></blockquote>` : `<p>${esc(c)}</p>`;
  const body = html`${breadcrumb(crumbs)}
  <article>
    <header class="container article-head">${kicker(a.category)}${a.status === 'review' ? '<p style="margin-top:.75rem"><span class="tag-draft">Draft for owner review — excluded from production</span></p>' : ''}
      <h1 style="margin-top:1rem">${esc(a.title)}</h1><p class="deck">${esc(a.deck)}</p>
      <p class="article-meta"><span>By ${esc(a.author)}</span><span><time datetime="${a.date}">${fmtDate(a.date)}</time></span><span>${a.readMinutes} min read</span></p>${rulePoint()}</header>
    <div class="container section-tight" style="padding-top:1rem"><div class="article-body">${a.body.map(block)}</div></div>
  </article>
  <section class="section-tight band-mist" aria-labelledby="rel-h"><div class="container"><h2 id="rel-h" class="h3" style="margin-bottom:1.5rem">Related</h2><div class="related">
    ${a.related.map((slug) => { const s = sol(slug); return `<a href="/solutions/${s.slug}/"><span>EdSolution ${s.n}</span><strong>${esc(s.name)}</strong></a>`; })}
    <a href="/school-health-index/" data-track="SHI opened"><span>Diagnostic</span><strong>The School Health Index</strong></a></div></div></section>
  ${closing()}`;
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.deck, datePublished: a.date, author: { '@type': 'Organization', name: a.author }, publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: `${site.url}/assets/logo-primary.svg` } }, mainEntityOfPage: `${site.url}/insights/${a.slug}/` };
  return layout({ path: `/insights/${a.slug}/`, title: a.title, description: a.deck, body, jsonld: [ldBreadcrumb(crumbs), ld], ogType: 'article', pageEvent: 'Insight viewed', noindex: a.status !== 'published' });
}

export function about() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'About', href: '/about/' }];
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero" aria-labelledby="h"><div class="container grid grid-12"><div class="span-8">${kicker('About BetterEd')}<h1 id="h">Every child deserves an excellent school.</h1>
    <p class="lead">BetterEd Solutions is a school improvement, turnaround and transformation firm, founded in ${site.foundedPlace} in ${site.founded}. We work with schools, districts and charter networks to diagnose what is keeping a school from getting better, treat it at the right intensity, and build what holds.</p></div></div></section>
  <section class="section band-ink" aria-labelledby="p-h"><div class="container grid grid-12">
    <div class="span-5">${kicker('Purpose')}<h2 id="p-h">We love children. We love adults.</h2></div>
    <div class="span-7 editorial measure"><p>It is up to the adults to make sure children have an opportunity, so the adults need training, development and support. A failing school is an institution that is unwell, and institutions can get well.</p>
    <p>Our promise is simple to say and hard to do: every child in an excellent classroom, in an excellent school, with excellent teachers and excellent leaders, in an excellent culture and climate.</p>${tagline()}</div>
  </div></section>
  <section class="section" aria-labelledby="d-h"><div class="container">
    <div class="section-head split"><div>${kicker('What makes BetterEd different')}<h2 id="d-h">Most firms start with a solution. We start with a diagnosis.</h2></div><p class="lead">And then we stay close enough to the work for practice to change.</p></div>
    <div class="table-wrap"><table class="data-table"><caption class="visually-hidden">Typical approach compared with BetterEd</caption><thead><tr><th scope="col">Typical approach</th><th scope="col">BetterEd</th></tr></thead><tbody>
      <tr><td>Arrives with a program</td><td><strong>Arrives with questions, and a diagnosis</strong></td></tr>
      <tr><td>Trains staff off-site</td><td><strong>Coaches inside classrooms and leadership meetings</strong></td></tr>
      <tr><td>Treats one symptom at a time</td><td><strong>Treats connected conditions together, at the right intensity</strong></td></tr>
      <tr><td>Promises outcomes</td><td><strong>Names measures in advance and reports them with their limits</strong></td></tr>
      <tr><td>Stays as long as the contract</td><td><strong>Plans the handover from the start: year after year</strong></td></tr>
    </tbody></table></div>
  </div></section>
  ${masterySection({ behaviors: true })}
  ${founderSection({ full: true })}
  <section class="section band-mist" id="team" aria-labelledby="t-h"><div class="container">
    <div class="section-head split"><div>${kicker('The team')}<h2 id="t-h">Practitioners who have done the work.</h2></div><p class="lead">Every school gets a team. BetterEd brings together school leaders, coaches and specialists in governance, data and charter strategy.</p></div>
    <ul class="team" role="list">${team.map(([n, t]) => `<li><strong>${esc(n)}</strong><span>${esc(t)}</span></li>`)}</ul>
  </div></section>
  ${closing()}`;
  const person = { '@context': 'https://schema.org', '@type': 'Person', '@id': `${site.url}/about/#founder`, name: 'Candido Brown', jobTitle: 'Founder and CEO', worksFor: { '@id': `${site.url}/#org` }, alumniOf: [{ '@type': 'EducationalOrganization', name: 'Johns Hopkins University' }, { '@type': 'EducationalOrganization', name: 'Harvard Graduate School of Education' }, { '@type': 'EducationalOrganization', name: 'Baltimore City College' }] };
  return layout({ path: '/about/', title: 'About', description: 'About BetterEd Solutions: our purpose, the MASTERY values, founder Candido Brown, and the practitioners who do the work.', body, jsonld: [ldBreadcrumb(crumbs), ldOrg(), person] });
}

export function partner() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Partner', href: '/partner/' }];
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero" aria-labelledby="h"><div class="container">${kicker('Partner')}<h1 id="h">Better schools take more than one organization.</h1>
    <p class="lead">We collaborate with organizations that share the standard: honest diagnosis, practical work in schools, and results that are measured, not promised.</p></div></section>
  <section class="section-tight" aria-labelledby="who-h"><div class="container grid grid-2">
    <div class="callout"><h2 id="who-h" class="h3">Who we work with</h2><ul class="check-list" style="margin-top:1rem"><li>Specialist consultants and coaches</li><li>Nonprofits and community organizations</li><li>Universities and researchers, including evaluation partners</li><li>Philanthropic partners funding durable improvement</li><li>Education organizations with complementary expertise</li></ul></div>
    <div class="callout"><h2 class="h3">How we partner</h2><ul class="check-list" style="margin-top:1rem"><li>Roles and responsibilities agreed in writing before work begins</li><li>One plan for the school, not parallel initiatives</li><li>Shared measures, reported honestly</li><li>No partnership is described publicly without both organizations' written permission</li></ul></div>
  </div></section>
  ${closing({ heading: 'Propose a partnership.', body: 'Tell us about your organization and the schools you serve. A BetterEd partner reads every message.' }).replace('/contact/?type=diagnostic', '/contact/?type=partnership').replace('Start with the diagnosis', 'Propose a partnership')}`;
  return layout({ path: '/partner/', title: 'Partner', description: 'Partner with BetterEd Solutions: how we collaborate with consultants, nonprofits, universities, philanthropic and education organizations.', body, jsonld: [ldBreadcrumb(crumbs)] });
}

export function procurement() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Procurement', href: '/procurement/' }];
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero" aria-labelledby="h"><div class="container">${kicker('Procurement')}<h1 id="h">What you need for the vendor file.</h1>
    <p class="lead">For district, state and charter procurement teams. Send RFPs, RFQs and requests for qualifications to BetterEd directly, and we will respond with the documents your process requires.</p>
    <div class="btn-row" style="margin-top:2rem">${btn('Request qualifications', '/contact/?type=procurement', { track: 'Procurement inquiry' })}</div></div></section>
  <section class="section-tight band-mist" aria-labelledby="ov-h"><div class="container">
    <h2 id="ov-h" class="h3" style="margin-bottom:1.5rem">Company overview</h2>
    <div class="table-wrap"><table class="data-table"><tbody>
      <tr><th scope="row">Legal name</th><td>${esc(site.legalName)}</td></tr>
      <tr><th scope="row">Founded</th><td>${site.founded}, ${site.foundedPlace}</td></tr>
      <tr><th scope="row">Leadership</th><td>Candido Brown, Founder and CEO</td></tr>
      <tr><th scope="row">Services</th><td>School improvement, turnaround and transformation: School Health (culture and climate), Leader Development, Teacher Development, Intensive Care (whole-school turnaround); School Health Index diagnostic</td></tr>
      <tr><th scope="row">Clients served</th><td>Public school districts, public charter schools and charter networks</td></tr>
      <tr><th scope="row">Contact for RFPs</th><td><a href="mailto:${site.email}">${site.email}</a> · ${site.phone}</td></tr>
    </tbody></table></div>
  </div></section>
  <section class="section" aria-labelledby="docs-h"><div class="container grid grid-2">
    <div class="callout"><h2 id="docs-h" class="h3">Available on request</h2><ul class="check-list" style="margin-top:1rem"><li>Capability statement</li><li>Scope of work and pricing for your solicitation</li><li>W-9</li><li>References from schools and systems served</li><li>Registration and certification details, where held</li></ul>
      <p class="small muted" style="margin-top:1rem">We list only registrations and certifications we currently hold, and provide documentation with every response.</p></div>
    <div class="callout"><h2 class="h3">How the process works</h2><ol class="next-steps" role="list" style="margin-top:1rem">
      <li><div>Send the solicitation or request through the form or by email.</div></li>
      <li><div>We confirm that we received it.</div></li>
      <li><div>We respond with the documents and scope your process requires.</div></li></ol></div>
  </div></section>
  <section class="section-tight band-ink" aria-label="Request qualifications"><div class="container grid grid-12"><div class="span-8 stack"><h2>Issuing an RFP?</h2><p class="lead">Add BetterEd to your notification list or send the solicitation directly.</p><div class="btn-row">${btn('Request qualifications', '/contact/?type=procurement', { track: 'Procurement inquiry' })}</div></div></div></section>`;
  return layout({ path: '/procurement/', title: 'Procurement', description: 'BetterEd Solutions procurement information for district, state and charter buyers: company overview, documents available on request, and how to send an RFP.', body, jsonld: [ldBreadcrumb(crumbs)], pageEvent: 'Procurement opened' });
}

export function contact() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }];
  const types = ['Start with the diagnosis', 'School Health Index', 'School Health', 'Leader Development', 'Teacher Development', 'Intensive Care', 'Partnership', 'Procurement', 'Other'];
  const field = (id, label, input, { hint = '', req = false } = {}) => html`<div class="field"><label for="${id}">${label}${req ? ' <span class="req">(required)</span>' : ''}${hint ? `<span class="hint" id="${id}-hint">${hint}</span>` : ''}</label>${input}<p class="error" id="${id}-err" aria-live="polite"></p></div>`;
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero" aria-labelledby="h"><div class="container">${kicker('Contact')}<h1 id="h">Start with the diagnosis.</h1>
    <p class="lead">Tell us what you are seeing. The first conversation is 30 minutes. A BetterEd partner reads every message.</p></div></section>
  <section class="section-tight" style="padding-top:0"><div class="container grid grid-12">
    <div class="span-7">
      <form class="form" data-contact action="${site.contactEndpoint}" method="post" novalidate aria-describedby="privacy-note">
        <div id="form-status" class="form-status" role="status" aria-live="polite" tabindex="-1" hidden></div>
        <div class="form-row two">
          ${field('f-name', 'Name', '<input id="f-name" name="name" type="text" autocomplete="name" required maxlength="120" data-validate data-required-msg="Enter your name." aria-describedby="f-name-err">', { req: true })}
          ${field('f-email', 'Work email', '<input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="200" data-validate data-required-msg="Enter your work email." aria-describedby="f-email-err">', { req: true })}
        </div>
        <div class="form-row two">
          ${field('f-org', 'School, district or organization', '<input id="f-org" name="organization" type="text" autocomplete="organization" required maxlength="200" data-validate data-required-msg="Enter your school, district or organization." aria-describedby="f-org-err">', { req: true })}
          ${field('f-role', 'Role', '<input id="f-role" name="role" type="text" autocomplete="organization-title" maxlength="120" data-validate aria-describedby="f-role-err" placeholder="e.g., Principal, Chief Academic Officer">')}
        </div>
        ${field('f-type', 'What would you like to talk about?', `<select id="f-type" name="inquiry_type" required data-validate aria-describedby="f-type-err">${types.map((t) => `<option>${esc(t)}</option>`).join('')}</select>`, { req: true })}
        ${field('f-msg', 'What is keeping your school from getting better?', '<textarea id="f-msg" name="message" required maxlength="4000" data-validate data-required-msg="Tell us a little about what you are seeing." aria-describedby="f-msg-hint f-msg-err"></textarea>', { req: true, hint: 'A few sentences is plenty. Please do not include student names or other confidential student information.' })}
        <div class="hp-field" aria-hidden="true"><label for="f-website">Leave this field empty</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <input type="hidden" name="started_at" value="">
        <div><button class="btn btn-primary" type="submit"><span class="label">Send to BetterEd</span><span class="arrow" aria-hidden="true">→</span></button></div>
        <p class="notice" id="privacy-note">We use what you send only to reply to you. See our <a href="/privacy/">privacy policy</a>.</p>
      </form>
    </div>
    <aside class="span-4 start-9 stack" aria-labelledby="next-h">
      <h2 id="next-h" class="h3">What happens next</h2>
      <ol class="next-steps" role="list"><li><div>A BetterEd partner reads your message.</div></li><li><div>We reply to schedule a 30-minute conversation.</div></li><li><div>If there is a fit, we propose a diagnostic with a clear scope.</div></li></ol>
      <div class="callout"><p class="small"><strong>Prefer email or phone?</strong></p><p class="small"><a href="mailto:${site.email}">${site.email}</a><br><a href="tel:+18007350953">${site.phone}</a></p></div>
    </aside>
  </div></section>`;
  return layout({ path: '/contact/', title: 'Contact', description: 'Contact BetterEd Solutions. Tell us what you are seeing; the first conversation is 30 minutes and starts with the diagnosis.', body, jsonld: [ldBreadcrumb(crumbs)], pageEvent: 'Contact opened' });
}

export function privacy() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Privacy', href: '/privacy/' }];
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero" aria-labelledby="h"><div class="container">${kicker('Policy')}<h1 id="h">Privacy</h1><p class="lead">What this website collects, why, and what we do with it. Last updated ${fmtDate('2026-11-08')}.</p></div></section>
  <div class="container section-tight" style="padding-top:0"><div class="prose">
    <p><em>This statement describes how this website is built. It has not yet been reviewed by legal counsel.</em></p>
    <h2>What we collect</h2>
    <p><strong>Contact form.</strong> Your name, work email, organization, role, the topic you choose and your message. We use it only to reply to you and to keep a record of the conversation. Please do not send confidential student information.</p>
    <p><strong>School Health Index.</strong> The diagnostic intake is governed by its own privacy notice, shown before you begin. Results are visible only to your organization, its invited collaborators and the BetterEd reviewers assigned to your assessment. Do not upload student-level records or identifiable personnel files. You can ask us to archive or delete your diagnostic records, subject to any legal hold.</p>
    <p><strong>Basic server logs.</strong> Our hosting provider records standard request information (such as IP address and browser type) to keep the site secure and working.</p>
    <h2>Cookies and analytics</h2>
    <p>This website does not set advertising or tracking cookies. If we add analytics, we will use a privacy-focused service that does not use cookies or build profiles, and we will update this page first.</p>
    <h2>Third parties</h2>
    <p>Fonts are served from our own domain; no font service receives your information. Contact form messages are delivered by an email service provider acting on our behalf. We do not sell personal information.</p>
    <h2>Retention</h2>
    <p>We keep contact messages as long as needed to respond and to maintain a record of the relationship, and delete them on request.</p>
    <h2>Your choices</h2>
    <p>To see, correct or delete what we hold about you, email <a href="mailto:${site.email}">${site.email}</a>.</p>
  </div></div>`;
  return layout({ path: '/privacy/', title: 'Privacy', description: 'How the BetterEd Solutions website collects and uses information.', body, jsonld: [ldBreadcrumb(crumbs)] });
}

export function accessibility() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Accessibility', href: '/accessibility/' }];
  const body = html`${breadcrumb(crumbs)}
  <section class="page-hero" aria-labelledby="h"><div class="container">${kicker('Policy')}<h1 id="h">Accessibility</h1><p class="lead">We want everyone who works on behalf of children to be able to use this site.</p></div></section>
  <div class="container section-tight" style="padding-top:0"><div class="prose">
    <p>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.</p>
    <h2>What we have done</h2>
    <ul><li>Semantic page structure, landmarks and a skip link</li><li>Full keyboard operation, with a visible focus indicator</li><li>Color contrast checked against AA for all text</li><li>Forms with labels, instructions and announced errors</li><li>Motion that respects your device's reduced-motion setting, without losing any content</li><li>Automated testing with axe-core and manual keyboard testing before release</li></ul>
    <h2>Known limitations</h2>
    <p>The School Health Index intake is a separate application and is being reviewed on its own schedule. If you have trouble with any part of the site, tell us.</p>
    <h2>Contact</h2>
    <p>Email <a href="mailto:${site.email}">${site.email}</a> or call ${site.phone}. We will respond and provide the information in another format if you need it.</p>
  </div></div>`;
  return layout({ path: '/accessibility/', title: 'Accessibility', description: 'Accessibility statement for the BetterEd Solutions website.', body, jsonld: [ldBreadcrumb(crumbs)] });
}

export function notFound() {
  const body = html`<section class="section notfound" aria-labelledby="h"><div class="container stack">${kicker('404')}<h1 id="h">This page could not be found.</h1>
    <p class="lead">The link may be old, or the page may have moved when we rebuilt the site. Here is where most people are headed.</p>
    <ul class="fact-list" role="list" style="max-width:32rem"><li><a href="/">Home</a></li><li><a href="/approach/">Our Approach</a></li><li><a href="/solutions/">EdSolutions</a></li><li><a href="/school-health-index/">School Health Index</a></li><li><a href="/contact/">Contact</a></li></ul>
    <div class="notfound-art">${crossArt({ draw: 'load' })}</div></div></section>`;
  return layout({ path: '/404.html', title: 'Page not found', description: 'This page could not be found.', body, noindex: true });
}
