#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_lib.sh"

banner "OpenTrust — Security Hardening"

printf "${DIM}Walks through your security configuration and flags${RESET}\n"
printf "${DIM}anything that should be tightened before shared or${RESET}\n"
printf "${DIM}remote deployment. See SECURITY.md for full guidance.${RESET}\n"
printf "${DIM}Working directory: %s${RESET}\n" "$REPO_ROOT"

pass_count=0
warn_count=0
fail_count=0

record_pass() { pass_count=$((pass_count + 1)); }
record_warn() { warn_count=$((warn_count + 1)); }
record_fail() { fail_count=$((fail_count + 1)); }

# ── Step 1: .env existence ─────────────────────────────────────────
step "Environment file"

if [ -f ".env" ]; then
  ok ".env file exists."
  record_pass
else
  fail ".env file not found."
  info "Copy .env.example to .env and configure auth variables."
  record_fail
fi

printf "\n"

# ── Step 2: Auth mode ──────────────────────────────────────────────
step "Authentication mode"
info "OPENTRUST_AUTH_MODE controls how the app authenticates users."

auth_mode="$(env_val OPENTRUST_AUTH_MODE)"
auth_mode="${auth_mode:-token}"

case "$auth_mode" in
  password)
    ok "Auth mode: password (recommended for shared access)."
    record_pass
    ;;
  token)
    warn "Auth mode: token — adequate for local use."
    info "For shared or remote access, consider switching to 'password'."
    record_warn
    ;;
  none)
    fail "Auth mode: none — authentication is disabled."
    info "Set OPENTRUST_AUTH_MODE=password in .env for any non-isolated use."
    record_fail
    if ask_skip "Set OPENTRUST_AUTH_MODE=password now?"; then
      if [ -f ".env" ]; then
        if grep -q '^OPENTRUST_AUTH_MODE=' .env; then
          sed -i.bak 's/^OPENTRUST_AUTH_MODE=.*/OPENTRUST_AUTH_MODE=password/' .env && rm -f .env.bak
        else
          echo "OPENTRUST_AUTH_MODE=password" >> .env
        fi
        ok "Set OPENTRUST_AUTH_MODE=password in .env"
      fi
    fi
    ;;
  *)
    warn "Auth mode: '$auth_mode' — unrecognized, will default to 'token'."
    record_warn
    ;;
esac

printf "\n"

# ── Step 3: Localhost bypass ───────────────────────────────────────
step "Localhost bypass"
info "OPENTRUST_ALLOW_LOCALHOST_BYPASS lets unauthenticated access"
info "from localhost / 127.0.0.1 / ::1."

bypass="$(env_val OPENTRUST_ALLOW_LOCALHOST_BYPASS)"
bypass="${bypass:-true}"

if [ "$bypass" = "false" ]; then
  ok "Localhost bypass is disabled — strict auth everywhere."
  record_pass
else
  warn "Localhost bypass is enabled (default)."
  info "For production or shared deployments, set"
  info "OPENTRUST_ALLOW_LOCALHOST_BYPASS=false in .env."
  record_warn
  if ask_skip "Disable localhost bypass now?"; then
    if [ -f ".env" ]; then
      if grep -q '^OPENTRUST_ALLOW_LOCALHOST_BYPASS=' .env; then
        sed -i.bak 's/^OPENTRUST_ALLOW_LOCALHOST_BYPASS=.*/OPENTRUST_ALLOW_LOCALHOST_BYPASS=false/' .env && rm -f .env.bak
      else
        echo "OPENTRUST_ALLOW_LOCALHOST_BYPASS=false" >> .env
      fi
      ok "Set OPENTRUST_ALLOW_LOCALHOST_BYPASS=false in .env"
    fi
  fi
fi

printf "\n"

# ── Step 4: Credential presence ────────────────────────────────────
step "Credential configuration"
info "Checks that the required credential is set for the current auth mode."

auth_mode="$(env_val OPENTRUST_AUTH_MODE)"
auth_mode="${auth_mode:-token}"

if [ "$auth_mode" = "none" ]; then
  info "Auth mode is 'none' — no credential needed."
  record_pass
elif [ "$auth_mode" = "token" ]; then
  token_val="$(env_val OPENTRUST_AUTH_TOKEN)"
  if [ -n "$token_val" ]; then
    ok "OPENTRUST_AUTH_TOKEN is set."
    record_pass
  else
    warn "OPENTRUST_AUTH_TOKEN is empty."
    info "Set a strong token in .env for token-mode auth."
    info "Without it, localhost bypass is the only way to authenticate."
    record_warn
  fi
