import Link from "next/link";
import { memoryHealth } from "@/lib/opentrust/memory-api";
import { getOverview } from "@/lib/opentrust/overview";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";

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

export default function MemoryHealthPage() {
  const health = memoryHealth({ scope: "global" });
  const overview = getOverview();
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
                <span className="list-item__subtitle">{signal.summary}</span>
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
