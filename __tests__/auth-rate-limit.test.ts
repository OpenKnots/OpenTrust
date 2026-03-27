import { describe, it, expect, beforeEach } from "vitest";
import {
  getLoginRateLimit,
  recordLoginFailure,
  clearLoginFailures,
  getRateLimitKey,
} from "@/lib/opentrust/auth-rate-limit";

describe("getRateLimitKey", () => {
  it("returns the IP when provided", () => {
    expect(getRateLimitKey("192.168.1.1")).toBe("192.168.1.1");
  });

  it("trims whitespace", () => {
    expect(getRateLimitKey("  10.0.0.1  ")).toBe("10.0.0.1");
  });

  it('returns "unknown" for null/undefined/empty', () => {
    expect(getRateLimitKey(null)).toBe("unknown");
    expect(getRateLimitKey(undefined)).toBe("unknown");
    expect(getRateLimitKey("")).toBe("unknown");
  });
});

describe("getLoginRateLimit", () => {
  beforeEach(() => {
    clearLoginFailures("test-ip-limit");
  });

  it("starts with 5 remaining attempts", () => {
    const state = getLoginRateLimit("test-ip-limit");
    expect(state.remaining).toBe(5);
    expect(state.count).toBe(0);
  });

  it("returns a future resetAt timestamp", () => {
    const state = getLoginRateLimit("test-ip-limit");
    expect(state.resetAt).toBeGreaterThan(Date.now());
  });
});

describe("recordLoginFailure", () => {
  beforeEach(() => {
    clearLoginFailures("test-ip-fail");
  });

  it("increments the failure count", () => {
    recordLoginFailure("test-ip-fail");
    const state = getLoginRateLimit("test-ip-fail");
    expect(state.remaining).toBe(4);
  });

  it("marks as limited after 5 failures", () => {
    for (let i = 0; i < 4; i++) {
      const result = recordLoginFailure("test-ip-fail");
      expect(result.limited).toBe(false);
    }
    const fifth = recordLoginFailure("test-ip-fail");
    expect(fifth.limited).toBe(true);
  });

  it("returns 0 remaining after limit reached", () => {
    for (let i = 0; i < 5; i++) {
      recordLoginFailure("test-ip-fail");
    }
    const state = getLoginRateLimit("test-ip-fail");
    expect(state.remaining).toBe(0);
  });
});

describe("clearLoginFailures", () => {
  it("resets the failure count", () => {
    recordLoginFailure("test-ip-clear");
    recordLoginFailure("test-ip-clear");
    clearLoginFailures("test-ip-clear");

    const state = getLoginRateLimit("test-ip-clear");
    expect(state.remaining).toBe(5);
  });
});
