import Link from "next/link";
import { ArrowRight, Telescope } from "lucide-react";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { getGroupedTraces } from "@/lib/opentrust/trace-list";
import { PageHeader } from "@/components/ui/page-header";
import { Pill, StatusDot } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function TracesPage() {
  const groups = getGroupedTraces();
  const totalTraces = groups.reduce((sum, g) => sum + g.trace_count, 0);

  return (
    <>
      <PageHeader
        title="Traces"
        subtitle={`${totalTraces} trace${totalTraces !== 1 ? "s" : ""} across ${groups.length} session${groups.length !== 1 ? "s" : ""} — grouped by session, similar traces collapsed.`}
        breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Traces" }]}
      />

      {groups.length === 0 ? (
        <EmptyState message="No traces imported yet." />
      ) : (
        <div className="section">
          <div className="section__header">
            <div className="section__icon">
              <Telescope size={14} />
              <span className="section__title">Session groups</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {groups.map((group) => (
              <details key={group.session_id} className="expandable">
                <summary>
                  <StatusDot
                    tone={
                      group.attention_count > 0
                        ? "danger"
                        : "success"
                    }
                  />
                  <span style={{ flex: 1, fontWeight: 500, color: "var(--text-primary)" }}>
                    {group.session_label ?? group.session_id}
                  </span>
                  <Pill
                    label={`${group.trace_count} trace${group.trace_count !== 1 ? "s" : ""}`}
                    tone="neutral"
                  />
                  {group.attention_count > 0 && (
                    <Pill label={`${group.attention_count} attention`} tone="danger" />
                  )}
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {formatRelativeTime(group.last_updated)}
                  </span>
                </summary>
                <div className="expandable__content" style={{ paddingTop: 0 }}>
                  <div className="list-group">
                    {group.traces.map((trace) => (
                      <Link
                        key={trace.id}
                        href={`/traces/${encodeURIComponent(trace.id)}`}
                        className="list-item"
                      >
                        <StatusDot
                          tone={
                            trace.status === "attention"
                              ? "danger"
                              : trace.status === "streaming"
                                ? "accent"
                                : "success"
                          }
                        />
                        <div className="list-item__content">
                          <span className="list-item__title">{trace.title ?? trace.id}</span>
                          {trace.summary && (
                            <span className="list-item__subtitle">{trace.summary}</span>
                          )}
                        </div>
                        <div className="list-item__meta">
                          <Pill
                            label={trace.status}
                            tone={
                              trace.status === "attention"
                                ? "danger"
                                : trace.status === "streaming"
                                  ? "info"
                                  : "neutral"
                            }
                          />
                          <span>{formatRelativeTime(trace.updated_at)}</span>
                        </div>
                        <ArrowRight size={14} className="list-item__arrow" />
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
