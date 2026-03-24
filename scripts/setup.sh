#!/usr/bin/env bash
set -euo pipefail

# ── Load shared helpers ────────────────────────────────────────────
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_lib.sh"

# ── Welcome ─────────────────────────────────────────────────────────
banner "OpenTrust — Interactive Setup"

printf "${DIM}This script walks you through the full setup of OpenTrust,${RESET}\n"
printf "${DIM}the local-first memory layer for OpenClaw.${RESET}\n\n"
printf "${DIM}Each step explains what it does and asks before proceeding.${RESET}\n"
printf "${DIM}Working directory: %s${RESET}\n" "$REPO_ROOT"

# ── Step 1: Prerequisites ──────────────────────────────────────────
step "Checking prerequisites"

# Node.js
if command -v node &>/dev/null; then
  node_version=$(node --version)
  ok "Node.js found: $node_version"
  node_major=$(echo "$node_version" | sed 's/v//' | cut -d. -f1)
  if [ "$node_major" -lt 18 ]; then
    warn "Node.js 18+ recommended. You have $node_version."
  fi
else
  fail "Node.js not found. Install Node.js 18+ and re-run this script."
  exit 1
fi

# pnpm
if command -v pnpm &>/dev/null; then
  pnpm_version=$(pnpm --version)
  ok "pnpm found: v$pnpm_version"
else
  fail "pnpm not found."
  info "Install it with:  npm install -g pnpm"
  info "Or see:           https://pnpm.io/installation"
  exit 1
fi

# git
if command -v git &>/dev/null; then
  ok "git found: $(git --version | head -1)"
else
  warn "git not found. Husky pre-commit hooks won't work."
fi

printf "\n"

# ── Step 2: Install dependencies ───────────────────────────────────
step "Install dependencies"
info "Runs 'pnpm install' to fetch all Node packages."
info "This also triggers the 'prepare' script which sets up Husky"
info "pre-commit hooks for secret scanning."

if [ -d "node_modules" ]; then
  info "node_modules/ already exists."
  if ask_skip "Re-install dependencies?"; then
    run_cmd pnpm install
    ok "Dependencies installed."
  else
    ok "Skipped — using existing node_modules."
  fi
else
  if ask_continue "Install dependencies now?"; then
    run_cmd pnpm install
    ok "Dependencies installed."
  else
    fail "Cannot continue without dependencies. Exiting."
    exit 1
  fi
fi

printf "\n"

# ── Step 3: Environment variables ──────────────────────────────────
step "Environment configuration"
info "OpenTrust uses a single optional env var:"
info ""
info "  OPENTRUST_SQLITE_VEC_PATH"
info "    Override path to the sqlite-vec extension."
info "    Leave unset unless auto-detection fails."
info ""

if [ -f ".env" ]; then
  ok ".env file already exists."
  if ask_skip "Overwrite .env from .env.example?"; then
    cp .env.example .env
    ok "Copied .env.example → .env"
  else
    ok "Kept existing .env."
  fi
else
  info "No .env file found. Copying from .env.example."
  cp .env.example .env
  ok "Created .env from .env.example"
fi

printf "\n"

# ── Step 4: Initialize the database ────────────────────────────────
step "Initialize the database"
info "Creates the SQLite database at storage/opentrust.sqlite"
info "and runs all schema migrations (tables, indexes, FTS)."
info ""
info "This is idempotent — safe to run multiple times."

if [ -f "storage/opentrust.sqlite" ]; then
  warn "Database already exists at storage/opentrust.sqlite"
  if ask_skip "Re-run migrations anyway?"; then
    run_cmd pnpm run db:init
    ok "Database migrations applied."
  else
    ok "Skipped — database already initialized."
  fi
else
  if ask_continue "Initialize the database now?"; then
    run_cmd pnpm run db:init
    ok "Database initialized."
  else
    warn "Skipped database init. Later steps may fail without it."
  fi
fi

printf "\n"

# ── Step 5: Ingest OpenClaw sessions ───────────────────────────────
step "Ingest OpenClaw sessions"
info "Imports recent session transcripts from:"
info "  ~/.openclaw/agents/main/sessions/"
info ""
info "This reads session JSONL files, extracts events, tool calls,"
info "and lineage edges, then populates the evidence store."
info ""

