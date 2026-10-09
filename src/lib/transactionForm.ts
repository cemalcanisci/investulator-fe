import type { TransactionType } from '@/domain/assetTypes';
import { validDate } from '@/lib/formatDate';
import {
  isTrade,
  type FxRateSource,
  type Transaction,
  type TransactionCurrency,
  type TransactionInput,
} from '@/domain/transaction';
import {
  divideDecimals,
  getSign,
  multiplyDecimals,
  roundDecimal,
  subtractDecimals,
  trimDecimals,
} from '@/lib/decimal';

// Pure logic behind the transaction form: everything the user types stays a string, and the
// "any two of quantity, unit price and total" rule is exact decimal math (no floating point).

export const AMOUNT_FIELDS = ['quantity', 'unitPrice', 'totalAmount'] as const;

export type AmountField = (typeof AMOUNT_FIELDS)[number];

export interface TransactionFormValues {
  readonly type: TransactionType;
  /** Catalog id, or '' while no asset is chosen. */
  readonly assetId: string;
  /** ISO date. */
  readonly date: string;
  readonly time: string;
  // What the user typed; the derived field's text is ignored (see `anchors`).
  readonly quantity: string;
  readonly unitPrice: string;
  readonly totalAmount: string;
  /** The last two amount fields the user filled; the third one is calculated from them. */
  readonly anchors: readonly AmountField[];
  readonly currency: TransactionCurrency;
  readonly fee: string;
  readonly fxSource: FxRateSource;
  /** Typed rate; only used when the source is manual. */
  readonly fxRate: string;
  readonly platform: string;
  readonly note: string;
  readonly splitRatio: string;
}

export function emptyFormValues(today: string): TransactionFormValues {
  return {
    type: 'BUY',
    assetId: '',
    date: today,
    time: '12:00',
    quantity: '',
    unitPrice: '',
    totalAmount: '',
    anchors: [],
    currency: 'USD',
    fee: '',
    fxSource: 'AUTO',
    fxRate: '',
    platform: '',
    note: '',
    splitRatio: '',
  };
}

/** Form values for editing: quantity and total are the anchors, the unit price is derived. */
export function formValuesOf(transaction: Transaction): TransactionFormValues {
  return {
    type: transaction.type,
    assetId: transaction.assetId,
    date: transaction.executedAt,
    time: transaction.executedTime ?? '12:00',
    quantity: transaction.quantity ?? '',
    unitPrice: transaction.unitPrice ?? '',
    totalAmount: transaction.totalAmount ?? '',
    anchors:
      transaction.quantity !== null && transaction.totalAmount !== null
        ? ['quantity', 'totalAmount']
        : [],
    currency: transaction.currency,
    fee: transaction.fee ?? '',
    fxSource: transaction.fxRateSource,
    fxRate: transaction.fxRateToUsd,
    platform: transaction.platform ?? '',
    note: transaction.note ?? '',
    splitRatio: transaction.splitRatio ?? '',
  };
}

/**
 * Normalizes what a person types into a decimal string: "1234,5" and "1234.5" both give "1234.5".
 * Empty text gives ''; anything that is not a plain number (thousand separators, letters) gives null.
 */
export function parseDecimalInput(text: string): string | null {
  const normalized = text.trim().replace(',', '.');
  if (normalized === '') {
    return '';
  }
  if (normalized.length > 40 || !/^(\d+\.?\d*|\.\d+)$/.test(normalized)) {
    return null;
  }
  const withZero = normalized.startsWith('.') ? `0${normalized}` : normalized;
  return withZero.endsWith('.') ? withZero.slice(0, -1) : withZero;
}

function parseOrEmpty(text: string): string {
  return parseDecimalInput(text) ?? '';
}

function isPositive(value: string): boolean {
  return value !== '' && getSign(value) === 'positive';
}

type Amounts = Readonly<Record<AmountField, string>>;

