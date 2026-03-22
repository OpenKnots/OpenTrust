import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtifactById } from "@/lib/opentrust/artifacts";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { getMemoryEntry } from "@/lib/opentrust/memory-entries";
import { getTraceDetail } from "@/lib/opentrust/trace-details";
import { getWorkflowDetail } from "@/lib/opentrust/workflow-details";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { MetricInline } from "@/components/ui/metric";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

function retentionTone(retentionClass: string) {
  switch (retentionClass) {
    case "pinned":
      return "danger" as const;
    case "longTerm":
      return "success" as const;
    case "working":
      return "info" as const;
    default:
      return "neutral" as const;
  }
}

function reviewTone(reviewStatus: string) {
  switch (reviewStatus) {
    case "approved":
      return "success" as const;
    case "reviewed":
      return "accent" as const;
    case "rejected":
      return "danger" as const;
    default:
      return "warning" as const;
  }
}

function originHref(originType: string, originId: string) {
  if (originType === "trace") return `/traces/${encodeURIComponent(originId)}`;
  if (originType === "workflowRun") return `/workflows/${encodeURIComponent(originId)}`;
  if (originType === "artifact") return "/artifacts";
  if (originType === "memoryEntry") return `/memory/${encodeURIComponent(originId)}`;
  return null;
}

function resolveOrigin(originType: string, originId: string) {
  if (originType === "trace") {
    const trace = getTraceDetail(originId);
    return trace
      ? {
          label: trace.title ?? trace.id,
          summary: trace.summary ?? `trace in ${trace.session_label ?? "unknown session"}`,
          meta: `updated ${formatRelativeTime(trace.updated_at)}`,
        }
      : null;
  }

  if (originType === "workflowRun") {
    const workflow = getWorkflowDetail(originId);
    return workflow
      ? {
          label: workflow.name,
          summary: workflow.summary ?? `${workflow.status} workflow run`,
          meta: `updated ${formatRelativeTime(workflow.updated_at)}`,
        }
      : null;
  }

  if (originType === "artifact") {
    const artifact = getArtifactById(originId);
    return artifact
      ? {
          label: artifact.title ?? artifact.id,
          summary: artifact.uri,
          meta: `${artifact.kind} · ${formatRelativeTime(artifact.created_at)}`,
        }
      : null;
  }

  if (originType === "memoryEntry") {
    const memory = getMemoryEntry(originId);
    return memory
      ? {
          label: memory.title,
          summary: memory.summary ?? memory.body.slice(0, 120),
          meta: `${memory.review_status} · ${formatRelativeTime(memory.updated_at)}`,
        }
      : null;
  }

  return null;
}

export default async function MemoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getMemoryEntry(decodeURIComponent(id));

  if (!entry) notFound();

  return (
    <>
      <PageHeader
        title={entry.title}
        subtitle={entry.summary ?? "Curated memory entry with provenance and review metadata."}
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Memory", href: "/memory" },
          { label: entry.title },
        ]}
        actions={
          <Link className="btn btn--ghost" href="/memory/review">
            Open review queue
          </Link>
        }
      />

      <div className="metadata-bar">
        <MetricInline label="Kind" value={entry.kind} />
        <MetricInline label="Retention" value={entry.retention_class} />
        <MetricInline label="Review" value={entry.review_status} />
        <MetricInline label="Origins" value={String(entry.origins.length)} />
        <MetricInline label="Updated" value={formatRelativeTime(entry.updated_at)} />
        <MetricInline label="Entry ID" value={entry.id} mono />
      </div>

      <div className="section">
        <div className="section__header">
          <span className="section__title">Memory posture</span>
          <span className="section__description">How this entry is currently classified and trusted.</span>
        </div>
        <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div className="artifact-card">
            <div className="artifact-card__kind"><Pill label={entry.retention_class} tone={retentionTone(entry.retention_class)} /></div>
            <div className="artifact-card__title">Retention</div>
            <div className="list-item__subtitle">Controls expected lifetime and retrieval weight.</div>
          </div>
          <div className="artifact-card">
            <div className="artifact-card__kind"><Pill label={entry.review_status} tone={reviewTone(entry.review_status)} /></div>
            <div className="artifact-card__title">Review state</div>
            <div className="list-item__subtitle">Reviewed at: {entry.reviewed_at ?? "not reviewed yet"}</div>
          </div>
          <div className="artifact-card">
            <div className="artifact-card__kind"><Pill label={entry.confidence_score != null ? `${entry.confidence_score}` : "unknown"} tone="neutral" /></div>
            <div className="artifact-card__title">Confidence</div>
            <div className="list-item__subtitle">{entry.confidence_reason ?? "No confidence note recorded."}</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <span className="section__title">Entry body</span>
          <span className="section__description">The actual curated memory content.</span>
        </div>
        <div className="artifact-card">
          <div className="list-item__subtitle" style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "var(--text)" }}>
            {entry.body}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <span className="section__title">Uncertainty and review notes</span>
          <span className="section__description">What remains uncertain or operationally important.</span>
        </div>
        <div className="card-grid">
          <div className="artifact-card">
            <div className="artifact-card__title">Uncertainty summary</div>
            <div className="list-item__subtitle">{entry.uncertainty_summary ?? "No uncertainty summary recorded."}</div>
          </div>
          <div className="artifact-card">
            <div className="artifact-card__title">Author</div>
            <div className="list-item__subtitle">{entry.author_type}{entry.author_id ? `:${entry.author_id}` : ""}</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <span className="section__title">Provenance</span>
          <span className="section__description">Origin references supporting this curated memory entry.</span>
        </div>
        {entry.origins.length > 0 ? (
          <div className="list-group">
            {entry.origins.map((origin, index) => {
              const href = originHref(origin.origin_type, origin.origin_id);
              const resolved = resolveOrigin(origin.origin_type, origin.origin_id);
              return (
                <div key={`${origin.origin_type}:${origin.origin_id}:${index}`} className="list-item" style={{ cursor: "default", alignItems: "flex-start" }}>
                  <div className="list-item__content">
                    <span className="list-item__title">{resolved?.label ?? `${origin.origin_type}:${origin.origin_id}`}</span>
                    <span className="list-item__subtitle">
                      {resolved?.summary ?? `relationship: ${origin.relationship}`}
                    </span>
                    <span className="list-item__subtitle" style={{ fontSize: "0.75rem" }}>
                      {origin.origin_type}:{origin.origin_id} · {origin.relationship}{resolved?.meta ? ` · ${resolved.meta}` : ""}
                    </span>
                  </div>
                  <div className="list-item__meta">
                    {href ? <Link className="btn btn--ghost" href={href}>Open origin</Link> : <Pill label="linked" tone="neutral" />}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState message="No origin references are attached to this memory entry." />
        )}
      </div>

      <div className="section">
        <div className="section__header">
          <span className="section__title">Tags</span>
          <span className="section__description">Simple labels used to cluster or filter memory.</span>
        </div>
        {entry.tags.length > 0 ? (
          <div className="filter-bar">
            {entry.tags.map((tag) => (
              <span key={tag.tag} className="filter-chip">{tag.tag}</span>
            ))}
          </div>
        ) : (
          <EmptyState message="No tags attached to this memory entry." />
        )}
      </div>
    </>
  );
}
