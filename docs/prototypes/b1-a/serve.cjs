const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
// All routes below are static prototype assets; no API or file-upload endpoint.
const files = { '/': ['index.html', 'text/html'], '/index.html': ['index.html', 'text/html'], '/styles.css': ['styles.css', 'text/css'], '/app.js': ['app.js', 'text/javascript'], '/charts.js': ['charts.js', 'text/javascript'] };
http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://127.0.0.1:3101').pathname;
  const asset = pathname === '/refresh.css' ? ['refresh.css', 'text/css'] : files[pathname];
  res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  if (!asset || !['GET', 'HEAD'].includes(req.method)) { res.writeHead(404); res.end('Not found'); return; }
  res.setHeader('Content-Type', `${asset[1]}; charset=utf-8`);
  res.writeHead(200);
  if (req.method === 'HEAD') res.end(); else fs.createReadStream(path.join(root, asset[0])).pipe(res);
}).listen(3101, '127.0.0.1', () => console.log('FitSync B1-A prototype: http://127.0.0.1:3101 — Ctrl+C to stop.'));
