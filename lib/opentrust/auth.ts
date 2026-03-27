import { createHash, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export const OPENTRUST_AUTH_COOKIE = "opentrust.auth";

export type OpenTrustAuthMode = "none" | "token" | "password";

export interface OpenTrustAuthConfig {
  mode: OpenTrustAuthMode;
  token?: string;
  password?: string;
  allowLocalhostBypass: boolean;
}

function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** Read auth configuration from environment variables. */
export function getOpenTrustAuthConfig(): OpenTrustAuthConfig {
  const mode = (process.env.OPENTRUST_AUTH_MODE ?? "token") as OpenTrustAuthMode;
  const allowLocalhostBypass = process.env.OPENTRUST_ALLOW_LOCALHOST_BYPASS !== "false";

  return {
    mode: mode === "none" || mode === "password" || mode === "token" ? mode : "token",
    token: process.env.OPENTRUST_AUTH_TOKEN,
    password: process.env.OPENTRUST_AUTH_PASSWORD,
    allowLocalhostBypass,
  };
}

/** Check whether a hostname resolves to a loopback address (localhost/127.0.0.1/::1). */
export function isLoopbackHost(hostname: string | null | undefined) {
  if (!hostname) return false;
  const value = hostname.split(":")[0]?.toLowerCase() ?? "";
  return value === "localhost" || value === "127.0.0.1" || value === "::1";
}

/** Derive a session cookie value by hashing the configured secret. */
export function createSessionValue(config: OpenTrustAuthConfig) {
  const secret = config.mode === "password" ? config.password : config.token;
  if (!secret) return null;
  return sha256(`opentrust:${config.mode}:${secret}`);
}

/** Verify a credential (token or password) against the auth config using timing-safe comparison. */
export function verifyCredential(input: string, config: OpenTrustAuthConfig) {
  if (config.mode === "none") return true;
  const expected = config.mode === "password" ? config.password : config.token;
  if (!expected) return false;
  return safeEqual(input, expected);
}

/** Extract host, IP, and user-agent from the incoming request headers. */
export async function getRequestMeta() {
  const store = await headers();
  const forwardedHost = store.get("x-forwarded-host");
  const host = forwardedHost ?? store.get("host");
  const forwardedFor = store.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? null;
  const userAgent = store.get("user-agent");

  return {
    host: host?.split(",")[0]?.trim() ?? null,
    ip,
    userAgent,
  };
}

/** Return the hostname from the current request (respects x-forwarded-host). */
export async function getRequestHostname() {
  return (await getRequestMeta()).host;
}

/** Check whether the current request is authenticated via cookie or localhost bypass. */
export async function isAuthenticatedRequest() {
  const config = getOpenTrustAuthConfig();
  if (config.mode === "none") return true;

  const hostname = await getRequestHostname();
  if (config.allowLocalhostBypass && isLoopbackHost(hostname)) {
    return true;
  }

  const sessionValue = createSessionValue(config);
  if (!sessionValue) return false;

  const cookieStore = await cookies();
  const existing = cookieStore.get(OPENTRUST_AUTH_COOKIE)?.value;
  return !!existing && safeEqual(existing, sessionValue);
}

/** Guard for API routes. Returns a 401 response if unauthenticated, or null if OK. */
export async function requireApiAuth() {
  const ok = await isAuthenticatedRequest();
  return ok ? null : NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}
