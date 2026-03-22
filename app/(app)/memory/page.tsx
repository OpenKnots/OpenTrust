import Link from "next/link";
import { listMemoryEntries } from "@/lib/opentrust/memory-entries";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoMemoryEntries } from "@/lib/opentrust/demo-data";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { CardGrid } from "@/components/ui/card-grid";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPanel,
} from "@/components/animate-ui/components/base/preview-card";

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
  const demo = await isDemoMode();
  const params = (await searchParams) ?? {};
  const reviewFilter = typeof params.review === "string" ? params.review : undefined;
  const retentionFilter = typeof params.retention === "string" ? params.retention : undefined;

  const entries = demo
    ? getDemoMemoryEntries().filter((e) => {
        if (reviewFilter && e.review_status !== reviewFilter) return false;
        if (retentionFilter && e.retention_class !== retentionFilter) return false;
        return true;
      })
    : listMemoryEntries({
        limit: 200,
        reviewStatus: reviewFilter as any,
        retentionClass: retentionFilter as any,
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
        <CardGrid tone="info" storageKey="memory-list">
          {entries.map((entry) => (
            <PreviewCard key={entry.id}>
              <PreviewCardTrigger
                render={
                  <Link href={`/memory/${encodeURIComponent(entry.id)}`} className="artifact-card" style={{ textDecoration: "none" }}>
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
                  </Link>
                }
              />
              <PreviewCardPanel side="right" sideOffset={12} align="start">
                <div className="preview-card__title">{entry.title}</div>
                <div className="preview-card__text">{entry.body.slice(0, 400)}</div>
                <div className="preview-card__divider" />
                <div className="preview-card__meta">
                  <Pill label={entry.review_status} tone={reviewTone(entry.review_status)} />
                  <Pill label={entry.retention_class} tone={retentionTone(entry.retention_class)} />
                </div>
                {entry.tags.length > 0 && (
                  <div className="preview-card__tags">
                    {entry.tags.map((tag) => (
                      <Pill key={tag.tag} label={tag.tag} tone="neutral" />
                    ))}
                  </div>
                )}
              </PreviewCardPanel>
            </PreviewCard>
          ))}
        </CardGrid>
      ) : (
        <EmptyState message="No curated memory entries yet." />
      )}
    </>
  );
}
