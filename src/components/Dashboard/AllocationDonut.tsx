import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/Card/Card';
import { ASSET_TYPE_COLOR } from '@/domain/assetTypes';
import { useLanguage } from '@/hooks/useLanguage';
import { useMoney } from '@/hooks/useMoney';
import { toDisplayNumber } from '@/lib/decimal';
import { formatPercent } from '@/lib/formatNumber';
import type { AllocationSlice } from '@/services/dashboard';

export interface AllocationDonutProps {
  readonly slices: readonly AllocationSlice[];
}

const TOOLTIP_STYLE = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 13,
} as const;

/** Part-to-whole at a glance (five slices at most); the legend below carries every exact value. */
export function AllocationDonut({ slices }: AllocationDonutProps): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const money = useMoney();
  const data = slices.map((slice) => ({
    name: t(`assetTypes.${slice.assetType}`),
    value: toDisplayNumber(slice.value),
    fill: ASSET_TYPE_COLOR[slice.assetType],
  }));

  return (
    <Card className="p-5">
      <h2 className="text-base font-semibold">
        {t('dashboard.allocation.title')}
      </h2>
      <div className="mt-4 grid items-center gap-5 sm:grid-cols-[11rem_1fr] lg:grid-cols-1">
        <div
          className="mx-auto size-44"
          role="img"
          aria-label={t('dashboard.allocation.aria')}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="66%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="var(--surface)"
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Tooltip
                formatter={(value) => money.format(Number(value))}
                contentStyle={TOOLTIP_STYLE}
                itemStyle={{ color: 'var(--text)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex flex-col gap-2.5 text-sm">
          {slices.map((slice) => (
            <li key={slice.assetType} className="flex items-center gap-2.5">
              <span
                className="size-2.5 flex-none rounded-sm"
                style={{ backgroundColor: ASSET_TYPE_COLOR[slice.assetType] }}
                aria-hidden="true"
              />
              <span className="flex-1 text-fg-2">
                {t(`assetTypes.${slice.assetType}`)}
              </span>
              <span className="font-medium tabular-nums">
                {formatPercent(slice.percent, language)}
              </span>
              <span className="min-w-24 text-end text-fg-2 tabular-nums">
                {money.format(slice.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
