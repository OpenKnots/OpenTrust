"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

const MODES = [
  { id: "system", icon: Monitor },
  { id: "light", icon: Sun },
  { id: "dark", icon: Moon },
] as const;

export function ThemeModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-mode-toggle" role="radiogroup" aria-label="Theme mode">
      {MODES.map(({ id, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={theme === id}
          aria-label={`${id} theme`}
          className={`theme-mode-toggle__btn${theme === id ? " theme-mode-toggle__btn--active" : ""}`}
          onClick={() => setTheme(id)}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
