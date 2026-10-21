import type { ResearchCalculation, ResearchFact } from '@/domain/research';
import {
  addDecimals,
  divideDecimals,
  multiplyDecimals,
  roundDecimal,
  subtractDecimals,
} from '@/lib/decimal';

/** Replays a report calculation using source facts, without portfolio state or floating point. */
export function calculateResearch(
  calculation: ResearchCalculation,
  facts: readonly ResearchFact[],
): string {
  const values = calculation.inputs.map((id) => {
    const fact = facts.find((entry) => entry.id === id);
    if (!fact || !/^-?\d+(\.\d+)?$/.test(fact.value)) {
      throw new Error(`Invalid research input: ${id}`);
    }
    return fact.value;
  });
  const [a, b] = values;
  if (calculation.operation === 'PRODUCT_OVER_SUM') {
    if (!a || !b || values.length < 3) {
      throw new Error('Invalid research calculation arity');
    }
    return divideDecimals(
      multiplyDecimals(a, b),
      addDecimals(values.slice(2)),
      calculation.precision,
    );
  }
  if (
    !a ||
    (values.length !== 2 &&
      calculation.operation !== 'SUM' &&
      calculation.operation !== 'MEAN')
  ) {
    throw new Error('Invalid research calculation arity');
  }
  const scale = calculation.precision;
  if (calculation.operation === 'SUM') {
    return roundDecimal(addDecimals(values), scale);
  }
  if (calculation.operation === 'MEAN') {
    return divideDecimals(addDecimals(values), String(values.length), scale);
  }
  if (b === undefined) {
    throw new Error('Missing second research input');
  }
  switch (calculation.operation) {
    case 'SUBTRACT':
      return roundDecimal(subtractDecimals(a, b), scale);
    case 'MULTIPLY':
      return roundDecimal(multiplyDecimals(a, b), scale);
    case 'RATIO':
      return divideDecimals(a, b, scale);
    case 'PERCENT':
      return divideDecimals(multiplyDecimals(a, '100'), b, scale);
    case 'GROWTH':
      return divideDecimals(
        multiplyDecimals(subtractDecimals(a, b), '100'),
        b,
        scale,
      );
    default:
      throw new Error('Unsupported research calculation');
  }
}
