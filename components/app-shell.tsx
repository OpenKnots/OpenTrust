import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { getIngestionStates } from "@/lib/opentrust/ingestion-state";
import { formatRelativeTime } from "@/lib/opentrust/format";
import { Sidebar } from "@/components/sidebar";
import { CommandPalette } from "@/components/command-palette";

export function AppShell({ children }: { children: React.ReactNode }) {
  let latestIngest = "never";
  try {
    ensureBootstrapped();
    const states = getIngestionStates();
    const newest = states[0]?.last_run_at;
    if (newest) latestIngest = formatRelativeTime(newest);
  } catch {
    /* db may not exist yet */
  }

  return (
    <div className="app-shell-root">
      <Sidebar latestIngest={latestIngest} />
      <div className="app-shell">
        <main className="app-main">
          <div className="app-content">{children}</div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
