// Mock catalog service (see mockCatalog.ts). The real one searches the price providers.
import type { CatalogAsset } from '@/domain/asset';
import { CATALOG } from '@/services/mockCatalog';

export function fetchCatalog(): Promise<readonly CatalogAsset[]> {
  return Promise.resolve(CATALOG);
}
