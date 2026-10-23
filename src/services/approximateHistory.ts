import type {
  ApproximateHistory,
  ApproximateCoverage,
} from '@/domain/approximateHistory';
import snapshot from '@/data/research/tuprs-approximate-history.json';

function coverage(value: typeof snapshot.coverage.prices): ApproximateCoverage {
  const state = value.state;
  if (state !== 'REVIEWED' && state !== 'MISSING' && state !== 'CONFLICT') {
    throw new Error('Invalid coverage state');
  }
  return { ...value, state };
}
function readSnapshot(): ApproximateHistory {
  const { currency, priceBasis } = snapshot;
  if (
    (currency !== 'TRY' && currency !== 'USD') ||
    (priceBasis !== 'SPLIT_ONLY' &&
      priceBasis !== 'TOTAL_RETURN' &&
      priceBasis !== 'UNKNOWN')
  ) {
    throw new Error('Invalid history basis');
  }
  return {
    ...snapshot,
    currency,
    priceBasis,
    coverage: {
      prices: coverage(snapshot.coverage.prices),
      fx: coverage(snapshot.coverage.fx),
      actions: coverage(snapshot.coverage.actions),
      dividends: coverage(snapshot.coverage.dividends),
    },
    actions: snapshot.actions.map((action) => {
      const type = action.type;
      if (type !== 'SPLIT' && type !== 'BONUS' && type !== 'UNSUPPORTED') {
        throw new Error('Invalid action type');
      }
      return { ...action, type };
    }),
  };
}
const histories: readonly ApproximateHistory[] = [readSnapshot()];

/** Public snapshots only. User portfolios and external providers are never accessed. */
export function getApproximateHistory(
  assetId: string,
): ApproximateHistory | undefined {
  const history = histories.find((item) => item.assetId === assetId);
  return history ? structuredClone(history) : undefined;
}
