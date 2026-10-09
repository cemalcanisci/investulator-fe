import { describe, expect, it } from 'vitest';
import type { Transaction } from '@/domain/transaction';
import {
  compareLedgerOrder,
  firstNegativePosition,
  positionQuantity,
  quantityBefore,
} from '@/lib/positions';
import { sortTransactions } from '@/lib/transactionsView';
import { SEED_TRANSACTIONS } from '@/services/mockTransactions';

function entry(
  id: string,
  time: string,
  type: Transaction['type'],
  quantity: string | null,
  splitRatio: string | null = null,
): Transaction {
  const base = SEED_TRANSACTIONS[0];
  if (base === undefined) {
    throw new Error('Missing fixture');
  }
  return {
    ...base,
    id,
    assetId: 'test',
    executedAt: '2026-09-01',
    executedTime: time,
    type,
    quantity,
    splitRatio,
    status: 'ACTIVE',
  };
}

describe('intraday ledger order', () => {
  const buy = entry('tx-20', '09:00', 'BUY', '100');
  const sell = entry('tx-21', '10:00', 'SELL', '60');
  const split = entry('tx-22', '11:00', 'SPLIT', null, '0.5');

  it('validates an existing sale using its own position before a later reverse split', () => {
    const ledger = [split, sell, buy];
    expect(quantityBefore(ledger, 'test', sell)).toBe('100');
    expect(positionQuantity(ledger, 'test')).toBe('20.0');
    expect(firstNegativePosition(ledger, 'test')).toBeNull();
    expect(
      quantityBefore(ledger, 'test', {
        ...sell,
        id: 'new',
        executedTime: '08:00',
      }),
    ).toBe('0');
  });

  it('places backfilled records by time and uses numeric ids for ties', () => {
    expect(
      sortTransactions([split, sell, buy], {
        sort: 'DATE',
        direction: 'asc',
      }).map((row) => row.id),
    ).toEqual(['tx-20', 'tx-21', 'tx-22']);
    expect(
      compareLedgerOrder({ ...buy, id: 'tx-9999' }, { ...buy, id: 'tx-10000' }),
    ).toBeLessThan(0);
    expect(
      firstNegativePosition([buy, { ...sell, executedTime: '08:00' }], 'test'),
    ).toMatchObject({ shortBy: '60' });
  });
});
