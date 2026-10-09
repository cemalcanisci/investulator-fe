import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/hooks/useCurrency';
import { useLanguage } from '@/hooks/useLanguage';
import { formatUnitMoney } from '@/lib/formatMoney';

/**
 * Says how the TL figures come about. Profit and loss are calculated in dollars, so the TL value is
 * the dollar value converted at today's rate, not what was actually paid in TL.
 */
export function CurrencyNote(): JSX.Element | null {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { currency, usdTryRate } = useCurrency();

  if (currency !== 'TRY' || usdTryRate === null) {
    return null;
  }
  return (
    <p className="text-xs text-fg-2">
      {t('currency.note', {
        rate: formatUnitMoney(usdTryRate.rate, language, 'TRY'),
      })}
    </p>
  );
}
