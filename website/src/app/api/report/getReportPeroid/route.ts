import { NextRequest, NextResponse } from 'next/server';
import { getReportPeriod } from '@/lib/reports/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';

    const csv = await getReportPeriod(from, to);
    return new Response(csv, { status: 200, headers: { 'Content-Type': 'text/csv' } });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
