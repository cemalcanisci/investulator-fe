import { useId, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HOLDINGS_SORTS,
  isHoldingsSort,
  type HoldingsSort,
} from '@/lib/holdingsView';

export interface SortSelectProps {
  readonly value: HoldingsSort;
  readonly onChange: (value: HoldingsSort) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps): JSX.Element {
  const { t } = useTranslation();
  const id = useId();

  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-fg-2">
      <span>{t('holdings.sort.label')}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          if (isHoldingsSort(next)) {
            onChange(next);
          }
        }}
        className="h-10 rounded-lg border border-line-strong bg-surface px-3 text-sm text-fg"
      >
        {HOLDINGS_SORTS.map((sort) => (
          <option key={sort} value={sort}>
            {t(`holdings.sort.${sort}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
