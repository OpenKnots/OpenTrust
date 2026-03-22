import Link from "next/link";
import { redirect } from "next/navigation";
import {
  IconArrowRight,
  IconClock,
  IconListCheck,
  IconRoute,
  IconSparkles,
} from "@tabler/icons-react";
import { listMemoryReviewQueue, updateMemoryEntryReview } from "@/lib/opentrust/memory-entries";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoMemoryEntries } from "@/lib/opentrust/demo-data";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import { ReviewActions } from "@/components/review-actions";
import { PiiSafe } from "@/components/pii-safe";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default async function MemoryReviewPage() {
  async function updateReviewAction(formData: FormData) {
    "use server";

    const id = formData.get("id");
    const action = formData.get("action");

    if (typeof id !== "string") {
      redirect("/memory/review");
    }

    if (action === "approved" || action === "reviewed" || action === "rejected") {
      updateMemoryEntryReview({
        id,
        reviewStatus: action,
        reviewedBy: "operator",
      });
    }

    redirect("/memory/review");
  }

  const demo = await isDemoMode();
  const entries = demo
    ? getDemoMemoryEntries().filter((e) => e.review_status === "draft")
    : listMemoryReviewQueue(200);

  const totalOrigins = entries.reduce((sum, entry) => sum + entry.origins.length, 0);
  const avgOrigins = entries.length > 0 ? (totalOrigins / entries.length).toFixed(1) : "0";
  const oldestDraft = entries[entries.length - 1];

  return (
    <>
      <PageHeader
        title="Memory review"
        subtitle="Review draft curated memory entries, inspect provenance density, and explicitly decide what becomes part of the durable memory layer."
        breadcrumbs={[{ label: "Overview", href: "/" }, { label: "Memory", href: "/memory" }, { label: "Review" }]}
        actions={
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/memory">Open memory</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/calendar">Open calendar <IconArrowRight /></Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Drafts awaiting review"
          value={entries.length}
          subtitle="Curated candidates not yet accepted or rejected"
          tone="warning"
          icon={<IconListCheck className="size-4" />}
        />
        <MetricCard
          label="Average provenance density"
          value={avgOrigins}
          subtitle="Average origin refs per entry in this queue"
          tone="info"
          icon={<IconRoute className="size-4" />}
        />
        <MetricCard
          label="Oldest draft activity"
          value={oldestDraft ? formatRelativeTime(oldestDraft.updated_at) : "—"}
          subtitle="Use this to spot stale review work"
          tone="accent"
          icon={<IconClock className="size-4" />}
        />
      </div>

      {entries.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_340px]">
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="border-white/8 bg-card/80 backdrop-blur-sm">
                <CardHeader className="gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Pill label={entry.kind} tone="neutral" />
                        <Pill label={entry.retention_class} tone={retentionTone(entry.retention_class)} />
                        <StatusBadge label={entry.review_status} status="attention" />
                        <span className="text-xs text-muted-foreground">
                          updated {formatRelativeTime(entry.updated_at)}
                        </span>
                      </div>
                      <CardTitle className="text-lg"><PiiSafe>{entry.title}</PiiSafe></CardTitle>
                      <CardDescription className="mt-2 text-sm leading-6">
                        <PiiSafe>{entry.summary ?? entry.body.slice(0, 260)}</PiiSafe>
                      </CardDescription>
                    </div>
                    <div className="w-full xl:w-[220px]">
                      <ReviewActions entryId={entry.id} formAction={updateReviewAction} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
                  <div className="rounded-2xl border bg-background/50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <IconSparkles className="size-4 text-primary" />
                      Review summary
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">Origins:</span> {entry.origins.length} supporting reference{entry.origins.length === 1 ? "" : "s"}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Confidence note:</span> {entry.confidence_reason ?? "No explicit confidence note recorded."}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Uncertainty:</span> {entry.uncertainty_summary ?? "No uncertainty summary recorded."}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-background/50 p-4">
                    <div className="mb-2 text-sm font-medium text-foreground">Provenance preview</div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {entry.origins.length > 0 ? (
                        entry.origins.slice(0, 3).map((origin, index) => (
                          <div key={`${origin.origin_type}:${origin.origin_id}:${index}`} className="rounded-xl border bg-muted/25 px-3 py-2">
                            <div className="font-medium text-foreground">
                              {origin.origin_type}:{origin.origin_id}
                            </div>
                            <div className="text-xs text-muted-foreground">relationship: {origin.relationship}</div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-dashed px-3 py-3 text-xs">No origin references attached.</div>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/memory/${encodeURIComponent(entry.id)}`}>Open full review detail</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review guidance</CardTitle>
                <CardDescription>
                  Use the queue like an operator console, not just a moderation list.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="rounded-xl border p-3">
                  <div className="font-medium text-foreground">Approve</div>
                  Durable memory worth preserving as part of the system’s trusted recall layer.
                </div>
                <div className="rounded-xl border p-3">
                  <div className="font-medium text-foreground">Mark reviewed</div>
                  Useful entry that still needs follow-up edits, better provenance, or retention tuning.
                </div>
                <div className="rounded-xl border p-3">
                  <div className="font-medium text-foreground">Reject</div>
                  Weak, noisy, or misleading candidate that should not remain in the queue.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Suggested operator loop</CardTitle>
                <CardDescription>
                  Review fastest when you follow the same rhythm for every candidate.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>1. Read the summary and provenance density.</div>
                <div>2. Open detail only when the candidate is ambiguous.</div>
                <div>3. Approve strong entries quickly.</div>
                <div>4. Reject noisy candidates instead of letting the queue grow stale.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <EmptyState message="No draft memory entries awaiting review." />
      )}
    </>
  );
}
