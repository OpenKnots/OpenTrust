import { notFound } from "next/navigation";
import { getWorkflowDetail } from "@/lib/opentrust/workflow-details";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { MetricInline } from "@/components/ui/metric";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workflow = getWorkflowDetail(decodeURIComponent(id));

  if (!workflow) notFound();

  return (
    <>
      <PageHeader
        title={workflow.name}
        subtitle={workflow.summary ?? "No summary available for this workflow."}
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Workflows", href: "/" },
          { label: workflow.name },
        ]}
      />

      <div className="metadata-bar">
        <MetricInline label="Status" value={workflow.status} />
        <MetricInline label="Source" value={workflow.source_kind ?? "unknown"} />
        <MetricInline label="Steps" value={String(workflow.steps.length)} />
        <MetricInline label="Artifacts" value={String(workflow.artifacts.length)} />
        <MetricInline label="Updated" value={workflow.updated_at} mono />
        {workflow.workflow_key && <MetricInline label="Key" value={workflow.workflow_key} mono />}
      </div>

      {/* Workflow steps */}
      <div className="section">
        <div className="section__header">
          <span className="section__title">Workflow steps</span>
          <span className="section__description">{workflow.steps.length} step{workflow.steps.length !== 1 ? "s" : ""}</span>
        </div>

        {workflow.steps.length > 0 ? (
          <div className="list-group">
            {workflow.steps.map((step) => (
              <div key={step.id} className="list-item" style={{ flexDirection: "column", alignItems: "stretch", cursor: "default" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Pill
                    label={step.status}
                    tone={step.status === "error" || step.status === "attention" ? "danger" : step.status === "active" ? "info" : "neutral"}
                  />
                  <span className="list-item__title" style={{ flex: 1 }}>{step.label ?? step.step_key}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {step.updated_at ?? step.started_at ?? step.id}
                  </span>
                </div>
                <div style={{ marginTop: 4, fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                  Step key: {step.step_key}
                </div>
                <details className="expandable" style={{ marginTop: 8 }}>
                  <summary>Timing</summary>
                  <div className="expandable__content">
                    <div style={{ display: "flex", gap: 24, fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                      <span>Started: {step.started_at ?? "—"}</span>
                      <span>Updated: {step.updated_at ?? "—"}</span>
                      <span>Ended: {step.ended_at ?? "—"}</span>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No workflow steps recorded yet." />
        )}
      </div>

      {/* Workflow artifacts */}
      <div className="section">
        <div className="section__header">
          <span className="section__title">Workflow artifacts</span>
          <span className="section__description">{workflow.artifacts.length} artifact{workflow.artifacts.length !== 1 ? "s" : ""}</span>
        </div>

        {workflow.artifacts.length > 0 ? (
          <div className="list-group">
            {workflow.artifacts.map((artifact) => (
              <div key={artifact.id} className="list-item" style={{ cursor: "default" }}>
                <div className="list-item__content">
                  <span className="list-item__title">{artifact.title ?? artifact.id}</span>
                  <span className="list-item__subtitle">{artifact.uri}</span>
                </div>
                <div className="list-item__meta">
                  <Pill label={artifact.kind} tone="neutral" />
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>{artifact.relation}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No workflow artifacts recorded yet." />
        )}
      </div>
    </>
  );
}
