// Minimal zero-dependency static file server for Walkcode.
// Serves index.html + src/** over HTTP. Cloud Run sets PORT (defaults to 8080).
// M3 will extend this same server with /api/** routes — keep it dependency-free.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = process.env.PORT || 8080;
// Static root = repo root (index.html lives here, app code under src/).
const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

// ES modules require a correct JS MIME or browsers refuse to execute them.
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function sendJson(res, status, obj) {
  const body = Buffer.from(JSON.stringify(obj));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

// Lazily-created Postgres pool (M4+). `pg` is imported on first DB use only, so the
// static server still boots if the module or DATABASE_URL is absent.
let dbPool;
async function getPool() {
  if (dbPool) return dbPool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  const { default: pg } = await import('pg');
  // Prod Postgres presents a self-signed cert and is reachable only over the private,
  // firewalled VPC path — so we encrypt in transit without CA identity verification.
  const useSsl = /[?&]sslmode=(require|no-verify|verify-ca|verify-full|prefer)/.test(connectionString);
  dbPool = new pg.Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    max: 3,
    connectionTimeoutMillis: 5000,
  });
  return dbPool;
}

// API routes live under /api/**. M4/M5 add DB-backed routes here.
async function handleApi(req, res, pathname) {
  if (pathname === '/api/health') {
    return sendJson(res, 200, { status: 'ok' });
  }
  // TEMP (M4): proves the Cloud Run → Postgres private path works. Removed in M5 when the
  // real /api/content routes land.
  if (pathname === '/api/db-ping') {
    try {
      const pool = await getPool();
      const { rows } = await pool.query('SELECT now() AS now');
      return sendJson(res, 200, { ok: true, now: rows[0].now });
    } catch (err) {
      return sendJson(res, 503, { ok: false, error: String((err && err.message) || err) });
    }
  }
  return sendJson(res, 404, { error: 'Not Found' });
}

async function sendFile(res, filePath) {
  const body = await readFile(filePath);
  const type = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': body.length,
    // Static assets are content-addressed by path; short cache is safe, HTML stays fresh.
    'Cache-Control': extname(filePath) === '.html' ? 'no-cache' : 'public, max-age=300',
  });
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
      return;
    }

    // Strip query/hash, decode, and default "/" to index.html.
    let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);

    // API routes never fall through to the static/SPA handler.
    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return handleApi(req, res, pathname);
    }

    if (pathname === '/') pathname = '/index.html';

    // Resolve within ROOT and reject any path traversal.
    const filePath = normalize(join(ROOT, pathname));
    if (filePath !== ROOT && !filePath.startsWith(ROOT + '/')) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }

    try {
      const info = await stat(filePath);
      if (info.isDirectory()) throw new Error('is directory');
      await sendFile(res, filePath);
    } catch {
      // Unknown path → serve the app shell so client-side rendering still boots.
      await sendFile(res, join(ROOT, 'index.html'));
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Walkcode static server listening on :${PORT}`);
});
