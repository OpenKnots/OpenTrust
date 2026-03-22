import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/opentrust/auth";
import { memorySearch } from "@/lib/opentrust/memory-api";
import {
  fail,
  filterSearchResultsByReview,
  ok,
  parseSearchQuery,
  parseSearchRequest,
  readJson,
} from "@/lib/opentrust/api-contract";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauthorized = await requireApiAuth();
  if (unauthorized) return unauthorized;

  try {
    const url = new URL(request.url);
    const parsed = parseSearchQuery(url);
    const response = memorySearch(parsed);
    const filtered = {
      ...response,
      results: filterSearchResultsByReview(response.results, url.searchParams.get("review") ?? undefined),
    };
    return NextResponse.json(ok(filtered));
  } catch (error) {
    const result = fail(error);
    return NextResponse.json(result, { status: result.status });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireApiAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = await readJson(request);
    return NextResponse.json(ok(memorySearch(parseSearchRequest(body))));
  } catch (error) {
    const result = fail(error);
    return NextResponse.json(result, { status: result.status });
  }
}
