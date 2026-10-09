import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchHoldings, type HoldingsResponse } from '@/services/holdings';

export const HOLDINGS_QUERY_KEY = ['holdings'] as const;

export function useHoldings(): UseQueryResult<HoldingsResponse> {
  return useQuery({ queryKey: HOLDINGS_QUERY_KEY, queryFn: fetchHoldings });
}
