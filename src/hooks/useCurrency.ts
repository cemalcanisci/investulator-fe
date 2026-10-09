import { useContext } from 'react';
import {
  CurrencyContext,
  type CurrencyContextValue,
} from '@/currency/currencyContext';

export function useCurrency(): CurrencyContextValue {
  return useContext(CurrencyContext);
}
