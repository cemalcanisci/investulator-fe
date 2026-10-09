import { toDisplayNumber } from '@/lib/decimal';

/** SVG polyline points for a sparkline; a flat series is drawn as a centered line. */
export function sparklinePoints(
  values: readonly string[],
  width: number,
  height: number,
): string {
  if (values.length === 0) {
    return '';
  }
  const numbers = values.map(toDisplayNumber);
  const min = Math.min(...numbers);
  const range = Math.max(...numbers) - min;
  const step = values.length > 1 ? width / (values.length - 1) : 0;

  return numbers
    .map((n, index) => {
      const y =
        range === 0 ? height / 2 : height - ((n - min) / range) * height;
      return `${(index * step).toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}
