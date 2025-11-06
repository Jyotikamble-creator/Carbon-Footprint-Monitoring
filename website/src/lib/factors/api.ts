import { apiClient } from "@/lib/axios/apiClient";
import { categorizeAxiosError } from "@/lib/errors";
import type { FactorPreview, Factor, CreateFactorRequest } from "@/types/factors/factorstypes";
import { Logger, LogTags } from "@/lib/logger";

/** Get factor preview for specific category and time */
export async function previewFactors(params: {
  category: string;
  occurred_at: string; // ISO-8601
  geography?: string;
}): Promise<FactorPreview> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    Logger.i(LogTags.FACTORS, `Getting factor preview [${requestId}]`);
    Logger.d(LogTags.FACTORS, `Preview params - category: ${params.category}, occurred_at: ${params.occurred_at}, geography: ${params.geography || 'default'}`);

    // Validate required parameters
    if (!params.category || params.category.trim().length === 0) {
      Logger.w(LogTags.FACTORS, "Missing or empty category for preview");
      throw new Error("Category is required for factor preview");
    }

    if (!params.occurred_at || !isValidISODate(params.occurred_at)) {
      Logger.w(LogTags.FACTORS, "Missing or invalid occurred_at date for preview");
      throw new Error("occurred_at must be a valid ISO-8601 date string");
    }

    const searchParams = new URLSearchParams();
    searchParams.append('category', params.category);
    searchParams.append('occurred_at', params.occurred_at);
    if (params.geography) searchParams.append('geography', params.geography);

    // Construct API URL
    const url = `/v1/factors/preview?${searchParams.toString()}`;
    Logger.d(LogTags.FACTORS, `Making API call to ${url} [${requestId}]`);

    const res = await apiClient.get<FactorPreview>(url);

    Logger.i(LogTags.FACTORS, `Factor preview retrieved successfully [${requestId}] - Status: ${res.status}`);
    Logger.d(LogTags.FACTORS, `Preview data: category: ${res.data.category}, factor_value: ${res.data.factor_value}, geography: ${res.data.geography}`);

    // Validate response structure
    if (!res.data.category || typeof res.data.factor_value !== 'number' || !res.data.geography) {
      Logger.e(LogTags.FACTORS, `Invalid response: missing required preview data [${requestId}]`);
      throw new Error("Invalid response from server: incomplete factor preview data");
    }

    Logger.i(LogTags.FACTORS, `Factor preview validated successfully [${requestId}]`);
    return res.data;

  } catch (err) {
    Logger.e(LogTags.FACTORS, `Factor preview failed [${requestId}]: ${err instanceof Error ? err.message : String(err)}`);

    if (err instanceof Error) {
      Logger.e(LogTags.FACTORS, `Error stack trace [${requestId}]: ${Logger.getStackTraceString(err)}`);
    }

    const categorizedError = categorizeAxiosError(err);
    Logger.e(LogTags.FACTORS, `Categorized error [${requestId}]: ${categorizedError.constructor.name} - ${categorizedError.message}`);
    throw categorizedError;
  }
}

