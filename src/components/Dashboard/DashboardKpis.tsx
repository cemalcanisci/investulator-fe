import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { KpiCard } from '@/components/KpiCard/KpiCard';
import { PnlValue } from '@/components/Pnl/PnlValue';
import { Sparkline } from '@/components/Pnl/Sparkline';
import { useMoney } from '@/hooks/useMoney';
import { getSign } from '@/lib/decimal';
import type { DashboardKpis as Kpis } from '@/services/dashboard';

export interface DashboardKpisProps {
  readonly kpis: Kpis;
}

export function DashboardKpis({ kpis }: DashboardKpisProps): JSX.Element {
  const { t } = useTranslation();
  const money = useMoney();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        hero
        label={t('dashboard.kpi.totalValue')}
        value={money.format(kpis.totalValue)}
        footer={
          <>
            <span className="inline-flex flex-wrap items-center gap-x-2">
              <PnlValue
                amount={kpis.dayChange}
                percent={kpis.dayChangePercent}
              />
              <span className="text-xs text-fg-2">
                {t('dashboard.kpi.today')}
              </span>
            </span>
            <Sparkline
              values={kpis.valueTrend}
              tone={
                getSign(kpis.dayChange) === 'negative' ? 'negative' : 'positive'
              }
            />
          </>
        }
      />
      <KpiCard
        label={t('dashboard.kpi.totalCost')}
        value={money.format(kpis.totalCost)}
        footer={
          <span className="text-xs text-fg-2">
            {t('dashboard.kpi.costHint')}
          </span>
        }
      />
      <KpiCard
        label={t('dashboard.kpi.unrealized')}
        value={money.format(kpis.unrealizedPnl)}
        footer={<PnlValue percent={kpis.unrealizedPnlPercent} />}
      />
      <KpiCard
        label={t('dashboard.kpi.realized')}
        value={money.format(kpis.realizedPnl)}
        footer={
          <>
            <PnlValue percent={kpis.realizedPnlPercent} />
            <Sparkline
              values={kpis.realizedTrend}
              tone={
                getSign(kpis.realizedPnl) === 'negative'
                  ? 'negative'
                  : 'positive'
              }
            />
          </>
        }
      />
    </div>
  );
}
