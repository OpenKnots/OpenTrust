import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
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
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 !h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage>{title ?? "Dashboard"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          {authMode ? <AuthControls mode={authMode} localBypass={!!allowLocalhostBypass} /> : null}
          {demo && <DemoModeBanner />}
        </div>
      </div>
    </header>
  );
}
