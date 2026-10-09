import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TRANSACTION_TYPE_FILTERS,
  type TransactionTypeFilter,
} from '@/lib/transactionsView';

export interface TransactionTypeChipsProps {
  readonly value: TransactionTypeFilter;
  readonly counts: Readonly<Record<TransactionTypeFilter, number>>;
  readonly onChange: (value: TransactionTypeFilter) => void;
}

export function TransactionTypeChips({
  value,
  counts,
  onChange,
}: TransactionTypeChipsProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('transactions.filter.typeLabel')}
      className="flex flex-wrap gap-2"
    >
      {TRANSACTION_TYPE_FILTERS.map((filter) => {
        const pressed = filter === value;
        return (
          <button
            key={filter}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(filter)}
            className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors ${
              pressed
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-line bg-surface text-fg-2 hover:text-fg'
            }`}
          >
            {filter === 'ALL'
              ? t('transactions.filter.all')
              : t(`transactionTypes.${filter}`)}
            <span className="text-xs tabular-nums">{counts[filter]}</span>
          </button>
        );
      })}
    </div>
  );
}
