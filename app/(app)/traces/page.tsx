import Link from "next/link";
import { ArrowRight, Bot, Telescope } from "lucide-react";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoGroupedTraces } from "@/lib/opentrust/demo-data";
import { formatRelativeTime, stripMarkdown } from "@/lib/opentrust/format";
import { getGroupedTraces, type SessionTraceGroup } from "@/lib/opentrust/trace-list";
import { PageHeader } from "@/components/ui/page-header";
import { Pill, StatusDot } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MarkdownPreviewWithModal } from "@/components/markdown-preview-with-modal";
import { PiiSafe } from "@/components/pii-safe";
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPanel,
} from "@/components/animate-ui/components/base/preview-card";

export const dynamic = "force-dynamic";

function TraceList({ traces }: { traces: SessionTraceGroup["traces"] }) {
  return (
    <div className="list-group">
      {traces.map((trace) => (
        <PreviewCard key={trace.id}>
          <PreviewCardTrigger
            render={
              <Link
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
                  <span className="list-item__title"><PiiSafe>{trace.title ?? trace.id}</PiiSafe></span>
                  {trace.summary && (
                    <span className="list-item__subtitle"><PiiSafe>{stripMarkdown(trace.summary)}</PiiSafe></span>
                  )}
                </div>
                <div className="list-item__meta">
                  <StatusBadge
                    label={trace.status}
                    status={
                      trace.status === "attention"
                        ? "degraded"
                        : trace.status === "streaming"
                          ? "active"
                          : "healthy"
                    }
                  />
                  <span>{formatRelativeTime(trace.updated_at)}</span>
                </div>
                <ArrowRight size={14} className="list-item__arrow" />
              </Link>
            }
          />
          <PreviewCardPanel side="right" sideOffset={12} align="start">
            <div className="preview-card__title"><PiiSafe>{trace.title ?? trace.id}</PiiSafe></div>
            <div className="preview-card__text">
              <MarkdownPreviewWithModal
                content={trace.summary}
                modalTitle={<PiiSafe>{trace.title ?? trace.id}</PiiSafe>}
                className="markdown-preview--compact"
              />
            </div>
            <div className="preview-card__meta">
              <StatusBadge
                label={trace.status}
                status={
                  trace.status === "attention"
                    ? "degraded"
                    : trace.status === "streaming"
                      ? "active"
                      : "healthy"
                }
              />
              <span>{formatRelativeTime(trace.updated_at)}</span>
            </div>
          </PreviewCardPanel>
        </PreviewCard>
      ))}
    </div>
  );
}

function totalTracesInGroup(group: SessionTraceGroup): number {
  return group.trace_count + group.children.reduce((sum, c) => sum + totalTracesInGroup(c), 0);
}

function totalAttentionInGroup(group: SessionTraceGroup): number {
  return group.attention_count + group.children.reduce((sum, c) => sum + totalAttentionInGroup(c), 0);
}

function SubagentGroup({ group }: { group: SessionTraceGroup }) {
  return (
    <details className="expandable expandable--nested">
      <summary>
        <Bot size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <StatusDot
          tone={group.attention_count > 0 ? "danger" : "success"}
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
        <TraceList traces={group.traces} />
      </div>
    </details>
  );
}

export default async function TracesPage() {
  const demo = await isDemoMode();
  const groups = demo ? getDemoGroupedTraces() : getGroupedTraces();
  const totalTraces = groups.reduce((sum, g) => sum + totalTracesInGroup(g), 0);

  return (
    <>
      <PageHeader
        title="Traces"
        subtitle={`${totalTraces} trace${totalTraces !== 1 ? "s" : ""} across ${groups.length} session${groups.length !== 1 ? "s" : ""} — grouped by session, subagents nested.`}
        breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Traces" }]}
      />

      {groups.length === 0 ? (
        <EmptyState message="No traces imported yet." />
      ) : (
        <GlassCard variant="raised">
          <div className="section__header" style={{ marginBottom: 16 }}>
            <div className="section__icon">
              <Telescope size={14} />
              <span className="section__title">Session groups</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {groups.map((group) => {
              const totalCount = totalTracesInGroup(group);
              const totalAttention = totalAttentionInGroup(group);

              return (
                <details key={group.session_id} className="expandable">
                  <summary>
                    <StatusDot
                      tone={totalAttention > 0 ? "danger" : "success"}
                    />
                    <span style={{ flex: 1, fontWeight: 500, color: "var(--text-primary)" }}>
                      {group.session_label ?? group.session_id}
                    </span>
                    <Pill
                      label={`${totalCount} trace${totalCount !== 1 ? "s" : ""}`}
                      tone="neutral"
                    />
                    {group.children.length > 0 && (
                      <Pill
                        label={`${group.children.length} subagent${group.children.length !== 1 ? "s" : ""}`}
                        tone="accent"
                      />
                    )}
                    {totalAttention > 0 && (
                      <Pill label={`${totalAttention} attention`} tone="danger" />
                    )}
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {formatRelativeTime(group.last_updated)}
                    </span>
                  </summary>
                  <div className="expandable__content" style={{ paddingTop: 0 }}>
                    <TraceList traces={group.traces} />

                    {group.children.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: group.traces.length > 0 ? 8 : 0 }}>
                        {group.children.map((child) => (
                          <SubagentGroup key={child.session_id} group={child} />
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </GlassCard>
      )}
    </>
  );
}
