import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthControls } from "@/components/auth-controls";
import { DemoModeBanner } from "@/components/demo-mode-banner";

export function SiteHeader({
  demo,
  title,
  authMode,
  allowLocalhostBypass,
}: {
  demo?: boolean;
  title?: string;
  authMode?: "none" | "token" | "password";
  allowLocalhostBypass?: boolean;
}) {
  return (
    <header className="brand-accent-line flex h-12 shrink-0 items-center transition-[width,height] ease-linear">
      <div className="flex w-full min-w-0 items-center gap-3 px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {title ?? "Dashboard"}
          </span>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span className="hidden text-[11px] font-medium tracking-wide text-muted-foreground sm:block">
            OpenTrust
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {demo && <DemoModeBanner />}
          {authMode ? <AuthControls mode={authMode} localBypass={!!allowLocalhostBypass} /> : null}
        </div>
      </div>
    </header>
  );
}