openclaw_sessions_dir="$HOME/.openclaw/agents/main/sessions"
if [ -d "$openclaw_sessions_dir" ]; then
  ok "OpenClaw sessions directory found."
  if ask_skip "Import OpenClaw sessions now?"; then
    run_cmd pnpm run ingest:openclaw
    ok "OpenClaw sessions imported."
  else
    ok "Skipped session ingestion."
  fi
else
  warn "No OpenClaw sessions directory found at:"
  warn "  $openclaw_sessions_dir"
  info "This is expected if OpenClaw hasn't been used yet."
  info "You can run 'pnpm run ingest:openclaw' later."
fi

printf "\n"

# ── Step 6: Ingest cron workflows ──────────────────────────────────
step "Ingest cron/workflow runs"
info "Imports cron job definitions and run history from:"
info "  ~/.openclaw/cron/"
info ""
info "Creates workflow_runs and workflow_steps entries"
info "from each job's run log."
info ""

openclaw_cron_dir="$HOME/.openclaw/cron"
if [ -d "$openclaw_cron_dir" ]; then
  ok "OpenClaw cron directory found."
  if ask_skip "Import cron workflows now?"; then
    run_cmd pnpm run ingest:cron
    ok "Cron workflows imported."
  else
    ok "Skipped cron ingestion."
  fi
else
  warn "No OpenClaw cron directory found at:"
  warn "  $openclaw_cron_dir"
  info "This is expected if no cron jobs have been configured."
  info "You can run 'pnpm run ingest:cron' later."
fi

printf "\n"

# ── Step 7: Build semantic index ───────────────────────────────────
step "Build semantic index"
info "Chunks all ingested traces and artifacts into semantic_chunks,"
info "then (if sqlite-vec loads) builds a vector index for"
info "similarity-based retrieval."
info ""
info "This step requires the database and at least one ingestion"
info "to have completed above. If no data was ingested, this will"
info "produce 0 chunks — that's fine, you can re-run later."
info ""

if ask_skip "Build the semantic index now?"; then
  run_cmd pnpm run index:semantic
  ok "Semantic index built."
else
  ok "Skipped semantic indexing."
fi

printf "\n"

# ── Step 8: Type check ─────────────────────────────────────────────
step "Type check"
info "Runs 'tsc --noEmit' to verify all TypeScript compiles cleanly."
info "This catches type errors before you start the dev server."
info ""

if ask_skip "Run type check now?"; then
  if run_cmd pnpm run typecheck; then
    ok "Type check passed."
  else
    warn "Type check reported errors. The app may still run,"
    warn "but you should investigate before making changes."
  fi
else
  ok "Skipped type check."
fi

printf "\n"

# ── Step 9: Secrets check ──────────────────────────────────────────
step "Secrets scan"
info "Runs Secretlint across the repo to detect any accidentally"
info "committed secrets. This same check runs as a pre-commit hook."
info ""

if ask_skip "Run secrets scan now?"; then
  if run_cmd pnpm run secrets:check; then
    ok "No secrets detected."
  else
    warn "Secretlint reported findings. Review the output above."
  fi
else
  ok "Skipped secrets scan."
fi

printf "\n"

# ── Step 10: Start dev server ──────────────────────────────────────
step "Start the dev server"
info "Launches Next.js in development mode on http://localhost:3000."
info "This is the OpenTrust dashboard UI."
info ""
info "The dev server will run in the foreground. Press Ctrl+C to stop."
info ""

if ask_skip "Start the dev server now?"; then
  printf "\n"
  ok "Launching dev server..."
  printf "    ${DIM}\$ pnpm dev${RESET}\n\n"
  exec pnpm dev
else
  ok "Skipped. Start it later with: pnpm dev"
fi

# ── Done ────────────────────────────────────────────────────────────
printf "\n"
banner "Setup complete"

printf "${DIM}Quick reference:${RESET}\n\n"
printf "  ${BOLD}pnpm dev${RESET}               Start the dev server\n"
printf "  ${BOLD}pnpm run db:init${RESET}       Re-run database migrations\n"
printf "  ${BOLD}pnpm run ingest:openclaw${RESET}  Import OpenClaw sessions\n"
printf "  ${BOLD}pnpm run ingest:cron${RESET}      Import cron workflows\n"
printf "  ${BOLD}pnpm run index:semantic${RESET}   Rebuild semantic index\n"
printf "  ${BOLD}pnpm run typecheck${RESET}        Type-check the project\n"
printf "  ${BOLD}pnpm run secrets:check${RESET}    Scan for leaked secrets\n"
printf "\n"
