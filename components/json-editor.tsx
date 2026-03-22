"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { codeToHtml, type BundledLanguage } from "shiki";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}

export function JsonEditor({ value, onChange, minHeight = 160 }: JsonEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [validJson, setValidJson] = useState(true);

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
    const display = value || " ";
    codeToHtml(display, {
      lang: "json" as BundledLanguage,
      theme: themeMode === "light" ? "vitesse-light" : "vitesse-dark",
    })
      .then((html) => {
        if (!cancelled) setHighlightedHtml(html);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [value, themeMode]);

  useEffect(() => {
    try {
      if (value.trim()) JSON.parse(value);
      setValidJson(true);
    } catch {
      setValidJson(value.trim().length === 0);
    }
  }, [value]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleScroll = useCallback(() => {
    if (textareaRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = textareaRef.current.scrollTop;
      scrollRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newValue = value.substring(0, start) + "  " + value.substring(end);
        onChange(newValue);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [value, onChange]
  );

  return (
    <div className="json-editor" style={{ minHeight }}>
      <div className="json-editor__backdrop" ref={scrollRef}>
        <div
          className="json-editor__highlight"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>
      <textarea
        ref={textareaRef}
        className="json-editor__input"
        value={value}
        onChange={handleInput}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        data-valid={validJson ? "true" : "false"}
      />
      {!validJson && (
        <div className="json-editor__error">Invalid JSON</div>
      )}
    </div>
  );
}
