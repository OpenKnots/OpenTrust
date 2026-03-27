import { notFound } from "next/navigation";
import { getTraceDetail } from "@/lib/opentrust/trace-details";
import { PageHeader } from "@/components/ui/page-header";
import { truncatePath } from "@/lib/opentrust/format";
import { Pill } from "@/components/ui/pill";
import { MetricInline } from "@/components/ui/metric";
import { EmptyState } from "@/components/ui/empty-state";
import { CodeBlock } from "@/components/code-block";
import { PiiSafe } from "@/components/pii-safe";
import { MarkdownPreviewWithModal } from "@/components/markdown-preview-with-modal";
import { Wrench, Package, Clock, FileJson, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArtifactLink } from "@/components/artifact-link";

function prettyJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

export const dynamic = "force-dynamic";

export default async function TraceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trace = getTraceDetail(decodeURIComponent(id));

  if (!trace) notFound();

  return (
    <>
      <PageHeader
        title={<PiiSafe>{trace.title ?? trace.id}</PiiSafe>}
        subtitle={
          <MarkdownPreviewWithModal
            content={trace.summary}
            modalTitle={<PiiSafe>{trace.title ?? trace.id}</PiiSafe>}
            className="markdown-preview--compact"
            emptyText="No summary available for this trace."
          />
        }
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Traces", href: "/traces" },
          { label: <PiiSafe>{trace.title ?? trace.id}</PiiSafe> },
        ]}
        actions={
          <Button asChild>
            <Link href={`/traces/${encodeURIComponent(trace.id)}/promote`}>
              <ArrowUpCircle size={14} />
              Promote to memory
            </Link>
          </Button>
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
            {trace.tools.map((tool) => {
              const status = tool.status === "error" ? "error" : tool.finished_at ? "success" : "info";
              const startTime = tool.started_at ? new Date(tool.started_at).getTime() : 0;
              const endTime = tool.finished_at ? new Date(tool.finished_at).getTime() : 0;
              const duration = endTime > startTime ? endTime - startTime : null;

              return (
                <div key={tool.id} className="list-item detail-stack" data-status={status}>
                  <div className="detail-stack__header">
                    <Pill
                      label={tool.status}
                      tone={tool.status === "error" ? "danger" : tool.finished_at ? "success" : "info"}
                    />
                    <span className="list-item__title detail-stack__title">{tool.tool_name}</span>
                    {duration && (
                      <span className="detail-stack__duration" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {duration}ms
                      </span>
                    )}
                    <span className="detail-stack__timestamp">{tool.started_at}</span>
                  </div>
                  <div className="detail-stack__body">
                    <PiiSafe>{tool.error_text ?? (tool.finished_at ? "Completed successfully." : "Awaiting paired result.")}</PiiSafe>
                  </div>
                  {(tool.result_json || tool.finished_at) && (
                    <details className="expandable" style={{ marginTop: 8 }}>
                      <summary>Result details</summary>
                      <div className="expandable__content">
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>
                          Finished: {tool.finished_at ?? "not yet paired"}
                        </p>
                        {tool.result_json ? (
                          <CodeBlock code={prettyJson(tool.result_json)} language="json" />
                        ) : (
                          <pre>No result payload captured.</pre>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            message="No tool calls captured for this trace. The trace may not have included any tool invocations."
            icon={<Wrench size={24} style={{ color: "var(--text-muted)" }} />}
          />
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
                  <ArtifactLink href={artifact.uri} className="list-item__subtitle">
                    {truncatePath(artifact.uri)}
                  </ArtifactLink>
                </div>
                <div className="list-item__meta">
                  <Pill label={artifact.kind} tone="neutral" />
                  <span style={{ fontSize: "0.6875rem", fontFamily: "var(--font-mono)" }}>{artifact.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message="No artifacts extracted for this trace. Artifacts represent files or resources referenced during execution."
            icon={<Package size={24} style={{ color: "var(--text-muted)" }} />}
          />
        )}
      </div>

      {/* Trace metadata */}
      {trace.metadata_json && trace.metadata_json !== "{}" && (
        <div className="section">
          <div className="section__header">
            <span className="section__title">Trace metadata</span>
            <span className="section__description">Raw metadata attached to this trace</span>
          </div>
          <CodeBlock code={prettyJson(trace.metadata_json)} language="json" filename="metadata.json" />
        </div>
      )}

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
                <div className="timeline__item-text"><PiiSafe>{event.text_preview ?? "No preview available."}</PiiSafe></div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message="No events captured for this trace. The event timeline shows the sequence of actions during execution."
            icon={<Clock size={24} style={{ color: "var(--text-muted)" }} />}
          />
        )}
      </div>
    </>
  );
}
