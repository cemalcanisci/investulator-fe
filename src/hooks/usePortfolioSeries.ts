import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { DASHBOARD_QUERY_KEY } from '@/hooks/useDashboardSummary';
import {
  fetchPortfolioSeries,
  type PortfolioPoint,
  type PortfolioRange,
} from '@/services/dashboard';

export function usePortfolioSeries(
  range: PortfolioRange,
): UseQueryResult<PortfolioPoint[]> {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'series', range],
    queryFn: () => fetchPortfolioSeries(range),
  });
}
