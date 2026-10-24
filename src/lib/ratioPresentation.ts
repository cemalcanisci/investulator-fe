import type { AnalysisReport, FinancialFact } from '@/domain/analysis';
import type { ResearchFact } from '@/domain/research';
import {
  evaluateCalculation,
  factIssues,
  factTechnicalIssues,
  factSourceIssues,
} from '@/lib/analysisValidation';
import { calculateResearch } from '@/lib/researchCalculations';
import { trailingTwelveMonths } from '@/lib/financialPeriods';
import {
  compareDecimals,
  divideDecimals,
  multiplyDecimals,
} from '@/lib/decimal';

export interface RatioPresentation {
  readonly id: string;
  readonly status: 'VERIFIED' | 'INDICATIVE' | 'SCENARIO' | 'MISSING_DATA';
  readonly value?: string;
  readonly unit?: ResearchFact['unit'];
  readonly inputs: readonly FinancialFact[];
  readonly issues: readonly string[];
  readonly strictStatus: 'PASS' | 'BLOCKED';
}

// Explicit display policies, never a fallback for arbitrary blocked calculations.
const DATED_RATIOS: Readonly<Record<string, readonly string[]>> = {
  marketCap: ['price', 'shares'],
  priceBook: ['price', 'shares', 'parentEquity'],
  peHalfYear: ['price', 'shares', 'profit'],
  peRunRate: ['price', 'shares', 'profit', 'profit'],
  dividendYield: ['dividendTotal', 'price'],
};

function sourceIdentified(
  report: AnalysisReport,
  fact: FinancialFact,
): boolean {
  return Boolean(
    fact.locator &&
    report.presentation.sources.some(
      (s) => s.id === fact.sourceId && s.url.startsWith('https://'),
    ),
  );
}

export function ratioPresentation(
  report: AnalysisReport | undefined,
  id: string,
): RatioPresentation {
  const empty: RatioPresentation = {
    id,
    status: 'MISSING_DATA',
    inputs: [],
    issues: ['MISSING'],
    strictStatus: 'BLOCKED',
  };
  if (!report) {
    return empty;
  }
  if (id === 'peTtm') {
    return ttmPresentation(report);
  }
  const calculation = report.calculations.find((c) => c.id === id);
  const fact = report.facts.find((f) => f.id === id);
  const inputs = calculation
    ? calculation.inputs.flatMap((key) =>
        report.facts.filter((f) => f.id === key),
      )
    : fact
      ? [fact]
      : [];
  const unit = calculation?.unit ?? fact?.unit;
  const strict = calculation
    ? evaluateCalculation(report, calculation)
    : fact
      ? {
          status: factIssues(
            fact,
            report.presentation.sources.map((s) => s.id),
          ).length
            ? ('BLOCKED' as const)
            : ('PASS' as const),
          value: fact.value,
          issues: factIssues(
            fact,
            report.presentation.sources.map((s) => s.id),
          ),
        }
      : undefined;
  const base = {
    ...empty,
    unit,
    inputs,
    issues: strict?.issues ?? ['MISSING'],
    strictStatus: strict?.status ?? ('BLOCKED' as const),
  };
  if (
    new Set(report.facts.map((f) => f.id)).size !== report.facts.length ||
    new Set(report.presentation.sources.map((s) => s.id)).size !==
      report.presentation.sources.length ||
    report.calculations.filter((c) => c.id === id).length > 1
  ) {
    return { ...base, issues: ['DUPLICATE'] };
  }
  const expected = DATED_RATIOS[id];
  if (!expected || (!calculation && fact)) {
    return strict?.status === 'PASS'
      ? { ...base, status: 'VERIFIED', value: strict.value }
      : base;
  }
  const contract = report.contracts.find((c) => c.id === id);
  if (
    !contract ||
    report.contracts.filter((c) => c.id === id).length !== 1 ||
    contract.units.length !== inputs.length ||
    inputs.some((f, i) => f.unit !== contract.units[i])
  ) {
    return { ...base, issues: ['UNIT'] };
  }
  if (
    !calculation ||
    JSON.stringify(calculation.inputs) !== JSON.stringify(expected) ||
    inputs.length !== expected.length ||
    inputs.some(
      (f) =>
        factTechnicalIssues(f).length ||
        f.verification === 'CONFLICT' ||
        (f.evidence &&
          factSourceIssues(
            f,
            report.presentation.sources.map((s) => s.id),
          ).some((issue) =>
            ['EVIDENCE', 'RESTATEMENT', 'SOURCE'].includes(issue),
          )) ||
        !sourceIdentified(report, f),
    )
  ) {
    return base;
  }
  const price = inputs.find((f) => f.id === 'price');
  const shares = inputs.find((f) => f.id === 'shares');
  const financial = inputs.find((f) =>
    ['profit', 'parentEquity'].includes(f.id),
  );
  const dividend = inputs.find((f) => f.id === 'dividendTotal');
  if (dividend && price && dividend.basis.end > price.basis.end) {
    return { ...base, issues: [...base.issues, 'dividendDate'] };
  }
  const currency = price?.basis.currency;
  const expectedOperation =
    id === 'marketCap'
      ? 'MULTIPLY'
      : id === 'dividendYield'
        ? 'PERCENT'
        : 'PRODUCT_OVER_SUM';
  if (
    !price ||
    calculation.operation !== expectedOperation ||
    price.basis.scope !== 'MARKET' ||
    price.basis.periodKind !== 'INSTANT' ||
    !price.basis.shareBasis ||
    price.unit !== `${currency}_SHARE` ||
    inputs.some(
      (f) =>
        f.basis.currency !== currency || compareDecimals(f.value, '0') <= 0,
    ) ||
    (shares &&
      (shares.unit !== 'SHARES' ||
        shares.basis.scope !== 'MARKET' ||
        shares.basis.periodKind !== 'INSTANT' ||
        shares.basis.shareBasis !== price.basis.shareBasis ||
        shares.basis.end > price.basis.end)) ||
    (financial &&
      (financial.unit !== currency ||
        financial.basis.attribution !== 'PARENT' ||
        financial.basis.scope === 'MARKET' ||
        financial.basis.end > price.basis.end ||
        financial.basis.periodKind !==
          (id === 'priceBook' ? 'INSTANT' : 'H1'))) ||
    (dividend &&
      (dividend.unit !== price.unit ||
        dividend.basis.shareBasis !== price.basis.shareBasis ||
        dividend.basis.end > price.basis.end))
  ) {
    return { ...base, issues: [...base.issues, 'BASIS'] };
  }
  // This explicit historical indicator does not restate TAS29 amounts into market-date money.
  const limitations = new Set(base.issues);
  if (shares?.basis.end !== price.basis.end && shares) {
    limitations.add('capitalDate');
  }
  if (financial && financial.basis.end !== price.basis.end) {
    limitations.add('marketDate');
  }
  if (
    financial?.basis.accounting === 'TAS29' &&
    financial.basis.purchasingPowerDate !== price.basis.end
  ) {
    limitations.add('purchasingPower');
  }
  if (id === 'peHalfYear') {
    limitations.add('halfYear');
  }
  if (id === 'peRunRate') {
    limitations.add('annualized');
  }
  try {
    return {
      ...base,
      value: calculateResearch(calculation, inputs),
      status:
        id === 'peRunRate'
          ? 'SCENARIO'
          : limitations.size
            ? 'INDICATIVE'
            : 'VERIFIED',
      issues: [...limitations],
    };
  } catch {
    return { ...base, issues: ['ARITHMETIC'] };
  }
}

