import { NextRequest, NextResponse } from "next/server";
import { ingestEvents as ingestEventsLib } from "@/lib/ingest/api";
import { Logger, LogTags } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    const body = await request.json();
    Logger.i(LogTags.INGEST, `Route /api/ingest/ingestevents called [${requestId}]`);
    const data = await ingestEventsLib(body);
    return NextResponse.json(data);
  } catch (err: any) {
    Logger.e(LogTags.INGEST, `Route /api/ingest/ingestevents error [${requestId}]: ${err?.message ?? String(err)}`);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 400 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ error: "not-implemented" }), { status: 501 });
}
