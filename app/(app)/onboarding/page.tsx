"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  IconApi,
  IconArrowRight,
  IconBook,
  IconBolt,
  IconChecklist,
  IconClock,
  IconDatabaseImport,
  IconPlayerPlayFilled,
  IconProgressCheck,
  IconRocket,
  IconRouteAltLeft,
  IconShieldCheck,
  IconStars,
  IconTopologyStar3,
} from "@tabler/icons-react";
import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Task = {
  id: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  eta: string;
};

type Phase = {
  id: string;
  name: string;
  summary: string;
  icon: typeof IconRocket;
  tasks: Task[];
};

const phases: Phase[] = [
  {
    id: "connect",
    name: "Connect your evidence sources",
    summary:
      "Point OpenTrust at the systems that already know what happened so the dashboard becomes operational instead of decorative.",
    icon: IconDatabaseImport,
    tasks: [
      {
        id: "ingest",
        title: "Run your first ingest",
        description:
          "Pull in OpenClaw traces, workflow runs, and artifacts so the overview starts with real evidence.",
        href: "/dashboard",
        actionLabel: "Open overview",
        eta: "5 min",
      },
      {
        id: "api",
        title: "Validate the Memory API contract",
        description:
          "Inspect the API playground to confirm the shape of data your memory layer will receive and serve.",
        href: "/api-playground",
        actionLabel: "Open API playground",
        eta: "3 min",
      },
    ],
  },
  {
    id: "inspect",
    name: "Inspect trust signals",
    summary:
      "Learn where evidence quality, provenance, and risky automation appear so operators know what to trust first.",
    icon: IconShieldCheck,
    tasks: [
      {
        id: "traces",
        title: "Review recent traces",
        description:
          "Check whether sessions, traces, and artifacts tell a coherent story with enough provenance to support memory promotion.",
        href: "/traces",
        actionLabel: "Open traces",
        eta: "7 min",
      },
      {
        id: "memory-review",
        title: "Visit the memory review queue",
        description:
          "See how draft memories move from raw evidence into curated memory with review state and origin references.",
        href: "/memory/review",
        actionLabel: "Review drafts",
        eta: "4 min",
      },
    ],
  },
  {
    id: "activate",
    name: "Activate the memory layer",
    summary:
      "Promote a draft, confirm retrieval surfaces, and make the system useful for daily operator workflows.",
    icon: IconRocket,
    tasks: [
      {
        id: "memory",
        title: "Explore curated memory",
        description:
          "Browse approved memory entries, retention classes, and provenance so you can verify what the system will recall later.",
        href: "/memory",
        actionLabel: "Open memory explorer",
        eta: "5 min",
      },
      {
        id: "workflows",
        title: "Check workflow automations",
        description:
          "Verify the orchestration layer is present and understand where recurring memory and trace flows will show up.",
        href: "/workflows",
        actionLabel: "Open workflows",
        eta: "4 min",
      },
    ],
  },
];

const quickWins = [
  "See live evidence on the overview instead of placeholder UI.",
  "Understand how traces become reviewable memory drafts.",
  "Verify curated memory retains provenance before promotion.",
  "Know where to inspect workflows when automations start writing back.",
] as const;

const resources = [
  {
    title: "Overview",
    description: "The operational snapshot: sessions, traces, workflows, and memory volume.",
    href: "/dashboard",
    icon: IconBolt,
  },
  {
    title: "Memory explorer",
    description: "Your durable, curated memory layer with retention and review state.",
    href: "/memory",
    icon: IconBook,
  },
  {
    title: "Workflow monitor",
    description: "Where recurring ingest, promotion, and orchestration health becomes visible.",
    href: "/workflows",
    icon: IconTopologyStar3,
  },
] as const;

