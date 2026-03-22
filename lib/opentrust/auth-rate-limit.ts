const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const entries = new Map<string, { count: number; resetAt: number }>();

function now() {
  return Date.now();
}

export function getRateLimitKey(ip: string | null | undefined) {
  return ip?.trim() || "unknown";
}

export function getLoginRateLimit(ip: string | null | undefined) {
  const key = getRateLimitKey(ip);
  const current = entries.get(key);
  const currentNow = now();

  if (!current || current.resetAt <= currentNow) {
    const fresh = { count: 0, resetAt: currentNow + WINDOW_MS };
    entries.set(key, fresh);
    return { key, ...fresh, remaining: MAX_ATTEMPTS };
  }

  return {
    key,
    ...current,
    remaining: Math.max(0, MAX_ATTEMPTS - current.count),
  };
}

export function recordLoginFailure(ip: string | null | undefined) {
  const state = getLoginRateLimit(ip);
  const next = { count: state.count + 1, resetAt: state.resetAt };
  entries.set(state.key, next);
  return {
    ...next,
    limited: next.count >= MAX_ATTEMPTS,
    retryAfterMs: Math.max(0, next.resetAt - now()),
  };
}

export function clearLoginFailures(ip: string | null | undefined) {
  entries.delete(getRateLimitKey(ip));
}
