"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconShieldCheck, IconLogout } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function AuthControls({
  mode,
  localBypass,
}: {
  mode: "none" | "token" | "password";
  localBypass: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (mode === "none") return null;

  const detail = `${mode}${localBypass ? " · localhost bypass" : ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          />
        }
      >
        <IconShieldCheck className="size-3.5" />
        <span className="hidden sm:inline">Protected</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-44">
        <DropdownMenuLabel>Auth: {detail}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={busy}>
          <IconLogout className="size-3.5" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
