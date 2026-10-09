// Mock dashboard service. Totals, allocation and movers are derived from the invented portfolio in
// mockPortfolio.ts (the same one the Holdings page shows); the rest is fixed, invented data. The
// signatures mirror the planned REST contract (money as decimal strings), so swapping in real
// endpoints is a one-file change and this mock is then deleted.
import { ASSET_TYPES } from '@/domain/assetTypes';
import type {
  AssetType,
  QuantityUnit,
  TransactionType,
} from '@/domain/assetTypes';
import type { Holding } from '@/domain/holding';
import type { Transaction, TransactionCurrency } from '@/domain/transaction';
import {
  addDecimals,
  getSign,
  percentageOf,
  subtractDecimals,
  toDisplayNumber,
} from '@/lib/decimal';
import { HOLDINGS, PRICES_UPDATED_AT } from '@/services/mockPortfolio';
import { readLedger } from '@/services/transactions';
import { compareLedgerOrder } from '@/lib/positions';

export const PORTFOLIO_RANGES = ['1W', '1M', '3M', '1Y', 'ALL'] as const;

export type PortfolioRange = (typeof PORTFOLIO_RANGES)[number];

export interface DashboardKpis {
  readonly totalValue: string;
  readonly totalCost: string;
  readonly dayChange: string;
  readonly dayChangePercent: string;
  readonly unrealizedPnl: string;
  readonly unrealizedPnlPercent: string;
  readonly realizedPnl: string;
  readonly realizedPnlPercent: string;
  readonly valueTrend: readonly string[];
  readonly realizedTrend: readonly string[];
}

export interface AllocationSlice {
  readonly assetType: AssetType;
  readonly value: string;
  readonly percent: string;
}

export interface Mover {
  readonly assetName: string;
  readonly symbol: string;
  readonly assetType: AssetType;
  readonly pnl: string;
  readonly pnlPercent: string;
}

export interface RecentTransaction {
  readonly id: string;
  readonly executedAt: string;
  readonly type: TransactionType;
  readonly assetName: string;
  readonly symbol: string;
  readonly assetType: AssetType;
  readonly quantity: string | null;
  readonly unit: QuantityUnit | null;
  /** In the transaction's own currency; null for bonus shares and splits. */
  readonly totalAmount: string | null;
  readonly currency: TransactionCurrency;
}

export interface DashboardSummary {
  readonly kpis: DashboardKpis;
  readonly allocation: readonly AllocationSlice[];
  readonly gainers: readonly Mover[];
  readonly losers: readonly Mover[];
  readonly recentTransactions: readonly RecentTransaction[];
  readonly pricesUpdatedAt: string;
}

export interface PortfolioPoint {
  readonly date: string;
  readonly value: string;
  readonly cost: string;
}

const MOVER_COUNT = 3;

function pricedHoldings(): Holding[] {
  return HOLDINGS.filter((holding) => holding.value !== null);
}

function toMover(holding: Holding): Mover {
  return {
    assetName: holding.assetName,
    symbol: holding.symbol,
    assetType: holding.assetType,
    pnl: holding.pnl ?? '0',
    pnlPercent: holding.pnlPercent ?? '0.0',
  };
}

function pnlOf(holding: Holding): number {
  return toDisplayNumber(holding.pnl ?? '0');
}

