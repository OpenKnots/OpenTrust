import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { isAuthenticatedRequest } from "@/lib/opentrust/auth";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authed = await isAuthenticatedRequest();
  if (!authed) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
