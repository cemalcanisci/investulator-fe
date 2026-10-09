import type { DisplayCurrency } from '@/domain/currency';
import { multiplyDecimals, toDisplayNumber } from '@/lib/decimal';
import type { FormatOptions } from '@/lib/formatNumber';

// "narrowSymbol" keeps the TL sign as "₺" in every locale (English would otherwise print "TRY").
const SYMBOL = 'narrowSymbol';

/**
 * Converts a USD amount to the display currency. `usdTryRate` is TL per one USD; without it the
 * amount is returned as is. Display only: exact for strings, floating point for numbers (charts).
 */
export function convertFromUsd(
  amount: number | string,
  currency: DisplayCurrency,
  usdTryRate: string | null,
): number | string {
  if (currency === 'USD' || usdTryRate === null) {
    return amount;
  }
  return typeof amount === 'string'
    ? multiplyDecimals(amount, usdTryRate)
    : amount * toDisplayNumber(usdTryRate);
}

function toNumber(amount: number | string): number {
  return typeof amount === 'string' ? toDisplayNumber(amount) : amount;
}

export function formatMoney(
  amount: number | string,
  locale: string,
  currency: DisplayCurrency,
  options: FormatOptions = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: SYMBOL,
    signDisplay: options.signed ? 'exceptZero' : 'auto',
  }).format(toNumber(amount));
}

/**
 * Whole units for chart axes. Compact notation is avoided on purpose: "B" means thousand in
 * Turkish but billion in English.
 */
export function formatWholeMoney(
  amount: number,
  locale: string,
  currency: DisplayCurrency,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: SYMBOL,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Price of one unit; currency rates need four decimals, other assets two. */
export function formatUnitMoney(
  price: number | string,
  locale: string,
  currency: DisplayCurrency,
  decimals = 2,
): string {
  const value = toNumber(price);
  const precision =
    value !== 0 && Math.abs(value) < 1
      ? Math.min(
          18,
          Math.max(decimals, -Math.floor(Math.log10(Math.abs(value))) + 1),
        )
      : decimals;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: SYMBOL,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}