elif [ "$auth_mode" = "password" ]; then
  pass_val="$(env_val OPENTRUST_AUTH_PASSWORD)"
  if [ -n "$pass_val" ]; then
    ok "OPENTRUST_AUTH_PASSWORD is set."
    record_pass
  else
    fail "OPENTRUST_AUTH_PASSWORD is empty."
    info "Password mode requires a password in .env."
    record_fail
  fi
fi

printf "\n"

# ── Step 5: Husky pre-commit hook ──────────────────────────────────
step "Pre-commit hook"
info "Husky runs Secretlint on every commit to catch leaked secrets."

if [ -f ".husky/pre-commit" ]; then
  ok "Husky pre-commit hook is installed."
  record_pass
else
  warn "Husky pre-commit hook not found."
  info "Run 'pnpm install' to install hooks via the 'prepare' script."
  record_warn
fi

printf "\n"

# ── Step 6: Secrets scan ──────────────────────────────────────────
step "Secrets scan"
info "Runs Secretlint across the repo to detect committed secrets."

if ask_skip "Run secrets scan now?"; then
  if run_cmd pnpm run secrets:check; then
    ok "No secrets detected."
    record_pass
  else
    fail "Secretlint reported findings — review the output above."
    record_fail
  fi
else
  ok "Skipped secrets scan."
fi

printf "\n"

# ── Step 7: Gitignore coverage ─────────────────────────────────────
step "Gitignore coverage"
info "Verifies that sensitive paths are excluded from git."

gitignore_ok=true

check_gitignore() {
  if grep -qF "$1" .gitignore 2>/dev/null; then
    ok "Covered: $1"
  else
    warn "Missing from .gitignore: $1"
    gitignore_ok=false
  fi
}

check_gitignore ".env"
check_gitignore ".env.local"
check_gitignore "storage/*.sqlite"

if [ "$gitignore_ok" = true ]; then
  record_pass
else
  record_warn
fi

printf "\n"

# ── Step 8: File permissions ───────────────────────────────────────
step "File permissions"
info "Checks that storage and env files are not world-readable."

perms_ok=true

check_perms() {
  if [ ! -e "$1" ]; then return; fi
  local mode
  mode=$(stat -f '%Lp' "$1" 2>/dev/null || stat -c '%a' "$1" 2>/dev/null || echo "")
  if [ -z "$mode" ]; then
    warn "Could not read permissions for $1"
    perms_ok=false
    return
  fi
  local other="${mode: -1}"
  if [ "$other" -ge 4 ] 2>/dev/null; then
    warn "$1 is world-readable (mode $mode)"
    info "Consider: chmod 600 $1"
    perms_ok=false
  else
    ok "$1 (mode $mode)"
  fi
}

check_perms ".env"
check_perms "storage/opentrust.sqlite"
check_perms "storage/audit/auth.log"

if [ "$perms_ok" = true ]; then
  record_pass
else
  record_warn
fi

printf "\n"

# ── Step 9: Audit log review ──────────────────────────────────────
step "Audit log review"
info "Shows recent entries from storage/audit/auth.log."

audit_log="storage/audit/auth.log"

if [ -f "$audit_log" ]; then
  total_lines=$(wc -l < "$audit_log" | tr -d ' ')
  failures=$(grep -c '"login_failure"' "$audit_log" 2>/dev/null || echo 0)
  successes=$(grep -c '"login_success"' "$audit_log" 2>/dev/null || echo 0)

  info "Total entries: $total_lines"
  info "Login successes: $successes"
  info "Login failures: $failures"

  if [ "$failures" -gt 0 ]; then
    warn "$failures login failure(s) recorded."
    info "Last 5 entries:"
    tail -5 "$audit_log" | while IFS= read -r line; do
      info "  $line"
    done
    record_warn
  else
    ok "No login failures recorded."
    record_pass
  fi
else
  info "No audit log found (storage/audit/auth.log)."
  info "This is normal if no login attempts have been made."
  record_pass
fi

# ── Summary ────────────────────────────────────────────────────────
printf "\n"
banner "Security Posture Summary"

printf "    ${GREEN}✓ %d passed${RESET}\n" "$pass_count"
if [ "$warn_count" -gt 0 ]; then
  printf "    ${YELLOW}⚠ %d warning(s)${RESET}\n" "$warn_count"
fi
if [ "$fail_count" -gt 0 ]; then
  printf "    ${RED}✗ %d failed${RESET}\n" "$fail_count"
fi

if [ "$fail_count" -gt 0 ]; then
  printf "\n${DIM}Address the failures above before shared or remote deployment.${RESET}\n"
elif [ "$warn_count" -gt 0 ]; then
  printf "\n${DIM}Review the warnings above. See SECURITY.md for guidance.${RESET}\n"
else
  printf "\n${DIM}All checks passed. Your configuration looks good.${RESET}\n"
fi

printf "\n"
