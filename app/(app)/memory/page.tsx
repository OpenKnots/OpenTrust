import Link from "next/link";
import { listMemoryEntries } from "@/lib/opentrust/memory-entries";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
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

export default async function MemoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ review?: string; retention?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const entries = listMemoryEntries({
    limit: 200,
    reviewStatus: typeof params.review === "string" ? (params.review as any) : undefined,
    retentionClass: typeof params.retention === "string" ? (params.retention as any) : undefined,
  });

  return (
    <>
      <PageHeader
        title="Memory"
        subtitle="Curated memory entries promoted from raw evidence with provenance and review state."
        breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Memory" }]}
      />

      <div className="filter-bar">
        <Link href="/memory" className="filter-chip">All</Link>
        <Link href="/memory?review=draft" className="filter-chip">Draft</Link>
        <Link href="/memory?review=approved" className="filter-chip">Approved</Link>
        <Link href="/memory?retention=working" className="filter-chip">Working</Link>
        <Link href="/memory?retention=longTerm" className="filter-chip">Long-term</Link>
        <Link href="/memory/review" className="filter-chip">Review queue</Link>
        <Link href="/memory/health" className="filter-chip">Health</Link>
      </div>

      {entries.length > 0 ? (
        <div className="card-grid">
          {entries.map((entry) => (
            <div key={entry.id} className="artifact-card">
              <div className="artifact-card__kind" style={{ flexWrap: "wrap", gap: 8 }}>
                <Pill label={entry.kind} tone="neutral" />
                <Pill label={entry.retention_class} tone={retentionTone(entry.retention_class)} />
                <Pill label={entry.review_status} tone={reviewTone(entry.review_status)} />
                <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                  {formatRelativeTime(entry.updated_at)}
                </span>
              </div>
              <div className="artifact-card__title">{entry.title}</div>
              <div className="list-item__subtitle" style={{ marginBottom: 10 }}>
                {entry.summary ?? entry.body.slice(0, 220)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                <div>{entry.origins.length} origin reference{entry.origins.length === 1 ? "" : "s"}</div>
                <div>
                  {entry.origins.length > 0
                    ? `origins: ${entry.origins.map((origin) => `${origin.origin_type}:${origin.origin_id}`).join(", ")}`
                    : "origins: none"}
                </div>
                <div>{entry.tags.length > 0 ? `tags: ${entry.tags.map((tag) => tag.tag).join(", ")}` : "no tags"}</div>
                <div>{entry.confidence_reason ?? "No confidence note recorded."}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No curated memory entries yet." />
      )}
    </>
  );
}