function calculate(field: AmountField, amounts: Amounts): string {
  const { quantity, unitPrice, totalAmount } = amounts;
  switch (field) {
    case 'totalAmount':
      return quantity !== '' && unitPrice !== ''
        ? trimDecimals(
            roundDecimal(multiplyDecimals(quantity, unitPrice), 8),
            2,
          )
        : '';
    case 'unitPrice':
      return totalAmount !== '' && isPositive(quantity)
        ? trimDecimals(divideDecimals(totalAmount, quantity, 18), 2)
        : '';
    default:
      return totalAmount !== '' && isPositive(unitPrice)
        ? trimDecimals(divideDecimals(totalAmount, unitPrice, 18))
        : '';
  }
}

export interface ResolvedAmounts {
  /** What each amount input shows: the typed text, or the calculated value for the derived one. */
  readonly display: Amounts;
  /** Normalized decimal strings; '' when missing or not a number. */
  readonly value: Amounts;
  /** The field that is calculated from the other two, or null until two are filled. */
  readonly derived: AmountField | null;
}

export function resolveAmounts(values: TransactionFormValues): ResolvedAmounts {
  const value: Record<AmountField, string> = {
    quantity: parseOrEmpty(values.quantity),
    unitPrice: parseOrEmpty(values.unitPrice),
    totalAmount: parseOrEmpty(values.totalAmount),
  };
  const display: Record<AmountField, string> = {
    quantity: values.quantity,
    unitPrice: values.unitPrice,
    totalAmount: values.totalAmount,
  };
  const derived =
    values.anchors.length === 2
      ? (AMOUNT_FIELDS.find((field) => !values.anchors.includes(field)) ?? null)
      : null;
  if (derived !== null) {
    const calculated = calculate(derived, value);
    value[derived] = calculated;
    display[derived] = calculated;
  }
  return { display, value, derived };
}

/** Records that the user typed in an amount field, keeping the last two touched as anchors. */
export function typeAmount(
  values: TransactionFormValues,
  field: AmountField,
  text: string,
): TransactionFormValues {
  const others = values.anchors.filter((anchor) => anchor !== field);
  return {
    ...values,
    ...resolveAmounts(values).display,
    [field]: text,
    anchors: text.trim() === '' ? others : [...others, field].slice(-2),
  };
}

/** USD per unit of the chosen currency; null while it is unknown or not a positive number. */
export function effectiveRate(
  values: TransactionFormValues,
  autoRate: string | null,
): string | null {
  if (values.currency === 'USD') {
    return '1';
  }
  const rate =
    values.fxSource === 'MANUAL' ? parseOrEmpty(values.fxRate) : autoRate;
  return rate !== null && isPositive(rate) ? rate : null;
}

function totalOf(values: TransactionFormValues): string {
  if (isTrade(values.type)) {
    return resolveAmounts(values).value.totalAmount;
  }
  return values.type === 'DIVIDEND' ? parseOrEmpty(values.totalAmount) : '';
}

/** The total in USD at the chosen rate (two decimals), or null when it cannot be worked out. */
export function usdPreview(
  values: TransactionFormValues,
  autoRate: string | null,
): string | null {
  const total = totalOf(values);
  const rate = effectiveRate(values, autoRate);
  if (!isPositive(total) || rate === null) {
    return null;
  }
  return roundDecimal(multiplyDecimals(total, rate), 2);
}

export type FormField =
  | 'asset'
  | 'date'
  | 'time'
  | 'amounts'
  | 'quantity'
  | 'totalAmount'
  | 'fee'
  | 'fxRate'
  | 'splitRatio';

export interface FormError {
  /** Key under `transactions.form.errors` in the translations. */
  readonly key: string;
  readonly params?: Readonly<Record<string, string>>;
}

export type FormErrors = Readonly<Partial<Record<FormField, FormError>>>;

export interface FormContext {
  /** ISO date; a transaction cannot be dated after it. */
  readonly today: string;
  readonly autoRate: string | null;
  /** How much of the asset is held on the chosen date, for the "cannot sell more" warning. */
  readonly available: string | null;
}

