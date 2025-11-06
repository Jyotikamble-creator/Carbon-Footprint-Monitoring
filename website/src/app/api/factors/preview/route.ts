import { NextRequest, NextResponse } from "next/server";
import { previewFactors as previewFactorsLib } from "@/lib/factors/api";
import { Logger, LogTags } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category") || "";
    const occurred_at = url.searchParams.get("occurred_at") || "";
    const geography = url.searchParams.get("geography") || undefined;

    Logger.i(LogTags.FACTORS, `Route /api/factors/preview GET called [${requestId}]`);
    const data = await previewFactorsLib({ category, occurred_at, geography });
    return NextResponse.json(data);
  } catch (err: any) {
    Logger.e(LogTags.FACTORS, `Route /api/factors/preview error [${requestId}]: ${err?.message ?? String(err)}`);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    const body = await request.json();
    Logger.i(LogTags.FACTORS, `Route /api/factors/preview POST called [${requestId}]`);
    const data = await previewFactorsLib(body);
    return NextResponse.json(data);
  } catch (err: any) {
    Logger.e(LogTags.FACTORS, `Route /api/factors/preview POST error [${requestId}]: ${err?.message ?? String(err)}`);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 400 });
  }
}
