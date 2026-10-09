import { RiSearchLine } from '@remixicon/react';
import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { assetDetailPath } from '@/app/routePaths';
import { AssetTypeBadge } from '@/components/AssetTypeBadge/AssetTypeBadge';
import { Card } from '@/components/Card/Card';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { NativeSelect } from '@/components/NativeSelect/NativeSelect';
import { PnlValue } from '@/components/Pnl/PnlValue';
import type { Holding } from '@/domain/holding';
import { useMoney } from '@/hooks/useMoney';
import {
  rankedHoldings,
  type PerformanceFilter,
  type PerformanceMetric,
} from '@/lib/analysisView';

export function AssetRanking({
  holdings,
}: {
  readonly holdings: readonly Holding[];
}): JSX.Element {
  const { t } = useTranslation();
  const money = useMoney();
  const [metric, setMetric] = useState<PerformanceMetric>('AMOUNT');
  const [filter, setFilter] = useState<PerformanceFilter>('ALL');
  const ranked = rankedHoldings(holdings, metric, filter);
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">{t('analysis.ranking')}</h2>
        <div className="flex flex-wrap gap-2">
          <NativeSelect
            label={t('analysis.filter')}
            value={filter}
            options={(['ALL', 'GAINERS', 'LOSERS'] as const).map((value) => ({
              value,
              label: t(`analysis.filters.${value}`),
            }))}
            onChange={(value) => {
              if (
                value === 'ALL' ||
                value === 'GAINERS' ||
                value === 'LOSERS'
              ) {
                setFilter(value);
              }
            }}
          />
          <NativeSelect
            label={t('analysis.metric')}
            value={metric}
            options={(['AMOUNT', 'PERCENT'] as const).map((value) => ({
              value,
              label: t(`analysis.metrics.${value}`),
            }))}
            onChange={(value) => {
              if (value === 'AMOUNT' || value === 'PERCENT') {
                setMetric(value);
              }
            }}
          />
        </div>
      </div>
      <p className="mt-2 text-sm text-fg-2">{t('analysis.rankingNote')}</p>
      {ranked.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={RiSearchLine}
            title={t('analysis.noResults')}
            description={t('analysis.noResultsNote')}
          />
        </div>
      ) : (
        <ol className="mt-3 divide-y divide-line">
          {ranked.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 py-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-5 flex-none text-sm tabular-nums text-fg-3">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <Link
                    to={assetDetailPath(item.id)}
                    className="block truncate font-medium text-primary hover:underline"
                  >
                    {item.assetName}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-fg-2">
                    <span>{item.symbol}</span>
                    <AssetTypeBadge assetType={item.assetType} />
                  </div>
                </div>
              </div>
              <div className="flex flex-none flex-col items-end gap-1 text-sm">
                <PnlValue
                  amount={item.pnl ?? '0'}
                  percent={item.pnlPercent ?? undefined}
                />
                <span className="text-xs text-fg-2">
                  {t('analysis.positionValue', {
                    value: money.format(item.value ?? '0'),
                  })}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
