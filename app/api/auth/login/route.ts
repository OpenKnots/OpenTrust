import { NextResponse } from "next/server";
import { writeAuthAudit } from "@/lib/opentrust/auth-audit";
import { clearLoginFailures, getLoginRateLimit, recordLoginFailure } from "@/lib/opentrust/auth-rate-limit";
import { verifySameOriginRequest } from "@/lib/opentrust/csrf";
import {
  createSessionValue,
  getOpenTrustAuthConfig,
  getRequestHostname,
  getRequestMeta,
  isLoopbackHost,
  OPENTRUST_AUTH_COOKIE,
  verifyCredential,
} from "@/lib/opentrust/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const config = getOpenTrustAuthConfig();
  const meta = await getRequestMeta();
  const csrf = await verifySameOriginRequest();

  if (!csrf.ok) {
    writeAuthAudit({
      action: "login_failure",
      ip: meta.ip,
      userAgent: meta.userAgent,
      detail: `csrf_${csrf.reason}`,
    });
    return NextResponse.json({ ok: false, error: "Invalid request origin" }, { status: 403 });
  }

  if (config.mode === "none") {
    return NextResponse.json({ ok: true, mode: config.mode, bypass: true });
  }

  if (config.allowLocalhostBypass && isLoopbackHost(await getRequestHostname())) {
    const sessionValue = createSessionValue(config);
    if (sessionValue) {
      clearLoginFailures(meta.ip);
      writeAuthAudit({ action: "login_success", ip: meta.ip, userAgent: meta.userAgent, detail: "localhost_bypass" });
      const response = NextResponse.json({ ok: true, mode: config.mode, bypass: true });
      response.cookies.set(OPENTRUST_AUTH_COOKIE, sessionValue, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      return response;
    }
  }

  const rate = getLoginRateLimit(meta.ip);
  if (rate.remaining <= 0) {
    writeAuthAudit({
      action: "login_failure",
      ip: meta.ip,
      userAgent: meta.userAgent,
      detail: "rate_limited",
    });
    return NextResponse.json(
      { ok: false, error: "Too many failed attempts. Try again later." },
      {
        status: 429,
        headers: { "retry-after": String(Math.ceil((rate.resetAt - Date.now()) / 1000)) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    recordLoginFailure(meta.ip);
    writeAuthAudit({
      action: "login_failure",
      ip: meta.ip,
      userAgent: meta.userAgent,
      detail: "invalid_json",
    });
    return NextResponse.json({ ok: false, error: "Malformed JSON body" }, { status: 400 });
  }

  const credential = typeof (body as { credential?: unknown })?.credential === "string"
    ? (body as { credential: string }).credential
    : "";
  const rememberMe = !!(body as { rememberMe?: unknown })?.rememberMe;

  if (!credential || !verifyCredential(credential, config)) {
    const failure = recordLoginFailure(meta.ip);
    writeAuthAudit({
      action: "login_failure",
      ip: meta.ip,
      userAgent: meta.userAgent,
      detail: failure.limited ? "invalid_credentials_limit_reached" : "invalid_credentials",
    });
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  const sessionValue = createSessionValue(config);
  if (!sessionValue) {
    writeAuthAudit({
      action: "login_failure",
      ip: meta.ip,
      userAgent: meta.userAgent,
      detail: "misconfigured_auth",
    });
    return NextResponse.json({ ok: false, error: "Auth is configured incorrectly" }, { status: 500 });
  }

  clearLoginFailures(meta.ip);
  writeAuthAudit({
    action: "login_success",
    ip: meta.ip,
    userAgent: meta.userAgent,
    detail: config.mode,
  });

  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 12;

  const response = NextResponse.json({ ok: true, mode: config.mode });
  response.cookies.set(OPENTRUST_AUTH_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return response;
}