/** List all factors with optional filters */
export async function listFactors(params?: {
  category?: string;
  geography?: string;
  valid_on?: string; // ISO-8601
}): Promise<Factor[]> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    Logger.i(LogTags.FACTORS, `Listing factors [${requestId}]`);
    Logger.d(LogTags.FACTORS, `Filter params - category: ${params?.category || 'all'}, geography: ${params?.geography || 'all'}, valid_on: ${params?.valid_on || 'any'}`);

    // Validate filter parameters
    if (params?.valid_on && !isValidISODate(params.valid_on)) {
      Logger.w(LogTags.FACTORS, "Invalid valid_on date format provided");
      throw new Error("valid_on must be a valid ISO-8601 date string");
    }

    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.geography) searchParams.append('geography', params.geography);
    if (params?.valid_on) searchParams.append('valid_on', params.valid_on);

    // Make API call
    const url = `/v1/factors${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    Logger.d(LogTags.FACTORS, `Making API call to ${url} [${requestId}]`);

    const res = await apiClient.get<Factor[]>(url);

    Logger.i(LogTags.FACTORS, `Factors retrieved successfully [${requestId}] - Status: ${res.status}`);
    Logger.d(LogTags.FACTORS, `Response: ${res.data.length} factors found`);

    // Validate response structure
    if (!Array.isArray(res.data)) {
      Logger.e(LogTags.FACTORS, `Invalid response: data is not an array [${requestId}]`);
      throw new Error("Invalid response from server: factors data should be an array");
    }

    // Log sample factor details if any
    if (res.data.length > 0) {
      Logger.d(LogTags.FACTORS, `Sample factor: ${res.data[0].category}, Value: ${res.data[0].factor_value}, Units: ${res.data[0].unit_in} -> ${res.data[0].unit_out}, Geography: ${res.data[0].geography}`);
    }

    Logger.i(LogTags.FACTORS, `Factors list validated successfully [${requestId}]`);
    return res.data;

  } catch (err) {
    Logger.e(LogTags.FACTORS, `List factors failed [${requestId}]: ${err instanceof Error ? err.message : String(err)}`);

    if (err instanceof Error) {
      Logger.e(LogTags.FACTORS, `Error stack trace [${requestId}]: ${Logger.getStackTraceString(err)}`);
    }

    const categorizedError = categorizeAxiosError(err);
    Logger.e(LogTags.FACTORS, `Categorized error [${requestId}]: ${categorizedError.constructor.name} - ${categorizedError.message}`);
    throw categorizedError;
  }
}

/** Create a new factor */
export async function createFactor(payload: CreateFactorRequest): Promise<Factor> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    Logger.i(LogTags.FACTORS, `Creating new factor [${requestId}]`);
    Logger.d(LogTags.FACTORS, `Factor data - category: ${payload.category}, geography: ${payload.geography || 'GLOBAL'}, factor_value: ${payload.factor_value}`);

    // Validate request payload
    if (!payload.category || payload.category.trim().length === 0) {
      Logger.w(LogTags.FACTORS, "Missing or empty factor category");
      throw new Error("Factor category is required");
    }

    if (!payload.unit_in || payload.unit_in.trim().length === 0) {
      Logger.w(LogTags.FACTORS, "Missing or empty factor unit_in");
      throw new Error("Factor unit_in is required");
    }

    if (!payload.unit_out || payload.unit_out.trim().length === 0) {
      Logger.w(LogTags.FACTORS, "Missing or empty factor unit_out");
      throw new Error("Factor unit_out is required");
    }

    if (typeof payload.factor_value !== 'number' || payload.factor_value < 0) {
      Logger.w(LogTags.FACTORS, "Invalid factor value");
      throw new Error("Factor value must be a non-negative number");
    }

    if (!payload.vendor || payload.vendor.trim().length === 0) {
      Logger.w(LogTags.FACTORS, "Missing or empty factor vendor");
      throw new Error("Factor vendor is required");
    }

    if (!payload.method || payload.method.trim().length === 0) {
      Logger.w(LogTags.FACTORS, "Missing or empty factor method");
      throw new Error("Factor method is required");
    }

    if (!payload.valid_from) {
      Logger.w(LogTags.FACTORS, "Missing factor valid_from date");
      throw new Error("Factor valid_from date is required");
    }

    if (!payload.valid_to) {
      Logger.w(LogTags.FACTORS, "Missing factor valid_to date");
      throw new Error("Factor valid_to date is required");
    }

    Logger.d(LogTags.FACTORS, `Making API call to /v1/factors [${requestId}]`);

    // Make API call
    const res = await apiClient.post<Factor>("/v1/factors", payload);

    Logger.i(LogTags.FACTORS, `Factor created successfully [${requestId}] - Status: ${res.status}`);
    Logger.d(LogTags.FACTORS, `Created factor: ${res.data.category}, ID: ${res.data.id}, Value: ${res.data.factor_value}, Units: ${res.data.unit_in} -> ${res.data.unit_out}`);

    // Validate response structure
    if (!res.data.id || !res.data.category || typeof res.data.factor_value !== 'number') {
      Logger.e(LogTags.FACTORS, `Invalid response: missing required factor data [${requestId}]`);
      throw new Error("Invalid response from server: incomplete factor data");
    }

    Logger.i(LogTags.FACTORS, `New factor validated successfully [${requestId}]`);
    return res.data;

  } catch (err) {
    Logger.e(LogTags.FACTORS, `Create factor failed [${requestId}]: ${err instanceof Error ? err.message : String(err)}`);

    if (err instanceof Error) {
      Logger.e(LogTags.FACTORS, `Error stack trace [${requestId}]: ${Logger.getStackTraceString(err)}`);
    }

    const categorizedError = categorizeAxiosError(err);
    Logger.e(LogTags.FACTORS, `Categorized error [${requestId}]: ${categorizedError.constructor.name} - ${categorizedError.message}`);
    throw categorizedError;
  }
}

// Helper function to validate ISO date strings
function isValidISODate(dateString: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  if (!isoDateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

