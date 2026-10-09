import type { JSX, ReactNode } from 'react';
import { Card } from '@/components/Card/Card';

export interface KpiCardProps {
  readonly label: string;
  readonly value: string;
  readonly footer?: ReactNode;
  /** The one number the dashboard leads with. */
  readonly hero?: boolean;
}

// Figures this long ("₺5.138.942,33") do not fit the narrow four-column cards at the largest size.
const LONG_VALUE_LENGTH = 12;

export function KpiCard({
  label,
  value,
  footer,
  hero = false,
}: KpiCardProps): JSX.Element {
  const valueSize = hero
    ? `text-4xl ${value.length > LONG_VALUE_LENGTH ? 'xl:text-3xl' : ''}`
    : 'text-2xl';

  return (
    <Card className="flex flex-col gap-2 p-5">
      <span className="text-sm text-fg-2">{label}</span>
      <span
        className={`font-semibold tracking-tight tabular-nums ${valueSize}`}
      >
        {value}
      </span>
      {footer !== undefined && (
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
          {footer}
        </div>
      )}
    </Card>
  );
}
