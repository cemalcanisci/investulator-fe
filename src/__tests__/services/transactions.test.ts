import { describe, expect, it } from 'vitest';
import { positionQuantity, firstNegativePosition } from '@/lib/positions';
import { subtractDecimals } from '@/lib/decimal';
import { emptyFormValues, toTransactionInput } from '@/lib/transactionForm';
import { HOLDINGS } from '@/services/mockPortfolio';
import { SEED_TRANSACTIONS } from '@/services/mockTransactions';
import {
  createTransaction,
  updateTransaction,
  voidTransaction,
  restoreTransaction,
  readLedger,
  fetchTransactions,
  TransactionRuleError,
} from '@/services/transactions';
import type { TransactionInput } from '@/domain/transaction';

function input(overrides: Partial<TransactionInput> = {}): TransactionInput {
  return {
    ...toTransactionInput(
      {
        ...emptyFormValues('2026-09-22'),
        assetId: 'btc',
        quantity: '1',
        totalAmount: '100',
        anchors: ['quantity', 'totalAmount'],
      },
      '1',
    ),
    ...overrides,
    ...(overrides.type === 'BONUS' ||
    overrides.type === 'SPLIT' ||
    overrides.type === 'DIVIDEND'
      ? { unitPrice: null }
      : {}),
  };
}

describe('transaction ledger', () => {
  it('rejects malformed direct writes without changing the ledger', async () => {
    const before = readLedger();
    for (const patch of [
      { quantity: '-1' },
      { executedAt: '2026-02-30' },
      { executedTime: '25:00' },
      { totalAmount: null },
      { fee: '-1' },
      { splitRatio: '2' },
    ]) {
      await expect(createTransaction(input(patch))).rejects.toThrow(
        'Invalid transaction input',
      );
      expect(readLedger()).toBe(before);
    }
  });

  it('keeps sub-cent dollar snapshots', async () => {
    const created = await createTransaction(
      input({ quantity: '1', unitPrice: '0.001', totalAmount: '0.001' }),
    );
    expect(created.usdAmount).toBe('0.001');
  });
  it('matches every holding while ignoring cancelled purchases', () => {
    for (const holding of HOLDINGS) {
      expect(
        subtractDecimals(
          positionQuantity(SEED_TRANSACTIONS, holding.id),
          holding.quantity,
        ),
      ).toMatch(/^0(?:\.0+)?$/);
      expect(firstNegativePosition(SEED_TRANSACTIONS, holding.id)).toBeNull();
    }
    expect(positionQuantity(SEED_TRANSACTIONS, 'unknown')).toMatch(
      /^0(?:\.0+)?$/,
    );
    expect(positionQuantity(SEED_TRANSACTIONS, 'btc', '2025-11-09')).toMatch(
      /^0(?:\.0+)?$/,
    );
  });

  it('creates, edits, cancels and restores without deleting history', async () => {
    const created = await createTransaction(input());
    expect(created).toMatchObject({ status: 'ACTIVE', usdAmount: '100.00' });
    const updated = await updateTransaction(
      created.id,
      input({ quantity: '2', totalAmount: '250' }),
    );
    expect(updated.usdAmount).toBe('250.00');
    expect(await voidTransaction(created.id, 'Test')).toMatchObject({
      status: 'VOIDED',
      voidReason: 'Test',
    });
    await expect(updateTransaction(created.id, input())).rejects.toThrow(
      'cancelled',
    );
    expect(await restoreTransaction(created.id)).toMatchObject({
      status: 'ACTIVE',
      voidedAt: null,
      voidReason: null,
    });
    expect(await fetchTransactions()).toHaveLength(
      SEED_TRANSACTIONS.length + 1,
    );
  });

  it('rejects historical shortages atomically and does not consume ids', async () => {
    const before = readLedger();
    await expect(
      createTransaction(
        input({ type: 'SELL', quantity: '1', executedAt: '2025-01-01' }),
      ),
    ).rejects.toBeInstanceOf(TransactionRuleError);
    expect(readLedger()).toBe(before);
    const created = await createTransaction(input());
    expect(created.id).toBe(
      `tx-${String(SEED_TRANSACTIONS.length + 1).padStart(4, '0')}`,
    );
    const sale = await createTransaction(
      input({ type: 'SELL', quantity: '1' }),
    );
    await expect(voidTransaction(created.id, null)).rejects.toMatchObject({
      shortBy: '0.5750',
    });
    await expect(
      updateTransaction(created.id, input({ assetId: 'eth' })),
    ).rejects.toBeInstanceOf(TransactionRuleError);
    await voidTransaction(sale.id, null);
    await voidTransaction(created.id, null);
    await expect(restoreTransaction(sale.id)).rejects.toBeInstanceOf(
      TransactionRuleError,
    );
  });

  it('applies bonus, split, reverse split and dividends chronologically', async () => {
    await createTransaction(
      input({
        assetId: 'btc',
        type: 'BONUS',
        quantity: '0.575',
        totalAmount: null,
      }),
    );
    await createTransaction(
      input({
        type: 'SPLIT',
        quantity: null,
        totalAmount: null,
        splitRatio: '2',
      }),
    );
    await createTransaction(
      input({
        type: 'SPLIT',
        quantity: null,
        totalAmount: null,
        splitRatio: '0.5',
      }),
    );
    await createTransaction(
      input({ type: 'DIVIDEND', quantity: null, totalAmount: '10' }),
    );
    expect(
      subtractDecimals(
        positionQuantity([...readLedger()].reverse(), 'btc'),
        '1',
      ),
    ).toMatch(/^0(?:\.0+)?$/);
  });

  it('rejects missing assets and transactions', async () => {
    await expect(
      createTransaction(input({ assetId: 'missing' })),
    ).rejects.toThrow('Unknown asset');
    await expect(voidTransaction('missing', null)).rejects.toThrow(
      'Unknown transaction',
    );
  });
});
