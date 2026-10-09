import { RiSearchLine } from '@remixicon/react';
import { useId, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeSelect } from '@/components/NativeSelect/NativeSelect';
import { TransactionTypeChips } from '@/components/Transactions/TransactionTypeChips';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import {
  ASSET_TYPE_FILTERS,
  TRANSACTION_PERIODS,
  TRANSACTION_SORTS,
  isTransactionPeriod,
  type AssetTypeFilter,
  type TransactionFilter,
  type TransactionSort,
  type TransactionTypeFilter,
} from '@/lib/transactionsView';

export interface TransactionsToolbarProps {
  readonly filter: TransactionFilter;
  readonly typeCounts: Readonly<Record<TransactionTypeFilter, number>>;
  readonly platforms: readonly string[];
  readonly sort: TransactionSort;
  readonly onFilterChange: (filter: TransactionFilter) => void;
  readonly onSortChange: (sort: TransactionSort) => void;
}

function isAssetTypeFilter(value: string): value is AssetTypeFilter {
  return ASSET_TYPE_FILTERS.some((filter) => filter === value);
}

function isSort(value: string): value is TransactionSort {
  return TRANSACTION_SORTS.some((sort) => sort === value);
}

export function TransactionsToolbar({
  filter,
  typeCounts,
  platforms,
  sort,
  onFilterChange,
  onSortChange,
}: TransactionsToolbarProps): JSX.Element {
  const { t } = useTranslation();
  const voidedLabelId = useId();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          allowClear
          value={filter.query}
          className="sm:max-w-sm"
          prefix={
            <RiSearchLine className="size-4 text-fg-2" aria-hidden="true" />
          }
          placeholder={t('transactions.search.placeholder')}
          aria-label={t('transactions.search.label')}
          onChange={(event) =>
            onFilterChange({ ...filter, query: event.target.value })
          }
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Below md the list is cards without column headers, so sorting lives here. */}
          <div className="md:hidden">
            <NativeSelect
              label={t('transactions.sort.label')}
              value={sort}
              options={TRANSACTION_SORTS.map((value) => ({
                value,
                label: t(`transactions.sort.${value}`),
              }))}
              onChange={(value) => {
                if (isSort(value)) {
                  onSortChange(value);
                }
              }}
            />
          </div>
          <span className="inline-flex items-center gap-2 text-sm text-fg-2">
            <Switch
              checked={filter.showVoided}
              aria-labelledby={voidedLabelId}
              onChange={(checked) =>
                onFilterChange({ ...filter, showVoided: checked })
              }
            />
            <span id={voidedLabelId}>
              {t('transactions.filter.showVoided')}
            </span>
          </span>
        </div>
      </div>

      <TransactionTypeChips
        value={filter.type}
        counts={typeCounts}
        onChange={(type) => onFilterChange({ ...filter, type })}
      />

      <div className="flex flex-wrap items-center gap-2">
        <NativeSelect
          label={t('transactions.filter.assetType')}
          value={filter.assetType}
          options={ASSET_TYPE_FILTERS.map((value) => ({
            value,
            label:
              value === 'ALL'
                ? t('transactions.filter.allAssetTypes')
                : t(`assetTypes.${value}`),
          }))}
          onChange={(value) => {
            if (isAssetTypeFilter(value)) {
              onFilterChange({ ...filter, assetType: value });
            }
          }}
        />
        <NativeSelect
          label={t('transactions.filter.platform')}
          value={filter.platform}
          options={[
            { value: 'ALL', label: t('transactions.filter.allPlatforms') },
            ...platforms.map((name) => ({ value: name, label: name })),
          ]}
          onChange={(platform) => onFilterChange({ ...filter, platform })}
        />
        <NativeSelect
          label={t('transactions.filter.period')}
          value={filter.period}
          options={TRANSACTION_PERIODS.map((value) => ({
            value,
            label: t(`transactions.periods.${value}`),
          }))}
          onChange={(value) => {
            if (isTransactionPeriod(value)) {
              onFilterChange({ ...filter, period: value });
            }
          }}
        />
        {filter.period === 'CUSTOM' && (
          <>
            <Input
              type="date"
              className="w-40"
              value={filter.from}
              aria-label={t('transactions.filter.from')}
              onChange={(event) =>
                onFilterChange({ ...filter, from: event.target.value })
              }
            />
            <Input
              type="date"
              className="w-40"
              value={filter.to}
              aria-label={t('transactions.filter.to')}
              onChange={(event) =>
                onFilterChange({ ...filter, to: event.target.value })
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
