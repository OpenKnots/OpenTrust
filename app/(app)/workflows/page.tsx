import Link from "next/link";
import { ArrowRight, Workflow } from "lucide-react";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoGroupedWorkflows } from "@/lib/opentrust/demo-data";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { getGroupedWorkflows } from "@/lib/opentrust/workflow-list";
import { PageHeader } from "@/components/ui/page-header";
import { Pill, StatusDot } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPanel,
} from "@/components/animate-ui/components/base/preview-card";

export const dynamic = "force-dynamic";

export default async function WorkflowsPage() {
  const demo = await isDemoMode();
  const groups = demo ? getDemoGroupedWorkflows() : getGroupedWorkflows();
  const totalRuns = groups.reduce((sum, g) => sum + g.run_count, 0);

  return (
    <>
      <PageHeader
        title="Workflows"
        subtitle={`${totalRuns} run${totalRuns !== 1 ? "s" : ""} across ${groups.length} workflow type${groups.length !== 1 ? "s" : ""} — similar runs collapsed by key.`}
        breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Workflows" }]}
      />

      {groups.length === 0 ? (
        <EmptyState message="No workflows tracked yet." />
      ) : (
        <div className="section">
          <div className="section__header">
            <div className="section__icon">
              <Workflow size={14} />
              <span className="section__title">Workflow types</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {groups.map((group) => (
              <details
                key={group.workflow_key ?? "__ungrouped__"}
                className="expandable"
              >
                <summary>
                  <StatusDot
                    tone={group.error_count > 0 ? "danger" : "neutral"}
                  />
                  <span style={{ flex: 1, fontWeight: 500, color: "var(--text-primary)" }}>
                    {group.workflow_key ?? "Ungrouped"}
                  </span>
                  <Pill
                    label={`${group.run_count} run${group.run_count !== 1 ? "s" : ""}`}
                    tone="neutral"
                  />
                  {group.error_count > 0 && (
                    <Pill label={`${group.error_count} failed`} tone="danger" />
                  )}
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {formatRelativeTime(group.last_updated)}
                  </span>
                </summary>
                <div className="expandable__content" style={{ paddingTop: 0 }}>
                  <div className="list-group">
                    {group.runs.map((run) => (
                      <PreviewCard key={run.id}>
                        <PreviewCardTrigger
                          render={
                            <Link
                              href={`/workflows/${encodeURIComponent(run.id)}`}
                              className="list-item"
                            >
                              <StatusDot
                                tone={
                                  run.status === "error" || run.status === "attention"
                                    ? "danger"
                                    : run.status === "active"
                                      ? "accent"
                                      : "neutral"
                                }
                              />
                              <div className="list-item__content">
                                <span className="list-item__title">{run.name}</span>
                                {run.summary && (
                                  <span className="list-item__subtitle">{run.summary}</span>
                                )}
                              </div>
                              <div className="list-item__meta">
                                <Pill
                                  label={run.status}
                                  tone={
                                    run.status === "error" || run.status === "attention"
                                      ? "danger"
                                      : "neutral"
                                  }
                                />
                                {run.source_kind && (
                                  <Pill label={run.source_kind} tone="neutral" />
                                )}
                                <span>{formatRelativeTime(run.updated_at)}</span>
                              </div>
                              <ArrowRight size={14} className="list-item__arrow" />
                            </Link>
                          }
                        />
                        <PreviewCardPanel side="right" sideOffset={12} align="start">
                          <div className="preview-card__title">{run.name}</div>
                          <div className="preview-card__text">{run.summary ?? "No summary available."}</div>
                          <div className="preview-card__meta">
                            <Pill
                              label={run.status}
                              tone={
                                run.status === "error" || run.status === "attention"
                                  ? "danger"
                                  : "neutral"
                              }
                            />
                            {run.source_kind && (
                              <Pill label={run.source_kind} tone="neutral" />
                            )}
                            <span>{formatRelativeTime(run.updated_at)}</span>
                          </div>
                        </PreviewCardPanel>
                      </PreviewCard>
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
