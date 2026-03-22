import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoIngestionStates } from "@/lib/opentrust/demo-data";
import { getIngestionStates } from "@/lib/opentrust/ingestion-state";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { Sidebar } from "@/components/sidebar";
import { CommandPalette } from "@/components/command-palette";
import { DemoModeBanner } from "@/components/demo-mode-banner";

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
    <div className="app-shell-root">
      <Sidebar latestIngest={latestIngest} />
      <div className="app-shell">
        {demo && <DemoModeBanner />}
        <main className="app-main">
          <div className="app-content">{children}</div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
