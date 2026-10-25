import type { CalculationResult, FinancialFact } from '@/domain/analysis';
import { factIssues } from '@/lib/analysisValidation';
import { addDecimals } from '@/lib/decimal';

/** Four actual calendar quarters on one accounting basis, never H1 multiplied by two. */
export function trailingTwelveMonths(
  id: string,
  quarters: readonly FinancialFact[],
  sourceIds: readonly string[],
): CalculationResult {
  const ordered = [...quarters].sort((a, b) =>
    a.basis.start.localeCompare(b.basis.start),
  );
  const first = ordered[0];
  const issues: string[] = [];
  if (ordered.length !== 4 || new Set(ordered.map((f) => f.id)).size !== 4) {
    issues.push('PERIOD');
  }
  for (const [index, fact] of ordered.entries()) {
    issues.push(...factIssues(fact, sourceIds));
    if (fact.basis.periodKind !== 'QUARTER') {
      issues.push('PERIOD');
    }
    if (
      first &&
      (fact.unit !== first.unit ||
        (
          [
            'currency',
            'scale',
            'scope',
            'attribution',
            'accounting',
            'purchasingPowerDate',
            'shareBasis',
          ] as const
        ).some((field) => fact.basis[field] !== first.basis[field]))
    ) {
      issues.push('BASIS');
    }
    const date = new Date(`${fact.basis.start}T00:00:00Z`);
    const expectedEnd = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 3, 0),
    );
    if (
      !Number.isFinite(expectedEnd.getTime()) ||
      date.getUTCDate() !== 1 ||
      expectedEnd.toISOString().slice(0, 10) !== fact.basis.end
    ) {
      issues.push('PERIOD');
    }
    if (
      index > 0 &&
      Date.parse(fact.basis.start) -
        Date.parse(ordered[index - 1].basis.end) !==
        86400000
    ) {
      issues.push('PERIOD');
    }
  }
  const base = {
    id,
    methodVersion: '1' as const,
    inputIds: ordered.map((f) => f.id),
    sourceIds: [...new Set(ordered.map((f) => f.sourceId))],
  };
  if (issues.length) {
    return { ...base, status: 'BLOCKED', issues: [...new Set(issues)] };
  }
  return {
    ...base,
    status: 'PASS',
    issues: [],
    value: addDecimals(ordered.map((f) => f.value)),
  };
}
