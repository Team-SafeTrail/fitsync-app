import http from 'node:http';
import https from 'node:https';
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('../', import.meta.url)));

async function loadTargetUrl() {
  if (process.env.SUPABASE_CLOUD_URL) return process.env.SUPABASE_CLOUD_URL.trim();
  try {
    const raw = await readFile(join(repoRoot, 'apps/web/.env.local'), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0 && trimmed.slice(0, idx).trim() === 'NEXT_PUBLIC_SUPABASE_URL') {
        const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (val.startsWith('https://')) return val;
      }
    }
  } catch {
    // ignore
  }
  throw new Error('Không tìm thấy https:// Supabase URL trong apps/web/.env.local hoặc biến SUPABASE_CLOUD_URL.');
}

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
]);

async function main() {
  const targetOrigin = new URL(await loadTargetUrl());
  const port = Number(process.env.LOOPBACK_PORT || 54321);

  const server = http.createServer((req, res) => {
    const forwardHeaders = {};
    for (const [k, v] of Object.entries(req.headers)) {
      if (v !== undefined && !HOP_BY_HOP.has(k.toLowerCase())) {
        forwardHeaders[k] = v;
      }
    }
    forwardHeaders['host'] = targetOrigin.host;

    const upstream = https.request(
      {
        protocol: targetOrigin.protocol,
        hostname: targetOrigin.hostname,
        port: targetOrigin.port || 443,
        method: req.method,
        path: req.url,
        headers: forwardHeaders,
      },
      (upRes) => {
        const outHeaders = {};
        for (const [k, v] of Object.entries(upRes.headers)) {
          if (v !== undefined && !HOP_BY_HOP.has(k.toLowerCase())) {
            outHeaders[k] = v;
          }
        }
        res.writeHead(upRes.statusCode || 502, outHeaders);
        upRes.pipe(res);
      }
    );

    upstream.on('error', (err) => {
      if (!res.headersSent) {
        res.writeHead(502, { 'content-type': 'application/json; charset=utf-8' });
      }
      res.end(JSON.stringify({ message: `Loopback proxy upstream error: ${err.message}` }));
    });

    req.pipe(upstream);
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`[✓] Loopback proxy đang chạy tại http://127.0.0.1:${port} -> ${targetOrigin.origin}`);
    console.log(`    (Chỉ lắng nghe trên 127.0.0.1, dùng ~25MB RAM thay cho Docker)`);
  });
}

main().catch((err) => {
  console.error('[!] Không thể khởi động proxy:', err.message);
  process.exit(1);
});
