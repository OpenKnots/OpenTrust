import Link from "next/link";
import { notFound } from "next/navigation";
import { getTraceDetail } from "@/lib/opentrust/trace-details";

export const dynamic = "force-dynamic";

export default async function TraceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trace = getTraceDetail(decodeURIComponent(id));

  if (!trace) {
    notFound();
  }

  return (
    <main className="shell shell--detail">
      <div className="content">
        <section className="card hero">
          <div className="hero__badge">Trace detail</div>
          <h2>{trace.title ?? trace.id}</h2>
          <p className="hero__lede">{trace.summary ?? "No summary available for this trace yet."}</p>
          <div className="hero__grid">
            <Metric label="Status" value={trace.status} />
            <Metric label="Session" value={trace.session_label ?? "Unknown"} />
            <Metric label="Updated" value={trace.updated_at} />
            <Metric label="Trace ID" value={trace.id} />
          </div>
          <div className="detail-actions">
            <Link href="/" className="search-form__button">Back to field manual</Link>
          </div>
        </section>

        <section className="stack">
          <header className="section-header">
            <div className="section-header__title">
              <span className="section-header__icon">01</span>
              <h2>Observed tool calls</h2>
            </div>
            <p>Direct evidence of tool usage connected to this trace.</p>
          </header>
          <div className="grid grid--two">
            {trace.tools.length > 0 ? trace.tools.map((tool) => (
              <article key={tool.id} className="card card--soft">
                <div className="meta-row">
                  <span className="pill pill--outline">{tool.status}</span>
                  <span className="muted">{tool.started_at}</span>
                </div>
                <h3>{tool.tool_name}</h3>
                <p>{tool.error_text ?? "No error recorded."}</p>
              </article>
            )) : <div className="search-empty">No tool calls captured for this trace.</div>}
          </div>
        </section>

        <section className="stack">
          <header className="section-header">
            <div className="section-header__title">
              <span className="section-header__icon">02</span>
              <h2>Event timeline</h2>
            </div>
            <p>Chronological view of the imported evidence for this trace.</p>
          </header>
          <div className="stack">
            {trace.events.length > 0 ? trace.events.map((event) => (
              <article key={event.id} className="card card--soft">
                <div className="meta-row">
                  <span className="pill pill--outline">{event.kind}</span>
                  <span className="muted">{event.created_at}</span>
                </div>
                <p>{event.text_preview ?? "No preview available."}</p>
              </article>
            )) : <div className="search-empty">No events captured for this trace.</div>}
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
