import { TRANSACTION_TYPES } from '@/domain/assetTypes';
import type { Transaction, TransactionInput } from '@/domain/transaction';
import { getSign, subtractDecimals, trimDecimals } from '@/lib/decimal';
import {
  type TransactionFormValues,
  emptyFormValues,
  toTransactionInput,
  validateForm,
  AMOUNT_FIELDS,
  parseDecimalInput,
} from '@/lib/transactionForm';
import { CATALOG } from '@/services/mockCatalog';
import tr from '@/i18n/locales/tr.json';
import en from '@/i18n/locales/en.json';
import { validDate } from '@/lib/formatDate';
export { validDate } from '@/lib/formatDate';

export const COLUMNS = [
  'date',
  'asset',
  'type',
  'quantity',
  'unitPrice',
  'totalAmount',
  'currency',
  'fee',
  'fxRate',
  'fxSource',
  'platform',
  'note',
  'splitRatio',
  'status',
  'time',
] as const;
export type Column = (typeof COLUMNS)[number];
export type TransferRow = Readonly<Record<Column, string>>;
export interface ImportRow {
  readonly line: number;
  readonly raw: TransferRow;
  readonly input: TransactionInput | null;
  readonly issue: string | null;
  readonly skipped: boolean;
}
export const MAX_ROWS = 1000;

export function headers(language: string): string[] {
  const labels = language === 'en' ? en.transfer.columns : tr.transfer.columns;
  return COLUMNS.map((key) => labels[key]);
}

export function mapRows(grid: readonly (readonly string[])[]): TransferRow[] {
  const first = grid[0];
  if (first === undefined) {
    throw new Error('empty');
  }
  const indexes = COLUMNS.map((key, index) =>
    first.findIndex((cell) =>
      [key, headers('tr')[index], headers('en')[index]].includes(cell.trim()),
    ),
  );
  if (
    indexes.some((index, column) => index < 0 && COLUMNS[column] !== 'time') ||
    new Set(first).size !== first.length ||
    first.length !== indexes.filter((index) => index >= 0).length
  ) {
    throw new Error('headers');
  }
  if (grid.length > MAX_ROWS + 1) {
    throw new Error('limit');
  }
  return grid.slice(1).map((row) => {
    if (row.length > first.length) {
      throw new Error('headers');
    }
    const record: Record<Column, string> = {
      date: '',
      asset: '',
      type: '',
      quantity: '',
      unitPrice: '',
      totalAmount: '',
      currency: '',
      fee: '',
      fxRate: '',
      fxSource: '',
      platform: '',
      note: '',
      splitRatio: '',
      status: '',
      time: '',
    };
    COLUMNS.forEach((key, index) => {
      record[key] = (row[indexes[index] ?? -1] ?? '').trim();
    });
    return record;
  });
}

export function fingerprint(input: TransactionInput): string {
  const number = (value: string | null): string =>
    value === null || getSign(value) === 'zero'
      ? ''
      : trimDecimals(subtractDecimals(value, '0'));
  return JSON.stringify([
    input.assetId,
    input.type,
    input.executedAt,
    input.executedTime ?? '12:00',
    input.currency,
    number(input.quantity),
    number(input.unitPrice),
    number(input.totalAmount),
    number(input.fee),
    input.type === 'BONUS' || input.type === 'SPLIT'
      ? ''
      : number(input.fxRateToUsd),
    number(input.splitRatio),
    input.platform?.trim() ?? '',
    input.note?.trim() ?? '',
  ]);
}

