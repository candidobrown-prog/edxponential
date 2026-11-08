// Internal link + anchor checker over dist/. External links are listed, not fetched.
import { readFile, readdir, stat } from 'node:fs/promises'; import { join } from 'node:path';
async function walk(d) { let out = []; for (const f of await readdir(d)) { const p = join(d, f); if ((await stat(p)).isDirectory()) out = out.concat(await walk(p)); else if (p.endsWith('.html')) out.push(p); } return out; }
const files = await walk('dist'); const pages = new Map();
for (const f of files) pages.set('/' + f.replace(/^dist\//, '').replace(/index\.html$/, ''), await readFile(f, 'utf8'));
let bad = [], ext = new Set(), checked = 0;
for (const [route, html] of pages) {
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(mailto:|tel:)/.test(href)) continue;
    if (/^https?:/.test(href)) { ext.add(href); continue; }
    checked++;
    const [pathq, hash] = href.split('#'); const path = (pathq || route).split('?')[0];
    if (path.startsWith('/assets/')) { try { await stat('dist' + path); } catch { bad.push(`${route} -> ${href} (missing asset)`); } continue; }
    const target = pages.get(path);
    if (!target) { bad.push(`${route} -> ${href}`); continue; }
    if (hash && !new RegExp(`id="${hash}"`).test(target)) bad.push(`${route} -> ${href} (missing #${hash})`);
  }
}
console.log(`checked ${checked} internal links on ${pages.size} pages; broken: ${bad.length}`); bad.forEach((b) => console.log('  ' + b));
console.log('external links (not fetched):'); [...ext].forEach((e) => console.log('  ' + e));
