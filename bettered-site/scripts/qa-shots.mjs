import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright');
import { mkdir } from 'node:fs/promises';
const base = 'http://localhost:4173';
const routes = (process.argv[2] || '/,/approach/,/solutions/,/solutions/culture-climate/,/solutions/whole-school-turnaround/,/school-health-index/,/results/,/results/shining-stars-montessori/,/insights/,/about/,/procurement/,/contact/,/partner/,/privacy/,/404.html').split(',');
const widths = (process.argv[3] || '1440,390').split(',').map(Number);
const dir = process.argv[4] || 'qa/shots';
await mkdir(dir, { recursive: true });
const b = await chromium.launch(); const errors = [];
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error') errors.push(`${w} ${p.url()} ${m.text()}`); });
  p.on('pageerror', (e) => errors.push(`${w} ${p.url()} PAGEERROR ${e.message}`));
  for (const r of routes) {
    await p.goto(base + r, { waitUntil: 'networkidle' });
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) errors.push(`${w} ${r} horizontal overflow ${overflow}px`);
    const name = (r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/\//g, '_').replace('.html', '')) + `-${w}.png`;
    await p.screenshot({ path: `${dir}/${name}`, fullPage: true });
  }
  await ctx.close();
}
await b.close();
console.log(errors.length ? errors.join('\n') : 'no console errors / no overflow');
