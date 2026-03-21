import { listMemoryReviewQueue } from "@/lib/opentrust/memory-entries";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default function MemoryReviewPage() {
  const entries = listMemoryReviewQueue(200);

  return (
    <>
      <PageHeader
        title="Memory review"
        subtitle="Draft curated memory entries awaiting operator review."
        breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Memory", href: "/memory" }, { label: "Review" }]}
      />

      {entries.length > 0 ? (
        <div className="list-group">
          {entries.map((entry) => (
            <div key={entry.id} className="list-item" style={{ cursor: "default", alignItems: "flex-start" }}>
              <div className="list-item__content">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  <Pill label={entry.kind} tone="neutral" />
                  <Pill label={entry.retention_class} tone="info" />
                  <Pill label={entry.review_status} tone="warning" />
                </div>
                <span className="list-item__title">{entry.title}</span>
                <span className="list-item__subtitle">{entry.summary ?? entry.body.slice(0, 260)}</span>
                <div style={{ marginTop: 8, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {entry.origins.length} origin reference{entry.origins.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="list-item__meta">
                <span>{formatRelativeTime(entry.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No draft memory entries awaiting review." />
      )}
    </>
  );
}
