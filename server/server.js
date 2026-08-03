// Walkcode server. Serves index.html + src/** over HTTP and the /api/** routes. Cloud Run
// sets PORT (defaults to 8080). The static server is dependency-free; the DB-backed content
// API lives in db.js and pulls in `pg` lazily, so the site still boots without a database.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureSeeded, getContentBundle } from './db.js';
import { algorithmCoachTurn, llmEnabled } from './llm.js';

const PORT = process.env.PORT || 8080;
// Local dev serves source files with no caching so a plain refresh always loads the latest code
// (the src/ files are bind-mounted and edited live). Prod keeps the short cache.
const DEV = process.env.WALKCODE_DEV === '1';
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

function sendJson(res, status, obj, cacheControl = 'no-store') {
  const body = Buffer.from(JSON.stringify(obj));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': cacheControl,
  });
  res.end(body);
}

// Read a small JSON request body, capped so the route can't be flooded with a huge payload.
function readJsonBody(req, limitBytes = 8000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        reject(Object.assign(new Error('payload too large'), { code: 'TOO_LARGE' }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(Object.assign(new Error('invalid JSON'), { code: 'BAD_JSON' })); }
    });
    req.on('error', reject);
  });
}

// Minimal in-memory sliding-window rate limit, keyed by client IP. Bounds the LLM route so it
// can't be turned into a free LLM faucet. Resets on restart — fine for a single small instance.
const rateHits = new Map();
function rateLimited(ip, max = 8, windowMs = 60000) {
  const now = Date.now();
  const recent = (rateHits.get(ip) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  rateHits.set(ip, recent);
  return recent.length > max;
}

function clientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

function cleanStrings(value, maxItems, maxLen) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => String(item).slice(0, maxLen)).filter(Boolean);
}

