import {
  DEFAULT_CURRENCY,
  isDisplayCurrency,
  type DisplayCurrency,
} from '@/domain/currency';

const STORAGE_KEY = 'inv-currency';

export function readStoredCurrency(): DisplayCurrency {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isDisplayCurrency(stored) ? stored : DEFAULT_CURRENCY;
  } catch {
    // Storage can be unavailable (private mode, blocked site data); use the default currency.
    return DEFAULT_CURRENCY;
  }
}

export function storeCurrency(currency: DisplayCurrency): void {
  try {
    localStorage.setItem(STORAGE_KEY, currency);
  } catch {
    // Remembering the choice is a convenience only.
  }
}
