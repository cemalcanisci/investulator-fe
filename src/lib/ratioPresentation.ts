import type { AnalysisReport, FinancialFact } from '@/domain/analysis';
import type { ResearchFact } from '@/domain/research';
import {
  evaluateCalculation,
  factIssues,
  factTechnicalIssues,
  factSourceIssues,
} from '@/lib/analysisValidation';
import { calculateResearch } from '@/lib/researchCalculations';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';
import {
  currentCalculation,
  latestMetricFact,
} from '@/lib/financialInputSelection';
import {
  selectFinancialFlow,
  selectFinancialStock,
  usableFinancialFact,
  sameFinancialBasis,
  availableAt,
} from '@/lib/financialPeriodSelection';
import {
  compareDecimals,
  divideDecimals,
  multiplyDecimals,
  addDecimals,
} from '@/lib/decimal';

export interface RatioPresentation {
  readonly periodBasis?: 'TTM' | 'ANNUAL' | 'INTERIM' | 'MISSING_DATA';
  readonly formula?: string;
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
  if (id === 'marketCap') {
    return selectedMarketCap(report);
  }
  if (id === 'peTtm') {
    return ttmPresentation(report);
  }
  if (
    (id === 'evEbitda' || id === 'netDebtEbitda') &&
    !report.calculations.some((calculation) => calculation.id === id)
  ) {
    return selectedEnterpriseRatio(report, id);
  }
  if (
    id === 'roe' &&
    !report.facts.some((fact) => fact.id === id) &&
    !report.calculations.some((calculation) => calculation.id === id)
  ) {
    return selectedRoe(report);
  }
  if (id === 'priceBook' && !report.facts.some((fact) => fact.id === id)) {
    const defined = report.calculations.find(
      (calculation) => calculation.id === id,
    );
    if (
      defined &&
      (defined.operation !== 'PRODUCT_OVER_SUM' ||
        JSON.stringify(defined.inputs) !==
          JSON.stringify(DATED_RATIOS.priceBook))
    ) {
      return { ...empty, issues: ['BASIS'] };
    }
    const price = ratioPresentation(report, 'marketCap').inputs.find((fact) =>
      fact.unit.endsWith('_SHARE'),
    );
    const selected = selectFinancialStock(
      report,
      'parentEquity',
      price?.basis.end ?? report.presentation.priceAt,
      'PARENT',
    );
    if (!selected) {
      return { ...empty, issues: ['publicationOrBasis'] };
    }
    return selectedBookRatio(report, selected);
  }
  const stored = report.calculations.find((c) => c.id === id);
  const calculation = stored ? currentCalculation(report, stored) : undefined;
  const fact = latestMetricFact(report, id);
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
    if (
      fact &&
      fact.verification === 'UNVERIFIED' &&
      !fact.evidence &&
      factTechnicalIssues(fact).length === 0 &&
      sourceIdentified(report, fact)
    ) {
      return { ...base, status: 'INDICATIVE', value: fact.value };
    }
    if (
      strict?.status === 'BLOCKED' &&
      calculation &&
      strict.issues.length &&
      strict.issues.every((issue) =>
        ['UNVERIFIED', 'EVIDENCE'].includes(issue),
      ) &&
      inputs.every(
        (input) =>
          input.verification !== 'CONFLICT' &&
          !input.evidence &&
          sourceIdentified(report, input),
      )
    ) {
      const technical = evaluateCalculation(report, calculation, 'TECHNICAL');
      if (technical.status === 'PASS') {
        return { ...base, status: 'INDICATIVE', value: technical.value };
      }
    }
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
        !availableAt(
          report,
          financial,
          price.basis.end < report.presentation.asOf
            ? price.basis.end
            : report.presentation.asOf,
        ) ||
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

function selectedMarketCap(report: AnalysisReport): RatioPresentation {
  const base: RatioPresentation = {
    id: 'marketCap',
    unit: 'TRY',
    status: 'MISSING_DATA',
    inputs: [],
    issues: ['MISSING'],
    strictStatus: 'BLOCKED',
  };
  if (
    new Set(report.facts.map((fact) => fact.id)).size !== report.facts.length ||
    new Set(report.presentation.sources.map((source) => source.id)).size !==
      report.presentation.sources.length
  ) {
    return { ...base, issues: ['DUPLICATE'] };
  }
  const declared = report.calculations.filter(
    (calculation) => calculation.id === 'marketCap',
  );
  if (
    declared.length > 1 ||
    declared.some(
      (calculation) =>
        calculation.operation !== 'MULTIPLY' ||
        JSON.stringify(calculation.inputs) !==
          JSON.stringify(DATED_RATIOS.marketCap),
    )
  ) {
    return { ...base, issues: ['BASIS'] };
  }
  const candidates = report.facts
    .filter(
      (fact) =>
        fact.basis.scope === 'MARKET' &&
        fact.basis.periodKind === 'INSTANT' &&
        fact.basis.end <= report.presentation.asOf &&
        factTechnicalIssues(fact).length === 0 &&
        fact.verification !== 'CONFLICT' &&
        sourceIdentified(report, fact),
    )
    .sort((a, b) => b.basis.end.localeCompare(a.basis.end));
  const price = candidates.find(
    (fact) =>
      (fact.id === 'price' || fact.metricKey === 'price') &&
      fact.unit.endsWith('_SHARE'),
  );
  const shares = candidates.find(
    (fact) =>
      (fact.id === 'shares' || fact.metricKey === 'shares') &&
      fact.unit === 'SHARES' &&
      (!price || fact.basis.end <= price.basis.end),
  );
  if (
    !price ||
    !shares ||
    price.basis.currency !== shares.basis.currency ||
    price.basis.shareBasis !== shares.basis.shareBasis ||
    compareDecimals(price.value, '0') <= 0 ||
    compareDecimals(shares.value, '0') <= 0
  ) {
    return base;
  }
  const inputs = [price, shares];
  const contracts = report.contracts.filter(
    (contract) => contract.id === 'marketCap',
  );
  if (
    declared.length &&
    (contracts.length !== 1 ||
      contracts[0].units.length !== inputs.length ||
      inputs.some((fact, index) => fact.unit !== contracts[0].units[index]))
  ) {
    return { ...base, issues: ['UNIT'] };
  }
  if (
    inputs.some(
      (fact) =>
        fact.evidence &&
        factSourceIssues(
          fact,
          report.presentation.sources.map((source) => source.id),
        ).some((issue) =>
          ['EVIDENCE', 'RESTATEMENT', 'SOURCE'].includes(issue),
        ),
    )
  ) {
    return base;
  }
  const issues = inputs.flatMap((fact) =>
    factIssues(
      fact,
      report.presentation.sources.map((source) => source.id),
    ),
  );
  if (price.basis.end !== shares.basis.end) {
    issues.push('capitalDate');
  }
  return {
    ...base,
    inputs,
    unit: price.basis.currency === 'USD' ? 'USD' : 'TRY',
    value: multiplyDecimals(price.value, shares.value),
    issues: [...new Set(issues)],
    status: issues.length ? 'INDICATIVE' : 'VERIFIED',
    strictStatus: issues.length ? 'BLOCKED' : 'PASS',
    formula: `${price.value} × ${shares.value}`,
  };
}

function ttmPresentation(report: AnalysisReport): RatioPresentation {
  const market = ratioPresentation(report, 'marketCap');
  const price = market.inputs.find((f) => f.unit.endsWith('_SHARE'));
  const asOf =
    price?.basis.end && price.basis.end < report.presentation.asOf
      ? price.basis.end
      : report.presentation.asOf;
  const ttm = selectFinancialFlow(report, 'profit', asOf, 'PARENT');
  const base: RatioPresentation = {
    id: 'peTtm',
    status: 'MISSING_DATA',
    unit: 'MULTIPLE',
    inputs: [...market.inputs, ...ttm.inputs],
    periodBasis: ttm.kind,
    formula: ttm.formula,
    issues: ttm.issues,
    strictStatus: 'BLOCKED',
  };
  const first = ttm.inputs[0];
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
    return {
      ...base,
      issues: [
        ...base.issues,
        ...(ttm.value && compareDecimals(ttm.value, '0') <= 0
          ? ['nonPositiveEarnings']
          : []),
      ],
    };
  }
  const issues = [...market.issues, ...ttm.issues];
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

function selectedBookRatio(
  report: AnalysisReport,
  equity: FinancialFact,
): RatioPresentation {
  const market = ratioPresentation(report, 'marketCap');
  const price = market.inputs.find((fact) => fact.unit.endsWith('_SHARE'));
  const contracts = report.contracts.filter(
    (contract) => contract.id === 'priceBook',
  );
  const base: RatioPresentation = {
    id: 'priceBook',
    unit: 'MULTIPLE',
    status: 'MISSING_DATA',
    inputs: [...market.inputs, equity],
    issues: ['BASIS'],
    strictStatus: 'BLOCKED',
  };
  if (
    !market.value ||
    !price ||
    (report.calculations.some(
      (calculation) => calculation.id === 'priceBook',
    ) &&
      (contracts.length !== 1 ||
        contracts[0].units.length !== base.inputs.length ||
        base.inputs.some(
          (fact, index) => fact.unit !== contracts[0].units[index],
        ))) ||
    equity.unit !== price.basis.currency ||
    equity.basis.currency !== price.basis.currency ||
    compareDecimals(equity.value, '0') <= 0
  ) {
    return base;
  }
  const issues = [
    ...market.issues,
    ...factIssues(
      equity,
      report.presentation.sources.map((source) => source.id),
    ),
  ];
  if (equity.basis.end !== price.basis.end) {
    issues.push('marketDate');
  }
  if (
    equity.basis.accounting === 'TAS29' &&
    equity.basis.purchasingPowerDate !== price.basis.end
  ) {
    issues.push('purchasingPower');
  }
  return {
    ...base,
    issues: [...new Set(issues)],
    value: divideDecimals(market.value, equity.value, 2),
    status: issues.length ? 'INDICATIVE' : 'VERIFIED',
  };
}

function selectedRoe(report: AnalysisReport): RatioPresentation {
  const flow = selectFinancialFlow(
    report,
    'profit',
    report.presentation.asOf,
    'PARENT',
  );
  const base: RatioPresentation = {
    id: 'roe',
    unit: 'PERCENT',
    status: 'MISSING_DATA',
    inputs: flow.inputs,
    issues: ['averageEquity'],
    strictStatus: 'BLOCKED',
    periodBasis: flow.kind,
  };
  if (!flow.value || !flow.inputs.length || flow.kind === 'INTERIM') {
    return base;
  }
  const end = flow.inputs
    .map((fact) => fact.basis.end)
    .sort()
    .at(-1);
  if (!end) {
    return base;
  }
  const finish = new Date(`${end}T00:00:00Z`);
  const opening = new Date(
    Date.UTC(finish.getUTCFullYear() - 1, finish.getUTCMonth() + 1, 0),
  )
    .toISOString()
    .slice(0, 10);
  const balances = report.facts.filter(
    (fact) =>
      (fact.id === 'parentEquity' || fact.metricKey === 'parentEquity') &&
      fact.basis.attribution === 'PARENT' &&
      fact.basis.periodKind === 'INSTANT' &&
      [opening, end].includes(fact.basis.end) &&
      usableFinancialFact(report, fact, report.presentation.asOf) &&
      sameFinancialBasis([flow.inputs[0], fact]),
  );
  const before = balances.filter((fact) => fact.basis.end === opening),
    after = balances.filter((fact) => fact.basis.end === end);
  if (
    before.length !== 1 ||
    after.length !== 1 ||
    balances.some((fact) => compareDecimals(fact.value, '0') <= 0)
  ) {
    return base;
  }
  const average = divideDecimals(
    addDecimals([before[0].value, after[0].value]),
    '2',
    8,
  );
  const inputs = [...flow.inputs, ...balances];
  const issues = [
    ...flow.issues,
    ...inputs.flatMap((fact) =>
      factIssues(
        fact,
        report.presentation.sources.map((source) => source.id),
      ),
    ),
  ];
  return {
    ...base,
    inputs,
    issues: [...new Set(issues)],
    value: multiplyDecimals(divideDecimals(flow.value, average, 4), '100'),
    status: issues.length ? 'INDICATIVE' : 'VERIFIED',
    formula: `${flow.value} / ((${before[0].value} + ${after[0].value}) / 2) × 100`,
  };
}

function selectedEnterpriseRatio(
  report: AnalysisReport,
  id: 'evEbitda' | 'netDebtEbitda',
): RatioPresentation {
  const base: RatioPresentation = {
    id,
    unit: 'MULTIPLE',
    status: 'MISSING_DATA',
    inputs: [],
    issues: ['MISSING'],
    strictStatus: 'BLOCKED',
  };
  if (!selectAnalysisProfile(report.context).methods.includes('EV_EBITDA')) {
    return { ...base, issues: ['sector'] };
  }
  const market = ratioPresentation(report, 'marketCap');
  const price = market.inputs.find((fact) => fact.unit.endsWith('_SHARE'));
  const at = price?.basis.end ?? report.presentation.asOf;
  const flow = selectFinancialFlow(report, 'ebitda', at, 'GROUP');
  const debt = selectFinancialStock(report, 'netFinancialDebt', at, 'GROUP');
  if (
    !debt ||
    !flow.value ||
    !flow.inputs.length ||
    flow.kind === 'INTERIM' ||
    compareDecimals(flow.value, '0') <= 0 ||
    !sameFinancialBasis([debt, flow.inputs[0]]) ||
    debt.basis.end !==
      flow.inputs
        .map((fact) => fact.basis.end)
        .sort()
        .at(-1)
  ) {
    return base;
  }
  if (
    id === 'evEbitda' &&
    (!market.value || !price || price.basis.currency !== debt.basis.currency)
  ) {
    return base;
  }
  const inputs = [
    ...(id === 'evEbitda' ? market.inputs : []),
    debt,
    ...flow.inputs,
  ];
  const issues = [
    ...flow.issues,
    ...inputs.flatMap((fact) =>
      factIssues(
        fact,
        report.presentation.sources.map((source) => source.id),
      ),
    ),
    ...(id === 'evEbitda' ? market.issues : []),
  ];
  if (id === 'evEbitda' && debt.basis.end !== at) {
    issues.push('marketDate');
  }
  if (
    id === 'evEbitda' &&
    debt.basis.accounting === 'TAS29' &&
    debt.basis.purchasingPowerDate !== at
  ) {
    issues.push('purchasingPower');
  }
  const numerator =
    id === 'evEbitda'
      ? addDecimals([market.value ?? '0', debt.value])
      : debt.value;
  return {
    ...base,
    inputs,
    periodBasis: flow.kind,
    issues: [...new Set(issues)],
    value: divideDecimals(numerator, flow.value, 2),
    status: issues.length ? 'INDICATIVE' : 'VERIFIED',
    formula: `${id === 'evEbitda' ? `(${market.value} + ${debt.value})` : debt.value} / (${flow.formula})`,
  };
}

export function presentationFormulaValue(result: RatioPresentation): string {
  if (result.formula) {
    return result.formula;
  }
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
