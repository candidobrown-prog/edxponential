// Minimal static server for dist/ with clean URLs (QA only).
import http from 'node:http'; import { readFile, stat } from 'node:fs/promises'; import { join, extname } from 'node:path';
const root = process.argv[2] || 'dist', port = +(process.argv[3] || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };
http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (req.method === 'POST' && p === '/api/contact') { res.writeHead(503, { 'content-type': 'application/json' }); return res.end('{"ok":false,"error":"not_configured"}'); }
  let f = join(root, p);
  try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); } catch { f = join(root, '404.html'); res.statusCode = 404; }
  try { const b = await readFile(f); res.setHeader('content-type', types[extname(f)] || 'application/octet-stream'); res.end(b); } catch { res.statusCode = 404; res.end('nf'); }
}).listen(port, () => console.log('serving', root, port));
