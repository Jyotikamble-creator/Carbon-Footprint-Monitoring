import { apiClient } from "@/lib/axios/apiClient";
import { categorizeAxiosError } from "@/lib/errors";
import type { CreateFactorRequest, Factor, FactorPreview } from "@/types/factors/factorstypes";

/** Create a new factor */
export async function createFactor(payload: CreateFactorRequest): Promise<Factor> {
  try {
    const res = await apiClient.post<Factor>("/v1/factors", payload);
    return res.data;
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}

/** List all factors with optional filters */
export async function listFactors(params?: {
  category?: string;
  geography?: string;
  valid_on?: string; // ISO-8601
}): Promise<Factor[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.geography) searchParams.append('geography', params.geography);
    if (params?.valid_on) searchParams.append('valid_on', params.valid_on);
    
    const url = `/v1/factors${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const res = await apiClient.get<Factor[]>(url);
    return res.data;
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}

/** Get factor preview for specific category and time */
export async function previewFactors(params: {
  category: string;
  occurred_at: string; // ISO-8601
  geography?: string;
}): Promise<FactorPreview> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('category', params.category);
    searchParams.append('occurred_at', params.occurred_at);
    if (params.geography) searchParams.append('geography', params.geography);
    
    const url = `/v1/factors/preview?${searchParams.toString()}`;
    const res = await apiClient.get<FactorPreview>(url);
    return res.data;
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}
