import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchUsdTryRate, type UsdTryRate } from '@/services/fx';

export const FX_QUERY_KEY = ['fx'] as const;

export function useUsdTryRate(): UseQueryResult<UsdTryRate> {
  return useQuery({
    queryKey: [...FX_QUERY_KEY, 'usd-try'],
    queryFn: fetchUsdTryRate,
  });
}
