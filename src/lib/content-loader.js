// Loads the content bundle the app renders from. Tries the DB-backed API first, caches the
// result so a later offline load still boots, and falls back to the content bundled with the
// app when neither the API nor the cache is available. The three sources produce the same
// shape by construction (see assemble.js), so the app looks identical whichever one wins.
const CACHE_KEY = 'walkcode-content';

function readCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function writeCache(bundle) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(bundle));
  } catch {
    // Quota or private-mode failures are non-fatal; the app still runs from memory.
  }
}

function isUsable(bundle) {
  return !!bundle && Array.isArray(bundle.cards) && bundle.cards.length > 0;
}

export async function loadContent() {
  // 1. Live content from the API (DB-backed). New DB content shows up on next load.
  try {
    const response = await fetch('/api/content', { headers: { accept: 'application/json' } });
    if (response.ok) {
      const bundle = await response.json();
      if (isUsable(bundle)) {
        writeCache(bundle);
        return bundle;
      }
    }
  } catch {
    // Network/API unavailable — fall through to cache, then to the bundled copy.
  }

  // 2. Last-known-good content cached from a previous successful load (offline boot).
  const cached = readCache();
  if (isUsable(cached)) return cached;

  // 3. Content shipped with the app. Imported lazily so a healthy API load never pays the
  //    cost of downloading the data modules.
  const { assembleClientBundle } = await import('../data/assemble.js');
  return assembleClientBundle();
}

// Server-advertised capabilities (M9). Best-effort: offline or no server → {} (features off).
export async function loadFeatures() {
  try {
    const response = await fetch('/api/health', { headers: { accept: 'application/json' } });
    if (response.ok) {
      const health = await response.json();
      return health.features || {};
    }
  } catch {
    // No server / offline — the app runs with all optional server features disabled.
  }
  return {};
}

// Owner review API (token-gated). Lists content-complete-but-uncertified problems + decisions.
export async function fetchReview(token) {
  try {
    const response = await fetch('/api/review', { headers: { accept: 'application/json', 'X-Review-Token': token || '' } });
    let data = {};
    try { data = await response.json(); } catch { /* non-JSON */ }
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'You appear to be offline.' } };
  }
}

// Record an approve/reject/pending decision (+ feedback) for a problem.
export async function postReview(token, title, status, feedback) {
  try {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: 'application/json', 'X-Review-Token': token || '' },
      body: JSON.stringify({ title, status, feedback }),
    });
    let data = {};
    try { data = await response.json(); } catch { /* non-JSON */ }
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'You appear to be offline.' } };
  }
}

// Ask the server proxy to judge a free-text algorithm plan (M9). Never sends or holds a key —
// the key lives only on the server. Returns a normalized { ok, status, data } either way.
export async function fetchAlgorithmFeedback(payload) {
  try {
    const response = await fetch('/api/algorithm-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    let data = {};
    try { data = await response.json(); } catch { /* non-JSON error body */ }
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'You appear to be offline — use “Check my algorithm” above.' } };
  }
}
