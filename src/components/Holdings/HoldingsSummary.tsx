import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { KpiCard } from '@/components/KpiCard/KpiCard';
import { PnlValue } from '@/components/Pnl/PnlValue';
import { useMoney } from '@/hooks/useMoney';
import type { HoldingsTotals } from '@/lib/holdingsView';

export interface HoldingsSummaryProps {
  readonly totals: HoldingsTotals;
}

export function HoldingsSummary({ totals }: HoldingsSummaryProps): JSX.Element {
  const { t } = useTranslation();
  const money = useMoney();

  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label={t('holdings.summary.value')}
          value={money.format(totals.value)}
        />
        <KpiCard
          label={t('holdings.summary.cost')}
          value={money.format(totals.cost)}
        />
        <KpiCard
          label={t('holdings.summary.pnl')}
          value={money.format(totals.pnl, { signed: true })}
          footer={<PnlValue percent={totals.pnlPercent} />}
        />
      </div>
      {totals.unpricedCount > 0 && (
        <p className="text-sm text-fg-2">
          {t('holdings.unpricedNote', { count: totals.unpricedCount })}
        </p>
      )}
    </div>
  );
}
