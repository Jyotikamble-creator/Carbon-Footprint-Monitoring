import { NextRequest, NextResponse } from "next/server";
import { signup as signupLib } from "@/lib/auth/api";
import { Logger, LogTags } from "@/lib/logger";

export async function POST(request: NextRequest) {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
        const body = await request.json();
        Logger.i(LogTags.SIGNUP, `Route /api/auth/signup called [${requestId}]`);
        const token = await signupLib(body);
        return NextResponse.json(token);
    } catch (err: any) {
        Logger.e(LogTags.SIGNUP, `Route /api/auth/signup error [${requestId}]: ${err?.message ?? String(err)}`);
        return NextResponse.json({ error: err?.message ?? String(err) }, { status: 400 });
    }
}

export async function GET() {
    return new Response(JSON.stringify({ error: "not-implemented" }), { status: 501 });
}
