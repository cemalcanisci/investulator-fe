import type { JSX } from 'react';
import { sparklinePoints } from '@/lib/sparkline';

export interface SparklineProps {
  readonly values: readonly string[];
  readonly tone: 'positive' | 'negative';
}

const WIDTH = 96;
const HEIGHT = 32;

/** Decorative trend line; the numbers next to it carry the meaning. */
export function Sparkline({ values, tone }: SparklineProps): JSX.Element {
  return (
    <svg
      className="h-8 w-24 flex-none"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
    >
      <polyline
        points={sparklinePoints(values, WIDTH, HEIGHT)}
        fill="none"
        stroke={tone === 'positive' ? 'var(--pos)' : 'var(--neg)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
