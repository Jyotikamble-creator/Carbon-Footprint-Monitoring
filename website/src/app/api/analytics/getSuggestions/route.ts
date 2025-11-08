import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/axios/apiClient';
import { Logger, LogTags } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    Logger.i(LogTags.ANALYTICS, `Getting AI suggestions [${requestId}]`);

    // Get the authorization token from the request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      Logger.w(LogTags.ANALYTICS, `Missing or invalid authorization header [${requestId}]`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Forward the request to the backend
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/analytics/suggestions`;

    Logger.d(LogTags.ANALYTICS, `Forwarding to backend: ${backendUrl} [${requestId}]`);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      Logger.e(LogTags.ANALYTICS, `Backend error [${requestId}]: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to get suggestions from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    Logger.i(LogTags.ANALYTICS, `AI suggestions retrieved successfully [${requestId}]`);

    return NextResponse.json(data);

  } catch (error) {
    Logger.e(LogTags.ANALYTICS, `Get suggestions failed [${requestId}]: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
