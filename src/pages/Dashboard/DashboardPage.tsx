import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { AllocationDonut } from '@/components/Dashboard/AllocationDonut';
import { DashboardKpis } from '@/components/Dashboard/DashboardKpis';
import { DashboardSkeleton } from '@/components/Dashboard/DashboardSkeleton';
import { MoversCard } from '@/components/Dashboard/MoversCard';
import { PortfolioChart } from '@/components/Dashboard/PortfolioChart';
import { PriceStatus } from '@/components/Dashboard/PriceStatus';
import { RecentTransactions } from '@/components/Dashboard/RecentTransactions';
import { CurrencyNote } from '@/components/CurrencyNote/CurrencyNote';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';

export function DashboardPage(): JSX.Element {
  const { t } = useTranslation();
  const summary = useDashboardSummary();

  function renderBody(): JSX.Element {
    if (summary.isPending) {
      return <DashboardSkeleton />;
    }
    if (summary.isError) {
      return <ErrorState onRetry={() => void summary.refetch()} />;
    }
    const data = summary.data;
    return (
      <>
        <DashboardKpis kpis={data.kpis} />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PortfolioChart />
          </div>
          <AllocationDonut slices={data.allocation} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <MoversCard
            title={t('dashboard.movers.gainers')}
            movers={data.gainers}
          />
          <MoversCard
            title={t('dashboard.movers.losers')}
            movers={data.losers}
          />
        </div>
        <RecentTransactions transactions={data.recentTransactions} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('dashboard.title')}
          </h1>
          {summary.data !== undefined && (
            <PriceStatus updatedAt={summary.data.pricesUpdatedAt} />
          )}
        </div>
        <CurrencyNote />
      </div>
      {renderBody()}
    </div>
  );
}
