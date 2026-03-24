#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_lib.sh"

banner "OpenTrust — Doctor"

printf "${DIM}Diagnoses common environment problems so you can fix${RESET}\n"
printf "${DIM}them before they bite. Run this when something feels off.${RESET}\n"
printf "${DIM}Working directory: %s${RESET}\n" "$REPO_ROOT"

pass_count=0
warn_count=0
fail_count=0

record_pass() { pass_count=$((pass_count + 1)); }
record_warn() { warn_count=$((warn_count + 1)); }
record_fail() { fail_count=$((fail_count + 1)); }

# ── Step 1: Node.js ────────────────────────────────────────────────
step "Node.js"

if command -v node &>/dev/null; then
  node_version=$(node --version)
  node_major=$(echo "$node_version" | sed 's/v//' | cut -d. -f1)
  if [ "$node_major" -ge 18 ]; then
    ok "Node.js $node_version"
    record_pass
  else
    warn "Node.js $node_version — version 18+ is required."
    record_warn
  fi
else
  fail "Node.js not found."
  info "Install Node.js 18+ from https://nodejs.org"
  record_fail
fi

printf "\n"

# ── Step 2: pnpm ──────────────────────────────────────────────────
step "pnpm"

if command -v pnpm &>/dev/null; then
  ok "pnpm v$(pnpm --version)"
  record_pass
else
  fail "pnpm not found."
  info "Install: npm install -g pnpm"
  record_fail
fi

printf "\n"

# ── Step 3: node_modules ──────────────────────────────────────────
step "Dependencies (node_modules)"

if [ -d "node_modules" ]; then
  if [ -f "pnpm-lock.yaml" ]; then
    lock_mtime=$(stat -f '%m' pnpm-lock.yaml 2>/dev/null || stat -c '%Y' pnpm-lock.yaml 2>/dev/null || echo 0)
    nm_mtime=$(stat -f '%m' node_modules 2>/dev/null || stat -c '%Y' node_modules 2>/dev/null || echo 0)
    if [ "$lock_mtime" -gt "$nm_mtime" ] 2>/dev/null; then
      warn "node_modules may be stale (lockfile is newer)."
      info "Run: pnpm install"
      record_warn
    else
      ok "node_modules/ exists and is up to date."
      record_pass
    fi
  else
    ok "node_modules/ exists."
    record_pass
  fi
else
  fail "node_modules/ not found."
  info "Run: pnpm install"
  record_fail
fi

printf "\n"

# ── Step 4: .env file ─────────────────────────────────────────────
step "Environment file (.env)"

if [ -f ".env" ]; then
  ok ".env exists."
  record_pass
else
  warn ".env not found."
  info "Copy from .env.example: cp .env.example .env"
  record_warn
fi

printf "\n"

# ── Step 5: Auth configuration ────────────────────────────────────
step "Auth environment variables"

auth_mode="$(env_val OPENTRUST_AUTH_MODE)"
auth_mode="${auth_mode:-token}"

info "OPENTRUST_AUTH_MODE=$auth_mode"

if [ "$auth_mode" = "token" ]; then
  token_val="$(env_val OPENTRUST_AUTH_TOKEN)"
  if [ -n "$token_val" ]; then
    ok "OPENTRUST_AUTH_TOKEN is set."
    record_pass
  else
    warn "OPENTRUST_AUTH_TOKEN is empty (localhost bypass may cover this)."
    record_warn
  fi
elif [ "$auth_mode" = "password" ]; then
  pass_val="$(env_val OPENTRUST_AUTH_PASSWORD)"
  if [ -n "$pass_val" ]; then
    ok "OPENTRUST_AUTH_PASSWORD is set."
    record_pass
  else
    fail "OPENTRUST_AUTH_PASSWORD is empty — password mode won't work."
    record_fail
  fi
elif [ "$auth_mode" = "none" ]; then
  info "Auth is disabled (mode=none)."
  record_pass
else
  warn "Unrecognized auth mode: $auth_mode"
  record_warn
fi

printf "\n"

# ── Step 6: Database file ─────────────────────────────────────────
step "Database file"

