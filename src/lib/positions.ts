import {
  addDecimals,
  getSign,
  multiplyDecimals,
  subtractDecimals,
} from '@/lib/decimal';
import type { Transaction } from '@/domain/transaction';

// A position is derived from the ledger: transactions in date order (then id), voided ones ignored.
// This mirrors the backend rule so the mock service and the form can warn before a save is refused.

type LedgerPoint = Pick<Transaction, 'executedAt' | 'executedTime' | 'id'>;

export function compareLedgerOrder(a: LedgerPoint, b: LedgerPoint): number {
  return (
    a.executedAt.localeCompare(b.executedAt) ||
    (a.executedTime ?? '12:00').localeCompare(b.executedTime ?? '12:00') ||
    a.id.localeCompare(b.id, 'en', { numeric: true })
  );
}

function applyToQuantity(quantity: string, transaction: Transaction): string {
  const amount = transaction.quantity ?? '0';
  switch (transaction.type) {
    case 'BUY':
    case 'BONUS':
      return addDecimals([quantity, amount]);
    case 'SELL':
      return subtractDecimals(quantity, amount);
    case 'SPLIT':
      return multiplyDecimals(quantity, transaction.splitRatio ?? '1');
    default:
      // A dividend is cash: the position does not change.
      return quantity;
  }
}

function ledgerOf(
  transactions: readonly Transaction[],
  assetId: string,
): Transaction[] {
  return transactions
    .filter(
      (transaction) =>
        transaction.assetId === assetId && transaction.status === 'ACTIVE',
    )
    .sort(compareLedgerOrder);
}

/** Quantity held after every active transaction up to and including `asOf` (default: all). */
export function positionQuantity(
  transactions: readonly Transaction[],
  assetId: string,
  asOf?: string,
): string {
  return ledgerOf(transactions, assetId)
    .filter(
      (transaction) => asOf === undefined || transaction.executedAt <= asOf,
    )
    .reduce(applyToQuantity, '0');
}

export function quantityBefore(
  transactions: readonly Transaction[],
  assetId: string,
  point: LedgerPoint,
): string {
  return ledgerOf(transactions, assetId)
    .filter(
      (transaction) =>
        transaction.id !== point.id &&
        compareLedgerOrder(transaction, point) < 0,
    )
    .reduce(applyToQuantity, '0');
}

export interface NegativePosition {
  /** The day the position first goes below zero. */
  readonly date: string;
  /** How far below zero it goes (a positive number). */
  readonly shortBy: string;
}

/** The first day the asset's position would be negative, or null when it never is. */
export function firstNegativePosition(
  transactions: readonly Transaction[],
  assetId: string,
): NegativePosition | null {
  let quantity = '0';
  for (const transaction of ledgerOf(transactions, assetId)) {
    quantity = applyToQuantity(quantity, transaction);
    if (getSign(quantity) === 'negative') {
      return {
        date: transaction.executedAt,
        shortBy: subtractDecimals('0', quantity),
      };
    }
  }
  return null;
}