// On accept, feedback should be ONLY a short acknowledgement — never a preview of the next
// question. Small models routinely tack the question on ("Good start, now think about the loop"
// or "...? "), often without a question mark, so we cut the text at the first prompt lead-in
// (a cue word/phrase) and drop anything that remains a question.
const PROMPT_CUE = /\b(now|next|then|consider|think about|let'?s|try to|move on|describe|tell me|can you|could you|would you|do you|should you|what|how|why|which|where|who|when)\b/i;
function acknowledgementOnly(text) {
  let t = String(text || '').replace(/\s+/g, ' ').trim();
  const cue = t.match(PROMPT_CUE);
  if (cue) t = t.slice(0, cue.index);
  t = t.replace(/[\s,;:]+$/, '').trim();
  return (!t || t.endsWith('?')) ? '' : t;
}

// Near-duplicate detection so re-worded repeats ("reduce the count" vs "reduce the count if
// possible", "move the left pointer inwards" vs "move left index inwards") don't pile up — small
// models loop out variations of a step they already have. We drop filler words and fold common
// synonyms to a canonical token so wording differences don't hide a duplicate.
const STEP_STOPWORDS = new Set(['the', 'and', 'for', 'each', 'both', 'then', 'that', 'this', 'with', 'into', 'from', 'when', 'while', 'our', 'your', 'its', 'are', 'was', 'has', 'have', 'not', 'but', 'one', 'two']);
const STEP_SYNONYMS = new Map([
  ['pointer', 'index'], ['pointers', 'index'], ['indices', 'index'], ['indexes', 'index'],
  ['dictionary', 'map'], ['dict', 'map'], ['hashmap', 'map'], ['hashtable', 'map'], ['hash', 'map'], ['table', 'map'],
  ['character', 'char'], ['characters', 'char'], ['chars', 'char'], ['letter', 'char'], ['letters', 'char'],
  ['decrement', 'reduce'], ['decrease', 'reduce'], ['subtract', 'reduce'],
  ['increment', 'add'], ['increase', 'add'],
  ['inwards', 'inward'], ['inner', 'inward'], ['moving', 'move'], ['moves', 'move'],
  ['returns', 'return'], ['skipping', 'skip'], ['skips', 'skip'],
]);
function stepWords(s) {
  return new Set(String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ')
    .filter((w) => w.length > 2 && !STEP_STOPWORDS.has(w))
    .map((w) => STEP_SYNONYMS.get(w) || w));
}
function isNearDuplicate(candidate, existingList) {
  const c = stepWords(candidate);
  if (!c.size) return false;
  return existingList.some((e) => {
    const x = stepWords(e);
    if (!x.size) return false;
    let inter = 0;
    for (const w of c) if (x.has(w)) inter += 1;
    const union = new Set([...c, ...x]).size;
    const subset = [...c].every((w) => x.has(w)) || [...x].every((w) => c.has(w));
    // Strict > 0.6 so a single distinguishing word (e.g. left vs right) is NOT treated as a dup.
    return subset || inter / union > 0.6;
  });
}

// Once the learner has assembled roughly this many steps, the algorithm is complete enough that
// the coach wraps up — a backstop against an unbounded back-and-forth. Set with headroom because
// decomposing decisions (condition, then each branch) produces more, smaller steps.
const MAX_COACH_STEPS = 16;

// POST /api/algorithm-feedback — one turn of the Socratic "build the algorithm" coach. Degrades
// safely: no key → 503 {disabled}; the client then falls back to the deterministic step builder.
async function handleAlgorithmFeedback(req, res) {
  if (!llmEnabled()) return sendJson(res, 503, { disabled: true });
  // Multi-turn, but human-paced — a generous per-minute cap still bounds abuse.
  if (rateLimited(clientIp(req), 20)) return sendJson(res, 429, { error: 'Too many requests — give it a minute and try again.' });

  let payload;
  try { payload = await readJsonBody(req); } catch { return sendJson(res, 400, { error: 'Invalid request.' }); }

  const learnerInput = String(payload.learnerInput || '').trim();
  if (learnerInput.length < 2) return sendJson(res, 400, { error: 'Type your idea first.' });
  if (learnerInput.length > 600) return sendJson(res, 400, { error: 'Please keep each step under 600 characters.' });

  const referenceAlgorithm = cleanStrings(payload.algorithm, 12, 200);
  const acceptedSteps = cleanStrings(payload.acceptedSteps, MAX_COACH_STEPS + 2, 200);
  try {
    const result = await algorithmCoachTurn({
      title: String(payload.title || '').slice(0, 200),
      brief: String(payload.brief || '').slice(0, 600),
      concepts: cleanStrings(payload.concepts, 8, 160),
      algorithm: referenceAlgorithm,
      code: String(payload.code || '').slice(0, 1500),
      acceptedSteps,
      currentPrompt: String(payload.currentPrompt || '').slice(0, 240),
      learnerInput,
    });
    // Drop exact OR near-duplicate accepted steps — a symptom of the model looping out re-worded
    // repeats of a step the learner already has.
    const wasDuplicate = result.decision === 'accept' && result.acceptedStep && isNearDuplicate(result.acceptedStep, acceptedSteps);
    if (wasDuplicate) result.acceptedStep = '';
    // On accept, keep feedback as pure acknowledgement (no question — that belongs in nextPrompt).
    if (result.decision === 'accept') {
      result.feedback = acknowledgementOnly(result.feedback) || 'Nice — added to your algorithm.';
    }
    // Completion backstops so it can't loop forever. Finish when the solution is at least as long
    // as the canonical one (hard cap), OR when the learner is already past that length and this
    // turn added nothing new (a revise/duplicate) — a sign the model is churning, not progressing.
    const addedNew = result.decision === 'accept' && Boolean(result.acceptedStep);
    const total = acceptedSteps.length + (addedNew ? 1 : 0);
    const refLen = referenceAlgorithm.length;
    const hardCap = refLen > 0 ? refLen + 1 : MAX_COACH_STEPS;
    // At/over the canonical length AND this turn added nothing new → the model is churning, wrap up.
    const stalledAtLength = refLen > 0 && !addedNew && acceptedSteps.length >= refLen;
    if (!result.done && (total >= hardCap || stalledAtLength)) {
      result.done = true;
      result.summary = result.summary || 'You’ve assembled the core steps — check them against the full solution in the Review step.';
      result.nextPrompt = '';
    }
    return sendJson(res, 200, result);
  } catch (err) {
    console.error('/api/algorithm-feedback failed:', err.message);
    if (err.code === 'DISABLED') return sendJson(res, 503, { disabled: true });
    return sendJson(res, 502, { error: 'The coach is temporarily unavailable — try again shortly.' });
  }
}

// API routes live under /api/**.
async function handleApi(req, res, pathname) {
  if (pathname === '/api/health') {
    // The features map lets the frontend hide UI it can't use (e.g. the AI feedback box when no
    // key is configured), so the feature degrades cleanly instead of showing a dead control.
    return sendJson(res, 200, { status: 'ok', features: { algorithmFeedback: llmEnabled() } });
  }
  if (pathname === '/api/algorithm-feedback') {
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method Not Allowed' });
    return handleAlgorithmFeedback(req, res);
  }
  // The DB-backed content bundle the frontend renders from. Short cache so a DB content
  // change is visible on the next load without hammering the VM on every request. On any DB
  // failure we return 503 and the frontend falls back to its cached/bundled copy.
  if (pathname === '/api/content') {
    try {
      const bundle = await getContentBundle();
      return sendJson(res, 200, bundle, 'public, max-age=60');
    } catch (err) {
      console.error('/api/content failed', err);
      return sendJson(res, 503, { error: 'content unavailable' });
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
    // HTML always revalidates; other assets get a short cache in prod, none in dev (live edits).
    'Cache-Control': DEV ? 'no-store' : (extname(filePath) === '.html' ? 'no-cache' : 'public, max-age=300'),
  });
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    // Strip query/hash, decode, and default "/" to index.html.
    let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);

    // API routes never fall through to the static/SPA handler, and (unlike the static server)
    // may accept POST — the method is enforced per route inside handleApi.
    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return handleApi(req, res, pathname);
    }

    // The static/SPA handler is read-only.
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
      return;
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
  console.log(`Walkcode server listening on :${PORT}`);
  // Best-effort: create the schema and seed content from the bundled copy when the DB is
  // empty or the bundled content changed. Never blocks or crashes serving — if the DB is
  // unreachable, /api/content returns 503 and the frontend uses its offline fallback.
  if (process.env.DATABASE_URL) {
    ensureSeeded()
      .then((result) => console.log(`Content ${result.seeded ? 'seeded' : 'already current'} (${result.version})`))
      .catch((err) => console.error('Content auto-seed skipped:', (err && err.message) || err));
  } else {
    console.log('DATABASE_URL not set — serving static app only (no /api/content).');
  }
});
