import { fingerprint } from '@/lib/transfer/schema';
// Mock transaction service: the ledger lives in memory, so adding, editing and cancelling really
// change the list until the page is reloaded. It enforces the same rule the backend will (a
// position may never go below zero on any day), so the screens can show the real refusals. The
// signatures mirror the planned REST contract; swapping in real endpoints is a one-file change and
// this mock is then deleted.
import type { Transaction, TransactionInput } from '@/domain/transaction';
import { multiplyDecimals, roundDecimal, trimDecimals } from '@/lib/decimal';
import { todayIso } from '@/lib/formatDate';
import { firstNegativePosition } from '@/lib/positions';
import { CATALOG } from '@/services/mockCatalog';
import { SEED_TRANSACTIONS } from '@/services/mockTransactions';
import { validateTransactionInput } from '@/lib/transactionValidation';

let ledger: readonly Transaction[] = SEED_TRANSACTIONS;
let nextNumber = SEED_TRANSACTIONS.length + 1;

/** The change would leave a position below zero: the refusal the user is told about. */
export class TransactionRuleError extends Error {
  readonly assetName: string;
  /** The first day the position would be negative (ISO date). */
  readonly date: string;
  /** How much of the asset would be missing that day. */
  readonly shortBy: string;

  constructor(assetName: string, date: string, shortBy: string) {
    super(`${assetName} would go below zero on ${date}`);
    this.name = 'TransactionRuleError';
    this.assetName = assetName;
    this.date = date;
    this.shortBy = shortBy;
  }
}

/** Test hook: puts the invented ledger back as it was. */
export function resetTransactions(): void {
  ledger = SEED_TRANSACTIONS;
  nextNumber = SEED_TRANSACTIONS.length + 1;
}

/** The current ledger, for other mock services that list transactions. */
export function readLedger(): readonly Transaction[] {
  return ledger;
}

export function fetchTransactions(): Promise<readonly Transaction[]> {
  return Promise.resolve(ledger);
}

function assetOf(assetId: string): (typeof CATALOG)[number] {
  const asset = CATALOG.find((entry) => entry.id === assetId);
  if (asset === undefined) {
    throw new Error(`Unknown asset: ${assetId}`);
  }
  return asset;
}

function build(
  id: string,
  input: TransactionInput,
  status: Pick<Transaction, 'status' | 'voidedAt' | 'voidReason'>,
): Transaction {
  const asset = assetOf(input.assetId);
  validateTransactionInput(input);
  return {
    ...input,
    ...status,
    id,
    assetName: asset.name,
    symbol: asset.symbol,
    assetType: asset.assetType,
    unit: asset.unit,
    usdAmount:
      input.totalAmount === null
        ? '0.00'
        : trimDecimals(
            roundDecimal(
              multiplyDecimals(input.totalAmount, input.fxRateToUsd),
              8,
            ),
            2,
          ),
  };
}

const ACTIVE = {
  status: 'ACTIVE',
  voidedAt: null,
  voidReason: null,
} as const;

/** Applies a new ledger only if no touched asset ends up with a negative position. */
function commit(
  next: readonly Transaction[],
  assetIds: readonly string[],
): void {
  for (const assetId of new Set(assetIds)) {
    const negative = firstNegativePosition(next, assetId);
    if (negative !== null) {
      throw new TransactionRuleError(
        assetOf(assetId).name,
        negative.date,
        negative.shortBy,
      );
    }
  }
  ledger = next;
}

function find(id: string): Transaction {
  const found = ledger.find((transaction) => transaction.id === id);
  if (found === undefined) {
    throw new Error(`Unknown transaction: ${id}`);
  }
  return found;
}

function replace(updated: Transaction): Transaction[] {
  return ledger.map((transaction) =>
    transaction.id === updated.id ? updated : transaction,
  );
}

export function createTransaction(
  input: TransactionInput,
): Promise<Transaction> {
  return run(() => {
    const created = build(
      `tx-${String(nextNumber).padStart(4, '0')}`,
      input,
      ACTIVE,
    );
    commit([...ledger, created], [created.assetId]);
    nextNumber += 1;
    return created;
  });
}

/** Edits in place (the old values are not kept). Only active transactions can be edited. */
export function updateTransaction(
  id: string,
  input: TransactionInput,
): Promise<Transaction> {
  return run(() => {
    const existing = find(id);
    if (existing.status === 'VOIDED') {
      throw new Error('A cancelled transaction cannot be edited');
    }
    const updated = build(id, input, ACTIVE);
    commit(replace(updated), [existing.assetId, updated.assetId]);
    return updated;
  });
}

/** Cancels instead of deleting: the flag keeps it out of every calculation. */
export function voidTransaction(
  id: string,
  reason: string | null,
): Promise<Transaction> {
  return run(() => {
    const existing = find(id);
    const voided: Transaction = {
      ...existing,
      status: 'VOIDED',
      voidedAt: todayIso(),
      voidReason: reason,
    };
    commit(replace(voided), [existing.assetId]);
    return voided;
  });
}

export function restoreTransaction(id: string): Promise<Transaction> {
  return run(() => {
    const existing = find(id);
    const restored: Transaction = { ...existing, ...ACTIVE };
    commit(replace(restored), [existing.assetId]);
    return restored;
  });
}

// Every call answers asynchronously and refusals arrive as rejections, like a real request.
function run<T>(action: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      resolve(action());
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

/** Atomically appends a batch; rechecks duplicates and chronological balances at commit time. */
export function importTransactions(
  inputs: readonly TransactionInput[],
): Promise<number> {
  return run(() => {
    const seen = new Set(ledger.map(fingerprint));
    const unique = inputs.filter((input) => {
      const key = fingerprint(input);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
    const created = unique.map((input, index) =>
      build(`tx-${String(nextNumber + index).padStart(4, '0')}`, input, ACTIVE),
    );
    commit(
      [...ledger, ...created],
      created.map((row) => row.assetId),
    );
    nextNumber += created.length;
    return created.length;
  });
}
