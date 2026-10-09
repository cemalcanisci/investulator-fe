import type {
  AssetType,
  QuantityUnit,
  TransactionType,
} from '@/domain/assetTypes';
import type { DisplayCurrency } from '@/domain/currency';

/** The currency an amount was actually paid or received in. */
export type TransactionCurrency = DisplayCurrency;

export type TransactionStatus = 'ACTIVE' | 'VOIDED';

/** Whether the rate to USD was fetched for the day or typed by the user. */
export type FxRateSource = 'AUTO' | 'MANUAL';

/** Buying or selling: the two types that carry quantity, unit price and total amount. */
export function isTrade(type: TransactionType): type is 'BUY' | 'SELL' {
  return type === 'BUY' || type === 'SELL';
}

/** What the transaction form submits. Amounts are decimal strings; unused fields are null. */
export interface TransactionInput {
  readonly type: TransactionType;
  readonly assetId: string;
  /** ISO date (yyyy-mm-dd). */
  readonly executedAt: string;
  /** Local ordering time (HH:mm); legacy date-only records sort at 12:00. */
  readonly executedTime?: string;
  readonly quantity: string | null;
  readonly unitPrice: string | null;
  readonly totalAmount: string | null;
  readonly currency: TransactionCurrency;
  readonly fee: string | null;
  /** How many USD one unit of `currency` is worth on the day. */
  readonly fxRateToUsd: string;
  readonly fxRateSource: FxRateSource;
  readonly platform: string | null;
  readonly note: string | null;
  /** Split only: shares after per share before ("2" doubles, "0.5" reverses). */
  readonly splitRatio: string | null;
}

export interface Transaction extends TransactionInput {
  readonly id: string;
  readonly assetName: string;
  readonly symbol: string;
  readonly assetType: AssetType;
  readonly unit: QuantityUnit | null;
  /** The total amount in USD at the day's rate, stored with the transaction. */
  readonly usdAmount: string;
  readonly status: TransactionStatus;
  readonly voidedAt: string | null;
  readonly voidReason: string | null;
}
