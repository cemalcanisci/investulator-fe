import type { AnalysisReport, CalculationResult } from '@/domain/analysis';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';
import { factIssues } from '@/lib/analysisValidation';
import { valuationBasisIssues } from '@/lib/valuationBasis';
import type {
  ValuationScenario,
  ValuationInputRule,
} from '@/lib/valuationBasis';
import {
  addDecimals,
  compareDecimals,
  divideDecimals,
  multiplyDecimals,
  percentageOf,
  roundDecimal,
  subtractDecimals,
} from '@/lib/decimal';

/** Potential return = (fair value − market price) / market price × 100; `null` without both inputs. */
export function scenarioUpsidePercent(
  fairValue: string | undefined,
  price: string | undefined,
): string | null {
  if (!fairValue || !price || /^0(\.0+)?$/.test(price)) {
    return null;
  }
  return percentageOf(subtractDecimals(fairValue, price), price);
}

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
    inputRules: [
      { id: 'normalizedFcf', role: 'FLOW' },
      { id: 'investmentPlan', role: 'FLOW' },
      { id: 'discountRate', role: 'MULTIPLE' },
      { id: 'terminalGrowth', role: 'MULTIPLE' },
      { id: 'shares', role: 'SHARES' },
    ],
    required: [
      'normalizedFcf',
      'investmentPlan',
      'discountRate',
      'terminalGrowth',
      'shares',
    ],
    formula:
      '((normalizedFcf − investmentPlan) × (100 + terminalGrowth) / (discountRate − terminalGrowth)) / shares',
    calculate: (v) =>
      divideDecimals(
        divideDecimals(
          multiplyDecimals(
            subtractDecimals(v.normalizedFcf, v.investmentPlan),
            addDecimals(['100', v.terminalGrowth]),
          ),
          subtractDecimals(v.discountRate, v.terminalGrowth),
          6,
        ),
        v.shares,
        2,
      ),
  },
  {
    id: 'BOOK_ROE',
    inputRules: [
      { id: 'parentEquity', role: 'STOCK' },
      { id: 'sustainableRoe', role: 'MULTIPLE' },
      { id: 'costOfEquity', role: 'MULTIPLE' },
      { id: 'capitalAdequacy', role: 'STOCK' },
      { id: 'shares', role: 'SHARES' },
    ],
    required: [
      'parentEquity',
      'sustainableRoe',
      'costOfEquity',
      'capitalAdequacy',
      'shares',
    ],
    formula: '(parentEquity / shares) × (sustainableRoe / costOfEquity)',
    calculate: (v) =>
      roundDecimal(
        multiplyDecimals(
          divideDecimals(v.parentEquity, v.shares, 6),
          divideDecimals(v.sustainableRoe, v.costOfEquity, 6),
        ),
        2,
      ),
  },
  {
    id: 'NAV',
    inputRules: [
      { id: 'netAssetValue', role: 'STOCK' },
      { id: 'shares', role: 'SHARES' },
    ],
    required: ['netAssetValue', 'shares'],
    formula: 'netAssetValue / shares',
    calculate: (v) => divideDecimals(v.netAssetValue, v.shares, 2),
  },
];

/**
 * Renames a method's generic input ids to scenario-specific fact ids (e.g. `peerEvEbitda` →
 * `peerEvEbitdaBear`) so BEAR/BASE/BULL cases can each reference their own sourced fact while
 * sharing one `calculate` implementation.
 */
export function scenarioMethod(
  method: ValuationMethod,
  idMap: Readonly<Record<string, string>>,
): ValuationMethod {
  const rename = (id: string): string => idMap[id] ?? id;
  const calculate = method.calculate;
  return {
    ...method,
    required: method.required.map(rename),
    inputRules: method.inputRules?.map((rule) => ({
      ...rule,
      id: rename(rule.id),
    })),
    calculate: calculate
      ? (values) =>
          calculate(
            Object.fromEntries(
              method.required.map((id) => [id, values[rename(id)]]),
            ),
          )
      : undefined,
  };
}

export interface ScenarioCase {
  readonly case: ValuationScenario['id'];
  readonly idMap: Readonly<Record<string, string>>;
  readonly scenario: ValuationScenario;
}

export function evaluateValuationScenarios(
  report: AnalysisReport,
  method: ValuationMethod,
  cases: readonly ScenarioCase[],
): readonly {
  readonly case: ValuationScenario['id'];
  readonly result: CalculationResult;
}[] {
  return cases.map((c) => ({
    case: c.case,
    result: evaluateValuation(
      report,
      scenarioMethod(method, c.idMap),
      c.scenario,
    ),
  }));
}

/**
 * Looks up a report's authored BEAR/BASE/BULL cases for a method (if any were integrated) and
 * evaluates all three; returns `null` when the report carries no scenario set for this method,
 * so the caller can fall back to the scenario-less `evaluateValuation` (always BLOCKED/ASSUMPTIONS).
 */
export function reportValuationScenarios(
  report: AnalysisReport,
  method: ValuationMethod,
): readonly {
  readonly case: ValuationScenario['id'];
  readonly result: CalculationResult;
}[] | null {
  const set = report.valuationScenarios?.find(
    (entry) => entry.methodId === method.id,
  );
  return set ? evaluateValuationScenarios(report, method, set.cases) : null;
}

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
    // Positional, not id-keyed: `scenarioMethod` renames the per-case multiple id
    // (e.g. `peerEvEbitda` → `peerEvEbitdaBear`), but required[]'s slot order is preserved.
    const [normalizedEbitda, peerEvEbitda, valuationNetDebt, shares] =
      method.required.map((id) => inputs.find((f) => f.id === id));
    if (
      shares?.unit !== 'SHARES' ||
      peerEvEbitda?.unit !== 'MULTIPLE' ||
      !['TRY', 'USD'].includes(normalizedEbitda?.unit ?? '') ||
      valuationNetDebt?.unit !== normalizedEbitda?.unit
    ) {
      issues.push('UNIT');
    }
    if (
      [normalizedEbitda, peerEvEbitda, shares].some(
        (f) =>
          f &&
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
