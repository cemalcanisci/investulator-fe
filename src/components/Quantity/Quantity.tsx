import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuantityUnit } from '@/domain/assetTypes';
import { useLanguage } from '@/hooks/useLanguage';
import { formatQuantity } from '@/lib/formatNumber';

export interface QuantityProps {
  readonly quantity: string | null;
  readonly unit: QuantityUnit | null;
}

const NO_QUANTITY = '—';

/** A quantity with the locale's separators and its unit: "10 gr" for gram gold, "2 adet" for coins. */
export function Quantity({ quantity, unit }: QuantityProps): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();

  if (quantity === null) {
    return <>{NO_QUANTITY}</>;
  }
  const unitLabel = unit === null ? '' : ` ${t(`units.${unit}`)}`;
  return <>{`${formatQuantity(quantity, language)}${unitLabel}`}</>;
}
