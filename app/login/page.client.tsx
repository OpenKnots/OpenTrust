"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowRight,
  IconLock,
  IconShieldCheck,
  IconTopologyStar3,
  IconWaveSine,
} from "@tabler/icons-react";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(107,114,255,0.22),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(59,130,246,0.2),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_24%),linear-gradient(180deg,#050816_0%,#070b18_42%,#05070f_100%)] px-6 py-10 lg:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[8%] right-[10%] h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative z-10 grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1.35fr)_480px]">
        <Card className="border-white/10 bg-white/5 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <CardHeader className="space-y-6 p-8 sm:p-10 xl:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <Pill label="strict access mode" tone="danger" />
              <Pill label="operator evidence boundary" tone="accent" />
            </div>

            <div className="space-y-4">
              <CardTitle className="max-w-4xl text-4xl leading-tight tracking-tight sm:text-5xl xl:text-6xl">
                OpenTrust stays locked until the operator boundary is verified.
              </CardTitle>
              <CardDescription className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                This surface exposes local traces, workflows, artifacts, and curated memory. Authentication happens
                before protected evidence renders, so the app can safely front local data without pretending the
                SQLite layer itself has a login screen.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-8 pt-0 sm:p-10 sm:pt-0 xl:p-12 xl:pt-0">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5 shadow-inner shadow-black/20">
                <IconLock className="mb-4 size-6 text-primary" />
                <div className="text-base font-medium text-foreground">App-boundary auth</div>
                <div className="mt-2 text-sm leading-6 text-muted-foreground">
                  The browser authenticates to OpenTrust first. The server then decides whether local evidence may be
                  read.
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5 shadow-inner shadow-black/20">
                <IconShieldCheck className="mb-4 size-6 text-primary" />
                <div className="text-base font-medium text-foreground">Remote-safe posture</div>
                <div className="mt-2 text-sm leading-6 text-muted-foreground">
                  Shared-secret auth, CSRF checks, rate limiting, and audit logging now protect remote access paths.
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5 shadow-inner shadow-black/20">
                <IconTopologyStar3 className="mb-4 size-6 text-primary" />
                <div className="text-base font-medium text-foreground">Session-scoped trust</div>
                <div className="mt-2 text-sm leading-6 text-muted-foreground">
                  Successful authentication establishes a protected app session instead of exposing the underlying DB.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-muted-foreground">
              <IconWaveSine className="size-4 text-primary" />
              The intended flow is simple: authenticate to the app, then inspect evidence with operator confidence.
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <CardHeader className="space-y-4 p-8 sm:p-10">
            <div className="flex items-center justify-between gap-3">
              <Pill label="secure access" tone="accent" />
              <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Protected
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl">Authenticate to continue</CardTitle>
              <CardDescription className="mt-2 text-sm leading-6">
                Enter the configured OpenTrust token or password to unlock protected routes and local evidence views.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 sm:p-10 sm:pt-0">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2.5">
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
                  className="h-12 rounded-2xl border-white/10 bg-black/20 px-4"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <div>{error}</div>
                  {retryAfter ? (
                    <div className="mt-1 text-xs text-red-100/80">
                      Retry after about {retryAfter} second{retryAfter === 1 ? "" : "s"}.
                    </div>
                  ) : null}
                </div>
              ) : null}

              <Button className="h-12 w-full rounded-2xl text-base" disabled={submitting || !credential.trim()} type="submit">
                {submitting ? "Authenticating…" : "Unlock OpenTrust"}
                {!submitting ? <IconArrowRight /> : null}
              </Button>

              <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-xs leading-6 text-muted-foreground">
                Authentication is required before the server can render protected traces, workflows, memory, and
                investigations.
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
