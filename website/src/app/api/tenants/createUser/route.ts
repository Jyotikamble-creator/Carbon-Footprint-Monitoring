import { NextRequest, NextResponse } from "next/server";
import { createUser as createUserLib } from "@/lib/tenants/api";
import { Logger, LogTags } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    const body = await request.json();
    Logger.i(LogTags.TENANTS, `Route /api/tenants/createUser called [${requestId}]`);
    const data = await createUserLib(body);
    return NextResponse.json(data);
  } catch (err: any) {
    Logger.e(LogTags.TENANTS, `Route /api/tenants/createUser error [${requestId}]: ${err?.message ?? String(err)}`);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 400 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ error: "not-implemented" }), { status: 501 });
}
