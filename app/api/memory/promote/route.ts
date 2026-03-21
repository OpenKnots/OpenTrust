import { NextResponse } from "next/server";
import { memoryPromote } from "@/lib/opentrust/memory-api";
import { fail, ok, parsePromoteRequest, readJson } from "@/lib/opentrust/api-contract";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    return NextResponse.json(ok(memoryPromote(parsePromoteRequest(body))));
  } catch (error) {
    const result = fail(error);
    return NextResponse.json(result, { status: result.status });
  }
}
