import { toDisplayNumber } from '@/lib/decimal';
import type { PortfolioPoint } from '@/services/dashboard';

export interface ChartPoint {
  readonly date: string;
  readonly value: number;
  readonly cost: number;
}

/** Charts need numbers to plot; this is the only place the decimal strings are converted. */
export function toChartPoints(points: readonly PortfolioPoint[]): ChartPoint[] {
  return points.map((point) => ({
    date: point.date,
    value: toDisplayNumber(point.value),
    cost: toDisplayNumber(point.cost),
  }));
}
