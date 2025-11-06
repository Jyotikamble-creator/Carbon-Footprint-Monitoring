import { apiClient } from "@/lib/axios/apiClient";
import { categorizeAxiosError } from "@/lib/errors";
import type { KpisResponse, TrendPoint, SummaryResponse } from "@/types/analytics/analyticstypes";

// In-flight request dedupe map. Keyed by request URL (including query params).
const inflightRequests = new Map<string, Promise<any>>();

async function fetchWithDedupe<T>(url: string) {
  // If there's an in-flight identical request, return the same promise.
  const existing = inflightRequests.get(url) as Promise<T> | undefined;
  if (existing) return existing;

  const p = (async () => {
    try {
      const res = await apiClient.get<T>(url);
      return res.data;
    } finally {
      // Remove the inflight entry after settle so future calls can re-fetch.
      inflightRequests.delete(url);
    }
  })();

  inflightRequests.set(url, p);
  return p;
}

export async function getKpis(from: string, to: string): Promise<KpisResponse> {
  try {
    const params = new URLSearchParams();
    params.append('from', from);
    params.append('to', to);

    const url = `/v1/analytics/kpis?${params.toString()}`;
    return await fetchWithDedupe<KpisResponse>(url);
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}

export async function getTrend(from: string, to: string, grain?: 'day' | 'month'): Promise<TrendPoint[]> {
  try {
    const params = new URLSearchParams();
    params.append('from', from);
    params.append('to', to);
    if (grain) params.append('grain', grain);

    const url = `/v1/analytics/trend?${params.toString()}`;
    return await fetchWithDedupe<TrendPoint[]>(url);
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}

export async function getSummary(): Promise<SummaryResponse> {
  try {
    const url = "/v1/analytics/summary";
    return await fetchWithDedupe<SummaryResponse>(url);
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}
