import type { AnalysisReport, CalculationResult } from '@/domain/analysis';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';
import { factIssues } from '@/lib/analysisValidation';
import { valuationBasisIssues } from '@/lib/valuationBasis';
import type {
  ValuationScenario,
  ValuationInputRule,
} from '@/lib/valuationBasis';
import {
  compareDecimals,
  divideDecimals,
  multiplyDecimals,
  subtractDecimals,
} from '@/lib/decimal';

export interface ValuationMethod {
  readonly id: string;
  readonly required: readonly string[];
  readonly formula: string;
  readonly inputRules?: readonly ValuationInputRule[];
  readonly calculate?: (values: Readonly<Record<string, string>>) => string;
}
/** Missing implementations remain explicit; applicability is not a valuation result. */
export const VALUATION_METHODS: readonly ValuationMethod[] = [
  {
    id: 'EV_EBITDA',
    inputRules: [
      { id: 'normalizedEbitda', role: 'FLOW' },
      { id: 'peerEvEbitda', role: 'MULTIPLE' },
      { id: 'valuationNetDebt', role: 'STOCK' },
      { id: 'shares', role: 'SHARES' },
    ],
    required: [
      'normalizedEbitda',
      'peerEvEbitda',
      'valuationNetDebt',
      'shares',
    ],
    formula: '(normalizedEbitda × peerEvEbitda − valuationNetDebt) / shares',
    calculate: (v) =>
      divideDecimals(
        subtractDecimals(
          multiplyDecimals(v.normalizedEbitda, v.peerEvEbitda),
          v.valuationNetDebt,
        ),
        v.shares,
        2,
      ),
  },
  {
    id: 'DDM',
    required: ['sustainableDividend', 'costOfEquity', 'dividendGrowth'],
    formula: 'Σ DPS(t)/(1+Ke)^t + terminal dividend value',
  },
  {
    id: 'FCF',
    required: [
      'normalizedFcf',
      'discountRate',
      'terminalGrowth',
      'investmentPlan',
    ],
    formula: 'Σ FCF(t)/(1+r)^t + terminal value',
  },
  {
    id: 'BOOK_ROE',
    required: [
      'parentEquity',
      'sustainableRoe',
      'costOfEquity',
      'capitalAdequacy',
    ],
    formula: 'P/B justified by sustainable ROE and cost of equity',
  },
  {
    id: 'NAV',
    required: ['netAssetValue', 'shares', 'appraisalDate'],
    formula: 'netAssetValue / shares',
  },
];

export function evaluateValuation(
  report: AnalysisReport,
  method: ValuationMethod,
  scenario?: ValuationScenario,
): CalculationResult {
  const inputs = method.required.flatMap((id) =>
    report.facts.filter((f) => f.id === id),
  );
  const issues: string[] = [];
  if (!selectAnalysisProfile(report.context).methods.includes(method.id)) {
    issues.push('NOT_APPLICABLE');
  }
  for (const id of method.required) {
    if (!inputs.some((f) => f.id === id)) {
      issues.push(`MISSING:${id}`);
    }
  }
  for (const f of inputs) {
    issues.push(
      ...factIssues(
        f,
        report.presentation.sources.map((s) => s.id),
      ),
    );
  }
  issues.push(
    ...valuationBasisIssues(inputs, method.inputRules ?? [], scenario),
  );
  if (
    method.calculate &&
    method.inputRules?.length !== method.required.length
  ) {
    issues.push('ASSUMPTIONS');
  }
  if (!method.calculate) {
    issues.push('METHOD_PENDING');
  }
  if (new Set(inputs.map((f) => f.id)).size !== inputs.length) {
    issues.push('DUPLICATE');
  }
  if (method.id === 'EV_EBITDA') {
    const byId = Object.fromEntries(inputs.map((f) => [f.id, f]));
    if (
      byId.shares?.unit !== 'SHARES' ||
      byId.peerEvEbitda?.unit !== 'MULTIPLE' ||
      !['TRY', 'USD'].includes(byId.normalizedEbitda?.unit ?? '') ||
      byId.valuationNetDebt?.unit !== byId.normalizedEbitda?.unit
    ) {
      issues.push('UNIT');
    }
    if (
      inputs.some(
        (f) =>
          ['normalizedEbitda', 'peerEvEbitda', 'shares'].includes(f.id) &&
          /^-?\d+(\.\d+)?$/.test(f.value) &&
          compareDecimals(f.value, '0') <= 0,
      )
    ) {
      issues.push('ARITHMETIC');
    }
  }
  const base = {
    id: method.id,
    methodVersion: '1' as const,
    inputIds: method.required,
    sourceIds: [...new Set(inputs.map((f) => f.sourceId))],
  };
  if (issues.length || !method.calculate) {
    return { ...base, status: 'BLOCKED', issues: [...new Set(issues)] };
  }
  try {
    const value = method.calculate(
      Object.fromEntries(inputs.map((f) => [f.id, f.value])),
    );
    if (compareDecimals(value, '0') <= 0) {
      return { ...base, status: 'BLOCKED', issues: ['ARITHMETIC'] };
    }
    return { ...base, status: 'PASS', value, issues: [] };
  } catch {
    return { ...base, status: 'BLOCKED', issues: ['ARITHMETIC'] };
  }
}
