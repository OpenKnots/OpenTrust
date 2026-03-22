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
    <header className="flex h-12 shrink-0 items-center transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-3 px-4">
        <SidebarTrigger className="-ml-1" />
        <span className="text-sm font-medium text-muted-foreground">
          {title ?? "Dashboard"}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {demo && <DemoModeBanner />}
          {authMode ? <AuthControls mode={authMode} localBypass={!!allowLocalhostBypass} /> : null}
        </div>
      </div>
    </header>
  );
}
