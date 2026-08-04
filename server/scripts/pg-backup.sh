#!/usr/bin/env bash
#
# Nightly Postgres backup for Walkcode (M8).
#
# Runs ON the e2-micro VM (walkcode-pg) from root's crontab. Dumps the `walkcode`
# database in Postgres custom format (compressed) and uploads it to the private
# GCS backup bucket using the VM's service-account credentials (no keys on disk).
# A 30-day lifecycle rule on the bucket handles retention, so this script never
# deletes anything itself.
#
# Install (on the VM):
#   sudo install -m 0755 pg-backup.sh /opt/walkcode/pg-backup.sh
#   # crontab (root): daily at 08:12 UTC
#   12 8 * * * /opt/walkcode/pg-backup.sh >> /var/log/walkcode-backup.log 2>&1
#
# Restore: see docs/RUNBOOK.md.

set -euo pipefail

BUCKET="gs://walkcode-504322-pg-backups"
DB="walkcode"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="walkcode-${TS}.dump"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
LOCAL="${TMP}/${FILE}"

# Dump as the postgres superuser via local peer auth (no password on disk).
# -Fc = custom format: compressed and restorable with pg_restore (selective, parallel).
sudo -u postgres pg_dump -Fc "$DB" > "$LOCAL"

SIZE="$(du -h "$LOCAL" | cut -f1)"

# Upload with the VM service account (needs devstorage.read_write scope + objectAdmin
# on the bucket). Fail loudly if the object doesn't land.
gcloud storage cp "$LOCAL" "${BUCKET}/${FILE}"
gcloud storage objects describe "${BUCKET}/${FILE}" >/dev/null

logger -t walkcode-backup "backup OK: ${BUCKET}/${FILE} (${SIZE})"
echo "$(date -u +%FT%TZ) backup OK: ${BUCKET}/${FILE} (${SIZE})"
