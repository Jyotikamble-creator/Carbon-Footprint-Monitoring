import { NextRequest, NextResponse } from 'next/server';
import { Logger, LogTags } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    Logger.i(LogTags.EMISSIONS, `Getting emissions list [${requestId}]`);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';
    const category = searchParams.get('category');
    const scope = searchParams.get('scope');
    const facilityId = searchParams.get('facility_id');
    const factorId = searchParams.get('factor_id');

    // Get the authorization token from the request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      Logger.w(LogTags.EMISSIONS, `Missing or invalid authorization header [${requestId}]`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Build backend URL with all parameters
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    params.append('limit', limit);
    params.append('offset', offset);

    // Note: Backend doesn't support advanced filtering yet, but we'll prepare for it
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/emissions?${params.toString()}`;

    Logger.d(LogTags.EMISSIONS, `Forwarding to backend: ${backendUrl} [${requestId}]`);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      Logger.e(LogTags.EMISSIONS, `Backend error [${requestId}]: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to get emissions from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    Logger.i(LogTags.EMISSIONS, `Emissions retrieved successfully [${requestId}] - ${data.length} records`);

    return NextResponse.json(data);

  } catch (error) {
    Logger.e(LogTags.EMISSIONS, `Get emissions failed [${requestId}]: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    Logger.i(LogTags.EMISSIONS, `Recomputing emissions [${requestId}]`);

    // Get the authorization token from the request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      Logger.w(LogTags.EMISSIONS, `Missing or invalid authorization header [${requestId}]`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Parse request body for recompute parameters
    const body = await request.json();
    const { since, until } = body;

    // Build backend URL
    const params = new URLSearchParams();
    if (since) params.append('since', since);
    if (until) params.append('until', until);

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/emissions/recompute${params.toString() ? '?' + params.toString() : ''}`;

    Logger.d(LogTags.EMISSIONS, `Forwarding recompute to backend: ${backendUrl} [${requestId}]`);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ since, until }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      Logger.e(LogTags.EMISSIONS, `Backend recompute error [${requestId}]: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to recompute emissions' },
        { status: response.status }
      );
    }

    const data = await response.json();
    Logger.i(LogTags.EMISSIONS, `Emissions recomputed successfully [${requestId}] - ${data.recalculated_events} events`);

    return NextResponse.json(data);

  } catch (error) {
    Logger.e(LogTags.EMISSIONS, `Recompute emissions failed [${requestId}]: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}