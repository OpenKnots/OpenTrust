import { cookies } from "next/headers";

const COOKIE_NAME = "opentrust.demo-mode";

export async function isDemoMode(): Promise<boolean> {
  try {
    const store = await cookies();
    return store.get(COOKIE_NAME)?.value === "true";
  } catch {
    return false;
  }
}
