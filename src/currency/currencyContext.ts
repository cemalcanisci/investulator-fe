import { createContext } from 'react';
import { DEFAULT_CURRENCY, type DisplayCurrency } from '@/domain/currency';
import type { UsdTryRate } from '@/services/fx';

export interface CurrencyContextValue {
  /** The currency amounts are shown in right now. */
  readonly currency: DisplayCurrency;
  readonly setCurrency: (currency: DisplayCurrency) => void;
  /** Null while the rate is loading or could not be loaded; TL cannot be shown then. */
  readonly usdTryRate: UsdTryRate | null;
}

// Unlike the theme, the currency has a usable default, so leaf components render in USD without a
// provider (their tests need no wrapper).
export const CurrencyContext = createContext<CurrencyContextValue>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => undefined,
  usdTryRate: null,
});
