import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { TYPE_FILTERS, type TypeFilter } from '@/lib/holdingsView';

export interface TypeFilterChipsProps {
  readonly value: TypeFilter;
  readonly counts: Readonly<Record<TypeFilter, number>>;
  readonly onChange: (value: TypeFilter) => void;
}

export function TypeFilterChips({
  value,
  counts,
  onChange,
}: TypeFilterChipsProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('holdings.filter.label')}
      className="flex flex-wrap gap-2"
    >
      {TYPE_FILTERS.map((filter) => {
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
              ? t('holdings.filter.all')
              : t(`assetTypes.${filter}`)}
            <span className="text-xs tabular-nums">{counts[filter]}</span>
          </button>
        );
      })}
    </div>
  );
}