function positiveNumberError(text: string): FormError | null {
  const parsed = parseDecimalInput(text);
  if (parsed === null) {
    return { key: 'invalidNumber' };
  }
  return isPositive(parsed) ? null : { key: 'mustBePositive' };
}

export function validateForm(
  values: TransactionFormValues,
  context: FormContext,
): FormErrors {
  const errors: Partial<Record<FormField, FormError>> = {};

  if (values.assetId === '') {
    errors.asset = { key: 'assetRequired' };
  }
  if (values.date === '') {
    errors.date = { key: 'dateRequired' };
  } else if (!validDate(values.date)) {
    errors.date = { key: 'dateInvalid' };
  } else if (values.date > context.today) {
    errors.date = { key: 'dateFuture' };
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time)) {
    errors.time = { key: 'timeInvalid' };
  }

  if (isTrade(values.type)) {
    const resolved = resolveAmounts(values);
    const typed = AMOUNT_FIELDS.filter((field) => field !== resolved.derived);
    if (typed.some((field) => parseDecimalInput(values[field]) === null)) {
      errors.amounts = { key: 'invalidNumber' };
    } else if (resolved.derived === null) {
      errors.amounts = { key: 'amountsRequired' };
    } else if (
      !AMOUNT_FIELDS.every((field) => isPositive(resolved.value[field]))
    ) {
      errors.amounts = { key: 'mustBePositive' };
    }
    if (values.fee.trim() !== '' && parseDecimalInput(values.fee) === null) {
      errors.fee = { key: 'invalidNumber' };
    }
    if (
      values.type === 'SELL' &&
      errors.amounts === undefined &&
      context.available !== null &&
      getSign(subtractDecimals(resolved.value.quantity, context.available)) ===
        'positive'
    ) {
      errors.quantity = {
        key: 'insufficientQuantity',
        params: { available: context.available },
      };
    }
  } else if (values.type === 'BONUS') {
    const problem = positiveNumberError(values.quantity);
    if (problem !== null) {
      errors.quantity = problem;
    }
  } else if (values.type === 'SPLIT') {
    const problem = positiveNumberError(values.splitRatio);
    if (problem !== null) {
      errors.splitRatio = problem;
    }
  } else {
    const problem = positiveNumberError(values.totalAmount);
    if (problem !== null) {
      errors.totalAmount = problem;
    }
  }

  if (
    (isTrade(values.type) || values.type === 'DIVIDEND') &&
    values.currency !== 'USD' &&
    effectiveRate(values, context.autoRate) === null
  ) {
    errors.fxRate = { key: 'rateRequired' };
  }
  return errors;
}

function orNull(text: string): string | null {
  const parsed = parseOrEmpty(text);
  return parsed === '' ? null : parsed;
}

/** The submitted transaction. Call only when `validateForm` found nothing wrong. */
export function toTransactionInput(
  values: TransactionFormValues,
  autoRate: string | null,
): TransactionInput {
  const { value } = resolveAmounts(values);
  const trade = isTrade(values.type);
  const platform = values.platform.trim();
  const note = values.note.trim();
  return {
    type: values.type,
    assetId: values.assetId,
    executedAt: values.date,
    ...(values.time === '12:00' ? {} : { executedTime: values.time }),
    quantity: trade
      ? value.quantity
      : values.type === 'BONUS'
        ? orNull(values.quantity)
        : null,
    unitPrice: trade ? value.unitPrice : null,
    totalAmount: trade
      ? value.totalAmount
      : values.type === 'DIVIDEND'
        ? orNull(values.totalAmount)
        : null,
    currency: values.currency,
    fee: trade ? orNull(values.fee) : null,
    fxRateToUsd:
      trade || values.type === 'DIVIDEND'
        ? (effectiveRate(values, autoRate) ?? '1')
        : '1',
    fxRateSource: values.currency === 'USD' ? 'AUTO' : values.fxSource,
    platform: platform === '' ? null : platform,
    note: note === '' ? null : note,
    splitRatio: values.type === 'SPLIT' ? orNull(values.splitRatio) : null,
  };
}
