// Database layer for Walkcode's content API (M5). Owns the Postgres pool, the schema, the
// auto-seed (from the content bundled with the app), and the read that rebuilds the
// /api/content bundle. `pg` is imported lazily so the static server still boots when the DB
// or DATABASE_URL is absent.
import { assembleBundle, clientBundleFrom, LANGUAGES } from '../src/data/assemble.js';

let poolPromise;

export async function getPool() {
  if (poolPromise) return poolPromise;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  poolPromise = (async () => {
    const { default: pg } = await import('pg');
    // Prod Postgres presents a self-signed cert and is reachable only over the private,
    // firewalled VPC path — so we encrypt in transit without CA identity verification.
    const useSsl = /[?&]sslmode=(require|no-verify|verify-ca|verify-full|prefer)/.test(connectionString);
    return new pg.Pool({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
      max: 3,
      connectionTimeoutMillis: 5000,
    });
  })();
  return poolPromise;
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS content_meta (
  id integer PRIMARY KEY DEFAULT 1,
  version text NOT NULL,
  seeded_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT content_meta_singleton CHECK (id = 1)
);
CREATE TABLE IF NOT EXISTS topics (
  name text PRIMARY KEY,
  position integer NOT NULL
);
CREATE TABLE IF NOT EXISTS problems (
  id text PRIMARY KEY,
  title text NOT NULL,
  topic text NOT NULL,
  difficulty text NOT NULL,
  is_built boolean NOT NULL DEFAULT false,
  is_card boolean NOT NULL DEFAULT true,
  position integer NOT NULL
);
CREATE TABLE IF NOT EXISTS lessons (
  problem_id text NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  language text NOT NULL,
  body jsonb NOT NULL,
  PRIMARY KEY (problem_id, language)
);
CREATE TABLE IF NOT EXISTS drills (
  id text PRIMARY KEY,
  title text NOT NULL,
  topic text,
  difficulty text,
  position integer NOT NULL,
  body jsonb NOT NULL
);
`;

// Unique topics in card order — the order the library renders groups in.
function topicsFrom(rich) {
  const seen = new Map();
  for (const problem of rich.problems) {
    if (problem.isCard && !seen.has(problem.topic)) seen.set(problem.topic, seen.size + 1);
  }
  return [...seen.entries()].map(([name, position]) => ({ name, position }));
}

async function seedFromBundle(client, rich) {
  await client.query('BEGIN');
  try {
    await client.query('TRUNCATE lessons, drills, problems, topics, content_meta RESTART IDENTITY CASCADE');

    for (const { name, position } of topicsFrom(rich)) {
      await client.query('INSERT INTO topics (name, position) VALUES ($1, $2)', [name, position]);
    }

    for (const problem of rich.problems) {
      await client.query(
        'INSERT INTO problems (id, title, topic, difficulty, is_built, is_card, position) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [problem.id, problem.title, problem.topic, problem.difficulty, problem.isBuilt, problem.isCard, problem.position],
      );
    }

    for (const [problemId, byLanguage] of Object.entries(rich.lessons)) {
      for (const language of LANGUAGES) {
        const body = byLanguage[language];
        if (!body) continue;
        await client.query(
          'INSERT INTO lessons (problem_id, language, body) VALUES ($1, $2, $3::jsonb)',
          [problemId, language, JSON.stringify(body)],
        );
      }
    }

    for (let index = 0; index < rich.drills.length; index += 1) {
      const drill = rich.drills[index];
      await client.query(
        'INSERT INTO drills (id, title, topic, difficulty, position, body) VALUES ($1, $2, $3, $4, $5, $6::jsonb)',
        [`drill-${index}`, drill.title, drill.topic || null, drill.difficulty || null, index, JSON.stringify(drill)],
      );
    }

    await client.query('INSERT INTO content_meta (id, version) VALUES (1, $1)', [rich.version]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

// Creates the schema if needed and seeds the DB from the bundled content, but only when the
// DB is empty or the bundled content changed (version mismatch). A manual content edit made
// directly in the DB is preserved across restarts because it does not change the version.
export async function ensureSeeded() {
  const pool = await getPool();
  const client = await pool.connect();
  try {
    await client.query(SCHEMA_SQL);
    const rich = assembleBundle();
    const { rows } = await client.query('SELECT version FROM content_meta WHERE id = 1');
    if (rows.length && rows[0].version === rich.version) {
      return { seeded: false, version: rich.version };
    }
    await seedFromBundle(client, rich);
    return { seeded: true, version: rich.version };
  } finally {
    client.release();
  }
}

// Rebuilds the client-facing content bundle from the DB. Same shape as assembleClientBundle()
// so the frontend cannot tell whether it was served from the DB or the offline fallback.
export async function getContentBundle() {
  const pool = await getPool();
  const [problemRows, lessonRows, drillRows, metaRows] = await Promise.all([
    pool.query('SELECT id, topic, title, difficulty, is_built, position FROM problems WHERE is_card = true ORDER BY position'),
    pool.query('SELECT problem_id, language, body FROM lessons'),
    pool.query('SELECT body FROM drills ORDER BY position'),
    pool.query('SELECT version FROM content_meta WHERE id = 1'),
  ]);

  const lessons = {};
  for (const row of lessonRows.rows) {
    (lessons[row.problem_id] ||= {})[row.language] = row.body;
  }

  // isComplete is derived from the lesson body (JSONB already carries it), so no schema column or
  // migration is needed — it works against any existing seed.
  const cards = problemRows.rows.map((row) => ({
    id: row.id,
    topic: row.topic,
    title: row.title,
    difficulty: row.difficulty,
    isBuilt: row.is_built,
    isComplete: Boolean(lessons[row.id]?.JavaScript?.isComplete),
    position: row.position,
  }));

  const drills = drillRows.rows.map((row) => row.body);

  return { version: metaRows.rows[0]?.version || '', cards, lessons, drills };
}

// Exposed so the offline/CLI paths and tests can reach the same assembled shapes.
export { assembleBundle, clientBundleFrom };
