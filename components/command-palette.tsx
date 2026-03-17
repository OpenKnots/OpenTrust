"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarChart3,
  FileSearch,
  Layers3,
  Search,
  Telescope,
  Workflow,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  group: string;
}

const COMMANDS: CommandItem[] = [
  { id: "overview", label: "Overview", href: "/", icon: <BarChart3 size={14} />, group: "Navigation" },
  { id: "artifacts", label: "Artifacts", href: "/artifacts", icon: <Layers3 size={14} />, group: "Navigation" },
  { id: "investigations", label: "Investigations", href: "/investigations", icon: <FileSearch size={14} />, group: "Navigation" },
  { id: "search", label: "Search traces...", href: "/?q=", icon: <Search size={14} />, group: "Actions" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      handleClose();
      if (item.id === "search" && query) {
        router.push(`/?q=${encodeURIComponent(query)}`);
      } else {
        router.push(item.href);
      }
    },
    [handleClose, router, query]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setActiveIndex(0);
      }
      if (e.key === "Escape" && open) {
        handleClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      handleSelect(filtered[activeIndex]);
    }
  }

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={handleClose}>
      <div className="cmd-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-input-wrap">
          <Search size={16} />
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="cmd-kbd">esc</span>
        </div>
        <div className="cmd-results">
          {filtered.length > 0 ? (
            filtered.map((item, i) => (
              <div
                key={item.id}
                className={`cmd-result${i === activeIndex ? " cmd-result--active" : ""}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="cmd-result__icon">{item.icon}</span>
                <span className="cmd-result__label">{item.label}</span>
                <span className="cmd-result__hint">{item.group}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8125rem" }}>
              No results found.
            </div>
          )}
        </div>
        <div className="cmd-footer">
          <span>Navigate with <span className="cmd-kbd">↑↓</span> and <span className="cmd-kbd">↵</span></span>
          <span><span className="cmd-kbd">⌘K</span> to toggle</span>
        </div>
      </div>
    </div>
  );
}
