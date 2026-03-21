import { notFound } from "next/navigation";
import { getTraceDetail } from "@/lib/opentrust/trace-details";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { MetricInline } from "@/components/ui/metric";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function TraceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trace = getTraceDetail(decodeURIComponent(id));

  if (!trace) notFound();

  return (
    <>
      <PageHeader
        title={trace.title ?? trace.id}
        subtitle={trace.summary ?? "No summary available for this trace."}
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Traces", href: "/" },
          { label: trace.title ?? trace.id },
        ]}
        actions={
          <a className="btn btn--primary" href={`/traces/${encodeURIComponent(trace.id)}/promote`}>
            Promote to memory
          </a>
        }
      />

      <div className="metadata-bar">
        <MetricInline label="Status" value={trace.status} />
        <MetricInline label="Session" value={trace.session_label ?? "unknown"} />
        <MetricInline label="Tool calls" value={String(trace.tools.length)} />
        <MetricInline label="Artifacts" value={String(trace.artifacts.length)} />
        <MetricInline label="Updated" value={trace.updated_at} mono />
        <MetricInline label="Trace ID" value={trace.id} mono />
      </div>

      {/* Tool calls */}
      <div className="section">
        <div className="section__header">
          <span className="section__title">Observed tool calls</span>
          <span className="section__description">{trace.tools.length} tool{trace.tools.length !== 1 ? "s" : ""}</span>
        </div>

        {trace.tools.length > 0 ? (
          <div className="list-group">
            {trace.tools.map((tool) => (
              <div key={tool.id} className="list-item detail-stack">
                <div className="detail-stack__header">
                  <Pill
                    label={tool.status}
                    tone={tool.status === "error" ? "danger" : tool.finished_at ? "success" : "info"}
                  />
                  <span className="list-item__title detail-stack__title">{tool.tool_name}</span>
                  <span className="detail-stack__timestamp">{tool.started_at}</span>
                </div>
                <div className="detail-stack__body">
                  {tool.error_text ?? (tool.finished_at ? "Completed successfully." : "Awaiting paired result.")}
                </div>
                {(tool.result_json || tool.finished_at) && (
                  <details className="expandable" style={{ marginTop: 8 }}>
                    <summary>Result details</summary>
                    <div className="expandable__content">
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>
                        Finished: {tool.finished_at ?? "not yet paired"}
                      </p>
                      <pre>{tool.result_json ?? "No result payload captured."}</pre>
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No tool calls captured for this trace." />
        )}
      </div>

      {/* Artifacts */}
      <div className="section">
        <div className="section__header">
          <span className="section__title">Referenced artifacts</span>
          <span className="section__description">{trace.artifacts.length} artifact{trace.artifacts.length !== 1 ? "s" : ""}</span>
        </div>

        {trace.artifacts.length > 0 ? (
          <div className="list-group">
            {trace.artifacts.map((artifact) => (
              <div key={artifact.id} className="list-item" style={{ cursor: "default" }}>
                <div className="list-item__content">
                  <span className="list-item__title">{artifact.title ?? artifact.id}</span>
                  <span className="list-item__subtitle">{artifact.uri}</span>
                </div>
                <div className="list-item__meta">
                  <Pill label={artifact.kind} tone="neutral" />
                  <span style={{ fontSize: "0.6875rem", fontFamily: "var(--font-mono)" }}>{artifact.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No artifacts extracted for this trace." />
        )}
      </div>

      {/* Event timeline */}
      <div className="section">
        <div className="section__header">
          <span className="section__title">Event timeline</span>
          <span className="section__description">{trace.events.length} event{trace.events.length !== 1 ? "s" : ""}</span>
        </div>

        {trace.events.length > 0 ? (
          <div className="timeline">
            {trace.events.map((event) => (
              <div key={event.id} className="timeline__item">
                <div className="timeline__item-time">{event.created_at}</div>
                <div className="timeline__item-kind">
                  <Pill label={event.kind} tone="neutral" />
                </div>
                <div className="timeline__item-text">{event.text_preview ?? "No preview available."}</div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No events captured for this trace." />
        )}
      </div>
    </>
  );
}
