import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getKpis, getTrend } from './api';
import type { KpisResponse, TrendPoint } from '@/types/analytics/analyticstypes';

export function useKpis(from: string, to: string, options?: UseQueryOptions<KpisResponse, unknown, KpisResponse>) {
  const base = {
    queryKey: ['kpis', from, to] as const,
    queryFn: () => getKpis(from, to),
    keepPreviousData: true,
    staleTime: 1000 * 60, // 1 minute
  };

  return useQuery(Object.assign({}, base, options) as UseQueryOptions<KpisResponse>);
}

export function useTrend(from: string, to: string, grain: 'day' | 'month' = 'day', options?: UseQueryOptions<TrendPoint[], unknown, TrendPoint[]>) {
  const base = {
    queryKey: ['trend', from, to, grain] as const,
    queryFn: () => getTrend(from, to, grain),
    keepPreviousData: true,
    staleTime: 1000 * 60, // 1 minute
  };

  return useQuery(Object.assign({}, base, options) as UseQueryOptions<TrendPoint[]>);
}
