import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { getFacilities, createFacility } from './api';
import type { Facility, CreateFacilityRequest } from '@/types/tenants/tenantstypes';

export function useFacilities(options?: UseQueryOptions<Facility[], unknown, Facility[]>) {
  const base = {
    queryKey: ['facilities'] as const,
    queryFn: getFacilities,
    staleTime: 1000 * 60 * 5, // 5 minutes
  };

  return useQuery(Object.assign({}, base, options) as UseQueryOptions<Facility[]>);
}

export function useCreateFacility() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFacility,
    onSuccess: () => {
      // Invalidate and refetch facilities list
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
  });
}