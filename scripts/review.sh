#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_lib.sh"

banner "OpenTrust — Data Review"

printf "${DIM}Operational snapshot of your OpenTrust instance:${RESET}\n"
printf "${DIM}data counts, ingestion freshness, index status, and audit log.${RESET}\n"
printf "${DIM}Working directory: %s${RESET}\n" "$REPO_ROOT"

# ── Step 1: Database file ──────────────────────────────────────────
step "Database"

db_file="storage/opentrust.sqlite"

if [ ! -f "$db_file" ]; then
  fail "Database not found at $db_file"
  info "Run ./scripts/setup.sh or pnpm run db:init first."
  exit 1
fi

if command -v du &>/dev/null; then
  db_size=$(du -sh "$db_file" | cut -f1 | tr -d ' ')
  ok "Database: $db_file ($db_size)"
else
  ok "Database: $db_file"
fi

# Count WAL/SHM files
wal_files=0
[ -f "${db_file}-wal" ] && wal_files=$((wal_files + 1))
[ -f "${db_file}-shm" ] && wal_files=$((wal_files + 1))
if [ "$wal_files" -gt 0 ]; then
  info "WAL mode files present ($wal_files)"
fi

printf "\n"

# ── Step 2: Data counts from TypeScript helper ─────────────────────
step "Table row counts"
info "Querying the database for record counts..."

review_json=$(pnpm exec tsx scripts/review-data.ts 2>/dev/null) || {
  fail "Could not query database. Is it initialized?"
  exit 1
}

print_count() {
  local table="$1"
  local count
  count=$(echo "$review_json" | sed -n "s/.*\"$table\":\([0-9]*\).*/\1/p" | head -1)
  count="${count:-0}"
  if [ "$count" -gt 0 ]; then
    ok "$(printf '%-24s %s' "$table" "$count")"
  else
    info "$(printf '%-24s %s' "$table" "$count")"
  fi
}

print_count "sessions"
print_count "traces"
print_count "events"
print_count "workflow_runs"
print_count "workflow_steps"
print_count "artifacts"
print_count "tool_calls"
print_count "trace_edges"
print_count "capabilities"
print_count "memory_entries"
print_count "saved_investigations"

printf "\n"

# ── Step 3: Ingestion state ───────────────────────────────────────
step "Ingestion pipelines"

# Parse ingestion states from JSON (simple extraction)
ingestion_count=$(echo "$review_json" | python3 -c "
import sys, json
data = json.load(sys.stdin)
states = data.get('ingestionStates', [])
if not states:
    print('NONE')
else:
    for s in states:
        last = s.get('last_run_at', 'never') or 'never'
        status = s.get('last_status', 'unknown') or 'unknown'
        imported = s.get('imported_count', 0)
        print(f\"{s['source_key']}|{status}|{imported}|{last}\")
" 2>/dev/null) || ingestion_count="NONE"

if [ "$ingestion_count" = "NONE" ]; then
  info "No ingestion pipelines recorded yet."
else
  while IFS='|' read -r key status imported last_run; do
    if [ "$status" = "ok" ] || [ "$status" = "success" ]; then
      ok "$(printf '%-28s imported=%-6s last=%s' "$key" "$imported" "$last_run")"
    else
      warn "$(printf '%-28s status=%-8s imported=%-6s last=%s' "$key" "$status" "$imported" "$last_run")"
    fi
  done <<< "$ingestion_count"
fi

printf "\n"

# ── Step 4: Semantic index ─────────────────────────────────────────
step "Semantic index"

chunk_count=$(echo "$review_json" | python3 -c "
import sys, json
data = json.load(sys.stdin)
s = data.get('semantic', {})
print(f\"{s.get('chunkCount', 0)}|{s.get('vectorReady', False)}|{s.get('lastChunkRunAt', 'never') or 'never'}\")
" 2>/dev/null) || chunk_count="0|false|never"

IFS='|' read -r chunks vec_ready last_chunk <<< "$chunk_count"

if [ "$chunks" -gt 0 ] 2>/dev/null; then
  ok "Semantic chunks: $chunks"
else
  info "Semantic chunks: 0"
fi

if [ "$vec_ready" = "True" ]; then
  ok "Vector index: ready"
else
  info "Vector index: not active"
fi

info "Last chunk run: $last_chunk"

printf "\n"

# ── Step 5: FTS index ──────────────────────────────────────────────
step "Full-text search index"

fts_count=$(echo "$review_json" | python3 -c "
import sys, json
print(json.load(sys.stdin).get('ftsCount', 0))
" 2>/dev/null) || fts_count="0"

if [ "$fts_count" -gt 0 ] 2>/dev/null; then
  ok "FTS entries: $fts_count"
else
  info "FTS entries: 0"
fi

printf "\n"

# ── Step 6: Auth configuration ────────────────────────────────────
step "Auth configuration"

auth_mode="$(env_val OPENTRUST_AUTH_MODE)"
auth_mode="${auth_mode:-token}"
bypass="$(env_val OPENTRUST_ALLOW_LOCALHOST_BYPASS)"
bypass="${bypass:-true}"

info "Auth mode: $auth_mode"
info "Localhost bypass: $bypass"

printf "\n"

# ── Step 7: Audit log ─────────────────────────────────────────────
step "Recent audit log"

audit_log="storage/audit/auth.log"

if [ -f "$audit_log" ]; then
  total=$(wc -l < "$audit_log" | tr -d ' ')
  info "Total entries: $total"
  if [ "$total" -gt 0 ]; then
    info "Last 5 entries:"
    tail -5 "$audit_log" | while IFS= read -r line; do
      info "  $line"
    done
  fi
else
  info "No audit log found yet."
fi

# ── Done ───────────────────────────────────────────────────────────
printf "\n"
banner "Review complete"
