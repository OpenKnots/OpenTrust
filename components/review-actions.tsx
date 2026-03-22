"use client";

import { useRef } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";

type ReviewActionsProps = {
  entryId: string;
  formAction: (formData: FormData) => void | Promise<void>;
};

export function ReviewActions({ entryId, formAction }: ReviewActionsProps) {
  const approveRef = useRef<HTMLFormElement>(null);
  const rejectRef = useRef<HTMLFormElement>(null);
  const reviewRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <form ref={reviewRef} action={formAction} style={{ display: "none" }}>
        <input type="hidden" name="id" value={entryId} />
        <input type="hidden" name="action" value="reviewed" />
      </form>
      <form ref={approveRef} action={formAction} style={{ display: "none" }}>
        <input type="hidden" name="id" value={entryId} />
        <input type="hidden" name="action" value="approved" />
      </form>
      <form ref={rejectRef} action={formAction} style={{ display: "none" }}>
        <input type="hidden" name="id" value={entryId} />
        <input type="hidden" name="action" value="rejected" />
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
        <ConfirmDialog
          trigger={
            <button className="btn btn--ghost" type="button">
              Mark reviewed
            </button>
          }
          title="Mark as reviewed?"
          description="This will mark the memory entry as reviewed without approving or rejecting it."
          confirmLabel="Mark reviewed"
          from="bottom"
          onConfirm={() => reviewRef.current?.requestSubmit()}
        />
        <ConfirmDialog
          trigger={
            <button className="btn btn--primary" type="button">
              Approve
            </button>
          }
          title="Approve memory entry?"
          description="This will approve the draft memory entry, making it part of the durable curated memory store."
          confirmLabel="Approve"
          from="bottom"
          onConfirm={() => approveRef.current?.requestSubmit()}
        />
        <ConfirmDialog
          trigger={
            <button className="btn btn--ghost" type="button">
              Reject
            </button>
          }
          title="Reject memory entry?"
          description="This will reject the draft memory entry. It will no longer appear in the review queue."
          confirmLabel="Reject"
          confirmVariant="danger"
          from="bottom"
          onConfirm={() => rejectRef.current?.requestSubmit()}
        />
      </div>
    </>
  );
}
