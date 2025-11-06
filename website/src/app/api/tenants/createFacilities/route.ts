import { NextRequest, NextResponse } from "next/server";
import { createFacility as createFacilityLib } from "@/lib/tenants/api";
import { Logger, LogTags } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    const body = await request.json();
    Logger.i(LogTags.FACILITIES, `Route /api/tenants/createFacilities called [${requestId}]`);
    const data = await createFacilityLib(body);
    return NextResponse.json(data);
  } catch (err: any) {
    Logger.e(LogTags.FACILITIES, `Route /api/tenants/createFacilities error [${requestId}]: ${err?.message ?? String(err)}`);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 400 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ error: "not-implemented" }), { status: 501 });
}
