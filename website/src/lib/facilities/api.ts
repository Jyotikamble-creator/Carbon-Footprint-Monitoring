import { apiClient } from "@/lib/axios/apiClient";
import { categorizeAxiosError } from "@/lib/errors";
import type { Facility, CreateFacilityRequest } from "@/types/tenants/tenantstypes";

export async function getFacilities(): Promise<Facility[]> {
  try {
    const url = `/v1/tenants/facilities`;
    const res = await apiClient.get<Facility[]>(url);
    return res.data;
  } catch (err) {
    throw categorizeAxiosError(err);
  }
}

export async function createFacility(facility: CreateFacilityRequest): Promise<Facility> {
  try {
    console.log('Creating facility with data:', facility);
    const url = `/v1/tenants/facilities`;
    const res = await apiClient.post<Facility>(url, facility);
    console.log('Facility created successfully:', res.data);
    return res.data;
  } catch (err) {
    console.error('Facility creation failed:', err);
    throw categorizeAxiosError(err);
  }
}