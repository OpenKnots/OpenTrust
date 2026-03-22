"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconLock, IconLogout } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";

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

  return (
    <div className="flex items-center gap-2">
      <Pill label={`auth: ${mode}`} tone="accent" />
      {localBypass ? <Pill label="localhost bypass" tone="neutral" /> : null}
      <Button size="sm" variant="outline" onClick={handleLogout} disabled={busy}>
        <IconLock />
        <span className="hidden sm:inline">Protected</span>
        <IconLogout className="ml-1" />
      </Button>
    </div>
  );
}
