"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Copy,
  FileSearch,
  Keyboard,
  Layers3,
  LogOut,
  Monitor,
  Search,
  Settings,
  Telescope,
  Workflow,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  group: string;
  href?: string;
  kbd?: string[];
  action?: () => void;
}

function getCommands(actions: {
  copyUrl: () => void;
  toggleTheme: () => void;
}): CommandItem[] {
  return [
    {
      id: "settings",
      label: "Settings...",
      icon: <Settings size={16} />,
      group: "General",
      kbd: ["⌘", ","],
    },
    {
      id: "theme",
      label: "Change Theme...",
      icon: <Monitor size={16} />,
      group: "General",
      kbd: ["⌘", "T"],
      action: actions.toggleTheme,
    },
    {
      id: "copy-url",
      label: "Copy Current URL",
      icon: <Copy size={16} />,
      group: "General",
      kbd: ["⌘", "⇧", "C"],
      action: actions.copyUrl,
    },
    {
      id: "nav-overview",
      label: "Go to Overview",
      icon: <BarChart3 size={16} />,
      group: "Navigation",
      href: "/dashboard",
    },
    {
      id: "nav-traces",
      label: "Go to Traces",
      icon: <Telescope size={16} />,
      group: "Navigation",
      href: "/traces",
    },
    {
      id: "nav-workflows",
      label: "Go to Workflows",
      icon: <Workflow size={16} />,
      group: "Navigation",
      href: "/workflows",
    },
    {
      id: "nav-artifacts",
      label: "Go to Artifacts",
      icon: <Layers3 size={16} />,
      group: "Navigation",
      href: "/artifacts",
    },
    {
      id: "nav-memory",
      label: "Go to Memory",
      icon: <BookOpen size={16} />,
      group: "Navigation",
      href: "/memory",
    },
    {
      id: "nav-investigations",
      label: "Go to Investigations",
      icon: <FileSearch size={16} />,
      group: "Navigation",
      href: "/investigations",
    },
    {
      id: "search",
      label: "Search traces...",
      icon: <Search size={16} />,
      group: "Actions",
      href: "/traces",
    },
    {
      id: "shortcuts",
      label: "View Keyboard Shortcuts",
      icon: <Keyboard size={16} />,
      group: "Help",
      kbd: ["⌘", "/"],
    },
  ];
}

const GROUP_ORDER = ["General", "Navigation", "Actions", "Help"];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme-mode");
    root.setAttribute("data-theme-mode", current === "light" ? "dark" : "light");
  }, []);

  const commands = useMemo(
    () => getCommands({ copyUrl, toggleTheme }),
    [copyUrl, toggleTheme],
  );

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q),
    );
  }, [commands, query]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({
      label: g,
      items: map.get(g)!,
    }));
  }, [filtered]);

  const flatItems = useMemo(
    () => groups.flatMap((g) => g.items),
    [groups],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      handleClose();
      if (item.action) {
        item.action();
      } else if (item.href) {
        router.push(item.href);
      }
    },
    [handleClose, router],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) {
            setQuery("");
            setActiveIndex(0);
          }
          return !prev;
        });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>(
      "[data-active='true']",
    );
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flatItems.length) % flatItems.length);
    } else if (e.key === "Enter" && flatItems[activeIndex]) {
      e.preventDefault();
      handleSelect(flatItems[activeIndex]);
    }
  }

  if (!open) return null;

  let itemIndex = 0;

  return (
    <div className="cmd-overlay" onClick={handleClose}>
      <div
        className="cmd-dialog"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Command Menu"
      >
        <div className="cmd-input-wrap">
          <Search size={16} />
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="What do you need?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="cmd-esc-btn"
            onClick={handleClose}
          >
            <kbd className="cmd-kbd">Esc</kbd>
          </button>
        </div>

        <div className="cmd-results" ref={listRef}>
          {flatItems.length === 0 ? (
            <div className="cmd-empty">No results found.</div>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="cmd-group">
                <div className="cmd-group__label">{group.label}</div>
                {group.items.map((item) => {
                  const idx = itemIndex++;
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={item.id}
                      className={`cmd-result${isActive ? " cmd-result--active" : ""}`}
                      data-active={isActive}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      role="option"
                      aria-selected={isActive}
                    >
                      <span className="cmd-result__icon">{item.icon}</span>
                      <span className="cmd-result__label">
                        {item.label.startsWith("Go to ") ? (
                          <>
                            Go to&nbsp;
                            <strong>{item.label.slice(6)}</strong>
                          </>
                        ) : (
                          item.label
                        )}
                      </span>
                      {item.kbd && (
                        <span className="cmd-result__kbd">
                          {item.kbd.map((k, i) => (
                            <kbd key={i} className="cmd-kbd">
                              {k}
                            </kbd>
                          ))}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="cmd-footer">
          <span>
            Navigate with <kbd className="cmd-kbd">↑↓</kbd> and{" "}
            <kbd className="cmd-kbd">↵</kbd>
          </span>
          <span>
            <kbd className="cmd-kbd">⌘K</kbd> to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
