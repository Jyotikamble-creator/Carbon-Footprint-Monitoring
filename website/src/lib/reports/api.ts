import { apiClient } from "@/lib/axios/apiClient";
import { categorizeAxiosError } from "@/lib/errors";

/** Get emissions report for the specified period in CSV or PDF format */
export async function getReportPeriod(from: string, to: string, format: 'csv' | 'pdf' = 'csv'): Promise<string> {
  try {
    const params = new URLSearchParams();
    params.append('from', from);
    params.append('to', to);
    params.append('format', format);

    const url = `/v1/reports/period?${params.toString()}`;

    // API returns CSV as text/csv or PDF as application/pdf
    const res = await apiClient.get(url, {
      headers: {
        'Accept': format === 'pdf' ? 'application/pdf' : 'text/csv'
      },
      responseType: format === 'pdf' ? 'arraybuffer' : 'text'
    });

    // For PDF, convert ArrayBuffer to base64 string for display
    if (format === 'pdf' && res.data instanceof ArrayBuffer) {
      const uint8Array = new Uint8Array(res.data);
      const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
      return btoa(binaryString);
    }

    return res.data as string;
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}