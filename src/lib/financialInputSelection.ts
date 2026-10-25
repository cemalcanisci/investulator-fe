import type { AnalysisReport, FinancialFact } from '@/domain/analysis';
import type { ResearchCalculation } from '@/domain/research';
import {
  usableFinancialFact,
  sameFinancialBasis,
} from '@/lib/financialPeriodSelection';

const KEYS: Readonly<Record<string, string>> = {
  price: 'price',
  shares: 'shares',
  profit: 'profit',
  revenue: 'revenue',
  operatingCash: 'cfo',
  capex: 'capex',
  cash: 'cash',
  parentEquity: 'parentEquity',
  operatingProfit: 'operatingProfit',
  currentAssets: 'currentAssets',
  currentLiabilities: 'currentLiabilities',
  netFinancialDebt: 'netFinancialDebt',
  debtShort: 'debtShort',
  debtCurrent: 'debtCurrent',
  debtLong: 'debtLong',
  workingCapitalCash: 'workingCapitalCash',
};
const CURRENT_CALCULATIONS = new Set([
  'profitGrowth',
  'revenueGrowth',
  'operatingMargin',
  'currentRatio',
  'financialDebt',
  'cashProxy',
]);

/** Semantic metric keys select inputs; historical calculation IDs retain their original inputs. */
export function latestMetricFact(
  report: AnalysisReport,
  id: string,
): FinancialFact | undefined {
  const original = report.facts.find((fact) => fact.id === id);
  const semantic = KEYS[id];
  if (!semantic) {
    return original;
  }
  const candidates = report.facts.filter(
    (fact) =>
      (fact.id === id || fact.metricKey === semantic) &&
      (!original ||
        (fact.basis.scope === original.basis.scope &&
          fact.basis.attribution === original.basis.attribution)) &&
      usableFinancialFact(report, fact, report.presentation.asOf),
  );
  return candidates.sort(
    (a, b) =>
      b.basis.end.localeCompare(a.basis.end) ||
      (a.id === id ? -1 : b.id === id ? 1 : 0),
  )[0];
}

export function currentCalculation(
  report: AnalysisReport,
  calculation: ResearchCalculation,
): ResearchCalculation {
  if (!CURRENT_CALCULATIONS.has(calculation.id)) {
    return calculation;
  }
  const inputs = calculation.inputs.map((id) => {
    if (id.endsWith('Previous')) {
      const currentId = id.slice(0, -8),
        current = latestMetricFact(report, currentId);
      if (!current) {
        return `missing:${id}`;
      }
      const priorStart = `${Number(current.basis.start.slice(0, 4)) - 1}${current.basis.start.slice(4)}`;
      const priorEnd = `${Number(current.basis.end.slice(0, 4)) - 1}${current.basis.end.slice(4)}`;
      return (
        report.facts.find(
          (fact) =>
            (fact.id === id || fact.metricKey === KEYS[currentId]) &&
            fact.basis.start === priorStart &&
            fact.basis.end === priorEnd &&
            fact.basis.periodKind === current.basis.periodKind &&
            sameFinancialBasis([current, fact]) &&
            usableFinancialFact(report, fact, report.presentation.asOf),
        )?.id ?? `missing:${id}`
      );
    }
    return KEYS[id]
      ? (latestMetricFact(report, id)?.id ?? `missing:${id}`)
      : id;
  });
  return { ...calculation, inputs };
}
