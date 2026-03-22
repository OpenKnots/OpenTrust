import Link from "next/link";
import { IconArrowRight, IconCalendarMonth, IconSparkles } from "@tabler/icons-react";
import { listMemoryEntries } from "@/lib/opentrust/memory-entries";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoMemoryEntries } from "@/lib/opentrust/demo-data";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { CardGrid } from "@/components/ui/card-grid";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { PiiSafe } from "@/components/pii-safe";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Memory" }]}
        actions={
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/calendar"><IconCalendarMonth /> Calendar</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/memory/review">Review queue <IconArrowRight /></Link>
            </Button>
          </div>
        }
      />

      <div className="filter-bar">
        <Link href="/memory" className={`filter-chip${!reviewFilter && !retentionFilter ? " filter-chip--active" : ""}`}>All</Link>
        <Link href="/memory?review=draft" className={`filter-chip${reviewFilter === "draft" ? " filter-chip--active" : ""}`}>Draft</Link>
        <Link href="/memory?review=approved" className={`filter-chip${reviewFilter === "approved" ? " filter-chip--active" : ""}`}>Approved</Link>
        <Link href="/memory?retention=working" className={`filter-chip${retentionFilter === "working" ? " filter-chip--active" : ""}`}>Working</Link>
        <Link href="/memory?retention=longTerm" className={`filter-chip${retentionFilter === "longTerm" ? " filter-chip--active" : ""}`}>Long-term</Link>
        <Link href="/memory/review" className="filter-chip">Review queue</Link>
        <Link href="/memory/health" className="filter-chip">Health</Link>
      </div>

      {entries.length > 0 ? (
        <>
          <Card className="mb-4 border-primary/10 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><IconSparkles className="size-4 text-primary" /> Live memory is now active</CardTitle>
              <CardDescription>
                These entries came from the existing promotion flows. Keep using traces, artifacts, workflows, and investigations to grow the memory layer.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline"><Link href="/traces">Promote from traces</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/artifacts/promote">Promote from artifacts</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/investigations/promote">Promote from investigations</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/workflows">Promote from workflows</Link></Button>
            </CardContent>
          </Card>

          <CardGrid tone="info" storageKey="memory-list">
            {entries.map((entry) => (
              <PreviewCard key={entry.id}>
                <PreviewCardTrigger
                  render={
                    <Link href={`/memory/${encodeURIComponent(entry.id)}`} className="artifact-card" style={{ textDecoration: "none" }}>
                      <div className="artifact-card__kind" style={{ flexWrap: "wrap", gap: 8 }}>
                        <Pill label={entry.kind} tone="neutral" />
                        <StatusBadge label={entry.retention_class} tone={retentionTone(entry.retention_class)} />
                        <StatusBadge
                          label={entry.review_status}
                          status={
                            entry.review_status === "approved"
                              ? "healthy"
                              : entry.review_status === "reviewed"
                                ? "active"
                                : entry.review_status === "rejected"
                                  ? "degraded"
                                  : "attention"
                          }
                        />
                        <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                          {formatRelativeTime(entry.updated_at)}
                        </span>
                      </div>
                      <div className="artifact-card__title"><PiiSafe>{entry.title}</PiiSafe></div>
                      <div className="list-item__subtitle" style={{ marginBottom: 10 }}>
                        <PiiSafe>{entry.summary ?? entry.body.slice(0, 220)}</PiiSafe>
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
                  <div className="preview-card__title"><PiiSafe>{entry.title}</PiiSafe></div>
                  <div className="preview-card__text">
                    <MarkdownPreview content={entry.body.slice(0, 400)} />
                  </div>
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
        </>
      ) : (
        <div className="space-y-4">
          <Card className="border-primary/10 bg-primary/5">
            <CardHeader>
              <CardTitle>No curated memory entries yet</CardTitle>
              <CardDescription>
                OpenTrust memory is populated by the existing promote flows. Promote from traces, artifacts, investigations, or workflows and those entries will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild size="sm"><Link href="/traces">Go to traces</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/artifacts/promote">Promote artifacts</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/investigations/promote">Promote investigations</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/workflows">Open workflows</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/calendar">Open calendar</Link></Button>
            </CardContent>
          </Card>
          <EmptyState message="No curated memory entries yet." />
        </div>
      )}
    </>
  );
}
