import { NextRequest, NextResponse } from 'next/server';
import { getActivities, createActivity } from '@/lib/activities/api';
import type { CreateActivityRequest, GetActivitiesParams } from '@/lib/activities/api';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    
    const params: GetActivitiesParams = {
      limit: searchParams.get('page_size') ? parseInt(searchParams.get('page_size')!) : undefined,
      offset: searchParams.get('page') ? (parseInt(searchParams.get('page')!) - 1) * (searchParams.get('page_size') ? parseInt(searchParams.get('page_size')!) : 50) : undefined,
      facility_id: searchParams.get('facility_id') ? parseInt(searchParams.get('facility_id')!) : undefined,
      category: searchParams.get('category') || undefined,
    };

    // Call API function
    const result = await getActivities(params);
    
    return NextResponse.json(result);

  } catch (error) {
    // Handle different error types with appropriate status codes
    if (error instanceof Error) {
      const message = error.message;
      
      if (message.includes('Page number must be') || 
          message.includes('Page size must be') || 
          message.includes('Facility ID must be') ||
          message.includes('required')) {
        return NextResponse.json(
          { error: message },
          { status: 400 }
        );
      }
      
      if (message.includes('Authentication') || message.includes('authentication')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      if (message.includes('backend service') || message.includes('Invalid response')) {
        return NextResponse.json(
          { error: 'Backend service error' },
          { status: 502 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CreateActivityRequest = await request.json();

    // Call API function
    const result = await createActivity(body);
    
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Handle other errors
    if (error instanceof Error) {
      const message = error.message;
      
      if (message.includes('required') || 
          message.includes('must be') || 
          message.includes('too long') ||
          message.includes('characters')) {
        return NextResponse.json(
          { error: message },
          { status: 400 }
        );
      }
      
      if (message.includes('Authentication') || message.includes('authentication')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      if (message.includes('backend service') || message.includes('Invalid response')) {
        return NextResponse.json(
          { error: 'Backend service error' },
          { status: 502 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}