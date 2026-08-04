# Walkcode ops runbook (M8)

Recovery and hardening procedures for the live stack. Infra facts live in
`plan.md` / `CLAUDE.md`; this file is the "something broke / verify it's safe" playbook.

**Stack at a glance** — project `walkcode-504322`, region `us-central1`:
- **Cloud Run** service `walkcode` (site + `/api/**`), custom domain `walkcode.maripi.net`.
- **Postgres 15** on always-free e2-micro VM `walkcode-pg` (`us-central1-a`, internal IP
  `10.128.0.2`, **no external IP**). DB `walkcode`, role `walkcode_app`.
- Reached only via Cloud Run **Direct VPC egress**; `DATABASE_URL` in Secret Manager.

---

## 1. Nightly backups

- **What:** `pg_dump -Fc` (custom/compressed format) of the `walkcode` DB.
- **Where:** `gs://walkcode-504322-pg-backups/walkcode-<UTCtimestamp>.dump`.
- **When:** root cron on the VM, **08:12 UTC daily** (`sudo crontab -l`).
- **Retention:** a bucket **lifecycle rule deletes objects older than 30 days** — the
  script never deletes anything itself. Small DB (~80 KB/dump) → trivially inside the
  5 GB always-free tier.
- **How it authenticates:** the VM's service account
  (`158097311442-compute@developer.gserviceaccount.com`) has `devstorage.read_write`
  **scope** and `roles/storage.objectAdmin` **on this bucket only**. No key files on disk.
  Reaching `storage.googleapis.com` with no external IP requires **Private Google Access**
  on the `default`/`us-central1` subnet (enabled in M8).
- **Script:** `server/scripts/pg-backup.sh` in the repo → installed at
  `/opt/walkcode/pg-backup.sh` on the VM. Log: `/var/log/walkcode-backup.log` + syslog tag
  `walkcode-backup`.

**Verify a backup ran (do this occasionally):**
```bash
gcloud storage ls -l gs://walkcode-504322-pg-backups/   # newest object should be < 24h old
gcloud compute ssh walkcode-pg --zone=us-central1-a --tunnel-through-iap \
  --command='sudo tail -5 /var/log/walkcode-backup.log'
```

**Run a backup on demand:**
```bash
gcloud compute ssh walkcode-pg --zone=us-central1-a --tunnel-through-iap \
  --command='sudo /opt/walkcode/pg-backup.sh'
```

---

## 2. Restore from a dump

Restores use `pg_restore` on the VM. **Test-restore into a scratch DB first** (never
practice on the live DB). Verified working in M8 — row counts matched the live DB exactly.

**Test restore into a throwaway DB (safe, non-destructive):**
```bash
gcloud compute ssh walkcode-pg --zone=us-central1-a --tunnel-through-iap --command='
  LATEST=$(gcloud storage ls gs://walkcode-504322-pg-backups/ | grep "\.dump$" | sort | tail -1)
  gcloud storage cp "$LATEST" /tmp/restore-test.dump -q
  sudo -u postgres psql -q -c "DROP DATABASE IF EXISTS walkcode_restore_test;"
  sudo -u postgres psql -q -c "CREATE DATABASE walkcode_restore_test;"
  sudo -u postgres pg_restore -d walkcode_restore_test /tmp/restore-test.dump
  sudo -u postgres psql -d walkcode_restore_test -tAc "select count(*) from problems"
  sudo -u postgres psql -q -c "DROP DATABASE walkcode_restore_test;"
  rm -f /tmp/restore-test.dump'
```

**Restore INTO the live DB (destructive — recovering from data loss/corruption):**
Pick the dump you want (usually the newest), then recreate the DB from it. This drops and
recreates `walkcode`, so the app falls back to cached/offline content until it's back.
```bash
gcloud compute ssh walkcode-pg --zone=us-central1-a --tunnel-through-iap --command='
  gcloud storage cp gs://walkcode-504322-pg-backups/<CHOSEN>.dump /tmp/restore.dump -q
  sudo -u postgres psql -c "DROP DATABASE walkcode;"
  sudo -u postgres psql -c "CREATE DATABASE walkcode OWNER walkcode_app;"
  sudo -u postgres pg_restore --no-owner --role=walkcode_app -d walkcode /tmp/restore.dump
  rm -f /tmp/restore.dump'
```
Then confirm the app: `curl -s -o /dev/null -w "%{http_code}\n" https://walkcode.maripi.net/api/content`.
(The server auto-seed only writes when the DB is empty or the content hash changed, so a
restored DB with existing content is left as-is.)

