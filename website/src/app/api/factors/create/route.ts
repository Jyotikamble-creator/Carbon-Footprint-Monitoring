import { NextRequest, NextResponse } from "next/server";
import { createFactor as createFactorLib } from "@/lib/factors/api";
import { Logger, LogTags } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    const body = await request.json();
    Logger.i(LogTags.FACTORS, `Route /api/factors/create POST called [${requestId}]`);
    const data = await createFactorLib(body);
    return NextResponse.json(data);
  } catch (err: any) {
    Logger.e(LogTags.FACTORS, `Route /api/factors/create POST error [${requestId}]: ${err?.message ?? String(err)}`);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 400 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ error: 'not-implemented' }), { status: 501 });
}
