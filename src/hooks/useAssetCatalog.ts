import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { CatalogAsset } from '@/domain/asset';
import { fetchCatalog } from '@/services/catalog';

export const CATALOG_QUERY_KEY = ['catalog'] as const;

export function useAssetCatalog(): UseQueryResult<readonly CatalogAsset[]> {
  return useQuery({ queryKey: CATALOG_QUERY_KEY, queryFn: fetchCatalog });
}
