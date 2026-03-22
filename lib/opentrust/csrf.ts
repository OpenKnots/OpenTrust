import { headers } from "next/headers";

function normalizeHost(value: string | null | undefined) {
  return value?.split(",")[0]?.trim().toLowerCase() ?? null;
}

export async function verifySameOriginRequest() {
  const h = await headers();
  const origin = h.get("origin");
  const referer = h.get("referer");
  const host = normalizeHost(h.get("x-forwarded-host") ?? h.get("host"));

  const source = origin ?? referer;
  if (!source || !host) {
    return { ok: false as const, reason: "missing_origin" };
  }

  try {
    const url = new URL(source);
    const sourceHost = normalizeHost(url.host);
    if (!sourceHost || sourceHost !== host) {
      return { ok: false as const, reason: "origin_mismatch" };
    }
    return { ok: true as const };
  } catch {
    return { ok: false as const, reason: "invalid_origin" };
  }
}
