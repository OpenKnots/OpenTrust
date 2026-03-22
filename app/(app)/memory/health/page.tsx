import Link from "next/link";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoOverview } from "@/lib/opentrust/demo-data";
import { memoryHealth } from "@/lib/opentrust/memory-api";
import { getOverview } from "@/lib/opentrust/overview";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import { PiiSafe } from "@/components/pii-safe";

export const dynamic = "force-dynamic";

function tone(status: string) {
  switch (status) {
    case "healthy":
      return "success" as const;
    case "attention":
      return "warning" as const;
    default:
      return "danger" as const;
  }
}

export default async function MemoryHealthPage() {
  const demo = await isDemoMode();
  const health = demo
    ? {
        scope: "global" as const,
        generatedAt: new Date().toISOString(),
        status: "attention" as const,
        signals: [
          { kind: "ingestion_freshness", status: "healthy" as const, summary: "All pipelines ran within the last hour.", metric: { name: "minutes_since_last_run", value: 15 } },
          { kind: "review_debt", status: "attention" as const, summary: "5 draft memory entries awaiting review.", metric: { name: "draft_count", value: 5 } },
          { kind: "semantic_coverage", status: "healthy" as const, summary: "284 chunks indexed, vector search operational.", metric: { name: "chunk_count", value: 284 } },
        ],
        stats: { total_entries: 14, approved: 7, draft: 5, reviewed: 2 },
      }
    : memoryHealth({ scope: "global" });
  const overview = demo ? getDemoOverview() : getOverview();
  const weakProvenanceCount = overview.recentMemoryEntries.filter((entry) => entry.origins.length === 0).length;

  return (
    <>
      <PageHeader
        title="Memory health"
        subtitle="Operational signals for curated memory, ingestion freshness, and review debt."
        breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Memory", href: "/memory" }, { label: "Health" }]}
      />

      <div className="stats-row">
        <div className="stats-row__item">
          <span className="stats-row__label">Status</span>
          <span className="stats-row__value">{health.status}</span>
        </div>
        <div className="stats-row__item">
          <span className="stats-row__label">Memory entries</span>
          <span className="stats-row__value">{overview.counts.memoryEntries}</span>
        </div>
        <div className="stats-row__item">
          <span className="stats-row__label">Drafts</span>
          <span className="stats-row__value">{overview.counts.memoryDrafts}</span>
        </div>
        <div className="stats-row__item">
          <span className="stats-row__label">Approved</span>
          <span className="stats-row__value">{overview.counts.memoryApproved}</span>
        </div>
        <div className="stats-row__item">
          <span className="stats-row__label">Weak provenance</span>
          <span className="stats-row__value">{weakProvenanceCount}</span>
        </div>
      </div>

      {health.signals.length > 0 ? (
        <div className="list-group">
          {health.signals.map((signal, index) => (
            <div key={`${signal.kind}:${index}`} className="list-item" style={{ cursor: "default" }}>
              <div className="list-item__content">
                <span className="list-item__title">{signal.kind}</span>
                <span className="list-item__subtitle"><PiiSafe>{signal.summary}</PiiSafe></span>
              </div>
              <div className="list-item__meta">
                <Pill label={signal.status} tone={tone(signal.status)} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No active memory health signals right now." />
      )}

      <div className="filter-bar">
        <Link href="/memory" className="filter-chip">Back to memory</Link>
        <Link href="/memory/review" className="filter-chip">Review queue</Link>
      </div>
    </>
  );
}
