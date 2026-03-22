import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoIngestionStates } from "@/lib/opentrust/demo-data";
import { getIngestionStates } from "@/lib/opentrust/ingestion-state";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
        <SiteHeader demo={demo} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
      <CommandPalette />
    </SidebarProvider>
  );
}
