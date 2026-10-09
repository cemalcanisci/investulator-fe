import { ASSET_TYPES, type AssetType } from '@/domain/assetTypes';
import type { Holding } from '@/domain/holding';
import {
  addDecimals,
  percentageOf,
  subtractDecimals,
  compareDecimals,
} from '@/lib/decimal';

export type TypeFilter = AssetType | 'ALL';

export const TYPE_FILTERS: readonly TypeFilter[] = ['ALL', ...ASSET_TYPES];

export const HOLDINGS_SORTS = ['VALUE', 'PNL', 'PNL_PERCENT', 'NAME'] as const;

export type HoldingsSort = (typeof HOLDINGS_SORTS)[number];

export function isHoldingsSort(value: string): value is HoldingsSort {
  return HOLDINGS_SORTS.some((sort) => sort === value);
}

export type SortDirection = 'asc' | 'desc';

/** What a column starts with when first chosen: biggest first for numbers, A to Z for names. */
const DEFAULT_DIRECTION: Readonly<Record<HoldingsSort, SortDirection>> = {
  VALUE: 'desc',
  PNL: 'desc',
  PNL_PERCENT: 'desc',
  NAME: 'asc',
};

export interface HoldingsOrder {
  readonly sort: HoldingsSort;
  readonly direction: SortDirection;
}

export function defaultOrder(sort: HoldingsSort): HoldingsOrder {
  return { sort, direction: DEFAULT_DIRECTION[sort] };
}

/** Choosing the column that is already sorted flips the direction; another column starts fresh. */
export function nextOrder(
  current: HoldingsOrder,
  sort: HoldingsSort,
): HoldingsOrder {
  if (current.sort !== sort) {
    return defaultOrder(sort);
  }
  return { sort, direction: current.direction === 'asc' ? 'desc' : 'asc' };
}

export interface HoldingsFilter {
  readonly type: TypeFilter;
  readonly query: string;
}

/** The `aria-sort` value of a column header that can be sorted by any of `sorts`. */
export function ariaSortOf(
  order: HoldingsOrder,
  sorts: readonly HoldingsSort[],
): 'ascending' | 'descending' | 'none' {
  if (!sorts.includes(order.sort)) {
    return 'none';
  }
  return order.direction === 'asc' ? 'ascending' : 'descending';
}

/** Keeps holdings of the chosen type whose name or symbol contains the query (locale-aware). */
export function filterHoldings(
  holdings: readonly Holding[],
  filter: HoldingsFilter,
  locale: string,
): Holding[] {
  const query = filter.query.trim().toLocaleLowerCase(locale);
  return holdings.filter(
    (holding) =>
      (filter.type === 'ALL' || holding.assetType === filter.type) &&
      (query === '' ||
        holding.assetName.toLocaleLowerCase(locale).includes(query) ||
        holding.symbol.toLocaleLowerCase(locale).includes(query)),
  );
}

const NUMERIC_SORT_KEYS: Readonly<
  Record<Exclude<HoldingsSort, 'NAME'>, (holding: Holding) => string | null>
> = {
  VALUE: (holding) => holding.value,
  PNL: (holding) => holding.pnl,
  PNL_PERCENT: (holding) => holding.pnlPercent,
};

/**
 * Sorts by the chosen column, in its default direction unless one is given. Holdings without a
 * value stay last in either direction. Returns a new list.
 */
export function sortHoldings(
  holdings: readonly Holding[],
  sort: HoldingsSort,
  locale: string,
  direction: SortDirection = DEFAULT_DIRECTION[sort],
): Holding[] {
  const factor = direction === 'asc' ? 1 : -1;
  const list = [...holdings];
  if (sort === 'NAME') {
    return list.sort(
      (a, b) => a.assetName.localeCompare(b.assetName, locale) * factor,
    );
  }
  const keyOf = NUMERIC_SORT_KEYS[sort];
  return list.sort((a, b) => {
    const left = keyOf(a);
    const right = keyOf(b);
    if (left === null || right === null) {
      return Number(left === null) - Number(right === null);
    }
    return compareDecimals(left, right) * factor;
  });
}

export function countByType(
  holdings: readonly Holding[],
): Readonly<Record<TypeFilter, number>> {
  const counts: Record<TypeFilter, number> = {
    ALL: holdings.length,
    CRYPTO: 0,
    BIST_STOCK: 0,
    US_STOCK: 0,
    GOLD: 0,
    FX: 0,
  };
  for (const holding of holdings) {
    counts[holding.assetType] += 1;
  }
  return counts;
}

export interface HoldingsTotals {
  readonly value: string;
  readonly cost: string;
  readonly pnl: string;
  readonly pnlPercent: string;
  /** Holdings without a price: left out of every total so that value, cost and P&L stay consistent. */
  readonly unpricedCount: number;
}

export function totalsOf(holdings: readonly Holding[]): HoldingsTotals {
  const priced = holdings.filter((holding) => holding.value !== null);
  const value = addDecimals(priced.map((holding) => holding.value ?? '0'));
  const cost = addDecimals(priced.map((holding) => holding.cost));
  const pnl = subtractDecimals(value, cost);
  return {
    value,
    cost,
    pnl,
    pnlPercent: percentageOf(pnl, cost),
    unpricedCount: holdings.length - priced.length,
  };
}
