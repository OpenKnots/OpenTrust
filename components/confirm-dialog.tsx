"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  type DialogFlipDirection,
} from "@/components/animate-ui/primitives/radix/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type ConfirmDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger";
  from?: DialogFlipDirection;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  from = "bottom",
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleConfirm = useCallback(async () => {
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
      setOpen(false);
    }
  }, [onConfirm]);

  const confirmButtonVariant = confirmVariant === "danger" ? "destructive" : "default";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent from={from}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" type="button">
                {cancelLabel}
              </Button>
            </DialogClose>
            <Button
              variant={confirmButtonVariant}
              type="button"
              disabled={pending}
              onClick={handleConfirm}
            >
              {pending && <span className="btn--loading" />}
              {confirmLabel}
            </Button>
          </DialogFooter>
          <DialogClose className="dialog-close">
            <X size={14} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
