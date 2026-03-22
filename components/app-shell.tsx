import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoIngestionStates, getDemoMemoryEntries } from "@/lib/opentrust/demo-data";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { getIngestionStates } from "@/lib/opentrust/ingestion-state";
import { listMemoryEntries } from "@/lib/opentrust/memory-entries";
import { getOpenTrustAuthConfig } from "@/lib/opentrust/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const demo = await isDemoMode();
  const auth = getOpenTrustAuthConfig();
  let latestIngest = "never";
  let memoryCount = 0;
  let draftCount = 0;

  if (demo) {
    const states = getDemoIngestionStates();
    const newest = states[0]?.last_run_at;
    if (newest) latestIngest = formatRelativeTime(newest);
    const demoMemory = getDemoMemoryEntries();
    memoryCount = demoMemory.length;
    draftCount = demoMemory.filter((entry) => entry.review_status === "draft").length;
  } else {
    try {
      ensureBootstrapped();
      const states = getIngestionStates();
      const newest = states[0]?.last_run_at;
      if (newest) latestIngest = formatRelativeTime(newest);
      const liveMemory = listMemoryEntries({ limit: 500 });
      memoryCount = liveMemory.length;
      draftCount = liveMemory.filter((entry) => entry.review_status === "draft").length;
    } catch {
      /* db may not exist yet */
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar latestIngest={latestIngest} memoryCount={memoryCount} draftCount={draftCount} authLabel={auth.mode === "none" ? "unprotected" : `${auth.mode}${auth.allowLocalhostBypass ? " · localhost bypass" : ""}`} />
      <SidebarInset>
        <SiteHeader demo={demo} authMode={auth.mode} allowLocalhostBypass={auth.allowLocalhostBypass} />
        <div className="flex min-w-0 max-w-full flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
      <CommandPalette />
    </SidebarProvider>
  );
}
