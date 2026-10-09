import type { JSX } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useMoney } from '@/hooks/useMoney';
import { formatDate } from '@/lib/formatDate';

interface TooltipRow {
  readonly dataKey?: string | number;
  readonly value?: number | string;
  readonly color?: string;
}

export interface ChartTooltipProps {
  readonly seriesLabels: Readonly<Record<string, string>>;
  // Injected by Recharts when it renders the tooltip.
  readonly active?: boolean;
  readonly payload?: readonly TooltipRow[];
  readonly label?: string | number;
}

/** Crosshair tooltip: text wears text tokens, the colored dot carries the series identity. */
export function ChartTooltip({
  seriesLabels,
  active,
  payload,
  label,
}: ChartTooltipProps): JSX.Element | null {
  const { language } = useLanguage();
  const money = useMoney();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-overlay">
      <p className="mb-1 text-xs text-fg-2">
        {formatDate(String(label), language)}
      </p>
      {payload.map((row) => (
        <div
          key={String(row.dataKey)}
          className="flex items-center justify-between gap-6"
        >
          <span className="inline-flex items-center gap-2 text-fg-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: row.color }}
              aria-hidden="true"
            />
            {seriesLabels[String(row.dataKey)]}
          </span>
          <span className="font-medium tabular-nums">
            {money.formatConverted(Number(row.value))}
          </span>
        </div>
      ))}
    </div>
  );
}
