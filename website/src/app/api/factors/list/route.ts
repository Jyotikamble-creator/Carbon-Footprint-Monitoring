import { NextRequest, NextResponse } from "next/server";
import { listFactors as listFactorsLib } from "@/lib/factors/api";
import { Logger, LogTags } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category") || undefined;
    const geography = url.searchParams.get("geography") || undefined;
    const valid_on = url.searchParams.get("valid_on") || undefined;

    Logger.i(LogTags.FACTORS, `Route /api/factors/list GET called [${requestId}]`);
    const data = await listFactorsLib({ category, geography, valid_on });
    return NextResponse.json(data);
  } catch (err: any) {
    Logger.e(LogTags.FACTORS, `Route /api/factors/list error [${requestId}]: ${err?.message ?? String(err)}`);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    const body = await request.json();
    Logger.i(LogTags.FACTORS, `Route /api/factors/list POST called [${requestId}]`);
    const data = await listFactorsLib(body);
    return NextResponse.json(data);
  } catch (err: any) {
    Logger.e(LogTags.FACTORS, `Route /api/factors/list POST error [${requestId}]: ${err?.message ?? String(err)}`);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 400 });
  }
}
