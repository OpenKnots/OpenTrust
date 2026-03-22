import { Suspense } from "react";
import LoginClient from "./page.client";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const nextPath = typeof params.next === "string" && params.next.startsWith("/") ? params.next : "/dashboard";

  return (
    <Suspense>
      <LoginClient nextPath={nextPath} />
    </Suspense>
  );
}
