import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/Card/Card';
import { KpiCard } from '@/components/KpiCard/KpiCard';
import { PnlValue } from '@/components/Pnl/PnlValue';
import { PriceBadge } from '@/components/Holdings/PriceBadge';
import { Quantity } from '@/components/Quantity/Quantity';
import type { Holding } from '@/domain/holding';
import { useMoney } from '@/hooks/useMoney';

export function AssetPosition({
  holding,
}: {
  readonly holding: Holding;
}): JSX.Element {
  const { t } = useTranslation();
  const money = useMoney();
  const decimals = holding.assetType === 'FX' ? 4 : 2;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label={t('assetDetail.value')}
          value={holding.value === null ? '—' : money.format(holding.value)}
        />
        <KpiCard
          label={t('assetDetail.cost')}
          value={money.format(holding.cost)}
        />
        <KpiCard
          label={t('assetDetail.unrealized')}
          value={
            holding.pnl === null
              ? '—'
              : money.format(holding.pnl, { signed: true })
          }
          footer={
            holding.pnlPercent === null ? undefined : (
              <PnlValue percent={holding.pnlPercent} />
            )
          }
        />
      </div>
      <Card className="p-4 sm:p-5">
        <h2 className="mb-4 font-semibold">{t('assetDetail.position')}</h2>
        <dl className="grid gap-5 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-fg-2">
              {t('holdings.table.quantity')}
            </dt>
            <dd className="mt-1 font-medium tabular-nums">
              <Quantity quantity={holding.quantity} unit={holding.unit} />
            </dd>
          </div>
          <div>
            <dt className="text-sm text-fg-2">{t('holdings.table.avgCost')}</dt>
            <dd className="mt-1 font-medium tabular-nums">
              {money.formatUnit(holding.avgCostPerUnit, decimals)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-fg-2">{t('holdings.table.price')}</dt>
            <dd className="mt-1 flex flex-col items-start gap-1 font-medium tabular-nums">
              {holding.currentPricePerUnit === null
                ? '—'
                : money.formatUnit(holding.currentPricePerUnit, decimals)}
              <PriceBadge
                status={holding.priceStatus}
                updatedAt={holding.priceUpdatedAt}
              />
            </dd>
          </div>
        </dl>
        <p className="mt-4 border-t border-line pt-3 text-xs text-fg-2">
          {t('assetDetail.costNote')}
        </p>
        {holding.priceStatus === 'UNAVAILABLE' && (
          <p className="mt-2 text-sm text-warn">{t('assetDetail.unpriced')}</p>
        )}
      </Card>
    </>
  );
}
