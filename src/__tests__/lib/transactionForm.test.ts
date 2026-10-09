import { describe, expect, it } from 'vitest';
import {
  emptyFormValues,
  parseDecimalInput,
  typeAmount,
  resolveAmounts,
  effectiveRate,
  usdPreview,
  validateForm,
  toTransactionInput,
  formValuesOf,
} from '@/lib/transactionForm';
import { SEED_TRANSACTIONS } from '@/services/mockTransactions';

const context = { today: '2026-09-22', autoRate: '0.025', available: '2' };
const initial = { ...emptyFormValues(context.today), assetId: 'btc' };

describe('transaction form calculations', () => {
  it('keeps small crypto prices and totals instead of rounding them to zero', () => {
    const values = typeAmount(
      typeAmount(initial, 'quantity', '1000000'),
      'totalAmount',
      '0.1',
    );
    expect(resolveAmounts(values).value.unitPrice).toBe('0.0000001');
    expect(validateForm(values, context)).toEqual({});
    const tiny = typeAmount(
      typeAmount(initial, 'quantity', '1'),
      'unitPrice',
      '0.00000001',
    );
    expect(toTransactionInput(tiny, '1').totalAmount).toBe('0.00000001');
  });

  it('uses the visible derived value when another field becomes calculated', () => {
    const values = typeAmount(
      typeAmount(initial, 'quantity', '2'),
      'unitPrice',
      '10',
    );
    const edited = typeAmount(values, 'totalAmount', '30');
    expect(resolveAmounts(edited).value.quantity).toBe('3');
    expect(
      resolveAmounts(typeAmount(edited, 'unitPrice', '5')).value.quantity,
    ).toBe('6');
  });

  it.each(['BONUS', 'SPLIT'] as const)(
    'does not require a rate for %s',
    (type) => {
      const values = {
        ...initial,
        type,
        currency: 'TRY' as const,
        quantity: '2',
        splitRatio: '2',
      };
      expect(validateForm(values, { ...context, autoRate: null })).toEqual({});
      expect(toTransactionInput(values, null).fxRateToUsd).toBe('1');
    },
  );

  it('rejects impossible calendar dates and invalid times', () => {
    expect(
      validateForm({ ...initial, date: '2026-02-30', time: '25:00' }, context),
    ).toMatchObject({
      date: { key: 'dateInvalid' },
      time: { key: 'timeInvalid' },
    });
  });
  it.each([
    [' 12,5 ', '12.5'],
    ['.5', '0.5'],
    ['12.', '12'],
    ['', ''],
    ['1.000,5', null],
    ['-1', null],
    ['abc', null],
  ])('parses %s', (text, expected) => {
    expect(parseDecimalInput(text)).toBe(expected);
  });

  it('derives each third field and preserves the entered total across rounding', () => {
    let values = typeAmount(
      typeAmount(initial, 'quantity', '3'),
      'unitPrice',
      '0.335',
    );
    expect(resolveAmounts(values)).toMatchObject({
      derived: 'totalAmount',
      value: { totalAmount: '1.005' },
    });
    values = typeAmount(values, 'totalAmount', '1');
    expect(resolveAmounts(values)).toMatchObject({
      derived: 'quantity',
      value: { quantity: '2.985074626865671642' },
    });
    values = typeAmount(values, 'quantity', '3');
    expect(resolveAmounts(values)).toMatchObject({
      derived: 'unitPrice',
      value: { unitPrice: '0.333333333333333333', totalAmount: '1' },
    });
    expect(toTransactionInput(values, '1').totalAmount).toBe('1');
    expect(
      resolveAmounts(typeAmount(values, 'quantity', '')).derived,
    ).toBeNull();
  });

  it('does not divide by zero or calculate from missing inputs', () => {
    for (const field of ['quantity', 'unitPrice'] as const) {
      const values = typeAmount(
        typeAmount(initial, field, '0'),
        'totalAmount',
        '10',
      );
      expect(validateForm(values, context).amounts?.key).toBe('mustBePositive');
    }
    expect(
      resolveAmounts({ ...initial, anchors: ['quantity', 'unitPrice'] }).value
        .totalAmount,
    ).toBe('');
  });

  it('handles automatic, manual, missing and USD rates', () => {
    const values = {
      ...initial,
      currency: 'TRY' as const,
      type: 'DIVIDEND' as const,
      totalAmount: '100',
    };
    expect(effectiveRate(initial, null)).toBe('1');
    expect(usdPreview(values, '0.025')).toBe('2.50');
    expect(
      effectiveRate({ ...values, fxSource: 'MANUAL', fxRate: '0,03' }, null),
    ).toBe('0.03');
    expect(
      effectiveRate({ ...values, fxSource: 'MANUAL', fxRate: '0' }, '1'),
    ).toBeNull();
    expect(usdPreview(values, null)).toBeNull();
    expect(usdPreview(initial, '1')).toBeNull();
    expect(
      validateForm(values, { ...context, autoRate: null }).fxRate?.key,
    ).toBe('rateRequired');
  });

  it('validates required fields, future dates, invalid amounts, fees and overselling', () => {
    expect(
      validateForm({ ...emptyFormValues(''), fee: 'x' }, context),
    ).toMatchObject({
      asset: { key: 'assetRequired' },
      date: { key: 'dateRequired' },
      amounts: { key: 'amountsRequired' },
      fee: { key: 'invalidNumber' },
    });
    expect(
      validateForm({ ...initial, date: '2027-01-01', quantity: 'x' }, context),
    ).toMatchObject({
      date: { key: 'dateFuture' },
      amounts: { key: 'invalidNumber' },
    });
    const sale = {
      ...typeAmount(typeAmount(initial, 'quantity', '3'), 'totalAmount', '10'),
      type: 'SELL' as const,
    };
    expect(validateForm(sale, context).quantity).toEqual({
      key: 'insufficientQuantity',
      params: { available: '2' },
    });
    expect(validateForm(sale, { ...context, available: null })).toEqual({});
  });

  it.each(['BONUS', 'SPLIT', 'DIVIDEND'] as const)(
    'validates and serializes %s',
    (type) => {
      const values = {
        ...initial,
        type,
        quantity: '5',
        splitRatio: '2',
        totalAmount: '12',
        platform: ' Test ',
        note: ' Note ',
      };
      expect(validateForm(values, context)).toEqual({});
      expect(toTransactionInput(values, null)).toMatchObject({
        quantity: type === 'BONUS' ? '5' : null,
        splitRatio: type === 'SPLIT' ? '2' : null,
        totalAmount: type === 'DIVIDEND' ? '12' : null,
        unitPrice: null,
        fee: null,
        platform: 'Test',
        note: 'Note',
      });
      expect(
        Object.values(
          validateForm(
            { ...values, quantity: 'x', splitRatio: 'x', totalAmount: 'x' },
            context,
          ),
        ),
      ).toContainEqual({ key: 'invalidNumber' });
      expect(
        Object.values(
          validateForm(
            { ...values, quantity: '', splitRatio: '0', totalAmount: '' },
            context,
          ),
        ),
      ).toContainEqual({ key: 'mustBePositive' });
    },
  );

  it('retains snapshots and nullable fields when loading existing records', () => {
    for (const transaction of SEED_TRANSACTIONS) {
      const values = formValuesOf(transaction);
      expect(values.fxRate).toBe(transaction.fxRateToUsd);
      expect(values.fxSource).toBe(transaction.fxRateSource);
      expect(values.assetId).toBe(transaction.assetId);
    }
  });
});
