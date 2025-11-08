import { NextRequest, NextResponse } from 'next/server';
import { Logger, LogTags } from '@/lib/logger';

export async function DELETE(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    Logger.i(LogTags.EMISSIONS, `Bulk delete emissions [${requestId}]`);

    // Get the authorization token from the request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      Logger.w(LogTags.EMISSIONS, `Missing or invalid authorization header [${requestId}]`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Parse request body for emission IDs to delete
    const body = await request.json();
    const { emissionIds, reason } = body;

    if (!emissionIds || !Array.isArray(emissionIds) || emissionIds.length === 0) {
      Logger.w(LogTags.EMISSIONS, `Invalid emission IDs for bulk delete [${requestId}]`);
      return NextResponse.json(
        { error: 'emissionIds array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Forward to backend bulk delete endpoint
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/emissions/bulk`;

    Logger.d(LogTags.EMISSIONS, `Forwarding bulk delete to backend: ${backendUrl} [${requestId}]`);

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emission_ids: emissionIds,
        reason: reason
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      Logger.e(LogTags.EMISSIONS, `Backend bulk delete error [${requestId}]: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to bulk delete emissions' },
        { status: response.status }
      );
    }

    const data = await response.json();
    Logger.i(LogTags.EMISSIONS, `Bulk delete completed successfully [${requestId}] - ${data.deleted_count} deleted, ${data.not_found_ids?.length || 0} not found`);

    return NextResponse.json(data);

  } catch (error) {
    Logger.e(LogTags.EMISSIONS, `Bulk delete emissions failed [${requestId}]: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    Logger.i(LogTags.EMISSIONS, `Bulk update emissions [${requestId}]`);

    // Get the authorization token from the request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      Logger.w(LogTags.EMISSIONS, `Missing or invalid authorization header [${requestId}]`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Parse request body for updates
    const body = await request.json();
    const { emissionIds, updates, reason } = body;

    if (!emissionIds || !Array.isArray(emissionIds) || emissionIds.length === 0) {
      Logger.w(LogTags.EMISSIONS, `Invalid emission IDs for bulk update [${requestId}]`);
      return NextResponse.json(
        { error: 'emissionIds array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
      Logger.w(LogTags.EMISSIONS, `Invalid updates for bulk update [${requestId}]`);
      return NextResponse.json(
        { error: 'updates object is required and must not be empty' },
        { status: 400 }
      );
    }

    // Forward to backend bulk update endpoint
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/v1/emissions/bulk`;

    Logger.d(LogTags.EMISSIONS, `Forwarding bulk update to backend: ${backendUrl} [${requestId}]`);

    const response = await fetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emission_ids: emissionIds,
        updates: updates,
        reason: reason
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      Logger.e(LogTags.EMISSIONS, `Backend bulk update error [${requestId}]: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to bulk update emissions' },
        { status: response.status }
      );
    }

    const data = await response.json();
    Logger.i(LogTags.EMISSIONS, `Bulk update completed successfully [${requestId}] - ${data.updated_count} updated, ${data.not_found_ids?.length || 0} not found`);

    return NextResponse.json(data);

  } catch (error) {
    Logger.e(LogTags.EMISSIONS, `Bulk update emissions failed [${requestId}]: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}