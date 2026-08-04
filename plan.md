# Plan: Host Walkcode on Google Cloud, with room to grow a backend + database

## Goals

1. Move Walkcode onto Google Cloud, staying at **$0/month** (always-free tier).
2. Keep HTTPS on the custom domain `walkcode.maripi.net`.
3. Leave a clean path to a **backend + relational database** later — and make sure the
   whole thing can be **run locally** and, if needed, moved off Google Cloud.

## Decisions locked in

- Database model: **relational / SQL (PostgreSQL)**.
- Database hosting: **self-hosted Postgres on the always-free Compute Engine e2-micro VM**
  (stays 100% on Google Cloud and genuinely $0).
- Must be able to **run locally**; portability matters more than staying 100% Google.
- Hosting/compute: **Cloud Run** container serving the site (and later the API).

These decisions are the spine of the plan. The rest follows from them.

## The one fact that drives everything

**GCP has no always-free *managed* relational database.** Cloud SQL (managed
Postgres/MySQL) starts at ~$8–10/mo. To get relational **and** $0, we self-host Postgres
on the one always-free Compute Engine VM — the **e2-micro**. This trades zero-ops for
zero-cost: we run Postgres ourselves (backups, patching, security), but Postgres is the
most portable option available — standard SQL, trivial local install, `pg_dump`/restore
moves it to any host.

So the stack is two pieces, both on GCP, both portable:

- **Compute/hosting** → a **container on Cloud Run**. Runs the same on a laptop, on Cloud
  Run, or any other host.
- **Database** → **PostgreSQL**, self-hosted on the always-free **e2-micro** VM in prod;
  a local Postgres (or `docker compose`) for dev — real parity, no cloud account needed.

## Target architecture (where we're heading)

```
                 walkcode.maripi.net  (HTTPS, custom domain)
                          │
                   ┌──────┴───────┐
                   │  Cloud Run   │   one portable container:
                   │  (container) │   - serves static site (index.html + src/**)
                   │              │   - serves /api/** (backend, added later)
                   └──────┬───────┘
                          │  private VPC connection (same region), port 5432
                   ┌──────┴────────────┐
                   │  Compute Engine   │   always-free e2-micro VM
                   │  e2-micro + PG    │   PostgreSQL self-hosted
                   │  (PostgreSQL)     │   local dev: local Postgres / docker compose
                   └───────────────────┘
```

- **Runs locally as one command** (`docker compose up` with app + postgres, or
  `node server` + local Postgres): full parity with production, no cloud account for dev.
- **Portable**: the container runs on Cloud Run, Fly.io, Render, a VM, anywhere; the DB is
  standard Postgres, movable by `pg_dump`/restore.
- **$0**: Cloud Run always-free (2M req/mo) + a single always-free e2-micro VM both cover
  this app with headroom.
- Backend language: **Node** (the codebase is already JS), so static and API live in one
  small server and one toolchain.

### Connecting Cloud Run → the VM's Postgres (the one wrinkle)

- Put the **VM and Cloud Run in the same region and VPC**, and reach Postgres over its
  **internal IP** — keeps traffic private and off the public internet, and avoids egress
  charges. Use **Cloud Run Direct VPC egress** (not the older Serverless VPC Access
  *connector*, which provisions billable instances and would break $0).
- **Firewall:** allow `5432` only from the Cloud Run/VPC source — never expose Postgres to
  the public internet. Require TLS on the Postgres connection.
- The e2-micro must be in an **always-free region** (`us-west1`/`us-central1`/`us-east1`),
  be the **only** e2-micro in the project, and use ≤30 GB standard persistent disk to stay
  in the free tier. Cloud Run goes in the same region.

## Phasing (don't boil the ocean)

We do **not** need the backend to move hosting today. Two sane sequencings:

### Phase 0 — Move the static site now (this migration)

**Decided: serve straight from Cloud Run, no CDN in front (cloud-only to start).**

A tiny container (small static server, e.g. Node) serves `index.html` + `src/**` directly
from Cloud Run. The deploy target *never changes* — when the backend arrives it's the same
service, just with `/api/**` added. Best long-term consistency and local parity, and no
second platform in the request path.

*(The alternative — Firebase Hosting/Cloudflare CDN in front — is deferred to Backlog. It
would add free CDN + egress protection, but it's a second layer we're choosing not to
introduce yet.)*

### Phase 1 — Move the content into the database (the first real backend feature)

**First feature: the content itself.** Today every problem, lesson, code example, and
drill lives in `src/data/**` as JS modules the browser imports at load, assembled by
`src/data/model.js`. The goal is to move that content into Postgres and serve it over
`/api`, so **new problems/drills can be added by writing to the DB without touching or
redeploying the frontend**. ("The data layer is the product" — so the data layer is what
earns a database first.) Accounts + progress sync is deferred to the Backlog.

1. **Stand up the VM** (M4): create the e2-micro (always-free region), install PostgreSQL,
   create the app database + a least-privilege role, enable TLS, lock down the firewall.
2. Add a small Node server layer to the existing container: keep serving static, add
   DB-backed `/api/content` routes. Connect via a Postgres client (`pg`); connection string
   in a Cloud Run **secret** (`DATABASE_URL`). Local dev points at local Postgres /
   `docker compose`.
3. **Model the content relationally** (M5): a schema that captures problems, their lessons
   (brief/explanation/code per language, concept choices, complexity, input-output), and
   their exercises/drills (answer, correct feedback, per-wrong-answer feedback, language
   variants), plus the classification the UI needs (topic, difficulty, `is_built`,
   position).
