"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconLock, IconShieldCheck, IconTopologyStar3 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";

export default function LoginClient({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [credential, setCredential] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setRetryAfter(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !data?.ok) {
        const retryAfterHeader = response.headers.get("retry-after");
        if (retryAfterHeader) {
          const seconds = Number(retryAfterHeader);
          if (Number.isFinite(seconds) && seconds > 0) {
            setRetryAfter(seconds);
          }
        }
        setError(data?.error ?? "Authentication failed.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Unable to reach the authentication endpoint.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_30%),var(--background)] px-4 py-12">
      <div className="grid w-full max-w-4xl gap-4 lg:grid-cols-[minmax(0,1.1fr)_420px]">
        <Card className="border-white/10 bg-background/70 backdrop-blur-xl">
          <CardHeader>
            <Pill label="strict access mode" tone="danger" />
            <CardTitle className="mt-3 text-3xl">OpenTrust is protected before evidence loads</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6">
              This surface reads local operator evidence, traces, workflows, and curated memory. In protected mode,
              the app requires authentication before the server can access and render that data.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
              <IconLock className="mb-3 size-5 text-primary" />
              <div className="font-medium text-foreground">App-boundary auth</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Authentication protects the web surface, not the SQLite file directly.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
              <IconShieldCheck className="mb-3 size-5 text-primary" />
              <div className="font-medium text-foreground">Remote-safe posture</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Non-local access is denied until a valid token or password is presented.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
              <IconTopologyStar3 className="mb-3 size-5 text-primary" />
              <div className="font-medium text-foreground">Session-scoped access</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Successful auth establishes a protected session cookie for this app.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-background/80 shadow-2xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Authenticate to continue</CardTitle>
            <CardDescription>
              Enter the configured OpenTrust token or password to access protected routes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="credential">
                  Credential
                </label>
                <Input
                  id="credential"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter token or password"
                  value={credential}
                  onChange={(event) => setCredential(event.target.value)}
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  <div>{error}</div>
                  {retryAfter ? (
                    <div className="mt-1 text-xs text-red-100/80">
                      Retry after about {retryAfter} second{retryAfter === 1 ? "" : "s"}.
                    </div>
                  ) : null}
                </div>
              ) : null}

              <Button className="w-full" disabled={submitting || !credential.trim()} type="submit">
                {submitting ? "Authenticating…" : "Unlock OpenTrust"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
