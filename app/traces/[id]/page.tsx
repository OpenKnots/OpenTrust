import Link from "next/link";
import { ArrowLeft, Bot, Layers3, Route } from "lucide-react";
import { notFound } from "next/navigation";
import { getTraceDetail } from "@/lib/opentrust/trace-details";

export const dynamic = "force-dynamic";

export default async function TraceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trace = getTraceDetail(decodeURIComponent(id));

  if (!trace) notFound();

  return (
    <main className="dashboard-shell">
      <div className="dashboard-bg" />
      <div className="dashboard-container">
        <section className="status-strip card">
          <StatusStripItem label="trace" value={trace.status} tone={trace.status === "attention" ? "danger" : trace.status === "streaming" ? "accent" : "success"} />
          <StatusStripItem label="session" value={trace.session_label ?? "unknown"} tone="neutral" />
          <StatusStripItem label="tools" value={String(trace.tools.length)} tone="accent" />
          <StatusStripItem label="artifacts" value={String(trace.artifacts.length)} tone="neutral" />
        </section>

        <section className="detail-hero card">
          <div className="hero__badge">Trace detail / evidence drill-down</div>
          <div className="detail-hero__top">
            <div>
              <h1>{trace.title ?? trace.id}</h1>
              <p>{trace.summary ?? "No summary available for this trace yet."}</p>
            </div>
            <div className="detail-actions">
              <Link href="/" className="action-link"><ArrowLeft size={16} /><span>Back to dashboard</span></Link>
              <Link href="/artifacts" className="action-link"><Layers3 size={16} /><span>Artifacts</span></Link>
            </div>
          </div>
          <div className="hero-band__stats detail-hero__stats">
            <Metric label="Updated" value={trace.updated_at} tone="neutral" />
            <Metric label="Session" value={trace.session_label ?? "unknown"} tone="neutral" />
            <Metric label="Tool calls" value={String(trace.tools.length)} tone="accent" />
            <Metric label="Trace ID" value={trace.id} tone="neutral" />
          </div>
        </section>

        <section className="bento-grid">
          <section className="dash-panel card panel-span-6">
            <header className="dash-panel__header">
              <div className="section-header__title">
                <span className="section-header__icon"><Bot size={18} /></span>
                <div>
                  <h2>Observed tool calls</h2>
                  <p>Direct evidence of tool usage connected to this trace.</p>
                </div>
              </div>
            </header>
            <div className="list-stack">
              {trace.tools.length > 0 ? trace.tools.map((tool) => (
                <article key={tool.id} className="entity-row entity-row--block">
                  <div className="entity-row__meta">
                    <StatusPill label={tool.status} tone={tool.status === "error" ? "danger" : tool.finished_at ? "success" : "accent"} />
                    <span className="muted">{tool.started_at}</span>
                  </div>
                  <div className="entity-row__content">
                    <strong>{tool.tool_name}</strong>
                    <p>{tool.error_text ?? (tool.finished_at ? "Tool completed successfully." : "Tool call observed; awaiting paired result.")}</p>
                  </div>
                  <details>
                    <summary>Tool result details</summary>
                    <p>Finished: {tool.finished_at ?? "not yet paired"}</p>
                    <pre>{tool.result_json ?? "No result payload captured."}</pre>
                  </details>
                </article>
              )) : <div className="search-empty">No tool calls captured for this trace.</div>}
            </div>
          </section>

          <section className="dash-panel card panel-span-6">
            <header className="dash-panel__header">
              <div className="section-header__title">
                <span className="section-header__icon"><Layers3 size={18} /></span>
                <div>
                  <h2>Referenced artifacts</h2>
                  <p>Files, repos, docs, and URLs inferred from this trace’s evidence.</p>
                </div>
              </div>
            </header>
            <div className="list-stack">
              {trace.artifacts.length > 0 ? trace.artifacts.map((artifact) => (
                <article key={artifact.id} className="entity-row entity-row--block">
                  <div className="entity-row__meta">
                    <StatusPill label={artifact.kind} tone="neutral" />
                    <span className="muted">{artifact.created_at}</span>
                  </div>
                  <div className="entity-row__content">
                    <strong>{artifact.title ?? artifact.id}</strong>
                    <p>{artifact.uri}</p>
                  </div>
                </article>
              )) : <div className="search-empty">No artifacts extracted for this trace yet.</div>}
            </div>
          </section>

          <section className="dash-panel card panel-span-12">
            <header className="dash-panel__header">
              <div className="section-header__title">
                <span className="section-header__icon"><Route size={18} /></span>
                <div>
                  <h2>Event timeline</h2>
                  <p>Chronological view of the imported evidence for this trace.</p>
                </div>
              </div>
            </header>
            <div className="list-stack">
              {trace.events.length > 0 ? trace.events.map((event) => (
                <article key={event.id} className="entity-row entity-row--block">
                  <div className="entity-row__meta">
                    <StatusPill label={event.kind} tone="neutral" />
                    <span className="muted">{event.created_at}</span>
                  </div>
                  <div className="entity-row__content">
                    <p>{event.text_preview ?? "No preview available."}</p>
                  </div>
                </article>
              )) : <div className="search-empty">No events captured for this trace.</div>}
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
