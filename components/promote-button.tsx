"use client";

import { useRouter } from "next/navigation";
import { ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";

type PromoteButtonProps = {
  href: string;
  itemTitle: string;
  label?: string;
  children?: React.ReactNode;
};

export function PromoteButton({
  href,
  itemTitle,
  label = "Promote",
  children,
}: PromoteButtonProps) {
  const router = useRouter();

  return (
    <ConfirmDialog
      trigger={
        children ?? (
          <Button type="button">
            <ArrowUpCircle size={14} />
            {label}
          </Button>
        )
      }
      title="Promote to memory"
      description={`This will create a draft memory entry for "${itemTitle}" and send it to the review queue.`}
      confirmLabel="Promote"
      from="bottom"
      onConfirm={() => {
        router.push(href);
      }}
    />
  );
}
