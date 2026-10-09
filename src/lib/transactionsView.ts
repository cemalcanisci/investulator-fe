import {
  ASSET_TYPES,
  TRANSACTION_TYPES,
  type AssetType,
  type TransactionType,
} from '@/domain/assetTypes';
import type { Transaction } from '@/domain/transaction';
import { addDecimals, compareDecimals } from '@/lib/decimal';
import type { SortDirection } from '@/lib/holdingsView';
import { compareLedgerOrder } from '@/lib/positions';

export type TransactionTypeFilter = TransactionType | 'ALL';

export const TRANSACTION_TYPE_FILTERS: readonly TransactionTypeFilter[] = [
  'ALL',
  ...TRANSACTION_TYPES,
];

export type AssetTypeFilter = AssetType | 'ALL';

export const ASSET_TYPE_FILTERS: readonly AssetTypeFilter[] = [
  'ALL',
  ...ASSET_TYPES,
];

export const TRANSACTION_PERIODS = [
  'ALL',
  'MONTH',
  'QUARTER',
  'YEAR',
  'CUSTOM',
] as const;

export type TransactionPeriod = (typeof TRANSACTION_PERIODS)[number];

export function isTransactionPeriod(value: string): value is TransactionPeriod {
  return TRANSACTION_PERIODS.some((period) => period === value);
}

export interface TransactionFilter {
  readonly query: string;
  readonly type: TransactionTypeFilter;
  readonly assetType: AssetTypeFilter;
  /** A platform name, or 'ALL'. */
  readonly platform: string;
  readonly period: TransactionPeriod;
  /** ISO dates, used when the period is custom; empty means open ended. */
  readonly from: string;
  readonly to: string;
  readonly showVoided: boolean;
}

export const DEFAULT_TRANSACTION_FILTER: TransactionFilter = {
  query: '',
  type: 'ALL',
  assetType: 'ALL',
  platform: 'ALL',
  period: 'ALL',
  from: '',
  to: '',
  showVoided: false,
};

function shiftMonths(isoDate: string, months: number): string {
  const [year = 0, month = 1, day = 1] = isoDate.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  // Clamp the day, so "31 May minus 3 months" is 28 or 29 Feb and not a day in March.
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.toISOString().slice(0, 10);
}

/** First and last day (inclusive, ISO) of a period; a missing side is open ended. */
export function periodRange(
  filter: Pick<TransactionFilter, 'period' | 'from' | 'to'>,
  today: string,
): { readonly from: string; readonly to: string } {
  switch (filter.period) {
    case 'MONTH':
      return { from: `${today.slice(0, 7)}-01`, to: '' };
    case 'QUARTER':
      return { from: shiftMonths(today, -3), to: '' };
    case 'YEAR':
      return { from: `${today.slice(0, 4)}-01-01`, to: '' };
    case 'CUSTOM':
      return { from: filter.from, to: filter.to };
    default:
      return { from: '', to: '' };
  }
}

/** Platform names in use, alphabetically. */
export function platformsOf(transactions: readonly Transaction[]): string[] {
  const names = new Set<string>();
  for (const transaction of transactions) {
    if (transaction.platform !== null) {
      names.add(transaction.platform);
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b, 'tr'));
}

/** Applies every filter. Voided transactions are only kept when `showVoided` is on. */
export function filterTransactions(
  transactions: readonly Transaction[],
  filter: TransactionFilter,
  locale: string,
  today: string,
): Transaction[] {
  const query = filter.query.trim().toLocaleLowerCase(locale);
  const { from, to } = periodRange(filter, today);
  return transactions.filter((transaction) => {
    if (transaction.status === 'VOIDED' && !filter.showVoided) {
      return false;
    }
    if (filter.type !== 'ALL' && transaction.type !== filter.type) {
      return false;
    }
    if (
      filter.assetType !== 'ALL' &&
      transaction.assetType !== filter.assetType
    ) {
      return false;
    }
    if (filter.platform !== 'ALL' && transaction.platform !== filter.platform) {
      return false;
    }
    if (from !== '' && transaction.executedAt < from) {
      return false;
    }
    if (to !== '' && transaction.executedAt > to) {
      return false;
    }
    return (
      query === '' ||
      [
        transaction.assetName,
        transaction.symbol,
        transaction.platform ?? '',
        transaction.note ?? '',
      ].some((text) => text.toLocaleLowerCase(locale).includes(query))
    );
  });
}

/** How many voided transactions the filter hides (they would match if the switch were on). */
export function hiddenVoidedCount(
  transactions: readonly Transaction[],
  filter: TransactionFilter,
  locale: string,
  today: string,
): number {
  if (filter.showVoided) {
    return 0;
  }
  return filterTransactions(
    transactions,
    { ...filter, showVoided: true },
    locale,
    today,
  ).filter((transaction) => transaction.status === 'VOIDED').length;
}

export const TRANSACTION_SORTS = ['DATE', 'AMOUNT'] as const;

export type TransactionSort = (typeof TRANSACTION_SORTS)[number];

export interface TransactionOrder {
  readonly sort: TransactionSort;
  readonly direction: SortDirection;
}

export const DEFAULT_TRANSACTION_ORDER: TransactionOrder = {
  sort: 'DATE',
  direction: 'desc',
};

/** Choosing the sorted column flips the direction; another column starts biggest or newest first. */
export function nextTransactionOrder(
  current: TransactionOrder,
  sort: TransactionSort,
): TransactionOrder {
  if (current.sort !== sort) {
    return { sort, direction: 'desc' };
  }
  return { sort, direction: current.direction === 'asc' ? 'desc' : 'asc' };
}

export function ariaSortOfTransactions(
  order: TransactionOrder,
  sort: TransactionSort,
): 'ascending' | 'descending' | 'none' {
  if (order.sort !== sort) {
    return 'none';
  }
  return order.direction === 'asc' ? 'ascending' : 'descending';
}

/** Sorts by date (then id) or by the USD amount, in the chosen direction. Returns a new list. */
export function sortTransactions(
  transactions: readonly Transaction[],
  order: TransactionOrder,
): Transaction[] {
  const factor = order.direction === 'asc' ? 1 : -1;
  return [...transactions].sort((a, b) => {
    if (order.sort === 'AMOUNT') {
      const difference = compareDecimals(a.usdAmount, b.usdAmount);
      if (difference !== 0) {
        return difference * factor;
      }
    }
    return compareLedgerOrder(a, b) * factor;
  });
}

export interface TransactionsSummary {
  readonly count: number;
  /** USD bought and sold by the active transactions shown. */
  readonly boughtUsd: string;
  readonly soldUsd: string;
}

export function summaryOf(
  transactions: readonly Transaction[],
): TransactionsSummary {
  const active = transactions.filter(
    (transaction) => transaction.status === 'ACTIVE',
  );
  const sum = (type: TransactionType): string =>
    addDecimals(
      active
        .filter((transaction) => transaction.type === type)
        .map((transaction) => transaction.usdAmount),
    );
  return {
    count: transactions.length,
    boughtUsd: sum('BUY'),
    soldUsd: sum('SELL'),
  };
}

export function countByTransactionType(
  transactions: readonly Transaction[],
): Readonly<Record<TransactionTypeFilter, number>> {
  const counts: Record<TransactionTypeFilter, number> = {
    ALL: transactions.length,
    BUY: 0,
    SELL: 0,
    BONUS: 0,
    SPLIT: 0,
    DIVIDEND: 0,
  };
  for (const transaction of transactions) {
    counts[transaction.type] += 1;
  }
  return counts;
}
