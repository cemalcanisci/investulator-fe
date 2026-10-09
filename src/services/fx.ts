// Mock exchange-rate service. The rates are invented; the signatures mirror the planned REST
// contract, so swapping in real endpoints is a one-file change and this mock is then deleted.
import type { TransactionCurrency } from '@/domain/transaction';
import { PRICES_UPDATED_AT } from '@/services/mockPortfolio';

export interface UsdTryRate {
  /** TL for one USD, as a decimal string. */
  readonly rate: string;
  readonly asOf: string;
}

export function fetchUsdTryRate(): Promise<UsdTryRate> {
  return Promise.resolve({ rate: '41.2500', asOf: PRICES_UPDATED_AT });
}

const LIRA_START = { date: Date.UTC(2025, 8, 1), rate: 0.0265 };
const LIRA_END = { date: Date.UTC(2026, 8, 21), rate: 0.02424 };

/**
 * USD per unit of `currency` on `date` (an ISO date); the invented lira weakens steadily over the
 * year. A real service takes the previous business day's rate for weekends and holidays.
 */
export function fetchRateToUsd(
  currency: TransactionCurrency,
  date: string,
): Promise<string> {
  if (currency === 'USD') {
    return Promise.resolve('1');
  }
  const day = Date.parse(`${date}T00:00:00Z`);
  const progress = Math.min(
    1,
    Math.max(0, (day - LIRA_START.date) / (LIRA_END.date - LIRA_START.date)),
  );
  const rate = LIRA_START.rate + (LIRA_END.rate - LIRA_START.rate) * progress;
  return Promise.resolve(rate.toFixed(5));
}
