import { describe, expect, it } from 'vitest';
import {
  COLUMNS,
  headers,
  mapRows,
  previewRows,
  transactionRows,
  validDate,
  type TransferRow,
} from '@/lib/transfer/schema';
import { SEED_TRANSACTIONS } from '@/services/mockTransactions';
import {
  importTransactions,
  readLedger,
  TransactionRuleError,
} from '@/services/transactions';

const row: TransferRow = {
  date: '2026-09-01',
  asset: 'btc',
  type: 'BUY',
  quantity: '1',
  unitPrice: '100',
  totalAmount: '',
  currency: 'USD',
  fee: '',
  fxRate: '1',
  fxSource: 'AUTO',
  platform: '',
  note: 'Test',
  splitRatio: '',
  status: 'ACTIVE',
  time: '',
};
const today = '2026-09-22';

describe('transfer validation', () => {
  it('reads legacy files without time and preserves explicit times', () => {
    const legacy = mapRows([
      headers('en').slice(0, -1),
      COLUMNS.slice(0, -1).map((key) => row[key]),
    ]);
    expect(legacy[0]?.time).toBe('');
    expect(() =>
      mapRows([headers('en').slice(0, -1), COLUMNS.map((key) => row[key])]),
    ).toThrow('headers');
    expect(previewRows(legacy, [], today)[0]?.issue).toBeNull();
    expect(
      previewRows([{ ...row, time: '09:30' }], [], today)[0]?.input
        ?.executedTime,
    ).toBe('09:30');
    expect(previewRows([{ ...row, time: '29:30' }], [], today)[0]?.issue).toBe(
      'values',
    );
  });

  it('preserves an exported unit price even when the total was rounded', () => {
    const result = previewRows(
      [{ ...row, quantity: '3', unitPrice: '0.333333', totalAmount: '1' }],
      [],
      today,
    );
    expect(result[0]?.input).toMatchObject({
      unitPrice: '0.333333',
      totalAmount: '1',
    });
  });
  it('recognizes localized and reordered headers and rejects wrong schemas', () => {
    expect(mapRows([headers('tr'), COLUMNS.map((key) => row[key])])).toEqual([
      row,
    ]);
    expect(
      mapRows([
        headers('en').reverse(),
        COLUMNS.map((key) => row[key]).reverse(),
      ]),
    ).toEqual([row]);
    expect(() => mapRows([])).toThrow('empty');
    expect(() => mapRows([['Date']])).toThrow('headers');
    expect(() =>
      mapRows([headers('tr'), Array.from({ length: 16 }, () => '')]),
    ).toThrow('headers');
    expect(() =>
      mapRows([headers('tr'), ...Array.from({ length: 1001 }, () => [])]),
    ).toThrow('limit');
    expect(mapRows([headers('tr'), []])[0]?.asset).toBe('');
  });
  it('validates real calendar dates', () => {
    expect(validDate('2024-02-29')).toBe(true);
    for (const date of ['2026-02-29', '2026-13-01', '01/01/2026', '']) {
      expect(validDate(date)).toBe(false);
    }
  });
  it.each([
    [{ date: '2026-02-30' }, 'date'],
    [{ date: '2027-01-01' }, 'values'],
    [{ asset: 'missing' }, 'asset'],
    [{ type: 'WRONG' }, 'type'],
    [{ currency: 'EUR' }, 'currency'],
    [{ fxSource: 'WRONG' }, 'rate'],
    [{ fxRate: '2' }, 'rate'],
    [{ quantity: '-1' }, 'number'],
    [{ quantity: '9'.repeat(41) }, 'number'],
    [{ note: 'x'.repeat(1001) }, 'cell'],
    [{ quantity: '0' }, 'values'],
    [{ totalAmount: '0' }, 'values'],
    [{ currency: 'TRY', fxRate: '' }, 'values'],
    [{ status: 'DELETED' }, 'status'],
    [{ splitRatio: '2' }, 'unused'],
  ])('rejects invalid input %j', (patch, issue) => {
    expect(previewRows([{ ...row, ...patch }], [], today)[0]).toMatchObject({
      input: null,
      issue,
      skipped: false,
    });
  });
  it('derives decimal amounts and recognizes file duplicates regardless of trailing zeros', () => {
    const rows = previewRows(
      [row, { ...row, quantity: '01.000', totalAmount: '100.00' }],
      [],
      today,
    );
    expect(rows[0]?.input).toMatchObject({
      quantity: '1',
      totalAmount: '100.00',
      fxRateToUsd: '1',
    });
    expect(rows[1]).toMatchObject({ issue: 'duplicate', skipped: true });
    expect(
      previewRows(
        [
          {
            ...row,
            currency: 'TRY',
            fxSource: '',
            fxRate: '0,025',
            quantity: '',
            totalAmount: '200',
          },
        ],
        [],
        today,
      )[0]?.input,
    ).toMatchObject({
      quantity: '2',
      fxRateToUsd: '0.025',
      fxRateSource: 'MANUAL',
    });
  });
  it('preserves all exported active snapshots and skips cancelled entries', () => {
    const preview = previewRows(
      mapRows([headers('tr'), ...transactionRows(SEED_TRANSACTIONS)]),
      [],
      today,
    );
    expect(
      preview.filter((item) => !item.skipped && item.issue !== null),
    ).toEqual([]);
    expect(
      preview
        .filter((item) => item.skipped)
        .every((item) => item.issue === 'voided'),
    ).toBe(true);
    const repeated = previewRows(
      mapRows([headers('en'), ...transactionRows(SEED_TRANSACTIONS)]),
      SEED_TRANSACTIONS,
      today,
    );
    expect(repeated.every((item) => item.skipped)).toBe(true);
  });
  it.each([
    { type: 'BONUS', quantity: '2', unitPrice: '' },
    { type: 'SPLIT', quantity: '', unitPrice: '', splitRatio: '0.5' },
    { type: 'DIVIDEND', quantity: '', unitPrice: '', totalAmount: '10' },
  ])('supports corporate action %j', (patch) => {
    expect(previewRows([{ ...row, ...patch }], [], today)[0]?.issue).toBeNull();
  });
  it('commits the entire batch once, deduplicates repeated submission, and refreshes balance rules', async () => {
    const preview = previewRows(
      [row, { ...row, type: 'SELL', quantity: '999' }],
      [],
      today,
    );
    const inputs = preview.flatMap((item) =>
      item.input === null ? [] : [item.input],
    );
    const before = readLedger();
    await expect(importTransactions(inputs)).rejects.toBeInstanceOf(
      TransactionRuleError,
    );
    expect(readLedger()).toBe(before);
    expect(await importTransactions(inputs.slice(0, 1))).toBe(1);
    expect(readLedger().at(-1)?.id).toBe(
      `tx-${String(SEED_TRANSACTIONS.length + 1).padStart(4, '0')}`,
    );
    expect(await importTransactions(inputs.slice(0, 1))).toBe(0);
  });
});
