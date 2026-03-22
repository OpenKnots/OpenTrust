"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Globe } from "lucide-react";
import type { OgData } from "@/app/(app)/api/og/route";

interface UrlPreviewProps {
  url: string;
  className?: string;
  compact?: boolean;
}

type Status = "loading" | "loaded" | "error";

const cache = new Map<string, OgData>();

export function UrlPreview({ url, className, compact = false }: UrlPreviewProps) {
  const [data, setData] = useState<OgData | null>(() => cache.get(url) ?? null);
  const [status, setStatus] = useState<Status>(() =>
    cache.has(url) ? "loaded" : "loading",
  );
  const [imgError, setImgError] = useState(false);

  const domain = getDomain(url);

  const fetchOg = useCallback(async () => {
    if (cache.has(url)) {
      setData(cache.get(url)!);
      setStatus("loaded");
      return;
    }

    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("fetch failed");
      const og: OgData = await res.json();
      cache.set(url, og);
      setData(og);
      setStatus("loaded");
    } catch {
      setData(null);
      setStatus("error");
    }
  }, [url]);

  useEffect(() => {
    if (status === "loading") fetchOg();
  }, [status, fetchOg]);

  const hasRichData = data && (data.title || data.description || data.image);
  const showImage = data?.image && !imgError;

  if (status === "loading") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`url-preview url-preview--skeleton ${className ?? ""}`.trim()}
      >
        <div className="url-preview__skeleton-bar url-preview__skeleton-bar--wide" />
        <div className="url-preview__skeleton-bar url-preview__skeleton-bar--medium" />
        <div className="url-preview__skeleton-bar url-preview__skeleton-bar--narrow" />
      </a>
    );
  }

  if (status === "error" || !hasRichData) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`url-preview url-preview--default ${className ?? ""}`.trim()}
      >
        <div className="url-preview__default-icon">
          {data?.favicon ? (
            <img
              src={data.favicon}
              alt=""
              className="url-preview__favicon"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove(
                  "url-preview__globe--hidden",
                );
              }}
            />
          ) : null}
          <Globe className={`url-preview__globe${data?.favicon ? " url-preview__globe--hidden" : ""}`} />
        </div>
        <div className="url-preview__default-body">
          <span className="url-preview__domain">{domain}</span>
          <span className="url-preview__url-hint">{truncateUrl(url)}</span>
        </div>
        <ExternalLink className="url-preview__external" />
      </a>
    );
  }

  if (compact) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`url-preview url-preview--compact ${className ?? ""}`.trim()}
      >
        {showImage && (
          <img
            src={data.image!}
            alt=""
            className="url-preview__compact-image"
            onError={() => setImgError(true)}
          />
        )}
        <div className="url-preview__compact-body">
          <span className="url-preview__compact-title">
            {data.title ?? domain}
          </span>
          <span className="url-preview__compact-domain">{domain}</span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`url-preview url-preview--rich ${className ?? ""}`.trim()}
    >
      {showImage && (
        <div className="url-preview__image-wrap">
          <img
            src={data.image!}
            alt={data.title ?? ""}
            className="url-preview__image"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      <div className="url-preview__body">
        <div className="url-preview__header">
          {data.favicon && (
            <img src={data.favicon} alt="" className="url-preview__favicon" />
          )}
          <span className="url-preview__site-name">
            {data.siteName ?? domain}
          </span>
          <ExternalLink className="url-preview__external" />
        </div>
        {data.title && (
          <h4 className="url-preview__title">{data.title}</h4>
        )}
        {data.description && (
          <p className="url-preview__description">{data.description}</p>
        )}
      </div>
    </a>
  );
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function truncateUrl(url: string, max = 60): string {
  try {
    const u = new URL(url);
    const path = u.pathname + u.search;
    const full = u.hostname + path;
    return full.length > max ? full.slice(0, max) + "..." : full;
  } catch {
    return url.length > max ? url.slice(0, max) + "..." : url;
  }
}
