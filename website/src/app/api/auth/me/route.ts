import { NextResponse } from "next/server";
import { me as meLib } from "@/lib/auth/api";
import { Logger, LogTags } from "@/lib/logger";

export async function GET() {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
        Logger.i(LogTags.AUTH, `Route /api/auth/me called [${requestId}]`);
        const data = await meLib();
        return NextResponse.json(data);
    } catch (err: any) {
        Logger.e(LogTags.AUTH, `Route /api/auth/me error [${requestId}]: ${err?.message ?? String(err)}`);
        return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
    }
}

export async function POST() {
    return new Response(JSON.stringify({ error: "not-implemented" }), { status: 501 });
}
