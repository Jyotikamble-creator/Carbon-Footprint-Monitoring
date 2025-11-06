import { NextRequest, NextResponse } from "next/server";
import { uploadCsv as uploadCsvLib } from "@/lib/ingest/api";
import { Logger, LogTags } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    Logger.i(LogTags.INGEST, `Route /api/ingest/upload called [${requestId}]`);
    const data = await uploadCsvLib(file);
    return NextResponse.json(data);
  } catch (err: any) {
    Logger.e(LogTags.INGEST, `Route /api/ingest/upload error [${requestId}]: ${err?.message ?? String(err)}`);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 400 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ error: "not-implemented" }), { status: 501 });
}