export type Activity = {
  id: number;
  facility_id?: number;
  source_id?: string;
  occurred_at: string;
  category: string;
  subcategory?: string;
  unit: string;
  value_numeric: number;
  currency?: string;
  spend_value?: number;
  scope_hint?: string;
};

export type ActivityFilters = {
  from?: string;
  to?: string;
  category?: string;
  facility_id?: number;
  limit?: number;
  offset?: number;
};

export type CreateActivityRequest = {
  occurred_at: string;
  category: string;
  unit: string;
  value_numeric: number;
  facility_id?: number;
  source_id?: string;
  subcategory?: string;
  currency?: string;
  spend_value?: number;
};

export type ActivityResponse = {
  activities: Activity[];
  total: number;
  hasMore: boolean;
};