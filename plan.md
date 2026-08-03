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

The **in-browser code editor + execution** (M6) is a separate, frontend-only feature that
does not depend on this migration — it's sequenced after because content-in-DB is the
higher-value backend milestone.

## Milestones

Each milestone is independently shippable and verifiable. **You** = things only you can do
(accounts, billing, DNS, interactive auth, product calls). **Me** = code/config I write and
commands I prepare or run.

**Progress overview** (🚧 = in progress, ⏳ = waiting on an external step):

- [x] **M0** — Foundations: project, billing, tooling, APIs enabled
- [x] **M1** — Static site live on Cloud Run (`*.run.app`)
- [x] **M2** — Custom domain + HTTPS — **done & verified**: `https://walkcode.maripi.net` live from Cloud Run with a valid Google-issued cert
- [x] **M3** — Backend skeleton + local dev — **done & verified**: `/api/health` live in prod; `docker compose up` runs app + Postgres locally (host port 8088)
- [x] **M4** — Postgres on the e2-micro VM — **done & verified**: private Cloud Run→Postgres path works (`/api/db-ping` OK), nothing on the public internet
- [ ] **M5** — Content to the database: problems, code examples, and exercises served from Postgres via `/api`
- [ ] **M6** — In-browser code editor + execution (client-side; JS now, Python via Pyodide later)
- [ ] **M7** — Hardening (backups, budget alert)

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
- [x] **Status: Deployed & serving** — live at `https://walkcode-n2nusmut7q-uc.a.run.app` with `--min-instances=0 --max-instances=2`; static + ES-module MIME + SPA fallback verified. ⏳ awaiting your desktop/phone smoke-test sign-off.
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
- [x] **Status: Live in prod** — `/api/health` added to the dependency-free server (`/api/**` no longer falls through to the SPA); `docker-compose.yml` (app + Postgres) added for local parity; redeployed (revision `walkcode-00002`); `/api/health` returns `{"status":"ok"}` on both the `*.run.app` URL and `https://walkcode.maripi.net`. ⏳ your `docker compose up` local test.
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

> **M4 ops notes (for M5+ / M7):** the `walkcode_app` password lives only in Secret Manager
> (`DATABASE_URL`), not in the repo. The VM has **no external IP**, so `apt`/patching needs a
> temporary IP re-added (`gcloud compute instances add-access-config walkcode-pg
> --zone=us-central1-a`) then removed again. Rebuilding the VM: re-run the same startup-script
> flow, restore from a `pg_dump` (M7). `/api/db-ping` is throwaway — delete when M5's
> `/api/content` routes land.

### M5 — Content to the database
- [ ] **Goal:** problems, code examples, and exercises are served from Postgres via `/api`,
  so new content is added by writing to the DB — no frontend edit or redeploy. The site
  looks and behaves exactly as it does today after the cutover.
- [ ] **You:** nothing to set up. One optional product call later: *how* you want to author
  new content (raw SQL/seed script now vs. a simple authed admin endpoint later) — punt-able.
- [ ] **Me:**
  1. **Schema** — `problems` (title, topic, difficulty, `is_built`, position), `lessons`
     (per problem: brief, explanation, code by language, concept choices, complexity,
     input/output), `exercises`/`drills` (prompt, answer, correct feedback, per-wrong-answer
     feedback, language variants, standalone vs. lesson-attached). Mirrors the fragments in
     `src/data/**` + the assembly `model.js` does today.
  2. **Content API** — read-only `/api/content` routes (e.g. cards list, a problem's full
     lesson, the drill queue) returning the same shapes `cards` / `lessonFor` / `drillItems`
     produce now, so views change as little as possible.
  3. **Seed importer** — a one-time script that reads today's assembled content via
     `model.js` and inserts it, making the DB an exact mirror of what ships now.
  4. **Frontend cutover** — replace `src/data` imports with `fetch` to `/api/content`,
     keeping a cached/bundled copy as an **offline fallback** so the app still boots with no
     network. Update `CLAUDE.md`/`CONTRIBUTING.md` since the content workflow changes.