---

## 3. VM died → recreate + restore

The VM is a single non-HA instance by design. If it's lost:

1. **Recreate the e2-micro** with the same M4 settings (always-free region `us-central1-a`,
   e2-micro, ≤30 GB pd-standard, **no external IP**), install Postgres 15, recreate DB
   `walkcode` + role `walkcode_app`, TLS on, `pg_hba` limited to `10.128.0.0/20`. See the
   M4 section of `plan.md` for the exact config.
2. **Reattach infra M8 added:** grant the VM SA `objectAdmin` on the backup bucket, ensure
   `devstorage.read_write` scope, confirm Private Google Access on the subnet, reinstall
   `pg-backup.sh` + the cron line.
3. **Restore** the latest dump into the live DB (section 2).
4. If the internal IP differs from `10.128.0.2`, update the `DATABASE_URL` secret and
   redeploy Cloud Run.

---

## 4. Budget alert + hard kill-switch

- **Budget:** a Cloud Billing budget of **$5/mo** on billing account `0168F6-758980-E485D2`,
  scoped to this project, alert thresholds **50 / 90 / 100%**. Emails billing admins
  automatically **and** publishes to Pub/Sub topic `billing-killswitch`.
- **Kill-switch:** Gen2 Cloud Function `billing-killswitch` (source `ops/killswitch/`) is
  subscribed to that topic. When **actual** spend **≥ the cap**, it **disables billing on
  the whole project** — a true hard "$0 can never be exceeded" guarantee. Warning/forecast
  alerts (50/90%) are no-ops in the function (they still email). Runs as the least-privilege
  SA `killswitch-fn@…` (`roles/billing.projectManager` only).
- **By design, when it fires the site AND the DB go offline** (billing off ⇒ Cloud Run and
  Compute stop). Re-enabling is deliberate and manual.

**If the kill-switch fired (re-enable billing):**
1. Understand *why* spend hit the cap before turning it back on (check Billing → Reports).
2. Re-link billing:
   ```bash
   gcloud billing projects link walkcode-504322 --billing-account=0168F6-758980-E485D2
   ```
   (Or Console → Billing → link the account.) Cloud Run + the VM come back automatically;
   confirm with the health checks below.
3. Confirm the VM restarted and Postgres is up; if the internal IP changed, see §3 step 4.

**Test the kill-switch WITHOUT disabling billing** — publish a fake *under-cap* event and
confirm the function logs "no action" (never publish an over-cap payload unless you intend
to pull the plug):
```bash
gcloud pubsub topics publish billing-killswitch --project=walkcode-504322 \
  --message='{"budgetDisplayName":"test","costAmount":1,"budgetAmount":5,"currencyCode":"USD"}'
gcloud functions logs read billing-killswitch --gen2 --region=us-central1 --limit=10
```

---

## 5. Health checks

```bash
curl -s -o /dev/null -w "health:%{http_code}\n"  https://walkcode.maripi.net/api/health
curl -s -o /dev/null -w "content:%{http_code}\n" https://walkcode.maripi.net/api/content
```
Both `200` = site up and DB-backed content served. `content` 503 with `health` 200 means
Postgres is unreachable (VM down / firewall / secret) — the frontend still boots from its
cached/offline bundle while you investigate.

## Cost-relevant invariants (keep these true to stay $0)

- Exactly **one** e2-micro VM, ≤30 GB standard disk, **no external IP** (an in-use external
  IPv4 now costs ~$3/mo).
- Cloud Run `--min-instances=0 --max-instances=2`.
- Backup bucket stays small (lifecycle-pruned) — inside the 5 GB free tier.
- Patching the VM needs a **temporary** external IP (`add-access-config` … then
  `delete-access-config`), because there's no permanent one.