function ttmPresentation(report: AnalysisReport): RatioPresentation {
  const quarters = report.facts
    .filter(
      (f) =>
        f.metricKey === 'profit' &&
        f.basis.attribution === 'PARENT' &&
        f.basis.periodKind === 'QUARTER',
    )
    .sort((a, b) => b.basis.end.localeCompare(a.basis.end))
    .slice(0, 4);
  const ttm = trailingTwelveMonths(
    'profitTtm',
    quarters,
    report.presentation.sources.map((s) => s.id),
  );
  const market = ratioPresentation(report, 'marketCap');
  const base: RatioPresentation = {
    id: 'peTtm',
    status: 'MISSING_DATA',
    unit: 'MULTIPLE',
    inputs: [...market.inputs, ...quarters],
    issues: ['ttm', ...ttm.issues],
    strictStatus: 'BLOCKED',
  };
  const price = market.inputs.find((f) => f.id === 'price');
  const first = quarters[0];
  if (
    !ttm.value ||
    !market.value ||
    !first ||
    !price ||
    compareDecimals(ttm.value, '0') <= 0 ||
    first.basis.currency !== price.basis.currency ||
    first.unit !== first.basis.currency ||
    first.basis.end > price.basis.end
  ) {
    return base;
  }
  const issues = [...market.issues];
  if (first.basis.end !== price.basis.end) {
    issues.push('marketDate');
  }
  if (
    first.basis.accounting === 'TAS29' &&
    first.basis.purchasingPowerDate !== price.basis.end
  ) {
    issues.push('purchasingPower');
  }
  return {
    ...base,
    status: issues.length ? 'INDICATIVE' : 'VERIFIED',
    value: divideDecimals(market.value, ttm.value, 2),
    issues,
  };
}

export function presentationFormulaValue(result: RatioPresentation): string {
  if (result.id === 'peTtm' && result.value) {
    return `${result.inputs
      .filter((f) => f.basis.periodKind === 'QUARTER')
      .map((f) => f.value)
      .join(' + ')}`;
  }
  if (result.id === 'peRunRate') {
    const profit = result.inputs.find((f) => f.id === 'profit');
    return profit
      ? `${profit.value} × 2 = ${multiplyDecimals(profit.value, '2')}`
      : '';
  }
  return '';
}
