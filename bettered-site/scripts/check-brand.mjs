// Brand lock. The BetterEd brand (brand/BRAND.md, version in brand/brand.lock.json) is locked by the founder.
// Every build runs this check and stops if a locked element changed: logo and icon files, the B-Cross
// geometry, the fonts, the color and type tokens, or the tagline.
//   node scripts/check-brand.mjs            check (build.mjs calls this)
//   node scripts/check-brand.mjs --update   re-lock after a change the founder approved in writing
//                                           (also bump "version" and add a row to brand/BRAND.md)
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const LOCK = 'brand/brand.lock.json';
const FILES = [
  'src/assets/logo-primary.svg', 'src/assets/logo-reversed.svg', 'src/assets/logo-reversed-panel.svg',
  'src/assets/favicon.svg', 'src/assets/app-icon.svg', 'src/templates/icons.mjs',
  'src/assets/fonts/source-serif-4-latin-400-normal.woff2', 'src/assets/fonts/source-serif-4-latin-400-italic.woff2',
  'src/assets/fonts/source-serif-4-latin-600-normal.woff2', 'src/assets/fonts/work-sans-latin-400-normal.woff2',
  'src/assets/fonts/work-sans-latin-500-normal.woff2', 'src/assets/fonts/work-sans-latin-600-normal.woff2',
  'src/assets/fonts/work-sans-latin-700-normal.woff2',
];
// Locked values inside source files: [label, file, regex whose first match is locked]
const VALUES = [
  ['color navy', 'src/assets/styles.css', /--ink:\s*([^;]+);/], ['color harbor', 'src/assets/styles.css', /--harbor:\s*([^;]+);/],
  ['color signal', 'src/assets/styles.css', /--signal:\s*([^;]+);/], ['color pulse', 'src/assets/styles.css', /--pulse:\s*([^;]+);/],
  ['color paper', 'src/assets/styles.css', /--paper:\s*([^;]+);/], ['color mist', 'src/assets/styles.css', /--mist:\s*([^;]+);/],
  ['color slate', 'src/assets/styles.css', /--slate:\s*([^;]+);/],
  ['font sans', 'src/assets/styles.css', /--sans:\s*([^;]+);/], ['font serif', 'src/assets/styles.css', /--serif:\s*([^;]+);/],
  ['B-Cross geometry', 'src/templates/lib.mjs', /export const BOWLS = (\[[^\]]+\])/],
  ['tagline', 'src/templates/lib.mjs', /export const tagline = [^\n]+/],
];

const sha = (b) => createHash('sha256').update(b).digest('hex');
async function snapshot() {
  const out = { files: {}, values: {} };
  for (const f of FILES) out.files[f] = sha(await readFile(f));
  for (const [label, f, re] of VALUES) {
    const m = re.exec(await readFile(f, 'utf8'));
    if (!m) throw new Error(`Brand lock: could not find ${label} in ${f}.`);
    out.values[label] = (m[1] ?? m[0]).trim();
  }
  return out;
}

const now = await snapshot();
if (process.argv.includes('--update')) {
  let prev = {}; try { prev = JSON.parse(await readFile(LOCK, 'utf8')); } catch { /* first lock */ }
  await writeFile(LOCK, JSON.stringify({ brand: 'BetterEd', version: prev.version ?? '2.2', lockedBy: prev.lockedBy ?? 'Candido Brown', lockedOn: new Date().toISOString().slice(0, 10), note: 'Do not edit by hand. Change the brand only with the founder\'s written approval, then run node scripts/check-brand.mjs --update.', ...now }, null, 2) + '\n');
  console.log(`brand lock updated (${Object.keys(now.files).length} files, ${Object.keys(now.values).length} values)`);
} else {
  const lock = JSON.parse(await readFile(LOCK, 'utf8'));
  const changed = [
    ...FILES.filter((f) => lock.files[f] !== now.files[f]).map((f) => `  file   ${f}`),
    ...Object.keys(now.values).filter((k) => lock.values[k] !== now.values[k]).map((k) => `  value  ${k}: locked "${lock.values[k]}", found "${now.values[k]}"`),
  ];
  if (changed.length) {
    console.error(`\nBRAND LOCK: the BetterEd brand (version ${lock.version}, locked by ${lock.lockedBy}) has changed:\n${changed.join('\n')}\n\nRestore the locked version, or, if the founder approved this change in writing, bump the version in ${LOCK}, record it in brand/BRAND.md, and run: node scripts/check-brand.mjs --update\n`);
    process.exit(1);
  }
  console.log(`brand lock: BetterEd ${lock.version} intact`);
}
