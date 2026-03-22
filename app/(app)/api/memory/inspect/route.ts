import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/opentrust/auth";
import { memoryInspect } from "@/lib/opentrust/memory-api";
import { fail, ok, parseInspectQuery, parseInspectRequest, readJson } from "@/lib/opentrust/api-contract";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauthorized = await requireApiAuth();
  if (unauthorized) return unauthorized;

  try {
    const url = new URL(request.url);
    return NextResponse.json(ok(memoryInspect(parseInspectQuery(url))));
  } catch (error) {
    const result = fail(error);
    return NextResponse.json(result, { status: result.status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    return NextResponse.json(ok(memoryInspect(parseInspectRequest(body))));
  } catch (error) {
    const result = fail(error);
    return NextResponse.json(result, { status: result.status });
  }
}
