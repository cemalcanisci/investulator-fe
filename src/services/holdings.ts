// Mock holdings service (see mockPortfolio.ts). The signature mirrors the planned REST contract, so
// swapping in a real endpoint is a one-file change and this mock is then deleted.
import type { Holding } from '@/domain/holding';
import { HOLDINGS, PRICES_UPDATED_AT } from '@/services/mockPortfolio';

export interface HoldingsResponse {
  readonly holdings: readonly Holding[];
  readonly pricesUpdatedAt: string;
}

export function fetchHoldings(): Promise<HoldingsResponse> {
  return Promise.resolve({
    holdings: HOLDINGS,
    pricesUpdatedAt: PRICES_UPDATED_AT,
  });
}
