"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Layers3,
  Shield,
  Telescope,
  Workflow,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: BarChart3 },
  { label: "Traces", href: "/traces", icon: Telescope, matchPrefix: true },
  { label: "Workflows", href: "/workflows", icon: Workflow, matchPrefix: true },
  { label: "Artifacts", href: "/artifacts", icon: Layers3 },
  { label: "Investigations", href: "/investigations", icon: FileSearch },
];

export function Sidebar({ latestIngest }: { latestIngest?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(item: (typeof NAV_ITEMS)[number]) {
    if (item.href === "/") return pathname === "/";
    if (item.matchPrefix) return pathname.startsWith(item.href);
    return pathname === item.href;
  }

  return (
    <aside className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}>
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <Shield size={14} />
          </div>
          <span>OpenTrust</span>
        </div>
        <button
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
  );
}
