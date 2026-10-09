import { RiWalletLine } from '@remixicon/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routePaths';
import { AssetRanking } from '@/components/Analysis/AssetRanking';
import { TypePerformance } from '@/components/Analysis/TypePerformance';
import { CurrencyNote } from '@/components/CurrencyNote/CurrencyNote';
import { AllocationDonut } from '@/components/Dashboard/AllocationDonut';
import { PortfolioChart } from '@/components/Dashboard/PortfolioChart';
import { PriceStatus } from '@/components/Dashboard/PriceStatus';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { HoldingsSkeleton } from '@/components/Holdings/HoldingsSkeleton';
import { HoldingsSummary } from '@/components/Holdings/HoldingsSummary';
import { useHoldings } from '@/hooks/useHoldings';
import { performanceByType } from '@/lib/analysisView';
import { totalsOf } from '@/lib/holdingsView';

export function AnalysisPage(): JSX.Element {
  const { t } = useTranslation();
  const query = useHoldings();

  function renderBody(): JSX.Element {
    if (query.isPending) {
      return <HoldingsSkeleton />;
    }
    if (query.isError) {
      return <ErrorState onRetry={() => void query.refetch()} />;
    }
    const holdings = query.data.holdings;
    if (holdings.length === 0) {
      return (
        <EmptyState
          icon={RiWalletLine}
          title={t('analysis.empty')}
          description={t('analysis.emptyNote')}
          actions={
            <Link
              to={ROUTE_PATHS.transactionsNew}
              className="text-primary hover:underline"
            >
              {t('transactions.add')}
            </Link>
          }
        />
      );
    }
    const groups = performanceByType(holdings);
    return (
      <>
        <HoldingsSummary totals={totalsOf(holdings)} />
        <PortfolioChart />
        <p className="text-sm text-fg-2">{t('analysis.scopeNote')}</p>
        {groups.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <AllocationDonut slices={groups} />
            <TypePerformance groups={groups} />
          </div>
        )}
        <AssetRanking holdings={holdings} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('nav.analysis')}
          </h1>
          {query.data !== undefined && (
            <PriceStatus updatedAt={query.data.pricesUpdatedAt} />
          )}
        </div>
        <p className="mt-2 text-sm text-fg-2">{t('analysis.description')}</p>
        <CurrencyNote />
      </div>
      {renderBody()}
    </div>
  );
}
