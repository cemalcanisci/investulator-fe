import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { TransactionType } from '@/domain/assetTypes';

export interface TransactionTypeBadgeProps {
  readonly type: TransactionType;
}

// The word always says what it is; the tone only helps scanning a long list.
const TONE: Readonly<Record<TransactionType, string>> = {
  BUY: 'bg-primary-soft text-primary',
  SELL: 'bg-warn-soft text-warn',
  BONUS: 'bg-surface-2 text-fg-2',
  SPLIT: 'bg-surface-2 text-fg-2',
  DIVIDEND: 'bg-surface-2 text-fg-2',
};

export function TransactionTypeBadge({
  type,
}: TransactionTypeBadgeProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex h-[22px] items-center whitespace-nowrap rounded-full px-2 text-xs font-medium ${TONE[type]}`}
    >
      {t(`transactionTypes.${type}`)}
    </span>
  );
}
