import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoIngestionStates } from "@/lib/opentrust/demo-data";
import { getIngestionStates } from "@/lib/opentrust/ingestion-state";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import { DemoModeBanner } from "@/components/demo-mode-banner";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const demo = await isDemoMode();
  let latestIngest = "never";

  if (demo) {
    const states = getDemoIngestionStates();
    const newest = states[0]?.last_run_at;
    if (newest) latestIngest = formatRelativeTime(newest);
  } else {
    try {
      ensureBootstrapped();
      const states = getIngestionStates();
      const newest = states[0]?.last_run_at;
      if (newest) latestIngest = formatRelativeTime(newest);
    } catch {
      /* db may not exist yet */
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar latestIngest={latestIngest} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 !h-4" />
          {demo && <DemoModeBanner />}
        </header>
        <main className="flex-1">
          <div className="app-content">{children}</div>
        </main>
      </SidebarInset>
      <CommandPalette />
    </SidebarProvider>
  );
}
