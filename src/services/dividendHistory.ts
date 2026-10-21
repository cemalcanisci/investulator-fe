import type { DividendHistory } from '@/domain/dividendHistory';
import snapshot from '@/data/research/tuprs-dividend-history.json';

const TUPRS: DividendHistory = {
  ...snapshot,
  priceBasis: 'SPLIT_ADJUSTED',
  review: 'PARTIAL',
  unavailableReason: 'MISSING_DATA',
};

/** Public research snapshots only; never reads the user's portfolio or contacts a provider. */
export function getDividendHistory(
  assetId: string,
): DividendHistory | undefined {
  return assetId === TUPRS.assetId ? structuredClone(TUPRS) : undefined;
}
