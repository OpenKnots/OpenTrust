"use client";

import { useCallback, useState, type ReactNode } from "react";
import { MarkdownPreview } from "@/components/markdown-preview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function isExternalNavigableLink(href: string | null): boolean {
  if (!href || href === "#") return false;
  return /^(https?:|mailto:|\/)/i.test(href);
}

type MarkdownPreviewWithModalProps = {
  content: string | null | undefined;
  modalTitle: ReactNode;
  className?: string;
  triggerClassName?: string;
  emptyText?: string;
};

/**
 * Renders Markdown in the previewer; clicking the preview (not external links)
 * opens the full text in a modal for comfortable reading.
 */
export function MarkdownPreviewWithModal({
  content,
  modalTitle,
  className,
  triggerClassName,
  emptyText = "No description available.",
}: MarkdownPreviewWithModalProps) {
  const [open, setOpen] = useState(false);
  const text = content?.trim() ?? "";

  const tryOpenFromEvent = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      if ("key" in e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
      } else {
        const link = (e.target as HTMLElement).closest("a");
        if (link && isExternalNavigableLink(link.getAttribute("href"))) {
          return;
        }
      }
      if (text) setOpen(true);
    },
    [text],
  );

  if (!text) {
    return <span style={{ color: "var(--text-muted)" }}>{emptyText}</span>;
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "markdown-preview-modal-trigger rounded-md outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring",
          triggerClassName,
        )}
        onClick={tryOpenFromEvent}
        onKeyDown={tryOpenFromEvent}
        aria-label="Open full description"
      >
        <MarkdownPreview content={text} className={className} />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="flex max-h-[85vh] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
          showCloseButton
        >
          <DialogHeader className="shrink-0 border-b border-border px-4 py-3">
            <DialogTitle className="pr-8">{modalTitle}</DialogTitle>
            <DialogDescription className="sr-only">
              Full trace description rendered from Markdown.
            </DialogDescription>
          </DialogHeader>
          <div className="markdown-preview-modal-body min-h-0 flex-1 overflow-y-auto px-4 py-3">
            <MarkdownPreview content={text} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
