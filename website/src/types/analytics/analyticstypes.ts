export type KpisResponse = {
  total_co2e_kg: number;
  scope1_kg: number;
  scope2_kg: number;
  scope3_kg: number;
};

export type TrendPoint = {
  period: string;
  co2e_kg: number;
};

export type SummaryResponse = {
  total_co2e_kg: number;
  scope1_kg: number;
  scope2_kg: number;
  scope3_kg: number;
  facilities_count: number;
  last_event_at?: string | null;
  // top_categories: array of category objects with category and co2e_kg
  top_categories: Array<{category: string; co2e_kg: number}>;
};

export type Suggestion = {
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  potential_savings: number;
  implementation_time: number;
  action_items?: string[];
  expected_outcome?: string;
};

export type SuggestionResponse = {
  suggestions: Suggestion[];
  total_suggestions: number;
  potential_savings_kg: number;
  implementation_time_weeks: number;
  generated_at: string;
};
