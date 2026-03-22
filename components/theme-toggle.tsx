"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "opentrust.theme-mode";

const MODES: { id: ThemeMode; icon: typeof Monitor }[] = [
  { id: "system", icon: Monitor },
  { id: "light", icon: Sun },
  { id: "dark", icon: Moon },
];

function resolveMode(mode: ThemeMode): "light" | "dark" {
  if (mode !== "system") return mode;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.dataset.themeMode = resolved;
  root.style.colorScheme = resolved;
}

export function ThemeModeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored && ["system", "light", "dark"].includes(stored)) {
      setMode(stored);
      applyTheme(resolveMode(stored));
    }
  }, []);

  useEffect(() => {
    applyTheme(resolveMode(mode));
    localStorage.setItem(STORAGE_KEY, mode);

    if (mode !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => applyTheme(resolveMode("system"));
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mode]);

  return (
    <div className="theme-mode-toggle" role="radiogroup" aria-label="Theme mode">
      {MODES.map(({ id, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={mode === id}
          aria-label={`${id} theme`}
          className={`theme-mode-toggle__btn${mode === id ? " theme-mode-toggle__btn--active" : ""}`}
          onClick={() => setMode(id)}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
