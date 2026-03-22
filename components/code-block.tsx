"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { codeToHtml, type BundledLanguage } from "shiki";

const NEON_COLORS = [
  { bg: "rgba(0, 229, 255, 0.13)", glow: "rgba(0, 229, 255, 0.5)", border: "rgba(0, 229, 255, 0.35)" },
  { bg: "rgba(255, 0, 255, 0.13)", glow: "rgba(255, 0, 255, 0.5)", border: "rgba(255, 0, 255, 0.35)" },
  { bg: "rgba(57, 255, 20, 0.13)", glow: "rgba(57, 255, 20, 0.5)", border: "rgba(57, 255, 20, 0.35)" },
  { bg: "rgba(255, 215, 0, 0.13)", glow: "rgba(255, 215, 0, 0.5)", border: "rgba(255, 215, 0, 0.35)" },
  { bg: "rgba(255, 69, 0, 0.13)", glow: "rgba(255, 69, 0, 0.5)", border: "rgba(255, 69, 0, 0.35)" },
];

export type CodeHighlightVariant =
  | "search"
  | "inspect"
  | "promote"
  | "health"
  | "plugin"
  | "accent";

export interface CodeHighlight {
  line: number;
  variant?: CodeHighlightVariant;
  start?: number;
  width?: number;
  label?: string;
  delayMs?: number;
}

interface CodeBlockProps {
  code: string;
  language?: BundledLanguage | string;
  filename?: string;
  showLineNumbers?: boolean;
  highlights?: CodeHighlight[];
  interactive?: boolean;
}

export function CodeBlock({
  code,
  language = "plaintext",
  filename,
  showLineNumbers = true,
  highlights = [],
  interactive,
}: CodeBlockProps) {
  const [html, setHtml] = useState("");
  const [highlightedLines, setHighlightedLines] = useState<Map<number, number>>(new Map());

  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const check = () => {
      setThemeMode(document.documentElement.dataset.themeMode === "light" ? "light" : "dark");
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme-mode"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code.trim(), {
      lang: language as BundledLanguage,
      theme: themeMode === "light" ? "vitesse-light" : "vitesse-dark",
    })
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        if (!cancelled) setHtml("");
      });
    return () => {
      cancelled = true;
    };
  }, [code, language, themeMode]);

  const cinematicHighlights = useMemo(() => {
    const next = new Map<number, CodeHighlight>();
    for (const highlight of highlights) next.set(highlight.line - 1, highlight);
    return next;
  }, [highlights]);

  const isInteractive = interactive ?? highlights.length === 0;

  const handleLineClick = useCallback((lineIndex: number) => {
    if (!isInteractive) return;
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
  }, [isInteractive]);

  const clearAll = useCallback(() => {
    setHighlightedLines(new Map());
  }, []);

  const lines = code.trim().split("\n");
  const htmlLines = useMemo(() => extractLines(html), [html]);
  const isTerminal = filename === "terminal";

  const rootCls = [
    "codeblock",
    highlights.length > 0 ? "codeblock--cinematic codeblock--static" : "",
    isTerminal ? "codeblock--terminal" : "",
  ].filter(Boolean).join(" ");

  if (!html) {
    return (
      <div className={rootCls}>
        {filename && (
          <div className="codeblock__header">
            {isTerminal && <TerminalDots />}
            <span className="codeblock__filename">{isTerminal ? "bash" : filename}</span>
          </div>
        )}
        <pre className="codeblock__pre codeblock__pre--loading">
          <code>{code.trim()}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className={rootCls}>
      {(filename || (isInteractive && highlightedLines.size > 0)) && (
        <div className="codeblock__header">
          {isTerminal && <TerminalDots />}
          {filename && <span className="codeblock__filename">{isTerminal ? "bash" : filename}</span>}
          {isInteractive && highlightedLines.size > 0 && (
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
              const cinematic = cinematicHighlights.get(i);
              const interactiveColorIdx = highlightedLines.get(i) ?? 0;
              const neon = NEON_COLORS[interactiveColorIdx];
              const isInteractiveHighlight = !cinematic && highlightedLines.has(i);
              const style = cinematic
                ? ({
                    "--highlight-start": `${cinematic.start ?? 8}%`,
                    "--highlight-width": `${cinematic.width ?? 82}%`,
                    "--highlight-delay": `${cinematic.delayMs ?? i * 140}ms`,
                  } as React.CSSProperties)
                : isInteractiveHighlight
                  ? ({
                      "--neon-bg": neon.bg,
                      "--neon-glow": neon.glow,
                      "--neon-border": neon.border,
                    } as React.CSSProperties)
                  : undefined;

              return (
                <tr
                  key={i}
                  className={[
                    "codeblock__line",
                    isInteractive ? "codeblock__line--interactive" : "",
                    cinematic ? `codeblock__line--cinematic codeblock__line--${cinematic.variant ?? "accent"}` : "",
                    isInteractiveHighlight ? "codeblock__line--neon" : "",
                  ].filter(Boolean).join(" ")}
                  style={style}
                  onClick={() => handleLineClick(i)}
                >
                  {showLineNumbers && (
                    <td className="codeblock__gutter">{i + 1}</td>
                  )}
                  <td className="codeblock__content">
                    <div
                      className="codeblock__content-inner"
                      dangerouslySetInnerHTML={{ __html: htmlLines[i] ?? "" }}
                    />
                    {cinematic?.label && <span className="codeblock__label">{cinematic.label}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TerminalDots() {
  return (
    <span className="codeblock__dots" aria-hidden>
      <span className="codeblock__dot codeblock__dot--close" />
      <span className="codeblock__dot codeblock__dot--minimize" />
      <span className="codeblock__dot codeblock__dot--maximize" />
    </span>
  );
}

function extractLines(fullHtml: string): string[] {
  const bodyMatch = fullHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/);
  if (!bodyMatch) return [];
  return bodyMatch[1].split("\n");
}
