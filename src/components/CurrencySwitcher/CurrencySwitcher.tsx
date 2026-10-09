import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Segmented } from '@/components/ui/Segmented';
import { DISPLAY_CURRENCIES } from '@/domain/currency';
import { useCurrency } from '@/hooks/useCurrency';

/** Switches the currency amounts are shown in; TL stays disabled while there is no exchange rate. */
export function CurrencySwitcher(): JSX.Element {
  const { t } = useTranslation();
  const { currency, setCurrency, usdTryRate } = useCurrency();
  const options = DISPLAY_CURRENCIES.map((code) => ({
    value: code,
    label: code,
    disabled: code === 'TRY' && usdTryRate === null,
  }));

  return (
    <span
      title={usdTryRate === null ? t('currency.rateUnavailable') : undefined}
    >
      <Segmented
        options={options}
        value={currency}
        onChange={setCurrency}
        aria-label={t('currency.label')}
      />
    </span>
  );
}
