import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkflowDetail } from "@/lib/opentrust/workflow-details";

export const dynamic = "force-dynamic";

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workflow = getWorkflowDetail(decodeURIComponent(id));

  if (!workflow) notFound();

  return (
    <main className="shell shell--detail">
      <div className="content">
        <section className="card hero">
          <div className="hero__badge">Workflow detail</div>
          <h2>{workflow.name}</h2>
          <p className="hero__lede">{workflow.summary ?? "No summary available for this workflow yet."}</p>
          <div className="hero__grid">
            <Metric label="Status" value={workflow.status} />
            <Metric label="Source" value={workflow.source_kind ?? "unknown"} />
            <Metric label="Workflow key" value={workflow.workflow_key ?? "—"} />
            <Metric label="Updated" value={workflow.updated_at} />
          </div>
          <div className="detail-actions">
            <Link href="/" className="search-form__button">Back to field manual</Link>
          </div>
        </section>

        <section className="stack">
          <header className="section-header">
            <div className="section-header__title">
              <span className="section-header__icon">01</span>
              <h2>Workflow steps</h2>
            </div>
            <p>Recent recorded steps for this workflow run.</p>
          </header>
          <div className="stack">
            {workflow.steps.length > 0 ? workflow.steps.map((step) => (
              <article key={step.id} className="card card--soft">
                <div className="meta-row">
                  <span className="pill pill--outline">{step.status}</span>
                  <span className="muted">{step.updated_at ?? step.started_at ?? step.ended_at ?? step.id}</span>
                </div>
                <h3>{step.label ?? step.step_key}</h3>
                <p>Step key: {step.step_key}</p>
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

        <section className="stack">
          <header className="section-header">
            <div className="section-header__title">
              <span className="section-header__icon">02</span>
              <h2>Workflow artifacts</h2>
            </div>
            <p>Artifacts linked to this workflow run.</p>
          </header>
          <div className="grid grid--two">
            {workflow.artifacts.length > 0 ? workflow.artifacts.map((artifact) => (
              <article key={artifact.id} className="card card--soft">
                <div className="meta-row">
                  <span className="pill pill--outline">{artifact.kind}</span>
                  <span className="muted">{artifact.relation}</span>
                </div>
                <h3>{artifact.title ?? artifact.id}</h3>
                <p>{artifact.uri}</p>
              </article>
            )) : <div className="search-empty">No workflow artifacts recorded yet.</div>}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
