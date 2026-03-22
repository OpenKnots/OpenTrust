"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { codeToHtml, type BundledLanguage } from "shiki";

const NEON_COLORS = [
  { bg: "rgba(0, 229, 255, 0.13)", glow: "rgba(0, 229, 255, 0.5)", border: "rgba(0, 229, 255, 0.35)" },   // cyan
  { bg: "rgba(255, 0, 255, 0.13)", glow: "rgba(255, 0, 255, 0.5)", border: "rgba(255, 0, 255, 0.35)" },   // magenta
  { bg: "rgba(57, 255, 20, 0.13)", glow: "rgba(57, 255, 20, 0.5)", border: "rgba(57, 255, 20, 0.35)" },   // green
  { bg: "rgba(255, 215, 0, 0.13)", glow: "rgba(255, 215, 0, 0.5)", border: "rgba(255, 215, 0, 0.35)" },   // gold
  { bg: "rgba(255, 69, 0, 0.13)", glow: "rgba(255, 69, 0, 0.5)", border: "rgba(255, 69, 0, 0.35)" },      // orange-red
];

interface CodeBlockProps {
  code: string;
  language?: BundledLanguage | string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "plaintext",
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [html, setHtml] = useState("");
  const [highlightedLines, setHighlightedLines] = useState<Map<number, number>>(new Map());
  useEffect(() => {
    let cancelled = false;
    codeToHtml(code.trim(), {
      lang: language as BundledLanguage,
      theme: "vitesse-dark",
    })
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        if (!cancelled) setHtml("");
      });
    return () => { cancelled = true; };
  }, [code, language]);

  const handleLineClick = useCallback((lineIndex: number) => {
    setHighlightedLines((prev) => {
      const next = new Map(prev);
      if (next.has(lineIndex)) {
        next.delete(lineIndex);
      } else {
        const colorIdx = lineIndex % NEON_COLORS.length;
        next.set(lineIndex, colorIdx);
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setHighlightedLines(new Map());
  }, []);

  const lines = code.trim().split("\n");
  const htmlLines = useMemo(() => extractLines(html), [html]);

  if (!html) {
    return (
      <div className="codeblock">
        {filename && (
          <div className="codeblock__header">
            <span className="codeblock__filename">{filename}</span>
          </div>
        )}
        <pre className="codeblock__pre codeblock__pre--loading">
          <code>{code.trim()}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="codeblock">
      {(filename || highlightedLines.size > 0) && (
        <div className="codeblock__header">
          {filename && <span className="codeblock__filename">{filename}</span>}
          {highlightedLines.size > 0 && (
            <button className="codeblock__clear" onClick={clearAll}>
              Clear highlights
            </button>
          )}
        </div>
      )}
      <div className="codeblock__scroll">
        <table className="codeblock__table">
          <tbody>
            {lines.map((line, i) => {
              const isHighlighted = highlightedLines.has(i);
              const colorIdx = highlightedLines.get(i) ?? 0;
              const neon = NEON_COLORS[colorIdx];
              return (
                <tr
                  key={i}
                  className={`codeblock__line${isHighlighted ? " codeblock__line--neon" : ""}`}
                  style={
                    isHighlighted
                      ? {
                          "--neon-bg": neon.bg,
                          "--neon-glow": neon.glow,
                          "--neon-border": neon.border,
                        } as React.CSSProperties
                      : undefined
                  }
                  onClick={() => handleLineClick(i)}
                >
                  {showLineNumbers && (
                    <td className="codeblock__gutter">{i + 1}</td>
                  )}
                  <td
                    className="codeblock__content"
                    dangerouslySetInnerHTML={{ __html: htmlLines[i] ?? "" }}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function extractLines(fullHtml: string): string[] {
  const bodyMatch = fullHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/);
  if (!bodyMatch) return [];
  return bodyMatch[1].split("\n");
}
