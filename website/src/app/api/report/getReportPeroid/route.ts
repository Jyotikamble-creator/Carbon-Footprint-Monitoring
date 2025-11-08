import { NextRequest, NextResponse } from 'next/server';
import { Logger, LogTags } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    Logger.i(LogTags.REPORTS, `Getting period report [${requestId}]`);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const format = searchParams.get('format') || 'csv';

    // Validate parameters
    if (!from || !to) {
      Logger.w(LogTags.REPORTS, `Missing date parameters [${requestId}]`);
      return NextResponse.json(
        { error: 'Both from and to date parameters are required' },
        { status: 400 }
      );
    }

    if (!['csv', 'pdf'].includes(format)) {
      Logger.w(LogTags.REPORTS, `Invalid format parameter: ${format} [${requestId}]`);
      return NextResponse.json(
        { error: 'Format must be either csv or pdf' },
        { status: 400 }
      );
    }

    // Get the authorization token from the request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      Logger.w(LogTags.REPORTS, `Missing or invalid authorization header [${requestId}]`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Forward the request to the backend
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/reports/period?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&format=${format}`;

    Logger.d(LogTags.REPORTS, `Forwarding to backend: ${backendUrl} [${requestId}]`);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': format === 'pdf' ? 'application/pdf' : 'text/csv',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      Logger.e(LogTags.REPORTS, `Backend error [${requestId}]: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to get report from backend' },
        { status: response.status }
      );
    }

    // Get the report data
    const data = format === 'pdf' ? await response.arrayBuffer() : await response.text();

    Logger.i(LogTags.REPORTS, `Period report retrieved successfully [${requestId}] - ${format.toUpperCase()} format`);

    // Return with appropriate headers
    const headers = new Headers();
    const extension = format;
    headers.set('Content-Type', format === 'pdf' ? 'application/pdf' : 'text/csv');
    headers.set('Content-Disposition', `attachment; filename=emissions_${from}_${to}.${extension}`);

    return new NextResponse(data, {
      status: 200,
      headers,
    });

  } catch (error) {
    Logger.e(LogTags.REPORTS, `Get period report failed [${requestId}]: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
