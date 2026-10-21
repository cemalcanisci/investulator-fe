import type {
  AnalysisReport,
  CalculationContract,
  CalculationResult,
  FinancialFact,
} from '@/domain/analysis';
import type { ResearchCalculation } from '@/domain/research';
import { calculateResearch } from '@/lib/researchCalculations';

export function validDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

export function factIssues(
  fact: FinancialFact,
  sourceIds: readonly string[],
): string[] {
  const issues: string[] = [];
  const b = fact.basis;
  if (fact.verification !== 'VERIFIED') {
    issues.push(fact.verification);
  }
  if (
    !sourceIds.includes(fact.sourceId) ||
    !fact.locator ||
    !validDate(fact.checkedAt)
  ) {
    issues.push('SOURCE');
  }
  if (!/^-?\d+(\.\d+)?$/.test(fact.value)) {
    issues.push('NUMBER');
  }
  if (
    !validDate(b.start) ||
    !validDate(b.end) ||
    b.start > b.end ||
    (b.periodKind === 'INSTANT' && b.start !== b.end)
  ) {
    issues.push('PERIOD');
  }
  if (b.scale !== '1') {
    issues.push('SCALE');
  }
  if (
    !b.currency ||
    (b.accounting === 'TAS29' &&
      (!b.purchasingPowerDate || !validDate(b.purchasingPowerDate)))
  ) {
    issues.push('BASIS');
  }
  if (fact.unit.startsWith('TRY') && b.currency !== 'TRY') {
    issues.push('CURRENCY');
  }
  if (fact.unit === 'USD_BARREL' && b.currency !== 'USD') {
    issues.push('CURRENCY');
  }
  if (fact.unit.startsWith('USD') && b.currency !== 'USD') {
    issues.push('CURRENCY');
  }
  if (
    (fact.unit.endsWith('_SHARE') || fact.unit === 'SHARES') &&
    !b.shareBasis
  ) {
    issues.push('SHARE_BASIS');
  }
  if (
    b.periodKind === 'H1' &&
    (b.start.slice(5) !== '01-01' || b.end !== `${b.start.slice(0, 4)}-06-30`)
  ) {
    issues.push('PERIOD');
  }
  if (
    b.periodKind === 'YEAR' &&
    (b.start.slice(5) !== '01-01' || b.end !== `${b.start.slice(0, 4)}-12-31`)
  ) {
    issues.push('PERIOD');
  }
  return issues;
}

function compatibility(
  facts: readonly FinancialFact[],
  contract: CalculationContract,
): string[] {
  const first = facts[0];
  if (!first) {
    return ['MISSING'];
  }
  const issues: string[] = [];
  const financial = facts.filter((f) => f.basis.scope !== 'MARKET');
  if (
    contract.periodPolicy !== 'DATED_MARKET' &&
    financial.length !== facts.length
  ) {
    issues.push('BASIS');
  }
  const reference = financial[0];
  for (const fact of facts) {
    if (fact.basis.currency !== first.basis.currency) {
      issues.push('CURRENCY');
    }
  }
  for (const fact of financial) {
    if (!reference) {
      break;
    }
    for (const field of [
      'scale',
      'scope',
      'attribution',
      'accounting',
      'purchasingPowerDate',
    ] as const) {
      if (fact.basis[field] !== reference.basis[field]) {
        issues.push('BASIS');
      }
    }
  }
  if (contract.periodPolicy !== 'DATED_MARKET') {
    for (const fact of facts) {
      const a = first.basis;
      const b = fact.basis;
      if (b.periodKind !== a.periodKind) {
        issues.push('PERIOD');
      }
      if (
        contract.periodPolicy === 'SAME' &&
        (a.start !== b.start || a.end !== b.end)
      ) {
        issues.push('PERIOD');
      }
      if (
        contract.periodPolicy === 'COMPARABLE' &&
        (a.start.slice(5) !== b.start.slice(5) ||
          a.end.slice(5) !== b.end.slice(5))
      ) {
        issues.push('PERIOD');
      }
    }
  }
  const shareBases = facts
    .filter((f) => f.basis.shareBasis)
    .map((f) => f.basis.shareBasis);
  if (new Set(shareBases).size > 1) {
    issues.push('SHARE_BASIS');
  }
  return issues;
}

export function evaluateCalculation(
  report: AnalysisReport,
  calculation: ResearchCalculation,
): CalculationResult {
  const contract = report.contracts.find((c) => c.id === calculation.id);
  const inputs = calculation.inputs.flatMap((id) =>
    report.facts.filter((f) => f.id === id),
  );
  const issues: string[] = [];
  if (new Set(report.facts.map((f) => f.id)).size !== report.facts.length) {
    issues.push('DUPLICATE');
  }
  if (
    new Set(report.presentation.sources.map((s) => s.id)).size !==
      report.presentation.sources.length ||
    report.contracts.filter((c) => c.id === calculation.id).length > 1
  ) {
    issues.push('DUPLICATE');
  }
  if (
    !contract ||
    contract.units.length !== calculation.inputs.length ||
    inputs.length !== calculation.inputs.length
  ) {
    issues.push('MISSING');
  }
  for (const [index, fact] of inputs.entries()) {
    issues.push(
      ...factIssues(
        fact,
        report.presentation.sources.map((s) => s.id),
      ),
    );
    if (contract?.units[index] !== fact.unit) {
      issues.push('UNIT');
    }
  }
  if (contract) {
    issues.push(...compatibility(inputs, contract));
  }
  if (contract?.periodPolicy === 'DATED_MARKET') {
    // Only explicit stock/price ratios or dated price series may cross period boundaries.
    const priceUnits = ['TRY_SHARE', 'USD_SHARE'];
    const priceSeries = inputs.every(
      (f) =>
        priceUnits.includes(f.unit) &&
        f.basis.scope === 'MARKET' &&
        f.basis.periodKind === 'INSTANT',
    );
    const stockRatio =
      inputs.some((f) => f.unit === 'SHARES') &&
      inputs.filter((f) => f.basis.scope !== 'MARKET').length <= 2;
    if (!priceSeries && !stockRatio) {
      issues.push('PERIOD');
    }
    const financial = inputs.filter((f) => f.basis.scope !== 'MARKET');
    if (
      financial.some(
        (f) =>
          f.basis.start !== financial[0]?.basis.start ||
          f.basis.end !== financial[0]?.basis.end,
      )
    ) {
      issues.push('PERIOD');
    }
  }
  const base = {
    id: calculation.id,
    methodVersion: '1' as const,
    inputIds: calculation.inputs,
    sourceIds: [...new Set(inputs.map((f) => f.sourceId))],
  };
  if (issues.length) {
    return { ...base, status: 'BLOCKED', issues: [...new Set(issues)] };
  }
  try {
    return {
      ...base,
      status: 'PASS',
      value: calculateResearch(calculation, inputs),
      issues: [],
    };
  } catch {
    return { ...base, status: 'BLOCKED', issues: ['ARITHMETIC'] };
  }
}
