"use client";

import { useState } from "react";
import { Onboarding01 } from "@/components/onboarding-01";
import { Onboarding02 } from "@/components/onboarding-02";
import { Onboarding04 } from "@/components/onboarding-04";
import { Onboarding06 } from "@/components/onboarding-06";
import { Onboarding07 } from "@/components/onboarding-07";
import { cn } from "@/lib/utils";

const blocks = [
  { id: "01", label: "Checklist", component: Onboarding01 },
  { id: "02", label: "Step Cards", component: Onboarding02 },
  { id: "04", label: "Accordion", component: Onboarding04 },
  { id: "06", label: "Timeline", component: Onboarding06 },
  { id: "07", label: "Progress", component: Onboarding07 },
] as const;

export default function OnboardingPage() {
  const [activeId, setActiveId] = useState<string>("01");
  const ActiveComponent =
    blocks.find((b) => b.id === activeId)?.component ?? Onboarding01;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-semibold text-foreground text-xl">Onboarding</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Choose an onboarding flow to get your workspace set up.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {blocks.map((block) => (
          <button
            key={block.id}
            onClick={() => setActiveId(block.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              activeId === block.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {block.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-card [&>div]:min-h-0">
        <ActiveComponent />
      </div>
    </div>
  );
}
