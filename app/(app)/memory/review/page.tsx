import { redirect } from "next/navigation";
import { listMemoryReviewQueue, updateMemoryEntryReview } from "@/lib/opentrust/memory-entries";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoMemoryEntries } from "@/lib/opentrust/demo-data";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import { ReviewActions } from "@/components/review-actions";
import { PiiSafe } from "@/components/pii-safe";

export const dynamic = "force-dynamic";

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

  return (
    <>
      <PageHeader
        title="Memory review"
        subtitle="Draft curated memory entries awaiting operator review. Review actions are explicit POST submissions, not query-string side effects."
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
                <span className="list-item__title"><PiiSafe>{entry.title}</PiiSafe></span>
                <span className="list-item__subtitle"><PiiSafe>{entry.summary ?? entry.body.slice(0, 260)}</PiiSafe></span>
                <div style={{ marginTop: 8, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {entry.origins.length} origin reference{entry.origins.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="list-item__meta" style={{ alignItems: "flex-end", gap: 8 }}>
                <span>{formatRelativeTime(entry.updated_at)}</span>
                <ReviewActions entryId={entry.id} formAction={updateReviewAction} />
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
