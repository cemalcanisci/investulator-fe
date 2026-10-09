import type { DisplayCurrency } from '@/domain/currency';
import { useCurrency } from '@/hooks/useCurrency';
import { useLanguage } from '@/hooks/useLanguage';
import {
  convertFromUsd,
  formatMoney,
  formatUnitMoney,
  formatWholeMoney,
} from '@/lib/formatMoney';
import type { FormatOptions } from '@/lib/formatNumber';

export interface Money {
  readonly currency: DisplayCurrency;
  /** An amount given in USD, converted and shown in the display currency. */
  readonly format: (amount: number | string, options?: FormatOptions) => string;
  /** Price of one USD-priced unit; `decimals` is 4 for currency rates. */
  readonly formatUnit: (price: number | string, decimals?: number) => string;
  /** USD to display currency as a number, for chart data (so axes pick round ticks). */
  readonly convert: (amount: number) => number;
  /** An amount that is already in the display currency (chart labels and tooltips). */
  readonly formatConverted: (amount: number, options?: FormatOptions) => string;
  /** Whole units of an already converted amount, for chart axes. */
  readonly formatWhole: (amount: number) => string;
}

export function useMoney(): Money {
  const { language } = useLanguage();
  const { currency, usdTryRate } = useCurrency();
  const rate = usdTryRate?.rate ?? null;

  function toDisplay(amount: number | string): number | string {
    return convertFromUsd(amount, currency, rate);
  }

  return {
    currency,
    format: (amount, options) =>
      formatMoney(toDisplay(amount), language, currency, options),
    formatUnit: (price, decimals) =>
      formatUnitMoney(toDisplay(price), language, currency, decimals),
    convert: (amount) => Number(toDisplay(amount)),
    formatConverted: (amount, options) =>
      formatMoney(amount, language, currency, options),
    formatWhole: (amount) => formatWholeMoney(amount, language, currency),
  };
}