function buildSummary(): Omit<DashboardSummary, 'recentTransactions'> {
  const priced = pricedHoldings();
  const totalValue = addDecimals(priced.map((holding) => holding.value ?? '0'));
  const totalCost = addDecimals(priced.map((holding) => holding.cost));
  const unrealizedPnl = subtractDecimals(totalValue, totalCost);

  const allocation = ASSET_TYPES.map((assetType) => {
    const value = addDecimals(
      priced
        .filter((holding) => holding.assetType === assetType)
        .map((holding) => holding.value ?? '0'),
    );
    return { assetType, value, percent: percentageOf(value, totalValue) };
  })
    .filter((slice) => toDisplayNumber(slice.value) > 0)
    .sort((a, b) => toDisplayNumber(b.value) - toDisplayNumber(a.value));

  return {
    kpis: {
      totalValue,
      totalCost,
      dayChange: '3240.18',
      dayChangePercent: '2.7',
      unrealizedPnl,
      unrealizedPnlPercent: percentageOf(unrealizedPnl, totalCost),
      realizedPnl: '-412.90',
      realizedPnlPercent: '-0.4',
      valueTrend: [
        '118200',
        '119400',
        '118900',
        '121300',
        '120800',
        '123100',
        totalValue,
      ],
      realizedTrend: ['120', '95', '110', '-60', '-140', '-330', '-412.9'],
    },
    allocation,
    gainers: priced
      .filter((holding) => getSign(holding.pnl ?? '0') === 'positive')
      .sort((a, b) => pnlOf(b) - pnlOf(a))
      .slice(0, MOVER_COUNT)
      .map(toMover),
    losers: priced
      .filter((holding) => getSign(holding.pnl ?? '0') === 'negative')
      .sort((a, b) => pnlOf(a) - pnlOf(b))
      .slice(0, MOVER_COUNT)
      .map(toMover),
    pricesUpdatedAt: PRICES_UPDATED_AT,
  };
}

const SUMMARY = buildSummary();

const POINT_COUNT: Readonly<Record<PortfolioRange, number>> = {
  '1W': 7,
  '1M': 30,
  '3M': 13,
  '1Y': 12,
  ALL: 24,
};

const STEP_DAYS: Readonly<Record<PortfolioRange, number>> = {
  '1W': 1,
  '1M': 1,
  '3M': 7,
  '1Y': 30,
  ALL: 45,
};

// Share of today's value the portfolio had at the start of each range.
const START_RATIO: Readonly<Record<PortfolioRange, number>> = {
  '1W': 0.96,
  '1M': 0.9,
  '3M': 0.82,
  '1Y': 0.62,
  ALL: 0.4,
};

const ANCHOR_DATE = Date.UTC(2026, 8, 21);
const DAY_MS = 86_400_000;

// Deterministic curve ending at the current totals: no randomness, so screenshots and tests are stable.
function buildSeries(range: PortfolioRange): PortfolioPoint[] {
  const count = POINT_COUNT[range];
  const endValue = toDisplayNumber(SUMMARY.kpis.totalValue);
  const endCost = toDisplayNumber(SUMMARY.kpis.totalCost);
  const startRatio = START_RATIO[range];

  return Array.from({ length: count }, (_, index) => {
    const progress = count === 1 ? 1 : index / (count - 1);
    const wiggle = Math.sin(index * 1.7) * endValue * 0.008 * (1 - progress);
    const value =
      endValue * (startRatio + (1 - startRatio) * progress) + wiggle;
    const cost =
      endCost *
      (startRatio +
        0.02 +
        (1 - startRatio - 0.02) * Math.min(1, progress * 1.15));
    const date = new Date(
      ANCHOR_DATE - (count - 1 - index) * STEP_DAYS[range] * DAY_MS,
    );
    return {
      date: date.toISOString().slice(0, 10),
      value: index === count - 1 ? SUMMARY.kpis.totalValue : value.toFixed(2),
      cost: index === count - 1 ? SUMMARY.kpis.totalCost : cost.toFixed(2),
    };
  });
}

const RECENT_COUNT = 5;

/** The newest active transactions from the ledger the Transactions page edits. */
function recentTransactionsOf(
  ledger: readonly Transaction[],
): RecentTransaction[] {
  return ledger
    .filter((transaction) => transaction.status === 'ACTIVE')
    .sort((a, b) => compareLedgerOrder(b, a))
    .slice(0, RECENT_COUNT)
    .map((transaction) => ({
      id: transaction.id,
      executedAt: transaction.executedAt,
      type: transaction.type,
      assetName: transaction.assetName,
      symbol: transaction.symbol,
      assetType: transaction.assetType,
      quantity: transaction.quantity,
      unit: transaction.unit,
      totalAmount: transaction.totalAmount,
      currency: transaction.currency,
    }));
}

export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return Promise.resolve({
    ...SUMMARY,
    recentTransactions: recentTransactionsOf(readLedger()),
  });
}

export function fetchPortfolioSeries(
  range: PortfolioRange,
): Promise<PortfolioPoint[]> {
  return Promise.resolve(buildSeries(range));
}
