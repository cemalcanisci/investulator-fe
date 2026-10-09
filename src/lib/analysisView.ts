import { ASSET_TYPES, type AssetType } from '@/domain/assetTypes';
import type { Holding } from '@/domain/holding';
import {
  addDecimals,
  getSign,
  percentageOf,
  subtractDecimals,
  compareDecimals,
} from '@/lib/decimal';

export interface AssetTypePerformance {
  readonly assetType: AssetType;
  readonly value: string;
  readonly cost: string;
  readonly pnl: string;
  readonly pnlPercent: string;
  readonly percent: string;
}

export function performanceByType(
  holdings: readonly Holding[],
): AssetTypePerformance[] {
  const priced = holdings.filter((item) => item.value !== null);
  const total = addDecimals(priced.map((item) => item.value ?? '0'));
  return ASSET_TYPES.flatMap((assetType) => {
    const matching = priced.filter((item) => item.assetType === assetType);
    if (matching.length === 0) {
      return [];
    }
    const value = addDecimals(matching.map((item) => item.value ?? '0'));
    const cost = addDecimals(matching.map((item) => item.cost));
    const pnl = subtractDecimals(value, cost);
    return [
      {
        assetType,
        value,
        cost,
        pnl,
        pnlPercent: percentageOf(pnl, cost),
        percent: percentageOf(value, total),
      },
    ];
  }).sort((a, b) => compareDecimals(b.value, a.value));
}

export type PerformanceMetric = 'AMOUNT' | 'PERCENT';
export type PerformanceFilter = 'ALL' | 'GAINERS' | 'LOSERS';

export function rankedHoldings(
  holdings: readonly Holding[],
  metric: PerformanceMetric,
  filter: PerformanceFilter,
): Holding[] {
  return holdings
    .filter((item) => {
      if (item.pnl === null) {
        return false;
      }
      if (filter === 'GAINERS') {
        return getSign(item.pnl) === 'positive';
      }
      if (filter === 'LOSERS') {
        return getSign(item.pnl) === 'negative';
      }
      return true;
    })
    .sort((a, b) => {
      const left = (metric === 'AMOUNT' ? a.pnl : a.pnlPercent) ?? '0';
      const right = (metric === 'AMOUNT' ? b.pnl : b.pnlPercent) ?? '0';
      return (
        (filter === 'LOSERS'
          ? compareDecimals(left, right)
          : compareDecimals(right, left)) || a.id.localeCompare(b.id)
      );
    });
}
