import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { ResearchReport } from '@/domain/research';
import { fetchResearch } from '@/services/research';

export function useResearch(
  assetId: string,
): UseQueryResult<readonly ResearchReport[], Error> {
  return useQuery({
    queryKey: ['research', assetId],
    queryFn: () => fetchResearch(assetId),
  });
}
