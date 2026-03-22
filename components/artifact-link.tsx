"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Globe } from "lucide-react";
import {
  PreviewLinkCard,
  PreviewLinkCardTrigger,
  PreviewLinkCardContent,
} from "@/components/animate-ui/components/radix/preview-link-card";
import type { OgData } from "@/app/(app)/api/og/route";

interface ArtifactLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const ogCache = new Map<string, OgData>();

function OgContent({ url }: { url: string }) {
  const [data, setData] = useState<OgData | null>(
    () => ogCache.get(url) ?? null,
  );
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(() =>
    ogCache.has(url) ? "loaded" : "loading",
  );
  const [imgError, setImgError] = useState(false);

  const domain = domainOf(url);

  const fetchOg = useCallback(async () => {
    if (ogCache.has(url)) {
      setData(ogCache.get(url)!);
      setStatus("loaded");
      return;
    }
    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("fetch failed");
      const og: OgData = await res.json();
      ogCache.set(url, og);
      setData(og);
      setStatus("loaded");
    } catch {
      setStatus("error");
    }
  }, [url]);

  useEffect(() => {
    if (status === "loading") fetchOg();
  }, [status, fetchOg]);

  if (status === "loading") {
    return (
      <div className="link-hover__skeleton">
        <div className="link-hover__skeleton-bar link-hover__skeleton-bar--wide" />
        <div className="link-hover__skeleton-bar link-hover__skeleton-bar--narrow" />
      </div>
    );
  }

  const hasRich = data && (data.title || data.description || data.image);

  if (status === "error" || !hasRich) {
    return (
      <div className="link-hover__fallback">
        <Globe className="link-hover__globe" />
        <div className="link-hover__fallback-body">
          <span className="link-hover__domain">{domain}</span>
          <span className="link-hover__url">{truncUrl(url)}</span>
        </div>
        <ExternalLink className="link-hover__ext" />
      </div>
    );
  }

  const showImage = data.image && !imgError;

  return (
    <div className="link-hover__rich">
      {showImage && (
        <div className="link-hover__image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.image!}
            alt=""
            className="link-hover__image"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      <div className="link-hover__body">
        <div className="link-hover__header">
          {data.favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.favicon}
              alt=""
              className="link-hover__favicon"
            />
          )}
          <span className="link-hover__site">{data.siteName ?? domain}</span>
          <ExternalLink className="link-hover__ext" />
        </div>
        {data.title && (
          <span className="link-hover__title">{data.title}</span>
        )}
        {data.description && (
          <span className="link-hover__desc">{data.description}</span>
        )}
      </div>
    </div>
  );
}

export function ArtifactLink({ href, children, className }: ArtifactLinkProps) {
  const isUrl = /^https?:\/\//.test(href);

  if (!isUrl) {
    return <span className={className}>{children}</span>;
  }

  return (
    <PreviewLinkCard href={href}>
      <PreviewLinkCardTrigger
        className={`artifact-link ${className ?? ""}`.trim()}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </PreviewLinkCardTrigger>
      <PreviewLinkCardContent
        side="top"
        sideOffset={8}
        className="link-hover"
      >
        <OgContent url={href} />
      </PreviewLinkCardContent>
    </PreviewLinkCard>
  );
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function truncUrl(url: string, max = 55): string {
  try {
    const u = new URL(url);
    const full = u.hostname + u.pathname + u.search;
    return full.length > max ? full.slice(0, max) + "\u2026" : full;
  } catch {
    return url.length > max ? url.slice(0, max) + "\u2026" : url;
  }
}