db_file="storage/opentrust.sqlite"

if [ -f "$db_file" ]; then
  if [ -r "$db_file" ]; then
    ok "Database exists and is readable."
    record_pass
  else
    fail "Database exists but is not readable."
    record_fail
  fi
else
  warn "Database not found at $db_file"
  info "Run: pnpm run db:init"
  record_warn
fi

printf "\n"

# ── Step 7: Database connectivity ─────────────────────────────────
step "Database connectivity"

if [ -f "$db_file" ]; then
  if pnpm exec tsx -e "
    const { getDb } = require('@/lib/opentrust/db');
    const db = getDb();
    const row = db.prepare('SELECT 1 AS ok').get();
    if (row && (row as any).ok === 1) process.exit(0);
    process.exit(1);
  " 2>/dev/null; then
    ok "Database opens and responds to queries."
    record_pass
  else
    # Try an alternative approach
    if pnpm exec tsx -e "
      import { queryOne } from '@/lib/opentrust/db';
      const row = queryOne<{ok: number}>('SELECT 1 AS ok');
      process.exit(row?.ok === 1 ? 0 : 1);
    " 2>/dev/null; then
      ok "Database opens and responds to queries."
      record_pass
    else
      warn "Could not verify database connectivity."
      info "The database file exists but the query test failed."
      record_warn
    fi
  fi
else
  info "Skipped — no database file."
fi

printf "\n"

# ── Step 8: sqlite-vec extension ──────────────────────────────────
step "sqlite-vec extension"

if pnpm exec tsx -e "
  import { getLoadablePath } from 'sqlite-vec';
  const p = getLoadablePath();
  if (p) process.exit(0);
  process.exit(1);
" 2>/dev/null; then
  ok "sqlite-vec extension is loadable."
  record_pass
else
  warn "sqlite-vec extension could not be loaded."
  info "Semantic vector search will be unavailable."
  info "Set OPENTRUST_SQLITE_VEC_PATH in .env if you have a custom path."
  record_warn
fi

printf "\n"

# ── Step 9: Husky hooks ───────────────────────────────────────────
step "Husky pre-commit hook"

if [ -f ".husky/pre-commit" ]; then
  ok "Pre-commit hook installed."
  record_pass
else
  warn "Pre-commit hook not found."
  info "Run: pnpm install (triggers the 'prepare' script)."
  record_warn
fi

printf "\n"

# ── Step 10: Port 3000 ────────────────────────────────────────────
step "Dev server port (3000)"

if command -v lsof &>/dev/null; then
  if lsof -iTCP:3000 -sTCP:LISTEN &>/dev/null; then
    warn "Port 3000 is already in use."
    info "The dev server may not start. Check what's running on that port."
    record_warn
  else
    ok "Port 3000 is available."
    record_pass
  fi
elif command -v ss &>/dev/null; then
  if ss -tlnp 2>/dev/null | grep -q ':3000 '; then
    warn "Port 3000 is already in use."
    record_warn
  else
    ok "Port 3000 is available."
    record_pass
  fi
else
  info "Could not check port 3000 (lsof/ss not available)."
  record_warn
fi

# ── Summary ────────────────────────────────────────────────────────
printf "\n"
banner "Diagnostic Summary"

printf "    ${GREEN}✓ %d passed${RESET}\n" "$pass_count"
if [ "$warn_count" -gt 0 ]; then
  printf "    ${YELLOW}⚠ %d warning(s)${RESET}\n" "$warn_count"
fi
if [ "$fail_count" -gt 0 ]; then
  printf "    ${RED}✗ %d failed${RESET}\n" "$fail_count"
fi

if [ "$fail_count" -gt 0 ]; then
  printf "\n${DIM}Fix the failures above, then re-run: ./scripts/doctor.sh${RESET}\n"
elif [ "$warn_count" -gt 0 ]; then
  printf "\n${DIM}Warnings are non-blocking but worth reviewing.${RESET}\n"
else
  printf "\n${DIM}Everything looks good. Ready to run: pnpm dev${RESET}\n"
fi

printf "\n"
