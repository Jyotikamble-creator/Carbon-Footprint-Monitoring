import { NextRequest, NextResponse } from 'next/server';
import { loginApi } from '@/lib/auth/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = await loginApi({ email: body.email, password: body.password });
    return NextResponse.json(token);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 400 });
  }
}
