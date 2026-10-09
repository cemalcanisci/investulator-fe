import { RiSearchLine } from '@remixicon/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { SortSelect } from '@/components/Holdings/SortSelect';
import { TypeFilterChips } from '@/components/Holdings/TypeFilterChips';
import { Input } from '@/components/ui/Input';
import type { HoldingsSort, TypeFilter } from '@/lib/holdingsView';

export interface HoldingsToolbarProps {
  readonly type: TypeFilter;
  readonly query: string;
  readonly sort: HoldingsSort;
  readonly counts: Readonly<Record<TypeFilter, number>>;
  readonly onTypeChange: (value: TypeFilter) => void;
  readonly onQueryChange: (value: string) => void;
  readonly onSortChange: (value: HoldingsSort) => void;
}

export function HoldingsToolbar({
  type,
  query,
  sort,
  counts,
  onTypeChange,
  onQueryChange,
  onSortChange,
}: HoldingsToolbarProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          allowClear
          value={query}
          className="sm:max-w-xs"
          prefix={
            <RiSearchLine className="size-4 text-fg-2" aria-hidden="true" />
          }
          placeholder={t('holdings.search.placeholder')}
          aria-label={t('holdings.search.label')}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {/* Below md the list is cards without column headers, so sorting lives here. */}
        <div className="md:hidden">
          <SortSelect value={sort} onChange={onSortChange} />
        </div>
      </div>
      <TypeFilterChips value={type} counts={counts} onChange={onTypeChange} />
    </div>
  );
}
