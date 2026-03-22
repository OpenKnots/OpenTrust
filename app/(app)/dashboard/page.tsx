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
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

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
      target: wf.source_kind === "cron" ? "Scheduled" : (wf.source_kind ?? "-"),
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
      <HeroHighlight
        containerClassName="mx-4 overflow-hidden rounded-2xl border border-border/50 py-16 lg:mx-0 lg:py-20"
        className="max-w-4xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground backdrop-blur-sm">
            <IconSparkles className="size-3.5 text-primary" />
            OpenClaw remembers.
          </div>

          <h1 className="text-balance px-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <Highlight className="px-3 py-1.5 text-foreground dark:text-white">
              OpenTrust Clarifies.
            </Highlight>
          </h1>

          <p className="mt-6 max-w-2xl px-4 text-sm leading-6 text-muted-foreground sm:text-base">
            {overview.counts.memoryEntries < 50 || overview.counts.traces < 50 || overview.counts.workflows < 50
              ? "Memories stored in operational layers across traces and workflows."
              : `${overview.counts.memoryEntries} memories shaped into a cleaner operational layer across ${overview.counts.traces} traces and ${overview.counts.workflows} workflows.`}
          </p>
        </div>
      </HeroHighlight>

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
            <div className="grid gap-2 sm:grid-cols-3">
              <Link href="/traces" className="rounded-xl border bg-muted/30 px-3 py-3 text-sm transition-colors hover:bg-muted/50">
                <div className="font-medium text-foreground">Trace details</div>
                <div className="mt-1 text-muted-foreground">Open sessions and promote notable trace outcomes into memory.</div>
              </Link>
              <Link href="/artifacts/promote" className="rounded-xl border bg-muted/30 px-3 py-3 text-sm transition-colors hover:bg-muted/50">
                <div className="font-medium text-foreground">Artifact promotion</div>
                <div className="mt-1 text-muted-foreground">Turn docs, repos, and links into reviewable memory entries.</div>
              </Link>
              <Link href="/investigations/promote" className="rounded-xl border bg-muted/30 px-3 py-3 text-sm transition-colors hover:bg-muted/50">
                <div className="font-medium text-foreground">Investigation promotion</div>
                <div className="mt-1 text-muted-foreground">Promote saved SQL findings directly into the memory layer.</div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><IconCalendarMonth className="size-4 text-primary" /> Calendar view</CardTitle>
            <CardDescription>
              Operational calendar that combines recurring schedule context with real memory activity.
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
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/calendar?view=week&mode=grid" className="rounded-xl border bg-muted/30 px-3 py-3 text-sm transition-colors hover:bg-muted/50">
                <div className="font-medium text-foreground">Week grid</div>
                <div className="mt-1 text-muted-foreground">See recurring schedule context and memory activity by day.</div>
              </Link>
              <Link href="/calendar?view=week&mode=agenda" className="rounded-xl border bg-muted/30 px-3 py-3 text-sm transition-colors hover:bg-muted/50">
                <div className="font-medium text-foreground">Agenda mode</div>
                <div className="mt-1 text-muted-foreground">Use a claw-dash-style list view for a denser operational timeline.</div>
              </Link>
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
