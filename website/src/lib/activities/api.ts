import { apiClient } from '@/lib/axios/apiClient';
import { categorizeAxiosError } from '@/lib/errors';
import type { Activity, ActivityFilters } from '@/types/activities/activitytypes';

// Types exported from this module for route handlers to import
export type GetActivitiesParams = ActivityFilters;

export type CreateActivityRequest = {
  occurred_at: string; // ISO-8601
  category: string;
  unit: string;
  value_numeric: number;
  facility_id?: number;
  source_id?: string;
  subcategory?: string;
  currency?: string;
  spend_value?: number;
};

export async function getActivities(params: GetActivitiesParams = {}) {
  try {
    const res = await apiClient.get<Activity[]>('/v1/activities', { params });
    return res.data;
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}

export async function createActivity(payload: CreateActivityRequest) {
  try {
    // Use the existing ingest endpoint for creating activities
    const res = await apiClient.post('/v1/ingest/events', {
      events: [payload]
    });
    return res.data;
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}
