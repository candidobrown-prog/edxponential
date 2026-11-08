// axe-core on every route (desktop + mobile), plus interaction tests. Writes qa/a11y-results.json.
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const { chromium } = require('playwright'); import { readFile, writeFile, mkdir } from 'node:fs/promises';
const axeSrc = await readFile('node_modules/axe-core/axe.min.js', 'utf8');
const base = 'http://localhost:4173';
const routes = ['/', '/approach/', '/solutions/', '/solutions/culture-climate/', '/solutions/leadership-development/', '/solutions/educator-development/', '/solutions/whole-school-turnaround/', '/school-health-index/', '/results/', '/results/shining-stars-montessori/', '/insights/', '/about/', '/partner/', '/procurement/', '/contact/', '/privacy/', '/accessibility/', '/404.html'];
const b = await chromium.launch(); const out = { axe: {}, tests: [] };
const ok = (name, pass, detail = '') => { out.tests.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage();
  for (const r of routes) {
    await p.goto(base + r, { waitUntil: 'networkidle' });
    // reveal everything so axe checks final colors
    await p.evaluate(() => document.querySelectorAll('[data-reveal],[data-mastery]').forEach((e) => e.classList.add('is-in')));
    await p.waitForTimeout(700);
    await p.addScriptTag({ content: axeSrc });
    const res = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })));
    out.axe[`${w} ${r}`] = res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target.join(' ') }));
  }
  await ctx.close();
}
const total = Object.values(out.axe).reduce((n, v) => n + v.length, 0);
ok('axe-core: 0 violations across 18 routes × 2 widths', total === 0, total ? JSON.stringify(Object.fromEntries(Object.entries(out.axe).filter(([, v]) => v.length))) : '');

// Keyboard: skip link + mobile menu focus containment + Escape
{ const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  await p.keyboard.press('Tab'); ok('Skip link is first focusable', (await p.evaluate(() => document.activeElement.className)) === 'skip-link');
  await p.keyboard.press('Enter'); ok('Skip link moves focus to main', (await p.evaluate(() => document.activeElement.id)) === 'main');
  await p.focus('.menu-toggle'); await p.keyboard.press('Enter'); await p.waitForTimeout(350);
  ok('Menu opens on Enter, aria-expanded=true', (await p.getAttribute('.menu-toggle', 'aria-expanded')) === 'true');
  ok('Focus moves into menu', await p.evaluate(() => !!document.activeElement.closest('#mobile-menu')));
  for (let i = 0; i < 20; i++) await p.keyboard.press('Tab');
  ok('Focus stays contained in open menu', await p.evaluate(() => !!document.activeElement.closest('#mobile-menu') || document.activeElement.classList.contains('menu-toggle')));
  await p.keyboard.press('Escape'); await p.waitForTimeout(350);
  ok('Escape closes menu and returns focus to toggle', (await p.getAttribute('.menu-toggle', 'aria-expanded')) === 'false' && await p.evaluate(() => document.activeElement.classList.contains('menu-toggle')));
  ok('Closed menu is inert', await p.evaluate(() => document.getElementById('mobile-menu').hasAttribute('inert')));
  await ctx.close(); }

// SHI tabs: arrow keys
{ const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  await p.goto(base + '/school-health-index/', { waitUntil: 'networkidle' });
  await p.focus('#tab-01'); await p.keyboard.press('ArrowRight');
  ok('SHI: ArrowRight selects next domain', (await p.getAttribute('#tab-02', 'aria-selected')) === 'true' && !(await p.isHidden('#panel-02')) && await p.isHidden('#panel-01'));
  await p.keyboard.press('End'); ok('SHI: End selects last domain', (await p.getAttribute('#tab-12', 'aria-selected')) === 'true');
  await p.keyboard.press('ArrowRight'); ok('SHI: wraps to first', (await p.getAttribute('#tab-01', 'aria-selected')) === 'true');
  await ctx.close(); }

// Contact form: validation, honest failure (endpoint returns 503 locally), duplicate submit guard, type preselect
{ const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  let posts = 0; p.on('request', (r) => { if (r.method() === 'POST') posts++; });
  await p.goto(base + '/contact/?type=procurement', { waitUntil: 'networkidle' });
  ok('Contact: ?type=procurement preselects Procurement', (await p.inputValue('#f-type')) === 'Procurement');
  await p.click('button[type=submit]');
  ok('Contact: empty submit shows errors, no request sent', (await p.getAttribute('#f-name', 'aria-invalid')) === 'true' && posts === 0);
  ok('Contact: focus moves to first invalid field', await p.evaluate(() => document.activeElement.id === 'f-name'));
  await p.fill('#f-name', 'QA Tester'); await p.fill('#f-email', 'not-an-email'); await p.fill('#f-org', 'Test District'); await p.fill('#f-msg', 'Testing.');
  await p.click('button[type=submit]');
  ok('Contact: invalid email rejected client-side', (await p.getAttribute('#f-email', 'aria-invalid')) === 'true' && posts === 0);
  await p.fill('#f-email', 'qa@example.org');
  await p.click('button[type=submit]'); await p.click('button[type=submit]').catch(() => {});
  await p.waitForSelector('#form-status.is-error, #form-status.is-success', { timeout: 5000 });
  const txt = await p.textContent('#form-status');
  ok('Contact: delivery failure shown honestly (never false success)', txt.includes('was not sent'), txt.trim().slice(0, 80));
  ok('Contact: duplicate submit prevented (1 request)', posts === 1, `requests=${posts}`);
  ok('Contact: user text preserved after failure', (await p.inputValue('#f-msg')) === 'Testing.');
  await ctx.close(); }

// Reduced motion: final state immediately
{ const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(50);
  const st = await p.evaluate(() => { const path = document.querySelector('.hero-trace path.trace'); const cs = getComputedStyle(path); const n = document.querySelector('.metric .n').textContent; const hidden = [...document.querySelectorAll('[data-reveal]')].filter((e) => getComputedStyle(e).opacity !== '1').length; return { off: cs.strokeDashoffset, n, hidden }; });
  ok('Reduced motion: Vital Line complete on load', parseFloat(st.off) === 0, JSON.stringify(st));
  ok('Reduced motion: metrics show final values (no counting)', st.n === '+15');
  ok('Reduced motion: no hidden reveal content', st.hidden === 0);
  await ctx.close(); }

// Motion: hero draws once and settles; content visible immediately
{ const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded' });
  const h1 = await p.evaluate(() => getComputedStyle(document.querySelector('#hero-h')).opacity);
  ok('Hero headline visible from first paint (not animated in)', h1 === '1');
  await p.waitForTimeout(1600);
  const drawn = await p.evaluate(() => ({ cls: document.querySelector('.hero-trace svg').classList.contains('is-drawn'), off: getComputedStyle(document.querySelector('.hero-trace path.trace')).strokeDashoffset }));
  ok('Hero Vital Line draws once and settles at offset 0', drawn.cls && parseFloat(drawn.off) === 0, JSON.stringify(drawn));
  await ctx.close(); }

await b.close();
await mkdir('qa', { recursive: true }); await writeFile('qa/a11y-results.json', JSON.stringify(out, null, 2));
