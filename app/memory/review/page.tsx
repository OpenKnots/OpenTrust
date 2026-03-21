import { redirect } from "next/navigation";
import { listMemoryReviewQueue, updateMemoryEntryReview } from "@/lib/opentrust/memory-entries";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function MemoryReviewPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; action?: string }>;
}) {
  const params = (await searchParams) ?? {};

  if (params.id && params.action && ["approved", "reviewed", "rejected"].includes(params.action)) {
    updateMemoryEntryReview({
      id: params.id,
      reviewStatus: params.action as "approved" | "reviewed" | "rejected",
      reviewedBy: "operator",
    });
    redirect("/memory/review");
  }

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
              <div className="list-item__meta" style={{ alignItems: "flex-end", gap: 8 }}>
                <span>{formatRelativeTime(entry.updated_at)}</span>
                <a className="btn btn--ghost" href={`/memory/review?id=${encodeURIComponent(entry.id)}&action=reviewed`}>
                  Mark reviewed
                </a>
                <a className="btn btn--primary" href={`/memory/review?id=${encodeURIComponent(entry.id)}&action=approved`}>
                  Approve
                </a>
                <a className="btn btn--ghost" href={`/memory/review?id=${encodeURIComponent(entry.id)}&action=rejected`}>
                  Reject
                </a>
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
