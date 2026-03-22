import Link from "next/link";
import { IconArrowRight, IconCalendarMonth, IconSparkles } from "@tabler/icons-react";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoOverview, getDemoHealthSummary } from "@/lib/opentrust/demo-data";
import { summarizeHealth } from "@/lib/opentrust/health";
import { getOverview } from "@/lib/opentrust/overview";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function buildTableData(overview: ReturnType<typeof getOverview>) {
  let id = 1;
  const rows: {
    id: number;
    header: string;
    type: string;
    status: string;
    target: string;
    limit: string;
    reviewer: string;
  }[] = [];

  for (const trace of overview.recentTraces) {
    rows.push({
      id: id++,
      header: trace.title ?? trace.id,
      type: "Trace",
      status: trace.status === "completed" ? "Done" : "In Process",
      target: trace.session_label ?? "-",
      limit: "-",
      reviewer: "Assign reviewer",
    });
  }

  for (const wf of overview.recentWorkflows) {
    rows.push({
      id: id++,
      header: wf.name,
      type: "Workflow",
      status: wf.status === "completed" || wf.status === "done" ? "Done" : "In Process",
      target: wf.source_kind ?? "-",
      limit: "-",
      reviewer: "Assign reviewer",
    });
  }

  for (const artifact of overview.recentArtifacts.slice(0, 5)) {
    rows.push({
      id: id++,
      header: artifact.title ?? artifact.id,
      type: "Artifact",
      status: "Done",
      target: artifact.kind ?? "-",
      limit: "-",
      reviewer: "Assign reviewer",
    });
  }

  return rows;
}

export default async function DashboardPage() {
  const demo = await isDemoMode();
  const overview = demo ? getDemoOverview() : getOverview();
  const health = demo
    ? getDemoHealthSummary()
    : summarizeHealth({
        traces: overview.recentTraces,
        workflows: overview.recentWorkflows,
        ingestionStates: overview.ingestionStates,
      });

  const tableData = buildTableData(overview);

  return (
    <>
      <div className="brand-shimmer relative overflow-hidden rounded-xl border border-border/50 px-5 py-4 mx-4 lg:mx-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[#FF6F61]">
              <IconSparkles className="size-4 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Mission Control
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {overview.counts.traces} traces &middot; {overview.counts.workflows} workflows &middot; {overview.counts.memoryEntries} memories tracked
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
          </div>
        </div>
      </div>

      <SectionCards
        sessions={overview.counts.sessions}
        traces={overview.counts.traces}
        workflows={overview.counts.workflows}
        memoryEntries={overview.counts.memoryEntries}
        attentionTraces={health.attentionTraces}
        riskyWorkflows={health.riskyWorkflows}
      />

      <div className="grid gap-4 px-4 lg:px-0 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><IconSparkles className="size-4 text-primary" /> Memory activation</CardTitle>
            <CardDescription>
              Memories appear when you use the existing promote flows from traces, artifacts, investigations, and workflows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Current memory entries: <span className="font-medium text-foreground">{overview.counts.memoryEntries}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm"><Link href="/memory">Open memory <IconArrowRight /></Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/traces">Promote from traces</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/artifacts/promote">Promote artifacts</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/investigations/promote">Promote investigations</Link></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><IconCalendarMonth className="size-4 text-primary" /> Calendar view</CardTitle>
            <CardDescription>
              A claw-dash-inspired operational calendar that combines recurring schedule context with real memory activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Use it to see recurring schedule context next to promoted memory entries by day.
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm"><Link href="/calendar">Open calendar <IconArrowRight /></Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/memory">View memories</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-0">
        <ChartAreaInteractive />
      </div>
      <DataTable data={tableData} />
    </>
  );
}
