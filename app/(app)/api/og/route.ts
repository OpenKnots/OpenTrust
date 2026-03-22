import { NextRequest, NextResponse } from "next/server";

export interface OgData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  domain: string;
}

const TIMEOUT_MS = 5_000;

function extractMeta(html: string, property: string): string | undefined {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1]);
  }
  return undefined;
}

function extractTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1] ? decodeEntities(m[1].trim()) : undefined;
}

function extractFavicon(html: string, origin: string): string | undefined {
  const m = html.match(
    /<link[^>]+rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]+href=["']([^"']+)["']/i,
  );
  if (!m?.[1]) return `${origin}/favicon.ico`;
  const href = m[1];
  if (href.startsWith("http")) return href;
  if (href.startsWith("//")) return `https:${href}`;
  return `${origin}${href.startsWith("/") ? "" : "/"}${href}`;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCharCode(parseInt(h, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function resolveUrl(src: string | undefined, origin: string): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http")) return src;
  if (src.startsWith("//")) return `https:${src}`;
  return `${origin}${src.startsWith("/") ? "" : "/"}${src}`;
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing ?url= parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const domain = parsed.hostname.replace(/^www\./, "");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(parsed.href, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OpenTrustBot/1.0; +https://github.com/OpenKnots/OpenTrust)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    clearTimeout(timer);

    if (!res.ok) {
      return NextResponse.json(
        { url: parsed.href, domain } satisfies OgData,
        {
          status: 200,
          headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
        },
      );
    }

    const html = await res.text();
    const origin = parsed.origin;

    const ogImage = extractMeta(html, "og:image") ?? extractMeta(html, "twitter:image");

    const data: OgData = {
      url: parsed.href,
      title:
        extractMeta(html, "og:title") ??
        extractMeta(html, "twitter:title") ??
        extractTitle(html),
      description:
        extractMeta(html, "og:description") ??
        extractMeta(html, "twitter:description") ??
        extractMeta(html, "description"),
      image: resolveUrl(ogImage, origin),
      siteName: extractMeta(html, "og:site_name"),
      favicon: extractFavicon(html, origin),
      domain,
    };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    });
  } catch {
    return NextResponse.json(
      { url: parsed.href, domain } satisfies OgData,
      {
        status: 200,
        headers: { "Cache-Control": "public, max-age=600" },
      },
    );
  }
}