function parseRow(raw: TransferRow, today: string): TransactionInput {
  if (Object.values(raw).some((value) => value.length > 1000)) {
    throw new Error('cell');
  }
  if (!validDate(raw.date)) {
    throw new Error('date');
  }
  const asset = CATALOG.find(
    (entry) => entry.id === raw.asset || entry.symbol === raw.asset,
  );
  const type = TRANSACTION_TYPES.find((entry) => entry === raw.type);
  if (asset === undefined) {
    throw new Error('asset');
  }
  if (type === undefined) {
    throw new Error('type');
  }
  if (raw.currency !== 'USD' && raw.currency !== 'TRY') {
    throw new Error('currency');
  }
  if (!['', 'AUTO', 'MANUAL'].includes(raw.fxSource)) {
    throw new Error('rate');
  }
  for (const key of [
    'quantity',
    'unitPrice',
    'totalAmount',
    'fee',
    'fxRate',
    'splitRatio',
  ] as const) {
    if (raw[key].length > 40 || parseDecimalInput(raw[key]) === null) {
      throw new Error('number');
    }
  }
  if (
    raw.currency === 'USD' &&
    raw.fxRate !== '' &&
    getSign(subtractDecimals(parseDecimalInput(raw.fxRate) ?? '0', '1')) !==
      'zero'
  ) {
    throw new Error('rate');
  }
  const unused =
    type === 'BUY' || type === 'SELL'
      ? ['splitRatio']
      : type === 'BONUS'
        ? ['unitPrice', 'totalAmount', 'fee', 'splitRatio']
        : type === 'SPLIT'
          ? ['quantity', 'unitPrice', 'totalAmount', 'fee']
          : ['quantity', 'unitPrice', 'fee', 'splitRatio'];
  if (
    unused.some((key) =>
      COLUMNS.some((column) => column === key && raw[column] !== ''),
    )
  ) {
    throw new Error('unused');
  }
  const values: TransactionFormValues = {
    ...emptyFormValues(today),
    ...raw,
    time: raw.time || '12:00',
    type,
    assetId: asset.id,
    currency: raw.currency,
    fxSource: 'MANUAL' as const,
    anchors: AMOUNT_FIELDS.filter((key) => raw[key] !== '').slice(0, 2),
  };
  const errors = validateForm(values, {
    today,
    autoRate: null,
    available: null,
  });
  if (Object.keys(errors).length > 0) {
    throw new Error('values');
  }
  const input = toTransactionInput(values, null);
  if (
    raw.totalAmount !== '' &&
    getSign(parseDecimalInput(raw.totalAmount) ?? '0') !== 'positive'
  ) {
    throw new Error('values');
  }
  if (AMOUNT_FIELDS.every((key) => raw[key] !== '')) {
    const difference = subtractDecimals(
      parseDecimalInput(raw.totalAmount) ?? '0',
      input.totalAmount ?? '0',
    );
    if (
      getSign(subtractDecimals(difference.replace('-', ''), '0.01')) ===
      'positive'
    ) {
      throw new Error('inconsistent');
    }
  }
  // Exported snapshots keep their original precision, including manually rounded totals.
  return {
    ...input,
    unitPrice:
      raw.unitPrice === '' ? input.unitPrice : parseDecimalInput(raw.unitPrice),
    totalAmount:
      raw.totalAmount === ''
        ? input.totalAmount
        : parseDecimalInput(raw.totalAmount),
    fxRateSource:
      raw.fxSource === 'AUTO' || raw.currency === 'USD' ? 'AUTO' : 'MANUAL',
  };
}

export function previewRows(
  rows: readonly TransferRow[],
  existing: readonly Transaction[],
  today: string,
): ImportRow[] {
  const seen = new Set(existing.map(fingerprint));
  return rows.map((raw, index) => {
    try {
      if (raw.status === 'VOIDED') {
        return {
          line: index + 2,
          raw,
          input: null,
          issue: 'voided',
          skipped: true,
        };
      }
      if (raw.status !== '' && raw.status !== 'ACTIVE') {
        throw new Error('status');
      }
      const input = parseRow(raw, today);
      const key = fingerprint(input);
      if (seen.has(key)) {
        return {
          line: index + 2,
          raw,
          input: null,
          issue: 'duplicate',
          skipped: true,
        };
      }
      seen.add(key);
      return { line: index + 2, raw, input, issue: null, skipped: false };
    } catch (error) {
      return {
        line: index + 2,
        raw,
        input: null,
        issue: error instanceof Error ? error.message : 'values',
        skipped: false,
      };
    }
  });
}

export function transactionRows(
  transactions: readonly Transaction[],
): string[][] {
  return transactions.map((row) => [
    row.executedAt,
    row.assetId,
    row.type,
    row.quantity ?? '',
    row.unitPrice ?? '',
    row.totalAmount ?? '',
    row.currency,
    row.fee ?? '',
    row.fxRateToUsd,
    row.fxRateSource,
    row.platform ?? '',
    row.note ?? '',
    row.splitRatio ?? '',
    row.status,
    row.executedTime ?? '',
  ]);
}
