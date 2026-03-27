"use client";

import { useEffect } from "react";

export default function InvestigationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          This section encountered an error. Your data is safe.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Back to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