export default function OnboardingPage() {
  const taskIds = phases.flatMap((phase) => phase.tasks.map((task) => task.id));
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(["ingest"]));

  const completedCount = completed.size;
  const totalCount = taskIds.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const nextTask = phases.flatMap((phase) => phase.tasks).find((task) => !completed.has(task.id));

  const toggleTask = (taskId: string) => {
    setCompleted((previous) => {
      const next = new Set(previous);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Onboarding"
        subtitle="Turn OpenTrust into a working memory layer: connect evidence, inspect trust signals, and activate curated memory workflows."
        breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Onboarding" }]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href={nextTask?.href ?? "/dashboard"}>
                <IconPlayerPlayFilled />
                {nextTask ? `Continue: ${nextTask.actionLabel}` : "Open dashboard"}
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/memory">
                <IconBook />
                Explore memory
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <Card className="border-primary/15 bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Badge variant="outline" className="mb-3">Operator setup</Badge>
                <CardTitle className="text-lg">A real first-run path for OpenTrust</CardTitle>
                <CardDescription className="mt-1 max-w-2xl">
                  This onboarding is structured around the actual product loop: ingest evidence, inspect provenance,
                  review memory candidates, and confirm the workflow layer is ready to keep the system current.
                </CardDescription>
              </div>
              <div className="rounded-xl border bg-background/80 px-3 py-2 text-right shadow-sm">
                <div className="text-2xl font-semibold text-foreground">{progress}%</div>
                <div className="text-sm text-muted-foreground">setup complete</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-foreground">Onboarding progress</div>
                <span className="ml-auto text-sm text-muted-foreground">
                  {completedCount}/{totalCount} tasks
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {quickWins.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border bg-background/70 p-3">
                  <span className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                    <IconProgressCheck className="size-4" />
                  </span>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-between gap-3 max-md:flex-col max-md:items-start">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconStars className="size-4 text-primary" />
              Recommended time: 20–30 minutes for a meaningful first pass.
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/traces">
                See recent traces
                <IconArrowRight />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">What success looks like</CardTitle>
            <CardDescription>
              By the end of onboarding, OpenTrust should feel operational, not like a component library demo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-xl border p-3">
              <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
                <IconRouteAltLeft className="size-4 text-primary" />
                Evidence is flowing
              </div>
              Dashboard, traces, and artifacts show real system activity.
            </div>
            <div className="rounded-xl border p-3">
              <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
                <IconChecklist className="size-4 text-primary" />
                Review path is obvious
              </div>
              Operators know where to inspect drafts before memory promotion.
            </div>
            <div className="rounded-xl border p-3">
              <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
                <IconShieldCheck className="size-4 text-primary" />
                Provenance is trustworthy
              </div>
              Curated memory remains attached to origins, retention, and review state.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <div className="space-y-4">
          {phases.map((phase, phaseIndex) => {
            const PhaseIcon = phase.icon;
            const phaseCompleted = phase.tasks.filter((task) => completed.has(task.id)).length;
            const phaseProgress = Math.round((phaseCompleted / phase.tasks.length) * 100);

            return (
              <Card key={phase.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <PhaseIcon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Phase {phaseIndex + 1}</Badge>
                        <span className="text-xs text-muted-foreground">{phaseCompleted}/{phase.tasks.length} complete</span>
                      </div>
                      <CardTitle>{phase.name}</CardTitle>
                      <CardDescription className="mt-1">{phase.summary}</CardDescription>
                    </div>
                    <CardAction>
                      <div className="rounded-lg border px-2 py-1 text-xs text-muted-foreground">
                        {phaseProgress}%
                      </div>
                    </CardAction>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {phase.tasks.map((task) => {
                    const isDone = completed.has(task.id);
                    return (
                      <div
                        key={task.id}
                        className={`rounded-2xl border p-4 transition-colors ${
                          isDone ? "border-primary/20 bg-primary/5" : "bg-background"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <Badge variant={isDone ? "default" : "outline"}>
                                {isDone ? "Completed" : "Next action"}
                              </Badge>
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <IconClock className="size-3.5" />
                                {task.eta}
                              </span>
                            </div>
                            <h3 className="font-medium text-foreground">{task.title}</h3>
                            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{task.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button asChild size="sm">
                              <Link href={task.href}>{task.actionLabel}</Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleTask(task.id)}
                            >
                              {isDone ? "Mark incomplete" : "Mark complete"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recommended route</CardTitle>
              <CardDescription>
                Follow the product loop instead of jumping between isolated demo widgets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Start with Overview to confirm data is present.",
                "Open Traces to inspect evidence quality and provenance.",
                "Review draft memory candidates before promotion.",
                "Finish in Memory and Workflows to verify the loop is durable.",
              ].map((step, index) => (
                <div key={step} className="flex gap-3 rounded-xl border p-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                    {index + 1}
                  </div>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Core surfaces to learn</CardTitle>
              <CardDescription>
                These are the screens operators will actually return to after onboarding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources.map((resource) => {
                const ResourceIcon = resource.icon;
                return (
                  <Link
                    key={resource.title}
                    href={resource.href}
                    className="flex items-start gap-3 rounded-xl border p-3 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <ResourceIcon className="size-4" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{resource.title}</div>
                      <div className="mt-1 text-muted-foreground">{resource.description}</div>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
