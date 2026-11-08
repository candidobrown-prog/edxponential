// Generates og-default.png (1200x630) and apple-touch-icon.png from brand assets. Run from the project root.
import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright'); import { readFile } from 'node:fs/promises';
const A = process.cwd() + '/src/assets';
const logo = await readFile(`${A}/logo-reversed.svg`, 'utf8');
const icon = await readFile(`${A}/app-icon.svg`, 'utf8');
const cell = (x, y, cls) => `<rect class="${cls}" x="${x}" y="${y}" width="92" height="92"/>`;
const cross = `<svg class="x" viewBox="-2 -2 304 304">${[[0,0],[208,0],[0,208],[208,208]].map(([x,y]) => cell(x,y,'g')).join('')}${[[104,0],[0,104],[208,104],[104,208]].map(([x,y]) => cell(x,y,'b')).join('')}${cell(104,104,'c')}</svg>`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(`<html><head><style>
@font-face{font-family:"Source Serif 4";src:url("file://${A}/fonts/source-serif-4-latin-400-normal.woff2")}
@font-face{font-family:"Source Serif 4";font-style:italic;src:url("file://${A}/fonts/source-serif-4-latin-400-italic.woff2")}
@font-face{font-family:"Work Sans";font-weight:600;src:url("file://${A}/fonts/work-sans-latin-600-normal.woff2")}
body{margin:0;width:1200px;height:630px;background:#0B1F3A;color:#fff;position:relative;overflow:hidden;font-family:"Work Sans",sans-serif}
.l{position:absolute;left:80px;top:72px;width:300px}.l svg{width:100%;height:auto}
h1{position:absolute;left:80px;top:220px;margin:0;font:400 96px/1.02 "Source Serif 4",serif;letter-spacing:-.02em}h1 em{color:#FFC20E}
p{position:absolute;left:80px;bottom:72px;margin:0;font-size:26px;font-weight:600}p span{color:#FFC20E}
.x{position:absolute;right:90px;top:150px;width:330px}.g{fill:none;stroke:rgba(255,255,255,.18);stroke-width:2}.b{fill:#1A5FB4}.c{fill:#FFC20E}
</style></head><body><div class="l">${logo}</div><h1>Schools can<br><em>get well.</em></h1><p>Happy. Healthy. <span>High-performing.</span></p>${cross}</body></html>`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: `${A}/og-default.png` });
await p.setViewportSize({ width: 180, height: 180 });
await p.setContent(`<html><body style="margin:0">${icon.replace('width="512" height="512"', 'width="180" height="180"')}</body></html>`);
await p.screenshot({ path: `${A}/apple-touch-icon.png` });
await b.close(); console.log('images ok');
