"use client";

import * as React from "react";
import { IconLoader2 } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuickNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickNoteDialog({ open, onOpenChange }: QuickNoteDialogProps) {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function reset() {
    setTitle("");
    setBody("");
    setTags("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      setError("Title and note content are required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        kind: "memoryEntry",
        title: trimmedTitle,
        body: trimmedBody,
        retentionClass: "working",
        originRefs: [],
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        author: { type: "user" },
        review: { status: "draft" },
      };

      const res = await fetch("/api/memory/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }

      reset();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Quick Note</DialogTitle>
            <DialogDescription>
              Add a note to memory. It will appear in the review queue as a
              draft.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="quick-note-title">Title</Label>
              <Input
                id="quick-note-title"
                placeholder="e.g. Deploy checklist update"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="quick-note-body">Note</Label>
              <Textarea
                id="quick-note-body"
                placeholder="Write your note..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-24"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="quick-note-tags">
                Tags{" "}
                <span className="font-normal text-muted-foreground">
                  (comma-separated, optional)
                </span>
              </Label>
              <Input
                id="quick-note-tags"
                placeholder="e.g. ops, reminder"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={submitting}>
              {submitting && <IconLoader2 className="animate-spin" />}
              {submitting ? "Saving..." : "Save to Memory"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
