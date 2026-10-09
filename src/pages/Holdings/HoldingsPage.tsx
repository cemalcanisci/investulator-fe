import { RiSearchLine, RiWalletLine } from '@remixicon/react';
import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routePaths';
import { CurrencyNote } from '@/components/CurrencyNote/CurrencyNote';
import { PriceStatus } from '@/components/Dashboard/PriceStatus';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { HoldingsSkeleton } from '@/components/Holdings/HoldingsSkeleton';
import { HoldingsSummary } from '@/components/Holdings/HoldingsSummary';
import { HoldingsTable } from '@/components/Holdings/HoldingsTable';
import { HoldingsToolbar } from '@/components/Holdings/HoldingsToolbar';
import { Button } from '@/components/ui/Button';
import { useHoldings } from '@/hooks/useHoldings';
import { useLanguage } from '@/hooks/useLanguage';
import {
  countByType,
  filterHoldings,
  defaultOrder,
  nextOrder,
  sortHoldings,
  totalsOf,
  type HoldingsOrder,
  type TypeFilter,
} from '@/lib/holdingsView';

export function HoldingsPage(): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const holdings = useHoldings();
  const [type, setType] = useState<TypeFilter>('ALL');
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<HoldingsOrder>(defaultOrder('VALUE'));

  function clearFilters(): void {
    setType('ALL');
    setQuery('');
  }

  function renderBody(): JSX.Element {
    if (holdings.isPending) {
      return <HoldingsSkeleton />;
    }
    if (holdings.isError) {
      return <ErrorState onRetry={() => void holdings.refetch()} />;
    }
    const all = holdings.data.holdings;
    if (all.length === 0) {
      return (
        <EmptyState
          icon={RiWalletLine}
          title={t('holdings.empty.title')}
          description={t('holdings.empty.description')}
          actions={
            <>
              <Button
                type="primary"
                onClick={() => void navigate(ROUTE_PATHS.transactionsNew)}
              >
                {t('holdings.empty.add')}
              </Button>
              <Button onClick={() => void navigate(ROUTE_PATHS.importExport)}>
                {t('holdings.empty.import')}
              </Button>
            </>
          }
        />
      );
    }
    const visible = sortHoldings(
      filterHoldings(all, { type, query }, language),
      order.sort,
      language,
      order.direction,
    );

    return (
      <>
        <HoldingsSummary totals={totalsOf(all)} />
        <HoldingsToolbar
          type={type}
          query={query}
          sort={order.sort}
          counts={countByType(all)}
          onTypeChange={setType}
          onQueryChange={setQuery}
          onSortChange={(sort) => setOrder(defaultOrder(sort))}
        />
        {visible.length === 0 ? (
          <EmptyState
            icon={RiSearchLine}
            title={t('holdings.noResults.title')}
            description={t('holdings.noResults.description')}
            actions={
              <Button onClick={clearFilters}>
                {t('holdings.noResults.clear')}
              </Button>
            }
          />
        ) : (
          <HoldingsTable
            holdings={visible}
            totals={totalsOf(visible)}
            portfolioValue={totalsOf(all).value}
            order={order}
            onSort={(sort) => setOrder(nextOrder(order, sort))}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('holdings.title')}
          </h1>
          {holdings.data !== undefined && (
            <PriceStatus updatedAt={holdings.data.pricesUpdatedAt} />
          )}
        </div>
        <CurrencyNote />
      </div>
      {renderBody()}
    </div>
  );
}
