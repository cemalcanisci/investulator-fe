import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  fetchDashboardSummary,
  type DashboardSummary,
} from '@/services/dashboard';

export const DASHBOARD_QUERY_KEY = ['dashboard'] as const;

export function useDashboardSummary(): UseQueryResult<DashboardSummary> {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, 'summary'],
    queryFn: fetchDashboardSummary,
  });
}
