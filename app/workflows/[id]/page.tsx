import Link from "next/link";
import { ArrowLeft, Layers3, ListTree, Workflow } from "lucide-react";
import { notFound } from "next/navigation";
import { getWorkflowDetail } from "@/lib/opentrust/workflow-details";

export const dynamic = "force-dynamic";

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workflow = getWorkflowDetail(decodeURIComponent(id));

  if (!workflow) notFound();

  return (
    <main className="dashboard-shell">
      <div className="dashboard-bg" />
      <div className="dashboard-container">
        <section className="status-strip card">
          <StatusStripItem label="workflow" value={workflow.status} tone={workflow.status === "attention" || workflow.status === "error" ? "danger" : "success"} />
          <StatusStripItem label="source" value={workflow.source_kind ?? "unknown"} tone="neutral" />
          <StatusStripItem label="updated" value={workflow.updated_at} tone="neutral" />
          <StatusStripItem label="steps" value={String(workflow.steps.length)} tone="accent" />
        </section>

        <section className="detail-hero card">
          <div className="hero__badge">Workflow detail / ledger view</div>
          <div className="detail-hero__top">
            <div>
              <h1>{workflow.name}</h1>
              <p>{workflow.summary ?? "No summary available for this workflow yet."}</p>
            </div>
            <div className="detail-actions">
              <Link href="/" className="action-link"><ArrowLeft size={16} /><span>Back to dashboard</span></Link>
              <Link href="/artifacts" className="action-link"><Layers3 size={16} /><span>Artifacts</span></Link>
            </div>
          </div>
          <div className="hero-band__stats detail-hero__stats">
            <Metric label="Workflow key" value={workflow.workflow_key ?? "—"} tone="neutral" />
            <Metric label="Status" value={workflow.status} tone="accent" />
            <Metric label="Source" value={workflow.source_kind ?? "unknown"} tone="neutral" />
            <Metric label="Artifacts" value={String(workflow.artifacts.length)} tone="neutral" />
          </div>
        </section>

        <section className="bento-grid">
          <section className="dash-panel card panel-span-7">
            <header className="dash-panel__header">
              <div className="section-header__title">
                <span className="section-header__icon"><ListTree size={18} /></span>
                <div>
                  <h2>Workflow steps</h2>
                  <p>Recent recorded steps for this workflow run.</p>
                </div>
              </div>
            </header>
            <div className="list-stack">
              {workflow.steps.length > 0 ? workflow.steps.map((step) => (
                <article key={step.id} className="entity-row entity-row--block">
                  <div className="entity-row__meta">
                    <StatusPill label={step.status} tone={step.status === "error" || step.status === "attention" ? "danger" : step.status === "active" ? "accent" : "neutral"} />
                    <span className="muted">{step.updated_at ?? step.started_at ?? step.ended_at ?? step.id}</span>
                  </div>
                  <div className="entity-row__content">
                    <strong>{step.label ?? step.step_key}</strong>
                    <p>Step key: {step.step_key}</p>
                  </div>
                  <details>
                    <summary>Timing</summary>
                    <p>Started: {step.started_at ?? "—"}</p>
                    <p>Updated: {step.updated_at ?? "—"}</p>
                    <p>Ended: {step.ended_at ?? "—"}</p>
                  </details>
                </article>
              )) : <div className="search-empty">No workflow steps recorded yet.</div>}
            </div>
          </section>

          <section className="dash-panel card panel-span-5">
            <header className="dash-panel__header">
              <div className="section-header__title">
                <span className="section-header__icon"><Workflow size={18} /></span>
                <div>
                  <h2>Workflow artifacts</h2>
                  <p>Artifacts linked to this workflow run.</p>
                </div>
              </div>
            </header>
            <div className="list-stack">
              {workflow.artifacts.length > 0 ? workflow.artifacts.map((artifact) => (
                <article key={artifact.id} className="entity-row entity-row--block">
                  <div className="entity-row__meta">
                    <StatusPill label={artifact.kind} tone="neutral" />
                    <span className="muted">{artifact.relation}</span>
                  </div>
                  <div className="entity-row__content">
                    <strong>{artifact.title ?? artifact.id}</strong>
                    <p>{artifact.uri}</p>
                  </div>
                </article>
              )) : <div className="search-empty">No workflow artifacts recorded yet.</div>}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "accent" | "neutral" }) {
  return (
    <div className={`metric metric--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "accent" | "neutral" | "danger" | "success" }) {
  return <span className={`pill pill--${tone}`}>{label}</span>;
}

function StatusStripItem({ label, value, tone }: { label: string; value: string; tone: "accent" | "neutral" | "danger" | "success" }) {
  return (
    <div className="status-strip__item">
      <span>{label}</span>
      <div className="status-strip__value"><StatusPill label={value} tone={tone} /></div>
    </div>
  );
}
