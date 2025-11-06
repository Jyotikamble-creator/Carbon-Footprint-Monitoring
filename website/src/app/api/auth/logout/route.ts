

import { NextResponse } from "next/server";
import { Logger, LogTags } from "@/lib/logger";

// Logout is primarily a client-side cleanup (localStorage). Expose a thin route for callers
// but keep actual token removal on the client.
export async function POST() {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    Logger.i(LogTags.AUTH, `Route /api/auth/logout called [${requestId}]`);
    // No server-side action required for this app; return success so client can proceed to clear local state.
    return NextResponse.json({ ok: true });
}

export async function GET() {
    return new Response(JSON.stringify({ error: "not-implemented" }), { status: 501 });
}