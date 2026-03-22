import { NextResponse } from "next/server";
import { memoryHealth } from "@/lib/opentrust/memory-api";
import { fail, ok, parseHealthQuery, parseHealthRequest, readJson } from "@/lib/opentrust/api-contract";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    return NextResponse.json(ok(memoryHealth(parseHealthQuery(url))));
  } catch (error) {
    const result = fail(error);
    return NextResponse.json(result, { status: result.status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    return NextResponse.json(ok(memoryHealth(parseHealthRequest(body))));
  } catch (error) {
    const result = fail(error);
    return NextResponse.json(result, { status: result.status });
  }
}
