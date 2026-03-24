#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_lib.sh"

banner "OpenTrust — Update"

printf "${DIM}Pulls the latest code, reinstalls dependencies, re-runs${RESET}\n"
printf "${DIM}migrations, re-ingests data, and rebuilds indexes.${RESET}\n"
printf "${DIM}Working directory: %s${RESET}\n" "$REPO_ROOT"

# ── Step 1: Prerequisites ──────────────────────────────────────────
step "Checking prerequisites"

if command -v node &>/dev/null; then
  ok "Node.js found: $(node --version)"
else
  fail "Node.js not found. Install Node.js 18+ first."
  exit 1
fi

if command -v pnpm &>/dev/null; then
  ok "pnpm found: v$(pnpm --version)"
else
  fail "pnpm not found."
  exit 1
fi

printf "\n"

# ── Step 2: Git pull ───────────────────────────────────────────────
step "Pull latest changes"

if command -v git &>/dev/null && [ -d ".git" ]; then
  info "Fetches and rebases on the latest upstream commits."
  if ask_skip "Run git pull --rebase?"; then
    run_cmd git pull --rebase
    ok "Repository updated."
  else
    ok "Skipped git pull."
  fi
else
  warn "Not a git repo or git not found — skipping."
fi

printf "\n"

# ── Step 3: Install dependencies ──────────────────────────────────
step "Install dependencies"
info "Runs 'pnpm install' to sync packages with the lockfile."

if ask_skip "Run pnpm install?"; then
  run_cmd pnpm install
  ok "Dependencies installed."
else
  ok "Skipped dependency install."
fi

printf "\n"

# ── Step 4: Database migrations ───────────────────────────────────
step "Run database migrations"
info "Applies any new schema changes to storage/opentrust.sqlite."
info "This is idempotent — safe to run on an up-to-date database."

if ask_skip "Run database migrations?"; then
  run_cmd pnpm run db:init
  ok "Migrations applied."
else
  ok "Skipped migrations."
fi

printf "\n"

# ── Step 5: Ingest OpenClaw sessions ──────────────────────────────
step "Re-ingest OpenClaw sessions"
info "Imports any new session transcripts since the last ingestion."

openclaw_sessions_dir="$HOME/.openclaw/agents/main/sessions"
if [ -d "$openclaw_sessions_dir" ]; then
  if ask_skip "Import new OpenClaw sessions?"; then
    run_cmd pnpm run ingest:openclaw
    ok "Sessions imported."
  else
    ok "Skipped session ingestion."
  fi
else
  warn "No OpenClaw sessions directory found — skipping."
fi

printf "\n"

# ── Step 6: Ingest cron workflows ─────────────────────────────────
step "Re-ingest cron workflows"
info "Imports any new cron job run history."

openclaw_cron_dir="$HOME/.openclaw/cron"
if [ -d "$openclaw_cron_dir" ]; then
  if ask_skip "Import new cron workflows?"; then
    run_cmd pnpm run ingest:cron
    ok "Cron workflows imported."
  else
    ok "Skipped cron ingestion."
  fi
else
  warn "No OpenClaw cron directory found — skipping."
fi

printf "\n"

# ── Step 7: Rebuild semantic index ────────────────────────────────
step "Rebuild semantic index"
info "Re-chunks traces and artifacts for similarity search."

if ask_skip "Rebuild the semantic index?"; then
  run_cmd pnpm run index:semantic
  ok "Semantic index rebuilt."
else
  ok "Skipped semantic indexing."
fi

printf "\n"

# ── Step 8: Type check ────────────────────────────────────────────
step "Type check"
info "Runs 'tsc --noEmit' to verify TypeScript compiles cleanly."

if ask_skip "Run type check?"; then
  if run_cmd pnpm run typecheck; then
    ok "Type check passed."
  else
    warn "Type check reported errors."
  fi
else
  ok "Skipped type check."
fi

# ── Done ───────────────────────────────────────────────────────────
printf "\n"
banner "Update complete"

printf "${DIM}Start the dev server with:${RESET}  ${BOLD}pnpm dev${RESET}\n\n"
