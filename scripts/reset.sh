#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_lib.sh"

banner "OpenTrust — Reset"

printf "${RED}${BOLD}  ⚠  THIS SCRIPT DELETES LOCAL DATA  ⚠${RESET}\n\n"
printf "${DIM}Removes the SQLite database and optionally other local state${RESET}\n"
printf "${DIM}so you can start fresh with ./scripts/setup.sh.${RESET}\n"
printf "${DIM}Working directory: %s${RESET}\n\n" "$REPO_ROOT"

# ── Require explicit confirmation ──────────────────────────────────
printf "    ${BOLD}${RED}Type 'yes' to proceed:${RESET} "
read -r confirm </dev/tty
if [ "$confirm" != "yes" ]; then
  info "Aborted. Nothing was deleted."
  exit 0
fi

printf "\n"

# ── Step 1: Remove database ────────────────────────────────────────
step "Remove database"

db_file="storage/opentrust.sqlite"
removed=0

for f in "$db_file" "${db_file}-wal" "${db_file}-shm"; do
  if [ -f "$f" ]; then
    rm -f "$f"
    ok "Removed $f"
    removed=$((removed + 1))
  fi
done

if [ "$removed" -eq 0 ]; then
  info "No database files found — already clean."
fi

printf "\n"

# ── Step 2: Audit log ─────────────────────────────────────────────
step "Audit log"

audit_log="storage/audit/auth.log"

if [ -f "$audit_log" ]; then
  info "The audit log records login successes and failures."
  if ask_skip "Remove $audit_log?"; then
    rm -f "$audit_log"
    ok "Removed $audit_log"
  else
    ok "Kept $audit_log"
  fi
else
  info "No audit log found."
fi

printf "\n"

# ── Step 3: node_modules ──────────────────────────────────────────
step "Dependencies (node_modules)"

if [ -d "node_modules" ]; then
  info "Removing node_modules/ forces a full reinstall next time."
  if ask_skip "Remove node_modules/?"; then
    rm -rf node_modules
    ok "Removed node_modules/"
  else
    ok "Kept node_modules/"
  fi
else
  info "node_modules/ not present."
fi

printf "\n"

# ── Step 4: .env ───────────────────────────────────────────────────
step "Environment file (.env)"

if [ -f ".env" ]; then
  info "Removing .env means you'll need to reconfigure auth settings."
  if ask_skip "Remove .env?"; then
    rm -f .env
    ok "Removed .env"
  else
    ok "Kept .env"
  fi
else
  info ".env not present."
fi

# ── Done ───────────────────────────────────────────────────────────
printf "\n"
banner "Reset complete"

printf "${DIM}To set up again, run:${RESET}\n\n"
printf "  ${BOLD}./scripts/setup.sh${RESET}\n\n"