- [ ] **Test plan (you):** open the site and confirm it looks/works **identical** to today —
  library browse, a random walkthrough through all five lesson steps, a drill with correct +
  wrong answers, and the **JS ↔ Python** switch (content still language-correct). Then the
  real proof: **I add a new problem/drill directly in the DB, you refresh, and it appears —
  with no redeploy.** Kill the network (offline) and confirm the app still boots from the
  fallback. Console shows **no errors**.
- [ ] **Done when:** the frontend renders all content from `/api` (DB-backed), a DB-only
  content addition shows up after refresh with no code change, and offline still boots.

### M6 — In-browser code editor + execution
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

### M7 — Hardening (pulled from Backlog)
- [ ] **Goal:** safe to leave running unattended.
- [ ] **You:** decide whether you want the absolute billing kill-switch.
- [ ] **Me:** nightly `pg_dump` → Cloud Storage cron; recovery runbook; budget alert.
- [ ] **Test plan (you):** **backup check** — list the Cloud Storage bucket and confirm today's
  dump is there. **Restore drill (with me)** — we restore the latest dump into a throwaway DB
  and you confirm your data (a user + their progress) comes back intact. **Alert check** —
  confirm the **budget-alert email** reaches your inbox (we trigger a test or verify the
  config + notification address). If you opted for the kill-switch, confirm it's wired.
- [ ] **Done when:** a test restore succeeds and a budget alert is live.

## Your setup checklist (what only you can do)

**Already done ✅:** GCP project **`walkcode-504322`** created; authenticated as
`mariapazmaluenda@gmail.com`; gcloud config pointed at the project with region
**`us-central1`**; **Docker** installed. (Note: gcloud is an older 421 build — fine to
proceed; we can update it later if any command needs it.)

**Still needed to unblock M0–M2:**

1. **Confirm billing** is linked to `walkcode-504322` (Console → Billing). Even the
   always-free tier needs billing enabled with a card on file; it won't charge within free
   limits, and we add a budget alert in M7 (Hardening). This gets definitively validated at
   the first M1 deploy.
2. Access to your **`maripi.net` DNS** provider (for the M2 domain-verify TXT record and the
   `walkcode` cutover) — needed at M2, not before.

**Later, for M4–M6:** approve VM creation (M4); optionally decide *how* you want to author
new content once it's in the DB (M5 — punt-able); a scope call on the in-browser runner
(M6). Auth is no longer a near-term call — accounts + progress sync moved to the Backlog.

Everything else on the checklist-adjacent work (Dockerfile, server, deploy commands, VM
setup scripts, content schema, seed importer, API + frontend cutover, the code runner) is
on me — I'll prepare each and walk you through
anything interactive.

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
- **Budget alert** — Cloud Billing budget at a low threshold ($1 / $5) that emails us
  early. Notification, not a stop.
- **Absolute kill-switch (true hard cap)** — budget threshold → Pub/Sub → a Cloud
  Function that **disables billing on the project**. Guarantees the bill can never grow;
  tradeoff is the site goes offline when it fires. Add only if we want a literal
  "can never be charged" guarantee.
- **Instance right-sizing** — `--cpu`, `--memory=256Mi`, request-based CPU billing, and a
  modest `--timeout` to shrink billed work if we ever exceed free limits.

## Open questions

- Confirm **Node** for the backend server (keeps one language with the existing JS).
- **Content authoring (M5):** start with raw SQL / a seed script for adding problems, or
  build a small authed admin endpoint? (Punt-able — read-only serving works either way.)
- **Runner scope (M6):** which surfaces get the in-browser editor — drills only, full
  lessons, or a scratch "try it" pane — and do runs check against expected output?
- ~~Auth / cross-device progress sync data model~~ — **settled:** accounts + progress sync
  moved to the Backlog; not shaping the near-term schema.
