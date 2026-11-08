import { site, nav, footerNav } from '../content/site.mjs';

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const html = (strings, ...vals) => strings.reduce((out, s, i) => out + s + (i < vals.length ? (Array.isArray(vals[i]) ? vals[i].join('') : (vals[i] ?? '')) : ''), '');

/* The Vital Line. Geometry is the approved mark (Brand Kit 02); only the baseline may be extended for graphic use. */
const MARK = 'H25 L29.5 57 L34 64 H43 L49.5 20 L58.5 92 L64 64 H75 L94 38';
export function vitalLine({ cls = '', draw = '', extend = 0, labels = false, label = 'The Vital Line: a flat baseline, a spike, and a rise to a yellow point', decorative = true, thin = false } = {}) {
  const x0 = 4 - extend;
  const vb = `${x0 - 8} 6 ${116 + extend} ${labels ? 112 : 100}`;
  const lab = labels ? html`<g aria-hidden="true">
    <text class="baseline-label" x="14" y="114">DIAGNOSE</text>
    <text class="baseline-label" x="40" y="114">TREAT</text>
    <text class="baseline-label" x="61" y="114">STRENGTHEN</text>
    <text class="baseline-label" x="88" y="114">SUSTAIN</text></g>` : '';
  const a11y = decorative ? 'aria-hidden="true" focusable="false"' : `role="img" aria-label="${esc(label)}"`;
  return html`<svg class="vital ${thin ? 'is-thin' : ''} ${cls}" viewBox="${vb}" ${a11y} ${draw ? `data-draw="${draw}"` : ''} preserveAspectRatio="xMidYMid meet"><path class="trace" d="M${x0} 64 ${MARK}"/><circle class="point" cx="94" cy="38" r="6.5"/>${lab}</svg>`;
}

export function methodSpine() {
  const nodes = [[29.5, 57], [49.5, 20], [64, 64], [94, 38]];
  return html`<div class="method-spine" aria-hidden="true">
    <svg viewBox="-8 6 120 100"><path class="trace" d="M-4 64 ${MARK}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="miter" style="stroke:var(--ink)"/>
    ${nodes.map(([x, y]) => `<circle class="node" cx="${x}" cy="${y}" r="3.4"/>`)}
    <circle class="signal" cx="${nodes[0][0]}" cy="${nodes[0][1]}" r="4.6"/></svg>
    <div class="labels"><span>Diagnose</span><span>Treat</span><span>Strengthen</span><span>Sustain</span></div>
  </div>`;
}

export const rulePoint = (extra = '') => `<div class="rule-point ${extra}" data-reveal aria-hidden="true"></div>`;
export const kicker = (t) => `<p class="kicker">${esc(t)}</p>`;
export const tagline = (cls = '') => `<p class="tagline ${cls}">Happy. Healthy. <span class="hp">High-performing.</span></p>`;

export function btn(label, href, { variant = 'primary', track = '', arrow = true } = {}) {
  return `<a class="btn btn-${variant}" href="${esc(href)}"${track ? ` data-track="${esc(track)}"` : ''}><span>${esc(label)}</span>${arrow ? '<span class="arrow" aria-hidden="true">→</span>' : ''}</a>`;
}
export const linkArrow = (label, href, track = '') => `<a class="link-arrow" href="${esc(href)}"${track ? ` data-track="${esc(track)}"` : ''}>${esc(label)} <span class="arrow" aria-hidden="true">→</span></a>`;

export function ctaPair(dark = false) {
  return `<div class="btn-row">${btn(site.primaryCta.label, site.primaryCta.href, { track: site.primaryCta.track })}${btn(site.secondaryCta.label, site.secondaryCta.href, { variant: 'secondary', track: site.secondaryCta.track })}</div>`;
}

export function breadcrumb(items) {
  return html`<nav class="breadcrumb container" aria-label="Breadcrumb"><ol>${items.map((it, i) => i === items.length - 1
    ? `<li><span aria-current="page">${esc(it.label)}</span></li>`
    : `<li><a href="${it.href}">${esc(it.label)}</a></li>`)}</ol></nav>`;
}

export function closing({ heading = 'What is keeping your school from getting better?', body = 'Tell us what you are seeing. The first conversation is 30 minutes and it starts where every BetterEd engagement starts: with the diagnosis.' } = {}) {
  return html`<section class="section band-ink closing" aria-labelledby="closing-h">
    ${vitalLine({ draw: 'scroll' })}
    <div class="container stack">
      ${kicker('Start here')}
      <h2 id="closing-h">${esc(heading)}</h2>
      <p class="lead">${esc(body)}</p>
      ${ctaPair(true)}
    </div></section>`;
}

export function evidenceNote(c, { compact = false } = {}) {
  return html`<div class="evidence-note"><strong>How to read this number.</strong> ${esc(c.definition)}
    ${compact ? '' : html`<dl>
      <dt>School</dt><dd>${esc(c.organization)}</dd>
      <dt>Period</dt><dd>${esc(c.dates)}</dd>
      <dt>Baseline</dt><dd>${esc(c.baseline)}</dd>
      <dt>Source</dt><dd>${esc(c.source)}</dd>
      <dt>Verification</dt><dd>${esc(c.verification)}</dd>
      <dt>Attribution</dt><dd>${esc(c.attribution)}</dd></dl>`}
  </div>`;
}