4. **Seed from the existing modules:** a one-time importer reads today's `src/data/**`
   (via `model.js`'s assembled `cards` / `lessonFor` / `drillItems`) and inserts it, so the
   DB starts as an exact mirror of what ships now — no content rewrite, no visible change.
5. **Cut the frontend over to `/api`:** replace the static `src/data` imports with `fetch`
   calls to the content API, keeping a bundled/`localStorage`-cached copy as an offline
   fallback so the app still boots with no network. Adding content afterward is a DB write
   the frontend picks up on next load.

The **in-browser code editor + execution** (M7) is a separate, frontend-only feature that
does not depend on this migration — it's sequenced after because content-in-DB is the
higher-value backend milestone.

## Milestones

Each milestone is independently shippable and verifiable. **You** = things only you can do
(accounts, billing, DNS, interactive auth, product calls). **Me** = code/config I write and
commands I prepare or run.

**Progress overview** (every milestone below is done unless noted):

- [x] **M0** — Foundations: GCP project, billing, tooling, APIs enabled.
- [x] **M1** — Static site live on Cloud Run (`*.run.app`).
- [x] **M2** — Custom domain + HTTPS: `https://walkcode.maripi.net` from Cloud Run, valid Google cert.
- [x] **M3** — Backend skeleton + local dev: `/api/health`; `docker compose up` runs app + Postgres (port 8088).
- [x] **M4** — Postgres on the always-free e2-micro VM; private Cloud Run→Postgres path; nothing on the public internet.
- [x] **M5** — Content in Postgres, served over `/api/content`; DB, API, and offline fallback share one assembled bundle so they can't drift.
- [x] **M6** — Learning-first UI restructure (Understand→Algorithm→Code→Complexity→Review; single stepper; escaped content). **Deployed.**
- [x] **M9** — LLM algorithm coach (Groq Llama-70B behind `/api/algorithm-feedback`; degrades to the drag-drop builder). **Deployed.**
- [x] **M8** — Hardening: nightly `pg_dump`→GCS backups (30-day retention) + $5 budget + hard billing kill-switch. **Live on GCP.**
- [x] **M10** — Typed code drills (fill-blank + predict + debug + edge-case, 105 drills) + drill progress + the home chooser, plus the post-M10 UX/review polish. **Built & verified locally; NOT yet deployed.**
- [ ] **M7** — In-browser code editor/runner — **backlogged** (doesn't fit the scaffolded, mobile-first model; see Backlog).

**Current state (2026-08):** everything through **M6/M9 is live** on `walkcode.maripi.net`, and **M8's infra is live** on GCP. Everything **since** — Understand-step depth (examples + fuller descriptions), the concept-check spoiler fix, the whole **typed-drill system** + progress/chooser, the **home-card redesign** (in-place expand + animation, progress tallies), and the **review-flow** work — is committed to `main` locally and verified, but **not yet deployed** (prod still serves the pre-M10 revision). Immediate next steps: a content **review pass** (the `/review` flow now covers all complete problems), then **deploy**.

### M0 — Foundations (accounts & tooling)
- [x] **Status: Done** — authed to `walkcode-504322`; APIs `run`, `artifactregistry`, `cloudbuild`, `compute` enabled; Docker installed.
- [x] **Goal:** an empty but working GCP project + local tooling.
- [x] **You:** create/confirm a Google account; create a GCP **project** (note the project ID);
  attach a **billing account**; run `gcloud auth login`.
- [x] **Me:** exact `gcloud` setup commands; enable APIs (Cloud Run, Artifact Registry, Compute
  Engine); confirm `gcloud` + Docker are installed.
- [x] **Test plan (you):** run `gcloud config list` and confirm **account = your email** and
  **project = walkcode-504322**; in the Cloud Console → Billing, confirm a **billing account
  is linked** to this project; eyeball the enabled-APIs list I show you and confirm `run`,
  `artifactregistry`, and `compute` are present.
- [x] **Done when:** `gcloud` is authed to the project and the APIs are enabled.

### M1 — Static site live on Cloud Run
- [x] **Status: Deployed & serving** — live at `https://walkcode-n2nusmut7q-uc.a.run.app` with `--min-instances=0 --max-instances=2`; static + ES-module MIME + SPA fallback verified; smoke-tested and signed off.
- [x] **Goal:** today's site served from Cloud Run at its `*.run.app` URL.
- [x] **Me:** tiny `Dockerfile` + minimal static server; build → Artifact Registry → deploy with
  `--min-instances=0 --max-instances=2`.
- [x] **You:** approve the deploy (nothing else).
- [ ] **Test plan (you):** open the `*.run.app` URL on **desktop and phone** and confirm the
  padlock/HTTPS. Walk the full flow: home loads → switch language **JS ↔ Python** → open
  library → browse a category → start a **random walkthrough** → complete all **five lesson
  steps** → do a **drill** and check the answer → **refresh the page** and confirm your
  progress persisted (localStorage). Open the browser console and confirm **no errors**.
- [ ] **Done when:** the `*.run.app` URL passes smoke test (home, library browse, random
  walkthrough, a drill, language switch, all five lesson steps, localStorage progress).

### M2 — Custom domain + HTTPS cutover
- [x] **Status: Live** — `https://walkcode.maripi.net` serves from Cloud Run (`server: Google Frontend`) with a valid Google Trust Services cert (`CN=walkcode.maripi.net`, valid Aug 2 → Oct 31 2026). No TXT needed (already `DomainRoutable`); `walkcode` CNAME cut over to `ghs.googlehosted.com`, **DNS-only** (proxy off) via the Cloudflare API; cert propagated ~14 min after the flip. **Verified** on the live domain (valid cert, `server: Google Frontend`, not cached GitHub Pages). Rollback if ever needed: repoint the `walkcode` CNAME back to `maripirs.github.io`.
- [x] **Goal:** `walkcode.maripi.net` served via Cloud Run over HTTPS.
- [x] **You:** add the domain-verify **TXT record** at your `maripi.net` DNS provider; then
  **repoint the `walkcode` record** to the Cloud Run target and remove the old GitHub Pages
  CNAME. *(TXT turned out unnecessary; CNAME repointed for you via the Cloudflare API. Old GitHub Pages CNAME still to retire once you're satisfied.)*
- [x] **Me:** create the Cloud Run domain mapping; give you the exact DNS records; verify HTTPS
  after propagation.
- [x] **Test plan (you):** after DNS propagates, open **`https://walkcode.maripi.net`** in a
  **fresh/incognito browser** and on **mobile data** (off your home network) to confirm
  propagation; check the cert is **valid** (padlock, issued for the domain) with **no
  mixed-content warnings**; confirm it's the new Cloud Run site (not cached GitHub Pages) via
  a hard refresh; re-run the M1 smoke flow once on the real domain.
- [x] **Done when:** `https://walkcode.maripi.net` serves from Cloud Run with a valid cert;
  GitHub Pages retired (no longer serves the domain — CNAME now points to Cloud Run).

### M3 — Backend skeleton + local dev
- [x] **Status: Live in prod** — `/api/health` added to the dependency-free server (`/api/**` no longer falls through to the SPA); `docker-compose.yml` (app + Postgres) added for local parity; redeployed (revision `walkcode-00002`); `/api/health` returns `{"status":"ok"}` on both the `*.run.app` URL and `https://walkcode.maripi.net`; `docker compose up` local dev confirmed.
- [x] **Goal:** the container also runs a Node server; one-command local dev.
- [x] **Me:** Node server (serve static + `/api/health`); `docker-compose.yml` (app + postgres)
  for local parity; redeploy.
- [x] **You:** nothing to set up.
- [x] **Test plan (you):** run **`docker compose up`** locally, open `http://localhost:8088`,
  confirm the app loads and **`/api/health`** returns OK; stop it and confirm it shuts down
  cleanly. In prod, open **`https://walkcode.maripi.net/api/health`** and confirm the healthy
  response. Confirm the public site still looks unchanged (backend added without regressions).
- [x] **Done when:** `docker compose up` runs the full app + DB locally and `/api/health`
  responds in prod.

### M4 — Postgres on the e2-micro VM
- [x] **Status: Done & verified.** VM **`walkcode-pg`** (e2-micro, `us-central1-a`, 30 GB
  pd-standard, internal IP **`10.128.0.2`**, **no external IP** — steady-state $0). PostgreSQL
  15: `listen_addresses = localhost,10.128.0.2` (never external), `ssl = on`, database
  **`walkcode`** owned by least-privilege role **`walkcode_app`** (LOGIN, not superuser);
  `pg_hba.conf` allows only `hostssl walkcode walkcode_app 10.128.0.0/20 scram-sha-256`.
  Firewall **`allow-pg-from-vpc`**: `tcp:5432` from `10.128.0.0/20` → tag `pg` only (no
  `0.0.0.0/0`). Cloud Run redeployed (**`walkcode-00003-frk`**) with **Direct VPC egress**
  (`network-interfaces` default/default, `vpc-access-egress: private-ranges-only`) reading
  **`DATABASE_URL`** from Secret Manager (`?sslmode=no-verify`, self-signed cert). Temporary
  **`/api/db-ping`** added (remove in M5). Prereqs done: gcloud updated **421 → 578** (Direct
  VPC egress flags), Secret Manager API enabled. **Verified:** `/api/db-ping` → `{"ok":true}`
  on `walkcode.maripi.net` and `*.run.app`; VM has no external IP and its internal IP times
  out from a laptop; `/api/health` + site unchanged. *(You can re-run the security/connectivity
  checks from your own devices if you like — no external IP means nothing to reach on `:5432`.)*
- [x] **Goal:** a secured, always-free Postgres reachable privately from Cloud Run.
- [x] **You:** approve VM creation; any interactive console confirmations.
- [x] **Me:** create the **e2-micro** (always-free region, ≤30 GB disk); install + secure
  PostgreSQL (internal-IP only, TLS, least-privilege role); **Direct VPC egress** + firewall
  (`5432` from the VPC only); store `DATABASE_URL` as a Cloud Run **secret**; add a temporary
  `/api/db-ping` endpoint that runs a trivial query.
- [x] **Test plan (you):** **security check** — from your laptop, try to reach Postgres on the
  VM's **external IP:5432** (e.g. `nc -vz <ip> 5432` or `psql`), and confirm it **fails/times
  out** (not publicly reachable). **Connectivity check** — open **`/api/db-ping`** and confirm
  it returns success (Cloud Run → Postgres over the private path works). Then confirm the
  public site is still healthy.
- [x] **Done when:** Cloud Run reaches Postgres over internal IP; nothing on the public internet.

> **M4 ops notes (for M6+ / M8):** the `walkcode_app` password lives only in Secret Manager
> (`DATABASE_URL`), not in the repo. The VM has **no external IP**, so `apt`/patching needs a
> temporary IP re-added (`gcloud compute instances add-access-config walkcode-pg
> --zone=us-central1-a`) then removed again. Rebuilding the VM: re-run the same startup-script
> flow, restore from a `pg_dump` (M8). `/api/db-ping` is throwaway — delete when M5's
> `/api/content` routes land.

### M5 — Content to the database
- [x] **Status: code-complete & locally verified** (2026-08). Content authored in `src/data/**`
  is assembled by `src/data/assemble.js` into one bundle that is used three ways — seeded to
  Postgres, rebuilt from the DB for `/api/content`, and shipped as the browser's offline
  fallback — so the three can't drift (verified byte-for-byte equal). `server/db.js` holds the
  schema (`content_meta`/`topics`/`problems`/`lessons`/`drills`, JSONB bodies) and
  **auto-seeds on boot** only when the DB is empty or the content hash changed (a manual DB
  edit survives restarts — verified). `server/server.js` serves `/api/content` (60 s cache,
  503→fallback) and dropped the throwaway `/api/db-ping`. Frontend cut over: `app.js` awaits
  `loadContent()` (`src/lib/content-loader.js`: fetch → localStorage cache → bundled fallback),
  `model.js` is now a thin selector over the loaded bundle. **Verified locally:** `docker
  compose up` seeds + serves; a headless-Chrome render boots the home screen from `/api`;
  library/lesson/drill render in both languages; a row inserted straight into Postgres appears
  with no redeploy; offline `loadContent()` returns a usable 150-card bundle. Docs updated
  (`CLAUDE.md`, `CONTRIBUTING.md`). Smoke-tested on the deployed revision and signed off.
- [x] **Goal:** problems, code examples, and exercises are served from Postgres via `/api`,
  so new content is added by writing to the DB — no frontend edit or redeploy. The site
  looks and behaves exactly as it does today after the cutover.
- [x] **You:** nothing to set up. Product call **settled: auto-seed on deploy + direct DB
  writes** (no admin endpoint); the server re-mirrors the DB from the bundled content whenever
  its hash changes, and direct DB edits persist otherwise.
- [x] **Me:**
  1. **Schema** — `problems` (title, topic, difficulty, `is_built`, `is_card`, position),
     `lessons` (per problem × language, assembled body as JSONB), `drills` (per drill item,
     body as JSONB), plus `topics` and a `content_meta` version row. Relational classification +
     JSONB bodies; mirrors the `src/data/**` fragments the assembler produces.
  2. **Content API** — read-only `GET /api/content` returning the bundle (`cards` / per-language
     `lessons` / `drills`) so the client keeps the same `cards` / `lessonFor` / `drillItems`
     interface and views barely changed.
  3. **Seed importer** — `assembleBundle()` is the single source; `ensureSeeded()` writes it to
     the DB on boot, making the DB an exact mirror of the shipped content.
  4. **Frontend cutover** — `src/data` imports replaced by `fetch('/api/content')` with a
     `localStorage` cache and the bundled assembly as offline fallback. `CLAUDE.md`/
     `CONTRIBUTING.md` updated for the new content workflow.
- [x] **Test plan (you):** ✅ confirmed the updates on `walkcode.maripi.net` (deployed revision
  serving DB-backed content). Remaining optional spot-checks whenever you like: the offline-boot
  test and a direct DB add showing up on refresh (both verified locally on my side).
- [x] **Done when:** the frontend renders all content from `/api` (DB-backed), a DB-only
  content addition shows up after refresh with no code change, and offline still boots —
  **all satisfied; deployed and confirmed live.**

### M6 — UI/UX restructure (learning-first, smooth & intuitive)
- [x] **Status: DONE & DEPLOYED (2026-08)** — learning-first restructure live on `walkcode.maripi.net`.
  Guided **stepper** (Understand→Algorithm→Code→Complexity→Review, friendly headers, tappable progress
  rail, consistent Back/Next, "another problem" in a footer); the **Understand** step leads with the full
  statement → I/O/example → problem-specific `intuition` → concept check (topic hidden there so it can't
  spoil the pattern); library **de-categorized** into one easier→harder Easy/Medium/Hard list (WIP hidden);
  human copy + progress labels (Not started / In progress / Done); algorithm distractors moved to authored
  data; all user-facing + LLM content **escaped** + a11y focus ring + committed `validate-content.mjs`.
  **Post-review polish:** browser back/forward + **refresh persistence** (`navigation.js`), a touch-friendly
  **pointer-drag** reorder with sliding steps, and the code-fix blank shown as a **placeholder comment**.
  Verified (`node --check` clean, validator 120 exercises/60 drills, headless render suites). Signed off.
- [x] **Goal:** make the whole experience **teach well and get out of the way**. Prioritize
  comprehension and ease of use so a learner can land, understand a problem, and make progress
  without friction. The content is now strong (M5) and the drills are solid — this milestone is
  about the *experience* around them. Builds on the findings in **"UI/UX & quality review"** below.
- [x] **You:** product calls on tone/wording and on the navigation model (a couple of small
  A/B-style choices I'll bring you with mockups); otherwise nothing to set up. *(Settled — see Status.)*
- [x] **Me — phased, each independently shippable (ordered by learning impact):**
  1. **Comprehension first — the Recognize step.** Always lead with a full, plain-language
     problem statement, *then* Input/Output/Example, *then* "what to notice"; replace the single
     generic hint with problem-specific intuition. (Fixes the flagged step-1 gap: Built lessons
     currently omit the full statement.)
  2. **One intuitive navigation model.** Collapse the three competing axes (stage tabs + bottom
     step buttons + top problem nav) into a single clear model — obvious "move through the steps"
     vs "go to another problem," consistent across all five steps (fix the step-3 inconsistency),
     with a visible progress indicator. Clarify "Seen" vs "Solved."
  3. **Human copy & headers.** Plain-language stage names; replace the "{n} of 150" title with the
     problem name; drop the internal "✓ BUILT" badge from the learner UI; humanize hints/labels.
  4. **Make step 2 (Algorithm) actually teach.** Move the hardcoded, identical distractors out of
     the view into per-problem authored content; a clearer, lower-friction interaction.
  5. **Ease-of-use polish.** Smooth first-run, sensible defaults, mobile tap-targets and code
     readability, and a consistency pass so drills and lessons feel like one system.
  6. **Robustness under the new model.** Escape DB-sourced content (the M5 authoring path made
     this a real gap), basic a11y/focus states, and commit the content validator as a real check.
- [ ] **Test plan (you):** open a Built problem cold and confirm you understand it from the
  Recognize step alone (full statement + example), move through all five steps without confusion
  about "where am I / how do I go next," and confirm the copy reads naturally on desktop and phone.
  Console shows **no errors**.
- [ ] **Done when:** a first-time learner can go home → understand a problem → work its five steps
  → do a drill **without instruction**, the Recognize step carries a complete problem explanation,
  navigation is unambiguous, and the learner-facing copy is clean. Phases 1–2 are the must-haves;
  3–6 are the polish that makes it feel finished.

### M7 — In-browser code editor + execution — ⬇ MOVED TO BACKLOG (2026-08)
- [ ] **Status: deferred to Backlog (2026-08).** A blank-canvas editor fights the app's identity —
  it's deliberately *scaffolded recognition* (recognize → order → select whole lines), not
  from-scratch authoring, and it's mobile-first (typing full solutions on a phone is poor). If
  execution is ever added, the fit is a **runner/checker on already-visible code** (run the
  assembled solution against the authored examples, pass/fail), not a text editor — and even that
  needs per-problem input drivers (many stored solutions aren't self-contained: `ListNode`/`TreeNode`,
  closure-scoped helpers) plus order-insensitive comparison for some outputs. Superseded as the near-term
  priority by **M10 (typed code drills)**, which extends the existing recognition model instead of
  breaking from it. Full detail below is kept for whenever this is revisited.
- [ ] **Goal:** learners can **write and run code in the browser** against a problem and see
  output/results, not just read and pick answers. **Client-side execution** (chosen): no
  server compute, scales to zero, no sandbox-escape risk on our infra.
- [ ] **You:** a product call on scope — which screens get the runner (drills only, full
  lessons, or a scratch “try it” pane) and whether runs check against expected output.
- [ ] **Me:**
  - **Editor** — a lightweight in-page code editor (textarea-plus or a small dependency-free
    editor; **no build step**), wired to the existing lesson/drill code context.
  - **JS execution (now)** — run user JS in a **sandboxed Web Worker** (no DOM/network),
    with a timeout and captured `console`/return value; render stdout + pass/fail vs.
    expected. This ships first.
  - **Python execution (later, same milestone or a fast-follow)** — **Pyodide** (WASM),
    lazy-loaded only when a learner runs Python, so JS users never pay the download. Same
    worker-sandbox + timeout + output-capture contract as JS.
  - Keep it **mobile-first and lightweight**; the runtime is loaded at run time, not bundled
    into the app shell.
- [ ] **Test plan (you):** open a problem, write a correct JS solution, **Run**, and see it
  pass; write a wrong/broken one and see a clear failure/error (no page crash). Trigger an
  **infinite loop** and confirm the timeout kills it and the UI stays responsive. Switch to
  **Python**, run a solution, and confirm Pyodide loads on demand and executes. Confirm the
  app shell still loads fast for users who never hit Run (no eager runtime download). Console
  shows **no errors**.
- [ ] **Done when:** a learner can run JS (and Python via Pyodide) in-browser against a
  problem, get correct pass/fail + output, runaway code is bounded by a timeout, and users
  who never run code pay no runtime-download cost.

### M8 — Hardening (pulled from Backlog) — ✅ DONE & VERIFIED (2026-08)
- [x] **Status: DONE & VERIFIED (2026-08).** Both tracks live. **Backups:** GCS bucket
  `gs://walkcode-504322-pg-backups` (us-central1, uniform access, public-access-prevention,
  **30-day lifecycle-delete** retention → inside the 5 GB free tier); nightly root cron on the VM
  (`12 8 * * *` UTC) runs `/opt/walkcode/pg-backup.sh` (`server/scripts/pg-backup.sh` in-repo):
  `pg_dump -Fc walkcode` → `gcloud storage cp` using the VM SA. **Two infra fixes were required:**
  the VM SA's OAuth scope was `devstorage.read_only` (widened to `read_write` via a brief
  stop/`set-service-account`/start — internal IP `10.128.0.2` and `DATABASE_URL` unchanged) + bucket-scoped
  `roles/storage.objectAdmin`; and **Private Google Access was OFF** on the `default`/us-central1 subnet
  (a no-external-IP VM can't reach `storage.googleapis.com` without it) — now **enabled**. **Verified:**
  dumps land in the bucket, and a **test-restore into a scratch DB matched the live row counts exactly**
  (problems 151, lessons 302, drills 60, topics 18). **Budget + hard kill-switch (your call):** a **$5/mo**
  Cloud Billing budget (thresholds 50/90/100%, emails billing admins) publishes to Pub/Sub topic
  `billing-killswitch`; a **Gen2 Cloud Function** `billing-killswitch` (source `ops/killswitch/`, runs as
  least-priv SA `killswitch-fn@…` with `roles/billing.projectManager`) disables project billing **only when
  actual spend ≥ cap** (warning/forecast alerts are no-ops). **Verified:** function `ACTIVE`; a safe
  under-cap self-test event logged `cost=1 cap=5 → no action` (no billing change). **Runbook:**
  `docs/RUNBOOK.md` (backup verify, safe + destructive restore, VM rebuild, and **how to re-enable billing
  if the kill-switch fires**). *(By design, if the kill-switch fires the site AND DB go offline until billing
  is manually re-linked.)*
- [x] **Goal:** safe to leave running unattended.
- [x] **You:** decided — **alert + hard kill-switch**, **$5** budget, default billing-admin email.
- [x] **Me:** nightly `pg_dump` → Cloud Storage cron; recovery runbook (`docs/RUNBOOK.md`); budget + kill-switch.
- [x] **Test plan (you):** **backup check** — `gcloud storage ls gs://walkcode-504322-pg-backups/` shows
  dumps (I verified; a fresh one lands after 08:12 UTC nightly). **Restore drill** — done: scratch-DB restore
  matched live row counts. **Alert check** — a budget-alert email reaches billing admins once real spend
  crosses a threshold; you can eyeball the budget in Console → Billing → Budgets & alerts. Kill-switch wired
  and under-cap-safe (verified).
- [x] **Done when:** a test restore succeeds and a budget alert is live. **Both satisfied.**

### M9 — LLM-assisted algorithm coach
- [x] **Status: DONE & DEPLOYED (2026-08)** — live on `walkcode.maripi.net` (rev `walkcode-00006`), Groq key in Secret Manager. **key created and tested
  locally** against the real model. **Interaction (settled & then upgraded):** a **Socratic, step-by-step
  build** — the coach asks a question ("what should we set up first?"), judges the learner's proposed
  step, appends an accepted step to a growing solution or nudges without revealing the answer, and asks
  the next question until the algorithm is complete. When on, it **replaces** the drag-and-drop builder;
  the deterministic drag-and-drop builder is the **offline/no-key fallback** (kept — no DB cleanup) and
  the whole feature **degrades gracefully** (no key / offline → coach hidden via `/api/health` →
  `features.algorithmFeedback`, builder returns). **Landed:** `server/llm.js` `algorithmCoachTurn()`
  (provider-agnostic OpenAI-compatible proxy, key server-only, env-configurable model/base-URL; returns
  `{decision, acceptedStep, feedback, nextPrompt, done, summary}`) + rate-limited `POST
  /api/algorithm-feedback` with input caps + a step-count backstop; frontend guided-build UI (question →
  answer → accepted step) with state that survives re-renders; the model's response is **escaped** as
  untrusted output; `.env`/`docker-compose.yml` pass the key through for local dev. **Verified:**
  `node --check` clean; a 30-check server+coach suite passes (turn parse of accept/revise, prompt built
  with reference marked *do-not-reveal*, no-key→503 + feature-off + static intact + POST-to-static→405,
  with-key→validation 400s + dead-upstream 502 + rate-limit 429, coach UI hides the drag-drop when on
  and escapes step text); and a **live multi-turn conversation** through the container returned correct
  accept (step added, next question) and revise (no step, non-spoiling nudge) turns. **Coaching-quality
  iteration (from live use):** the prompt now judges GENEROUSLY (a correct compound if/else is accepted,
  not rejected), asks clear one-thing-at-a-time questions and decomposes decisions (condition → each
  branch), is grounded with a structural checklist (state/setup → loop → per-iteration update → stopping
  condition → return) plus the reference solution code (private) so it teaches loop mechanics and knows
  when it's complete, and runs a completeness check; server guards add near-duplicate step dedup, a reference-length
  completion backstop (so it can't loop forever on micro-edge-cases), and strip question sentences out of
  `feedback` (so it never echoes the next question); and a learner **"I've got the full
  algorithm" finish control** ends the session reliably instead of relying on the small model to detect
  completion. **Model note:** provider auto-selects from the key. Local default is now **Groq
  `llama-3.3-70b-versatile`** (`GROQ_API_KEY`) — fast (~0.7s/turn) and a big judgment/coverage upgrade
  over NVIDIA's 8B (the only fast+free NVIDIA option; its 70B was 404/unavailable, 49B ~34s/turn). Groq
  free tier = 12k tokens/min (fine for one user; rapid testing 429s). The 8B-era server guards + prompt
  rules stay as a safety net and for the NVIDIA fallback. **Prod:** `GROQ_API_KEY` in Secret Manager,
  wired via `--set-secrets`; `.gcloudignore` keeps the key out of the build and the Dockerfile now copies
  `server/llm.js`. Public LLM proxy is bounded by the per-IP rate limit + Groq's free TPM cap (worst case
  → graceful fallback, no cost).
- [x] **Goal:** the **Algorithm** lesson step (step 2) gains an *optional* "get feedback on my
  approach" that judges a learner's ordered steps (or a free-text plan) against the problem and
  returns specific, non-spoiling feedback — more flexible than today's exact-match step check.
  The deterministic drag-and-drop checker **stays** as the baseline; the LLM is additive.
  *(Built for the free-text-plan interaction.)*
- [x] **You:** create a free LLM API key and accept the external-vendor posture.
  *(Settled: **Groq** chosen over NVIDIA for coaching quality; free `GROQ_API_KEY` created, stored in
  Secret Manager, and deployed. Surface = the Algorithm step. NVIDIA NIM remains a config-only fallback.)*
- [x] **Me:**
  - **Server proxy** — one route `POST /api/algorithm-feedback` on the existing Node server;
    reads `NVIDIA_API_KEY` from a Cloud Run **secret** (never in the browser). Calls the
    **OpenAI-compatible** endpoint `https://integrate.api.nvidia.com/v1` with a free model
    (default **`meta/llama-3.1-8b-instruct`** — the reliably fast+free option on the tested account;
    bigger free models were unavailable/too slow). Server guards compensate for the small model
    (step dedup, feedback-question stripping, learner "finish" control). Tight system prompt, JSON
    output, **token cap + basic rate-limit** so the
    route can't be turned into a free LLM faucet.
  - **Frontend** — an opt-in button/box in the algorithm panel; shows the model's feedback,
    **degrades gracefully** to the deterministic checker when offline / no key / rate-limited.
  - **Portability** — base-URL is config, so the vendor is swappable (Groq, local Ollama, any
    OpenAI-compatible host) with no code change.
- [ ] **Test plan (you):** open a built lesson's algorithm step, submit a valid approach and a
  flawed one, and confirm the feedback is specific and correct without revealing the full answer;
  go offline and confirm the step still works via the deterministic checker (no crash).
- [ ] **Done when:** algorithm-step feedback works end-to-end behind the server proxy, costs stay
  within the free tier, and the step is fully functional with the LLM path disabled.

### M10 — Typed code drills — DONE (built & verified locally; not yet deployed, 2026-08)
**Goal:** make "fill the blank" **one of four drill types** so learners practice the full spread of
code-reading skills, not just line synthesis. All types stay tap-friendly multiple-choice + per-choice
feedback (mobile-first, no-build) — this **extends** the recognition model rather than breaking from it
(contrast M7). `type` on the exercise defaults to `fill-blank`, so **every legacy drill is unchanged**; the
shuffled queue **interleaves** types and each drill labels its type in the UI.

**The four types** (JS + Python; `views/drill.js` switches on type):
- **fill-blank** (60 drills) — the solution with one line blanked; choices are candidate lines.
- **predict** (`src/data/prediction-drills.js`, **22 drills / 21 problems**) — a self-contained function + a
  call; choices are candidate return values.
- **debug** (`src/data/debug-drills.js`, **12 drills**) — two-step: spot the buggy line, then pick the fix.
  Authored as a structured spec that `assemble.js` flattens per language; the two-step bind logic is
  behaviorally tested (10/10 assertions).
- **edge-case** (`src/data/edge-case-drills.js`, **11 drills**) — a function + "which input yields this
  result?"; choices are input literals (shared across languages), exactly one hits `target`.

**Quality lever — the validator EXECUTES the JS** (`server/scripts/validate-content.mjs`): predict runs
against its call (must equal `correct`); debug runs the buggy code (must differ) **and** the fixed code (must
equal `correctReturns`); edge-case runs `call(choice)` for every choice (only the correct one may hit
`target`). So a wrong answer, a non-manifesting bug, or a non-unique edge case can't ship. Total: **210
exercises / 105 drills**, all green. Still uncovered by the new types (order-insensitive or list/tree-heavy):
Group Anagrams, Top K, Min Stack, Reverse Linked List, Merge Two Sorted Lists, Invert Binary Tree.

**Drill progress + chooser:** each drill has a **stable `id`** (`assemble.js`), and device-local **progress**
(`walkcode-drills` in `localStorage`) marks a drill solved on a correct answer (or the correct fix for debug).
The home **"Code drills" card expands in place** (no separate screen) into **Random reps** vs **Pick or
filter** → a new `drill-picker` screen (filter by type + difficulty; each row shows done state). A shared
**"include already completed"** toggle governs both random drills and random walkthroughs (skips completed by
default).

**Product calls (settled):** predict shipped first; queue interleaved; debug is two-step (spot then fix).

**Remaining:** deploy; an on-device eyeball of the chooser + two-step debug; optionally scale the new types to
the six uncovered problems above.

### Post-M10 UX & review polish (built locally, not yet deployed, 2026-08)
- **Understand step:** always leads with the full statement, then I/O + a collapsible "More examples", then
  the concept check — and the answer-revealing cues (`intuition`, "what to notice") are **hidden until the
  check is answered**, so the recognition check isn't spoiled. Examples/descriptions live in
  `src/data/examples.js` (verified against each real solution).
- **Home mode cards:** both **Code drills** and **Full walkthroughs** expand in place (no separate screen; one
  open at a time; the panel animates **open and closed**, respecting reduced-motion) and each shows a
  `solved/total done` tally. The library is now purely the easier→harder browse list.
- **Review flow:** `/review` now lists **all content-complete problems**, including the 23 that were live via
  the `certifiedTitles` code allowlist but **never actually reviewed** (badged "live · not yet reviewed";
  rejecting a stage takes a live problem back down). Once the token is loaded, the inline five-stage
  **Approve/Reject** shows while browsing **any** problem, and the library shows each problem's review status —
  so browsing and reviewing are unified (no longer split between `?review=1` preview and the `/review` page).

## UI/UX & quality review — mostly resolved by M6/M10 (captured 2026-08)

The 2026-08 diagnostic that drove M6 and the drill work is now **largely done**:

- **Recognize/Understand step** — leads with the full statement, then I/O + a collapsible "More
  examples", then the concept check (the answer-revealing `intuition`/"what to notice" cues stay
  hidden until it's answered); the generic hint was dropped. ✅
- **Headers & copy** — problem title in the top bar, the internal "✓ BUILT" badge dropped from the
  learner UI, plain-language stage names. ✅
- **Navigation** — collapsed to one stepper + a separate "another problem" axis, consistent across
  all five steps. ✅
- **Algorithm step** — the generic hardcoded distractors were removed entirely (it's now a pure
  ordering task, or the M9 AI coach); WIP problems hidden from the library and random walkthroughs. ✅
- **Tech-debt** — the content validator is committed (`server/scripts/validate-content.mjs`, now
  also *executes* typed drills) and user-facing content is escaped (`escapeText`/`richText`). ✅
- **More examples** — done for the complete set: `examples` + optional fuller `description`
  (`src/data/examples.js`, verified against each real solution); all 28 complete problems carry
  3 examples, 8 got a fuller description. ✅

**Still open (small, low-priority):**
- **Harder-problem explanation depth** — Hard-tier problems could use a fuller worked intuition on
  Understand; scale explanation depth with difficulty. (The ~121 title-only WIP problems get
  examples/depth as they're authored toward Built.)
- **Code wrapping vs. indentation** — code blocks use `white-space:pre-wrap`; wrapping can distort
  Python indentation on narrow screens. Consider horizontal scroll for code.
- **Dead-CSS audit** (e.g. any leftover `.fix` from the old drill masking).

**Strengths to preserve:** clean render-on-state loop with no framework/build step; cohesive warm
visual system; mobile-first; DB-backed **and** offline-capable; pedagogically strong drills (whole-line
+ typed, no answer leak, correct per-language variants). Don't regress these while polishing.

## Your setup checklist (what only you can do)

**All prior setup is done ✅:** GCP project `walkcode-504322` (auth `mariapazmaluenda@gmail.com`,
region `us-central1`), billing linked, `maripi.net` DNS cut over to Cloud Run (M2), gcloud updated
(578), Docker installed, e2-micro VM created (M4), and the `GROQ_API_KEY` secret created (M9). Product
calls for M6 (UI/UX) and M9 (Groq provider) are settled.

**Still on you, ahead:**

1. **Review the content** — the `/review#<token>` flow now covers **all** complete problems, including
   the 23 that went live via the code allowlist without being reviewed. Walk them to actually vet them
   (rejecting a stage takes a live problem back down).
2. **Deploy the local batch** — everything since M6/M9 (the whole typed-drill system + UX/review work) is
   committed to `main` locally but not deployed. Approve a Cloud Run deploy when you're happy on localhost.
   Optional: set `REVIEW_TOKEN` as a Cloud Run secret so `/review` works on prod too.
3. **(Optional) retire the `certifiedTitles` allowlist** once the 23 are reviewed, so per-stage review
   becomes the single gate for what's live.

*(All product calls settled: M6 UI/UX, M8 kill-switch + $5 budget, M9 Groq provider, M10 drill types.
M7 in-browser editor is in the Backlog. Per the owner's request, do not commit or push without explicit
per-change approval.)*

## Database choice detail

Chosen: **self-hosted PostgreSQL on the always-free e2-micro VM.** How it compares:

| Option | Relational? | Local run | Prod cost | Portable | Notes |
|---|---|---|---|---|---|
| **Self-host Postgres on e2-micro** ★ | yes | real Postgres | $0 (always-free VM) | yes (`pg_dump`) | 100% GCP + $0; we own ops (backups/patching), single instance |
| Cloud SQL (managed Postgres) | yes | — | ~$8–10/mo | yes | Zero-ops managed, but not free — rejected on cost |
| Neon / Supabase (managed Postgres) | yes | local Postgres | $0 free tier | yes | Free but another platform; free tiers can pause/cap — set aside |
| Firestore | no | emulator only | $0 free tier | no | Not relational; proprietary API — out of scope now |

**What we accept by self-hosting:** we run Postgres ourselves — OS/Postgres patching,
backups, and being a single non-HA instance (fine for a personal app; if the VM dies we
restore from backup). In exchange we get relational + $0 + fully on GCP + portable. The
ops items below are how we keep that safe.

### Self-hosting responsibilities (own these)

- **Backups:** nightly `pg_dump` to a Cloud Storage bucket (always-free ~5 GB) via cron,
  and/or scheduled disk snapshots. Verify a restore at least once.
- **Patching:** keep the OS and Postgres updated (unattended-upgrades for security fixes).
- **Access:** Postgres bound to the internal IP only, TLS required, least-privilege role,
  strong password/secret; firewall allows `5432` only from the Cloud Run/VPC source.
- **Recovery plan:** documented "VM died → recreate + restore from latest dump" steps.

## Custom domain & HTTPS

- **Cloud Run domain mapping** gives free managed TLS for `walkcode.maripi.net` on a
  single service — no paid load balancer, no CDN layer needed.
- **DNS cutover** at the `maripi.net` provider: replace the current
  `walkcode → maripirs.github.io` CNAME with the record(s) Cloud Run domain mapping
  specifies. GitHub Pages stays live until we flip DNS, so rollback is just repointing the
  CNAME.

## Cost summary (target: $0)

- Cloud Run: within always-free (2M req/mo, generous CPU/mem-seconds, 1 GB N.A. egress).
- Compute Engine **e2-micro**: always-free (1 instance, in `us-west1`/`us-central1`/
  `us-east1`, ≤30 GB standard disk, 1 GB N.A. egress). Self-hosted Postgres runs here.
- TLS + custom domain: free (Cloud Run domain mapping).
- **Only ways this leaves free:** choosing Cloud SQL instead of self-hosting (~$8–10/mo —
  avoided); a **second** VM or exceeding e2-micro's free limits (region, disk size, count);
  keeping Postgres traffic on public/external IPs instead of internal VPC (egress); or a
  serverless VPC *connector* (billable) instead of Cloud Run Direct VPC egress.

## Cost controls & capping (Cloud Run)

**Important, stated plainly: Cloud Run has no native hard dollar cap.** Cloud Billing
"budgets" are *alerts*, not automatic stops. For now we're bounding cost with instance
limits and deferring the rest (see Backlog).

**Committed now — instance limits:**

- **`--min-instances=0` (scale to zero).** Pay **nothing while idle**, which for this app
  is nearly all the time. Never raise this above 0 unless we accept an always-on charge.
- **`--max-instances=2` (bound autoscaling).** Stops a traffic spike or abusive load from
  fanning out into many billable instances. It caps the *rate* of spend, not a monthly
  total — which, combined with scale-to-zero and the free tier, keeps the realistic bill
  at **$0** and the worst case small.

The e2-micro Postgres VM has no scaling bill — it's a single fixed always-free instance,
so there's nothing to autoscale or cap there (just don't add a second VM or oversize the
disk). Note it does **not** scale to zero: it runs continuously, which is expected and
still free within the e2-micro allowance.

> Reality check: instance limits bound compute scaling, **not** network egress, and are a
> bounded-worst-case rather than an absolute "can never be charged" guarantee. The items
> in Backlog close those gaps when we want them.

## Rollback

- Phase 0: GitHub Pages remains intact until the DNS flip; revert by repointing the
  `walkcode` CNAME back to `maripirs.github.io`.
- Cloud Run keeps prior revisions — roll back to a known-good revision in one step.
- Phase 1 data: restore Postgres from the latest `pg_dump`; if the VM itself is lost,
  recreate the e2-micro and restore the dump.

## Backlog (deferred cost controls & hardening)

Not doing these now; revisit as traffic or risk tolerance changes:

- **In-browser code editor + execution** (was M7, deferred 2026-08) — a blank-canvas editor fights
  the app's scaffolded, mobile-first, recognition-first model. If revisited, the fit is a
  **runner/checker on already-visible code** (run the assembled solution against the authored
  examples → pass/fail), not a text editor — and it needs per-problem input drivers (many solutions
  aren't self-contained) + order-insensitive comparison for some outputs. Full spec retained in the
  M7 section above. Superseded near-term by **M10 (typed code drills)**.
- **Accounts + progress sync** (moved here from M5) — user accounts so per-device progress
  (today `localStorage` only — `walkcode-states`) syncs across devices. A simple relational
  schema fits: a `users` table and a `progress` table keyed by `(user_id, card_id)` → state,
  with portable auth (Auth.js/Lucia/plain sessions; no vendor lock-in) and `localStorage`
  kept as the guest/offline fallback. Deferred behind content-in-DB and the code runner;
  promote back to a milestone when cross-device sync becomes the priority.
- **CDN in front of Cloud Run** (Firebase Hosting or Cloudflare, free) — *explicitly
  deferred; starting cloud-only, direct from Cloud Run.* Absorbs static traffic so the
  origin barely runs and egress stays tiny. The one control that bounds **network
  egress**, which instance limits do not. Revisit if traffic or egress ever grows.
- **Instance right-sizing** — `--cpu`, `--memory=256Mi`, request-based CPU billing, and a
  modest `--timeout` to shrink billed work if we ever exceed free limits.

*(The budget alert **and** the absolute hard kill-switch were built in **M8** — a $5 Cloud Billing
budget → Pub/Sub → a Cloud Function that disables project billing at the cap — so they're no longer
backlog items.)*

## Open questions

- **When to deploy** the local batch (M10 + UX/review), and whether to do the content review pass on
  localhost first or set `REVIEW_TOKEN` on prod and review there.
- Whether to **retire the `certifiedTitles` allowlist** after reviewing the 23 (review as the single gate).

**Settled:** ~~Node for the backend~~ · ~~Content authoring (M5)~~ (auto-seed + direct DB writes) ·
~~LLM provider/posture (M9)~~ (Groq, config-swappable) · ~~Auth / cross-device progress sync~~ (Backlog) ·
~~In-browser code editor (M7)~~ (Backlog) · ~~Typed code drills (M10)~~ (predict-first, interleaved queue,
two-step debug — all built) · ~~Cost cap (M8)~~ (alert + hard kill-switch, $5 budget).
