import type {
  ApproximateHistory,
  ApproximateCoverage,
} from '@/domain/approximateHistory';
import tuprsSnapshot from '@/data/research/tuprs-approximate-history.json';
import doasSnapshot from '@/data/research/doas-approximate-history.json';
import { researchBundle } from '@/services/researchBundle';
import { isApproximateHistory } from '@/lib/approximateHistorySchema';

interface RawCoverage {
  readonly from: string;
  readonly to: string;
  readonly state: string;
  readonly sourceIds: readonly string[];
  readonly method: string;
}
interface RawSnapshot {
  readonly assetId: string;
  readonly asOf: string;
  readonly currency: string;
  readonly listedFrom: string | null;
  readonly priceBasis: string;
  readonly shareBasisDate: string;
  readonly sources: ApproximateHistory['sources'];
  readonly coverage: {
    readonly prices: RawCoverage;
    readonly fx: RawCoverage;
    readonly actions: RawCoverage;
    readonly dividends: RawCoverage;
  };
  readonly monthly: ApproximateHistory['monthly'];
  readonly actions: readonly {
    readonly id: string;
    readonly date: string;
    readonly factor: string;
    readonly type: string;
    readonly sourceId: string;
  }[];
  readonly dividends: ApproximateHistory['dividends'];
  readonly expectedDividendIds: readonly string[];
  readonly expectedActionIds: readonly string[];
}

function coverage(value: RawCoverage): ApproximateCoverage {
  const state = value.state;
  if (state !== 'REVIEWED' && state !== 'MISSING' && state !== 'CONFLICT') {
    throw new Error('Invalid coverage state');
  }
  return { ...value, state };
}
function readSnapshot(snapshot: RawSnapshot): ApproximateHistory {
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
const histories: readonly ApproximateHistory[] = [
  readSnapshot(tuprsSnapshot),
  readSnapshot(doasSnapshot),
];

/** Public snapshots only. User portfolios and external providers are never accessed. */
export function getApproximateHistory(
  assetId: string,
): ApproximateHistory | undefined {
  const imported = researchBundle.approximate.find(
    (item) => isApproximateHistory(item) && item.assetId === assetId,
  );
  const history = isApproximateHistory(imported)
    ? imported
    : histories.find((item) => item.assetId === assetId);
  return history ? structuredClone(history) : undefined;
}