export function metric(c) {
  return html`<div class="metric" data-count="${c.value}" data-prefix="${esc(c.prefix || '')}">
    <p class="metric-value"><span class="n">${esc((c.prefix || '') + c.value)}</span><span class="unit">${esc(c.unit)}</span></p>
    <p class="metric-label">${esc(c.label)}</p>
    <p class="metric-context">${esc(c.organization)} · ${esc(c.dates)} · percentage points</p>
  </div>`;
}

function header(path) {
  const isCurrent = (href) => path === href ? 'aria-current="page"' : (path.startsWith(href) && href !== '/' ? 'aria-current="true"' : '');
  return html`<a class="skip-link" href="#main">Skip to content</a>
  <aside class="utility-bar" aria-label="Contact and quick links"><div class="container utility-inner">
    <p><a href="tel:+18007350953">${esc(site.phone)}</a> · <a href="mailto:${site.email}">${esc(site.email)}</a></p>
    <nav aria-label="Utility"><ul role="list">
      <li><a href="/school-health-index/">School Health Index</a></li><li><a href="/procurement/">Procurement</a></li><li><a href="/partner/">Partner</a></li><li><a href="/contact/">Contact</a></li>
      <li><a class="utility-cta" href="${esc(site.primaryCta.href)}" data-track="CTA utility">${esc(site.primaryCta.label)} →</a></li></ul></nav>
  </div></aside>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="BetterEd Solutions, home"><img src="/assets/logo-primary.svg" width="168" height="46" alt="BetterEd Solutions"></a>
      <nav class="nav-primary" aria-label="Primary"><ul role="list">${nav.map((n) => `<li><a href="${n.href}" ${isCurrent(n.href)}>${esc(n.label)}</a></li>`)}</ul></nav>
      <div class="header-cta">${btn(site.primaryCta.label, site.primaryCta.href, { track: 'CTA header', arrow: false })}</div>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu"><span class="bars" aria-hidden="true"></span><span class="label">Menu</span></button>
    </div>
    <div class="progress" aria-hidden="true"><div class="progress-bar"></div><div class="progress-point"></div></div>
  </header>
  <div class="mobile-menu" id="mobile-menu">
    <nav aria-label="Mobile"><ul role="list">${nav.map((n) => `<li><a href="${n.href}" ${isCurrent(n.href)}>${esc(n.label)}</a></li>`)}</ul>
    <ul role="list" class="utility" style="margin-top:1.5rem">
      <li><a href="/school-health-index/">School Health Index</a></li><li><a href="/procurement/">Procurement</a></li><li><a href="/partner/">Partner</a></li><li><a href="/contact/">Contact</a></li></ul>
    ${btn(site.primaryCta.label, site.primaryCta.href, { track: 'CTA mobile menu' })}</nav>
  </div>`;
}

function footer() {
  return html`<footer class="site-footer">
    <div class="container">
      <p class="footer-mission">Every child deserves an excellent school. <em>Schools can get well.</em></p>
      <div class="footer-top">
        <div class="footer-brand"><img src="/assets/logo-reversed.svg" width="190" height="52" alt="BetterEd Solutions">
          ${tagline()}
          <p class="small" style="margin-top:1rem;color:var(--on-ink-2);max-width:32ch">A school improvement, turnaround and transformation firm.</p>
        </div>
        <div class="footer-cols">${footerNav.map((col) => html`<div><h2>${esc(col.heading)}</h2><ul role="list">${col.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`)}</ul></div>`)}</div>
      </div>
      <div class="footer-rule" aria-hidden="true"></div>
      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} ${esc(site.legalName)}</p>
        <p><a href="mailto:${site.email}">${site.email}</a> · <a href="tel:+18007350953">${site.phone}</a></p>
      </div>
    </div>
  </footer>`;
}

export function layout({ path, title, description, body, jsonld = [], ogType = 'website', pageEvent = '', noindex = false, ogImage = '/assets/og-default.png' }) {
  const fullTitle = path === '/' ? `${site.name} | School improvement, turnaround and transformation` : `${title} | ${site.name}`;
  const canonical = site.url + path;
  const ld = jsonld.length ? `<script type="application/ld+json">${JSON.stringify(jsonld.length === 1 ? jsonld[0] : { '@context': 'https://schema.org', '@graph': jsonld.map(({ '@context': _, ...r }) => r) }).replace(/</g, '\\u003c')}</script>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta name="theme-color" content="#0B1F3A">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}${ogImage}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/libre-franklin-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/libre-franklin-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/newsreader-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/styles.css">
<script src="/assets/main.js" defer></script>
${ld}
</head>
<body${pageEvent ? ` data-page-event="${esc(pageEvent)}"` : ''}>
${header(path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
</body>
</html>
`;
}

export const ldOrg = () => ({
  '@context': 'https://schema.org', '@type': 'Organization', '@id': `${site.url}/#org`,
  name: site.name, legalName: site.legalName, url: site.url, logo: `${site.url}/assets/logo-primary.svg`,
  description: site.description, slogan: site.tagline, email: site.email, telephone: '+1-800-735-0953', foundingDate: site.founded,
  founder: { '@type': 'Person', '@id': `${site.url}/about/#founder`, name: 'Candido Brown', jobTitle: 'Founder and CEO' },
  knowsAbout: ['School improvement', 'School turnaround', 'School culture and climate', 'School leadership development', 'Teacher development', 'Instructional coaching'],
});
export const ldBreadcrumb = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, item: site.url + it.href })),
});
