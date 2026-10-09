import { toDisplayNumber } from '@/lib/decimal';

export interface FormatOptions {
  /** Prefixes positive amounts with "+" (used for profit and loss). */
  readonly signed?: boolean;
}

/**
 * Formats a decimal string with the locale's separators, keeping the number of decimals the string
 * has ("0.0500" stays four decimals). Display only.
 */
export function formatQuantity(value: string, locale: string): string {
  const decimals = value.split('.')[1]?.length ?? 0;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(toDisplayNumber(value));
}

/** Formats a percentage given in percent units ("6.5" is 6.5%). */
export function formatPercent(
  percent: number | string,
  locale: string,
  options: FormatOptions = {},
): string {
  const value =
    typeof percent === 'string' ? toDisplayNumber(percent) : percent;
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: options.signed ? 'exceptZero' : 'auto',
  }).format(value / 100);
}
