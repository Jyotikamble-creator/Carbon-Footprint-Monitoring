import { apiClient } from "@/lib/axios/apiClient";
import { categorizeAxiosError } from "@/lib/errors";
import type { HealthResponse } from "@/types/health/heathtypes";

export async function getHealth(): Promise<HealthResponse> {
  try {
    const res = await apiClient.get<HealthResponse>("/health");
    return res.data;
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}
