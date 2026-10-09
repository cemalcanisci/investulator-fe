// Money and quantities travel as decimal strings ("-189.00"). Sign checks and exact sums work on
// the digits, so no precision is lost. Everything else about money belongs to the backend.

export type Sign = 'positive' | 'negative' | 'zero';

export function getSign(value: string): Sign {
  const digits = value.replace(/[^0-9]/g, '');
  if (/^0*$/.test(digits)) {
    return 'zero';
  }
  return value.trim().startsWith('-') ? 'negative' : 'positive';
}

/** Display-only conversion (chart axes, sparklines); never use the result for money math. */
export function toDisplayNumber(value: string): number {
  return Number(value);
}

interface Scaled {
  readonly units: bigint;
  readonly scale: number;
}

function scaled(value: string): Scaled {
  const trimmed = value.trim();
  const [whole = '', fraction = ''] = trimmed.replace(/^[+-]/, '').split('.');
  const units = BigInt(`${whole}${fraction}` || '0');
  return {
    units: trimmed.startsWith('-') ? -units : units,
    scale: fraction.length,
  };
}

function toUnits(value: Scaled, scale: number): bigint {
  return value.units * 10n ** BigInt(scale - value.scale);
}

function fromUnits(units: bigint, scale: number): string {
  const negative = units < 0n;
  const digits = (negative ? -units : units)
    .toString()
    .padStart(scale + 1, '0');
  const whole = digits.slice(0, digits.length - scale);
  const fraction = digits.slice(digits.length - scale);
  return `${negative ? '-' : ''}${whole}${scale > 0 ? `.${fraction}` : ''}`;
}

/** Exact sum of decimal strings; the result keeps the largest number of decimals of the inputs. */
export function addDecimals(values: readonly string[]): string {
  const parts = values.map(scaled);
  const scale = Math.max(0, ...parts.map((part) => part.scale));
  return fromUnits(
    parts.reduce((sum, part) => sum + toUnits(part, scale), 0n),
    scale,
  );
}

/** Exact `a - b` for decimal strings. */
export function subtractDecimals(a: string, b: string): string {
  const left = scaled(a);
  const right = scaled(b);
  const scale = Math.max(left.scale, right.scale);
  return fromUnits(toUnits(left, scale) - toUnits(right, scale), scale);
}

/** Exact `a * b` for decimal strings; the result has as many decimals as both inputs together. */
export function multiplyDecimals(a: string, b: string): string {
  const left = scaled(a);
  const right = scaled(b);
  return fromUnits(left.units * right.units, left.scale + right.scale);
}

/** `part` as a percentage of `whole`, one decimal ("8.6"). Display only; zero whole gives "0.0". */
export function percentageOf(part: string, whole: string): string {
  return getSign(whole) === 'zero'
    ? '0.0'
    : divideDecimals(multiplyDecimals(part, '100'), whole, 1);
}

export function compareDecimals(left: string, right: string): number {
  const sign = getSign(subtractDecimals(left, right));
  return sign === 'zero' ? 0 : sign === 'negative' ? -1 : 1;
}

/** `value` rounded half away from zero to exactly `scale` decimals. */
export function roundDecimal(value: string, scale: number): string {
  const parsed = scaled(value);
  if (parsed.scale <= scale) {
    return fromUnits(toUnits(parsed, scale), scale);
  }
  const divisor = 10n ** BigInt(parsed.scale - scale);
  const magnitude = parsed.units < 0n ? -parsed.units : parsed.units;
  const rounded = (magnitude * 2n + divisor) / (divisor * 2n);
  return fromUnits(parsed.units < 0n ? -rounded : rounded, scale);
}

/** `a / b` rounded half away from zero to exactly `scale` decimals. `b` must not be zero. */
export function divideDecimals(a: string, b: string, scale: number): string {
  const left = scaled(a);
  const right = scaled(b);
  if (right.units === 0n) {
    throw new RangeError('Cannot divide by zero');
  }
  const numerator = left.units * 10n ** BigInt(right.scale + scale);
  const denominator = right.units * 10n ** BigInt(left.scale);
  const negative = numerator < 0n !== denominator < 0n;
  const top = numerator < 0n ? -numerator : numerator;
  const bottom = denominator < 0n ? -denominator : denominator;
  const quotient = (top * 2n + bottom) / (bottom * 2n);
  return fromUnits(negative ? -quotient : quotient, scale);
}

/** Drops trailing zeros of the fraction but keeps at least `minScale` decimals. */
export function trimDecimals(value: string, minScale = 0): string {
  const [whole = '', fraction = ''] = value.split('.');
  let end = fraction.length;
  while (end > minScale && fraction[end - 1] === '0') {
    end -= 1;
  }
  return end === 0 ? whole : `${whole}.${fraction.slice(0, end)}`;
}
