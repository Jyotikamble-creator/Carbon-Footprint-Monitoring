import { NextRequest, NextResponse } from "next/server";
import { getKpis as getKpisLib } from "@/lib/analytics/api";
import { Logger, LogTags } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    const url = new URL(request.url);
    const from = url.searchParams.get("from") || "";
    const to = url.searchParams.get("to") || "";

    Logger.i(LogTags.ANALYTICS, `Route /api/analytics/getKpis called [${requestId}]`);
    const data = await getKpisLib(from, to);
    return NextResponse.json(data);
  } catch (err: any) {
    Logger.e(LogTags.ANALYTICS, `Route /api/analytics/getKpis error [${requestId}]: ${err?.message ?? String(err)}`);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function POST() {
  return new Response(JSON.stringify({ error: "not-implemented" }), { status: 501 });
}
