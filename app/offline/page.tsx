export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-sm space-y-4 text-center">
        <div className="text-5xl">📡</div>
        <h1 className="text-2xl font-semibold text-foreground">You're offline</h1>
        <p className="text-sm text-muted-foreground">
          OpenTrust needs a network connection to load. Please check your
          connection and try again.
        </p>
        <button
          onClick={() => location.reload()}
          className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
