#!/usr/bin/env bash
# Shared helpers for OpenTrust operator scripts.
# Source this file; do not execute directly.

# ── Colors ─────────────────────────────────────────────────────────
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'

# ── Output helpers ─────────────────────────────────────────────────
_ot_step_num=0

banner() {
  printf "\n${BOLD}${BLUE}%s${RESET}\n" "─────────────────────────────────────────────"
  printf "${BOLD}${BLUE}  %s${RESET}\n" "$1"
  printf "${BOLD}${BLUE}%s${RESET}\n\n" "─────────────────────────────────────────────"
}

step() {
  _ot_step_num=$((_ot_step_num + 1))
  printf "${BOLD}${CYAN}[%d] %s${RESET}\n" "$_ot_step_num" "$1"
}

info() {
  printf "    ${DIM}%s${RESET}\n" "$1"
}

ok() {
  printf "    ${GREEN}✓ %s${RESET}\n" "$1"
}

warn() {
  printf "    ${YELLOW}⚠ %s${RESET}\n" "$1"
}

fail() {
  printf "    ${RED}✗ %s${RESET}\n" "$1"
}

ask_continue() {
  local prompt="${1:-Continue?}"
  printf "\n    ${BOLD}%s${RESET} ${DIM}[Y/n]${RESET} " "$prompt"
  read -r answer </dev/tty
  case "$answer" in
    [nN]*) return 1 ;;
    *) return 0 ;;
  esac
}

ask_skip() {
  local prompt="${1:-Run this step?}"
  printf "\n    ${BOLD}%s${RESET} ${DIM}[Y/n]${RESET} " "$prompt"
  read -r answer </dev/tty
  case "$answer" in
    [nN]*) return 1 ;;
    *) return 0 ;;
  esac
}

run_cmd() {
  printf "    ${DIM}\$ %s${RESET}\n" "$*"
  "$@" 2>&1 | sed 's/^/    /'
  local code=${PIPESTATUS[0]}
  if [ "$code" -ne 0 ]; then
    fail "Command exited with code $code"
    return "$code"
  fi
}

# ── Repo root ──────────────────────────────────────────────────────
# Resolve repo root relative to the calling script's location.
# BASH_SOURCE[0] is _lib.sh itself; the caller is BASH_SOURCE[1].
_OT_LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$_OT_LIB_DIR/.." && pwd)"
cd "$REPO_ROOT"

# ── Env helpers ────────────────────────────────────────────────────
env_val() {
  if [ -f "$REPO_ROOT/.env" ]; then
    grep -E "^${1}=" "$REPO_ROOT/.env" 2>/dev/null | head -1 | cut -d= -f2-
  fi
}

require_db() {
  if [ ! -f "$REPO_ROOT/storage/opentrust.sqlite" ]; then
    fail "Database not found at storage/opentrust.sqlite"
    info "Run ./scripts/setup.sh or pnpm run db:init first."
    return 1
  fi
}
