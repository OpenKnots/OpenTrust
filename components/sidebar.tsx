"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Layers3,
  Menu,
  Shield,
  Telescope,
  Workflow,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: BarChart3 },
  { label: "Traces", href: "/traces", icon: Telescope, matchPrefix: true },
  { label: "Workflows", href: "/workflows", icon: Workflow, matchPrefix: true },
  { label: "Artifacts", href: "/artifacts", icon: Layers3 },
  { label: "Memory", href: "/memory", icon: BookOpen },
  { label: "Investigations", href: "/investigations", icon: FileSearch },
];

export function Sidebar({ latestIngest }: { latestIngest?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(item: (typeof NAV_ITEMS)[number]) {
    if (item.href === "/dashboard") return pathname === "/dashboard";
    if (item.matchPrefix) return pathname.startsWith(item.href);
    return pathname === item.href;
  }

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="mobile-topbar">
        <Link href="/" className="mobile-topbar__brand" aria-label="OpenTrust home">
          <span className="sidebar__logo">
            <Shield size={14} />
          </span>
          <span>OpenTrust</span>
        </Link>
        <button
          type="button"
          className="mobile-topbar__toggle"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="app-sidebar"
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {mobileOpen && <button type="button" className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

      <aside
        id="app-sidebar"
        className={`sidebar${collapsed ? " sidebar--collapsed" : ""}${mobileOpen ? " sidebar--mobile-open" : ""}`}
      >
        <div className="sidebar__header">
          <Link href="/" className="sidebar__brand" aria-label="OpenTrust home">
            <div className="sidebar__logo">
              <Shield size={14} />
            </div>
            <span>OpenTrust</span>
          </Link>
          <button
            type="button"
            className="sidebar__toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__group">
            <div className="sidebar__group-label">Navigation</div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar__link${isActive(item) ? " sidebar__link--active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="sidebar__link-icon">
                    <Icon size={16} />
                  </span>
                  <span className="sidebar__link-label">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__status">
            <span className={`sidebar__status-dot${latestIngest === "never" ? " sidebar__status-dot--stale" : ""}`} />
            <span>{latestIngest && latestIngest !== "never" ? `Ingested ${latestIngest}` : "No ingestion"}</span>
          </div>
        </div>
      </aside>

      <nav className="mobile-tabs" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-tabs__item${isActive(item) ? " mobile-tabs__item--active" : ""}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
