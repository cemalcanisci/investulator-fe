import type { AnalysisReport, FinancialFact } from '@/domain/analysis';
import {
  factIssues,
  factTechnicalIssues,
  validDate,
} from '@/lib/analysisValidation';
import { trailingTwelveMonths } from '@/lib/financialPeriods';
import { addDecimals, subtractDecimals } from '@/lib/decimal';

export interface FinancialPeriodSelection {
  readonly kind: 'TTM' | 'ANNUAL' | 'INTERIM' | 'MISSING_DATA';
  readonly value?: string;
  readonly inputs: readonly FinancialFact[];
  readonly issues: readonly string[];
  readonly formula?: string;
}

/** Publication bounds are mandatory: a period end is not a publication date. */
export function availableAt(
  report: AnalysisReport,
  fact: FinancialFact,
  asOf: string,
): boolean {
  const source = report.presentation.sources.find(
    (source) => source.id === fact.sourceId,
  );
  const published =
    fact.evidence?.publishedAt ?? source?.publishedAt ?? source?.observedAt;
  return Boolean(
    published &&
    validDate(published) &&
    published <= asOf &&
    fact.basis.end <= asOf,
  );
}

export function sameFinancialBasis(facts: readonly FinancialFact[]): boolean {
  const first = facts[0];
  return Boolean(
    first &&
    facts.every(
      (fact) =>
        fact.unit === first.unit &&
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
        ).every((key) => fact.basis[key] === first.basis[key]),
    ),
  );
}

export function usableFinancialFact(
  report: AnalysisReport,
  fact: FinancialFact,
  asOf: string,
): boolean {
  const source = report.presentation.sources.find(
    (item) => item.id === fact.sourceId,
  );
  return (
    availableAt(report, fact, asOf) &&
    factTechnicalIssues(fact).length === 0 &&
    fact.verification !== 'CONFLICT' &&
    Boolean(fact.locator && source?.url.startsWith('https://')) &&
    (!fact.evidence ||
      factIssues(
        fact,
        report.presentation.sources.map((item) => item.id),
      ).every((issue) => issue === 'UNVERIFIED'))
  );
}

export function selectFinancialStock(
  report: AnalysisReport,
  metricKey: string,
  asOf: string,
  attribution: FinancialFact['basis']['attribution'],
): FinancialFact | undefined {
  return report.facts
    .filter(
      (fact) =>
        (fact.metricKey === metricKey || fact.id === metricKey) &&
        fact.basis.periodKind === 'INSTANT' &&
        fact.basis.attribution === attribution &&
        usableFinancialFact(report, fact, asOf),
    )
    .sort(
      (a, b) =>
        b.basis.end.localeCompare(a.basis.end) ||
        (b.evidence?.publishedAt ?? '').localeCompare(
          a.evidence?.publishedAt ?? '',
        ),
    )[0];
}

/** Select realized earnings, never silently substitute an older profitable year for a loss. */
export function selectFinancialFlow(
  report: AnalysisReport,
  metricKey: string,
  asOf: string,
  attribution: FinancialFact['basis']['attribution'],
): FinancialPeriodSelection {
  if (!validDate(asOf)) {
    return { kind: 'MISSING_DATA', inputs: [], issues: ['PERIOD'] };
  }
  const sourceIds = report.presentation.sources.map((source) => source.id);
  if (
    new Set(report.facts.map((fact) => fact.id)).size !== report.facts.length
  ) {
    return { kind: 'MISSING_DATA', inputs: [], issues: ['DUPLICATE'] };
  }
  const candidates = report.facts
    .filter(
      (fact) =>
        (fact.metricKey === metricKey || fact.id === metricKey) &&
        fact.basis.attribution === attribution &&
        usableFinancialFact(report, fact, asOf),
    )
    .sort((a, b) => b.basis.end.localeCompare(a.basis.end));
  const quarters = candidates
    .filter((fact) => fact.basis.periodKind === 'QUARTER')
    .slice(0, 4);
  const quarterly = trailingTwelveMonths(metricKey, quarters, sourceIds);
  const annuals = candidates.filter((fact) => fact.basis.periodKind === 'YEAR');
  const interim = candidates.find((fact) =>
    ['H1', 'YTD'].includes(fact.basis.periodKind),
  );
  const annual = annuals[0];
  const choices: FinancialPeriodSelection[] = [];
  if (quarterly.status === 'PASS') {
    choices.push({
      kind: 'TTM',
      value: quarterly.value,
      inputs: quarters,
      issues: [],
      formula: quarters.map((fact) => fact.value).join(' + '),
    });
  }
  if (interim) {
    const year = Number(interim.basis.start.slice(0, 4));
    const previous = candidates.filter(
      (fact) =>
        fact.basis.periodKind === interim.basis.periodKind &&
        fact.basis.start === `${year - 1}${interim.basis.start.slice(4)}` &&
        fact.basis.end ===
          `${Number(interim.basis.end.slice(0, 4)) - 1}${interim.basis.end.slice(4)}`,
    );
    const priorEnd = new Date(Date.parse(interim.basis.start) - 86400000)
      .toISOString()
      .slice(0, 10);
    const priorAnnuals = annuals.filter(
      (fact) =>
        fact.basis.start === `${year - 1}${interim.basis.start.slice(4)}` &&
        fact.basis.end === priorEnd,
    );
    for (const full of priorAnnuals) {
      for (const prior of previous) {
        const inputs = [full, interim, prior];
        if (sameFinancialBasis(inputs)) {
          choices.push({
            kind: 'TTM',
            inputs,
            issues: [],
            value: subtractDecimals(
              addDecimals([full.value, interim.value]),
              prior.value,
            ),
            formula: `${full.value} + ${interim.value} − ${prior.value}`,
          });
        }
      }
    }
  }
  choices.sort((a, b) =>
    [...b.inputs]
      .sort((x, y) => y.basis.end.localeCompare(x.basis.end))[0]
      .basis.end.localeCompare(
        [...a.inputs].sort((x, y) => y.basis.end.localeCompare(x.basis.end))[0]
          .basis.end,
      ),
  );
  const ttm = choices[0];
  // A newly published full year supersedes an older trailing window.
  const quality = (facts: readonly FinancialFact[]): string[] =>
    facts.some((fact) => factIssues(fact, sourceIds).length)
      ? ['UNVERIFIED']
      : [];
  if (
    ttm &&
    (!annual || ttm.inputs.some((fact) => fact.basis.end >= annual.basis.end))
  ) {
    return { ...ttm, issues: quality(ttm.inputs) };
  }
  if (annual) {
    return {
      kind: 'ANNUAL',
      value: annual.value,
      inputs: [annual],
      issues: ['annualFallback', ...quality([annual])],
      formula: annual.value,
    };
  }
  if (interim) {
    return {
      kind: 'INTERIM',
      value: interim.value,
      inputs: [interim],
      issues: ['halfYear', ...quality([interim])],
      formula: interim.value,
    };
  }
  return {
    kind: 'MISSING_DATA',
    inputs: [],
    issues: ['ttm', 'publicationOrBasis'],
  };
}
