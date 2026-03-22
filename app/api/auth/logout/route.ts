import { NextResponse } from "next/server";
import { writeAuthAudit } from "@/lib/opentrust/auth-audit";
import { verifySameOriginRequest } from "@/lib/opentrust/csrf";
import { getRequestMeta, OPENTRUST_AUTH_COOKIE } from "@/lib/opentrust/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const meta = await getRequestMeta();
  const csrf = await verifySameOriginRequest();
  if (!csrf.ok) {
    writeAuthAudit({
      action: "logout",
      ip: meta.ip,
      userAgent: meta.userAgent,
      detail: `csrf_${csrf.reason}`,
    });
    return NextResponse.json({ ok: false, error: "Invalid request origin" }, { status: 403 });
  }

  writeAuthAudit({
    action: "logout",
    ip: meta.ip,
    userAgent: meta.userAgent,
    detail: null,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(OPENTRUST_AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
  return response;
}
