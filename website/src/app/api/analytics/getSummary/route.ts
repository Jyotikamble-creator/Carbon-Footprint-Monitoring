import { NextResponse } from 'next/server';
import { getSummary } from '@/lib/analytics/api';

export async function GET() {
  try {
    const data = await getSummary();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
