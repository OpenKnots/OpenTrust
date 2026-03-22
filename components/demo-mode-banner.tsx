"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

export function DemoModeBanner() {
  const router = useRouter();

  function disable() {
    document.cookie = "opentrust.demo-mode=false; path=/; SameSite=Lax";
    router.refresh();
  }

  return (
    <div className="demo-banner">
      <Eye size={14} />
      <span>Viewing demo data</span>
      <button type="button" className="demo-banner__dismiss" onClick={disable}>
        Exit demo
      </button>
    </div>
  );
}
