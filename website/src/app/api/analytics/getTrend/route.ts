import { NextRequest, NextResponse } from "next/server";
import { getTrend as getTrendLib } from "@/lib/analytics/api";
import { Logger, LogTags } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    const url = new URL(request.url);
    const from = url.searchParams.get("from") || "";
    const to = url.searchParams.get("to") || "";
    const grain = (url.searchParams.get("grain") as "day" | "month" | null) || undefined;

    Logger.i(LogTags.ANALYTICS, `Route /api/analytics/getTrend called [${requestId}]`);
    const data = await getTrendLib(from, to, grain);
    return NextResponse.json(data);
  } catch (err: any) {
    Logger.e(LogTags.ANALYTICS, `Route /api/analytics/getTrend error [${requestId}]: ${err?.message ?? String(err)}`);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function POST() {
  return new Response(JSON.stringify({ error: "not-implemented" }), { status: 501 });
}
