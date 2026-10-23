import type { AnalysisReport } from '@/domain/analysis';
import { metricDefinition } from '@/domain/metricEducation';
import { evaluateCalculation, factIssues } from '@/lib/analysisValidation';
import { getSign } from '@/lib/decimal';

export interface MetricInterpretation {
  readonly key: string;
  readonly value?: string;
  readonly periods: readonly string[];
  readonly sectorKey: string;
}

/** Consumes the existing validation/calculation result; never scores a company. */
export function interpretMetric(
  report: AnalysisReport | undefined,
  id: string,
): MetricInterpretation {
  const sector = report?.context.businessModel ?? 'UNSUPPORTED';
  const sectorKey = [
    'BANK',
    'REIT',
    'REFINING',
    'AUTOMOTIVE',
    'BROKER',
    'TECHNOLOGY',
  ].includes(sector)
    ? sector
    : 'GENERAL';
  const missing = { key: 'missing', periods: [], sectorKey };
  if (!report) {
    return missing;
  }
  if (
    report.facts.filter((f) => f.id === id).length > 1 ||
    new Set(report.presentation.sources.map((s) => s.id)).size !==
      report.presentation.sources.length
  ) {
    return missing;
  }
  const calculation = report.calculations.find((c) => c.id === id),
    fact = report.facts.find((f) => f.id === id);
  const inputs =
    calculation?.inputs.flatMap((input) =>
      report.facts.filter((f) => f.id === input),
    ) ?? (fact ? [fact] : []);
  const result = calculation
    ? evaluateCalculation(report, calculation)
    : fact &&
        factIssues(
          fact,
          report.presentation.sources.map((s) => s.id),
        ).length === 0
      ? { status: 'PASS', value: fact.value }
      : undefined;
  if (result?.status !== 'PASS' || result.value === undefined) {
    return missing;
  }
  const definition = metricDefinition(
    id,
    calculation?.metricKey ?? fact?.metricKey,
  );
  const periods = inputs.map((f) => `${f.basis.start} → ${f.basis.end}`);
  if (definition?.rule === 'GROWTH') {
    // A loss-to-profit transition cannot be described by an ordinary growth percentage.
    if (
      calculation?.operation !== 'GROWTH' ||
      !inputs[1] ||
      getSign(inputs[1].value) !== 'positive'
    ) {
      return { ...missing, key: 'growthBase', periods };
    }
    return {
      key: `growth.${getSign(result.value)}`,
      value: result.value,
      periods,
      sectorKey,
    };
  }
  if (
    definition?.rule === 'NET_DEBT' &&
    ['REFINING', 'AUTOMOTIVE', 'INDUSTRIAL', 'TECHNOLOGY'].includes(sector)
  ) {
    return {
      key: `netDebt.${getSign(result.value)}`,
      value: result.value,
      periods,
      sectorKey,
    };
  }
  return {
    key: definition?.rule === 'DIVIDEND' ? 'historicalDividend' : 'context',
    value: result.value,
    periods,
    sectorKey,
  };
}
