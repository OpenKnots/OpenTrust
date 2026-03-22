"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Square } from "lucide-react";

const COOKIE_NAME = "opentrust.demo-mode";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
}

export function DemoModeToggle() {
  const router = useRouter();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(getCookie(COOKIE_NAME) === "true");
  }, []);

  function toggle() {
    const next = !active;
    setActive(next);
    setCookie(COOKIE_NAME, String(next));
    router.refresh();
  }

  return (
    <button
      type="button"
      className={`demo-mode-toggle${active ? " demo-mode-toggle--active" : ""}`}
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? "Disable demo mode" : "Enable demo mode"}
      title={active ? "Demo mode on" : "Demo mode off"}
    >
      {active ? <Square size={14} /> : <Play size={14} />}
      <span className="demo-mode-toggle__label">Demo</span>
    </button>
  );
}
