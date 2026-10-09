import { useState, type JSX, type ReactNode } from 'react';
import { readStoredCurrency, storeCurrency } from '@/currency/currencyStorage';
import { CurrencyContext } from '@/currency/currencyContext';
import type { DisplayCurrency } from '@/domain/currency';
import { useUsdTryRate } from '@/hooks/useUsdTryRate';

export interface CurrencyProviderProps {
  readonly children: ReactNode;
}

export function CurrencyProvider({
  children,
}: CurrencyProviderProps): JSX.Element {
  const [preferred, setPreferred] =
    useState<DisplayCurrency>(readStoredCurrency);
  const usdTryRate = useUsdTryRate().data ?? null;
  // TL needs a rate. Until there is one the app shows USD, and the switch says so instead of
  // claiming TL while showing dollars.
  const currency = usdTryRate === null ? 'USD' : preferred;

  function setCurrency(next: DisplayCurrency): void {
    storeCurrency(next);
    setPreferred(next);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, usdTryRate }}>
      {children}
    </CurrencyContext.Provider>
  );
}
