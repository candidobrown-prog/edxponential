// BetterEd static site generator. Zero runtime dependencies.
//   node build.mjs            -> dist/     (production: clean URLs, published content only)
//   node build.mjs --preview  -> preview/  (flat relative files for private review; includes 'review' drafts)
import { mkdir, writeFile, rm, cp, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

// The BetterEd brand is locked (brand/BRAND.md). Stop the build if a locked element changed.
try { execFileSync(process.execPath, ['scripts/check-brand.mjs'], { stdio: 'inherit' }); } catch { process.exit(1); }
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { site, solutions, caseStudies, insights } from './src/content/site.mjs';
import * as P from './src/templates/pages.mjs';
import * as SHI from './src/templates/shi.mjs';

const PREVIEW = process.argv.includes('--preview');
const OUT = PREVIEW ? 'preview' : 'dist';
const visible = (item) => item.status === 'published' || item.status === 'external' || (PREVIEW && item.status === 'review');

const routes = [
  ['/', P.home(insights.filter(visible))],
  ['/approach/', P.approach()],
  ['/solutions/', P.solutionsIndex()],
  ...solutions.map((s) => [`/solutions/${s.slug}/`, P.solutionPage(s)]),
  ['/school-health-index/', P.shi()],
  ['/school-health-index/start/', SHI.shiStart()],
  ['/school-health-index/sign-in/', SHI.shiSignIn()],
  ['/school-health-index/check-email/', SHI.shiCheckEmail()],
  ['/school-health-index/reset/', SHI.shiReset()],
  ['/school-health-index/exam/', SHI.shiExam()],
  ['/school-health-index/submitted/', SHI.shiSubmitted()],
  ['/school-health-index/terms/', SHI.shiTerms()],
  ['/results/', P.results()],
  ...caseStudies.filter(visible).map((c) => [`/results/${c.slug}/`, P.caseStudy(c)]),
  ['/insights/', P.insightsIndex(insights.filter(visible))],
  ...insights.filter((a) => visible(a) && a.status !== 'external').map((a) => [`/insights/${a.slug}/`, P.article(a)]),
  ['/about/', P.about()],
  ['/partner/', P.partner()],
  ['/procurement/', P.procurement()],
  ['/contact/', P.contact()],
  ['/privacy/', P.privacy()],
  ['/accessibility/', P.accessibility()],
  ['/404.html', P.notFound()],
];

// Production must never ship drafts on the home page or insights index.
if (!PREVIEW) for (const [, h] of routes) if (h.includes('Draft for owner review')) throw new Error('Draft content leaked into production build.');

const flat = (route) => route === '/' ? 'index.html' : route.endsWith('.html') ? route.slice(1) : route.replace(/^\/|\/$/g, '').replace(/\//g, '-') + '.html';

function toPreview(htmlStr, route) {
  // Rewrite root-relative URLs to flat relative files.
  let out = htmlStr.replace(/(href|src)="\/(?!\/)([^"]*)"/g, (m, attr, rest) => {
    const [pathPart, ...q] = rest.split(/(?=[?#])/);
    const suffix = q.join('');
    if (pathPart.startsWith('assets/') || pathPart.startsWith('api/')) return `${attr}="${pathPart}${suffix}"`;
    return `${attr}="${pathPart === '' ? './' : flat('/' + pathPart)}${suffix}"`;
  });
  if (route === '/') {
    out = out.replace(/<title>[^<]*<\/title>/, '<title>BetterEd Website v2</title><style>.site-header{top:env(safe-area-inset-top,0px)}body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:60;background:#F6F4EE}</style>');
    // The artifact host wraps the main page in its own skeleton.
    out = out.replace(/<!doctype html>\s*<html[^>]*>\s*<head>/i, '').replace(/<\/head>\s*<body([^>]*)>/i, (m, attrs) => attrs.trim() ? `<div hidden data-body-attrs ${attrs}></div><script>(function(){var d=document.querySelector('[data-body-attrs]');if(d){var e=d.getAttribute('data-page-event');if(e)document.body.setAttribute('data-page-event',e);d.remove();}})()</script>` : '').replace(/<\/body>\s*<\/html>\s*$/i, '');
  }
  return out;
}

// Cache-busting: version query on CSS/JS so /assets can be served immutable.
const ver = async (f) => createHash('sha256').update(await readFile(f)).digest('hex').slice(0, 10);
const V = { css: await ver('src/assets/styles.css'), js: await ver('src/assets/main.js') };
for (const r of routes) r[1] = r[1].replace('/assets/styles.css"', `/assets/styles.css?v=${V.css}"`).replace('/assets/main.js"', `/assets/main.js?v=${V.js}"`);

await rm(OUT, { recursive: true, force: true });
await mkdir(join(OUT, 'assets'), { recursive: true });
for (const [route, h] of routes) {
  const file = PREVIEW ? join(OUT, flat(route)) : route.endsWith('.html') ? join(OUT, route) : join(OUT, route, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, PREVIEW ? toPreview(h, route) : h);
}
await cp('src/assets', join(OUT, 'assets'), { recursive: true });

if (!PREVIEW) {
  const indexable = routes.filter(([r, h]) => !r.endsWith('.html') && !h.includes('name="robots" content="noindex"')).map(([r]) => r);
  const today = new Date().toISOString().slice(0, 10);
  await writeFile(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((r) => `  <url><loc>${site.url}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  await writeFile(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`);
}
console.log(`${OUT}: ${routes.length} routes written`);
