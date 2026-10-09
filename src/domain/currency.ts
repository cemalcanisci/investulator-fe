/** Currencies amounts can be shown in. Calculations stay in USD; this only changes the display. */
export const DISPLAY_CURRENCIES = ['USD', 'TRY'] as const;

export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number];

export const DEFAULT_CURRENCY: DisplayCurrency = 'USD';

export function isDisplayCurrency(value: unknown): value is DisplayCurrency {
  return DISPLAY_CURRENCIES.some((currency) => currency === value);
}
