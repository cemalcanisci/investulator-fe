import { RiArrowLeftLine, RiSearchLine } from '@remixicon/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routePaths';
import { AssetHistory } from '@/components/AssetDetail/AssetHistory';
import { AssetPosition } from '@/components/AssetDetail/AssetPosition';
import { AssetTypeBadge } from '@/components/AssetTypeBadge/AssetTypeBadge';
import { CurrencyNote } from '@/components/CurrencyNote/CurrencyNote';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { HoldingsSkeleton } from '@/components/Holdings/HoldingsSkeleton';
import { useHoldings } from '@/hooks/useHoldings';
import { useTransactions } from '@/hooks/useTransactions';

export function AssetDetailPage(): JSX.Element {
  const { assetId } = useParams();
  const { t } = useTranslation();
  const holdings = useHoldings();
  const transactions = useTransactions();
  const back = (
    <Link
      to={ROUTE_PATHS.holdings}
      className="inline-flex w-fit items-center gap-1 text-sm text-primary hover:underline"
    >
      <RiArrowLeftLine className="size-4" aria-hidden="true" />
      {t('assetDetail.back')}
    </Link>
  );

  if (holdings.isPending) {
    return (
      <div className="flex flex-col gap-6">
        {back}
        <HoldingsSkeleton />
      </div>
    );
  }
  if (holdings.isError) {
    return (
      <div className="flex flex-col gap-6">
        {back}
        <ErrorState onRetry={() => void holdings.refetch()} />
      </div>
    );
  }
  const holding = holdings.data.holdings.find((item) => item.id === assetId);
  if (holding === undefined) {
    return (
      <div className="flex flex-col gap-6">
        {back}
        <EmptyState
          icon={RiSearchLine}
          title={t('assetDetail.notFound')}
          description={t('assetDetail.notFoundNote')}
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {back}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {holding.assetName}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-fg-2">
            <span>{holding.symbol}</span>
            <AssetTypeBadge assetType={holding.assetType} />
          </div>
        </div>
        <Link
          to={`${ROUTE_PATHS.transactions}?varlik=${encodeURIComponent(holding.id)}`}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover"
        >
          {t('assetDetail.manage')}
        </Link>
      </div>
      <CurrencyNote />
      <AssetPosition holding={holding} />
      {transactions.isPending ? (
        <p role="status" className="text-sm text-fg-2">
          {t('assetDetail.loadingHistory')}
        </p>
      ) : transactions.isError ? (
        <ErrorState onRetry={() => void transactions.refetch()} />
      ) : (
        <AssetHistory
          key={holding.id}
          transactions={transactions.data.filter(
            (item) => item.assetId === holding.id,
          )}
        />
      )}
    </div>
  );
}
