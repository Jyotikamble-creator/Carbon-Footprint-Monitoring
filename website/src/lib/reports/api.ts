import { apiClient } from "@/lib/axios/apiClient";
import { categorizeAxiosError } from "@/lib/errors";

/** Get emissions report as CSV for the specified period */
export async function getReportPeriod(from: string, to: string): Promise<string> {
  try {
    const params = new URLSearchParams();
    params.append('from', from);
    params.append('to', to);
    
    const url = `/v1/reports/period?${params.toString()}`;
    // API returns CSV as text/csv
    const res = await apiClient.get<string>(url, {
      headers: {
        'Accept': 'text/csv'
      }
    });
    return res.data;
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}
