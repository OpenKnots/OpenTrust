import { cookies } from "next/headers";

const COOKIE_NAME = "opentrust.demo-mode";

function isServerlessEnvironment(): boolean {
  return !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export async function isDemoMode(): Promise<boolean> {
  if (isServerlessEnvironment()) return true;

  try {
    const store = await cookies();
    return store.get(COOKIE_NAME)?.value === "true";
  } catch {
    return false;
  }
}
