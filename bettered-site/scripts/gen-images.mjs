// Generates og-default.png (1200x630) and apple-touch-icon.png from brand assets.
import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright'); import { readFile } from 'node:fs/promises';
const logo = await readFile('src/assets/logo-reversed.svg', 'utf8');
const icon = await readFile('src/assets/app-icon.svg', 'utf8');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto('file://'+process.cwd()+'/src/assets/'); await p.setContent(`<html><head><style>@font-face{font-family:"Libre Franklin";font-weight:800;src:url("file:///home/claude/bettered-site/src/assets/fonts/libre-franklin-latin-800-normal.woff2")}body{margin:0;width:1200px;height:630px;background:#0B1F3A;color:#fff;font-family:'Libre Franklin',sans-serif;position:relative;overflow:hidden}
.l{position:absolute;left:72px;top:64px;width:360px}.l svg{width:100%;height:auto}h1{position:absolute;left:80px;top:250px;margin:0;font-size:92px;font-weight:800;letter-spacing:-.03em;line-height:1}
p{position:absolute;left:80px;bottom:70px;margin:0;font-size:30px;font-weight:800}p span{color:#FFC20E}
.v{position:absolute;right:-30px;top:150px;width:520px}</style></head><body><div class="l">${logo}</div><h1>Schools can<br>get well.</h1><p>Happy. Healthy. <span>High-performing.</span></p>
<svg class="v" viewBox="-4 6 116 100"><path d="M4 64 H25 L29.5 57 L34 64 H43 L49.5 20 L58.5 92 L64 64 H75 L94 38" fill="none" stroke="#1A5FB4" stroke-width="3" stroke-linejoin="miter"/><circle cx="94" cy="38" r="6.5" fill="#FFC20E"/></svg></body></html>`, { waitUntil: 'networkidle' });
await p.screenshot({ path: 'src/assets/og-default.png' });
await p.setViewportSize({ width: 180, height: 180 });
await p.setContent(`<html><body style="margin:0">${icon.replace('width="512" height="512"', 'width="180" height="180"')}</body></html>`);
await p.screenshot({ path: 'src/assets/apple-touch-icon.png', omitBackground: true });
await b.close(); console.log('images ok');
