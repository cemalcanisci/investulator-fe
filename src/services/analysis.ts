import { researchBundle } from '@/services/researchBundle';
import type { AnalysisReport, CalculationResult } from '@/domain/analysis';
import type { ResearchReport } from '@/domain/research';
import { AnalysisRepository } from '@/lib/analysisRepository';
import { evaluateCalculation, factIssues } from '@/lib/analysisValidation';

export const analysisRepository = new AnalysisRepository(
  researchBundle.reports,
);

export function getAnalysis(
  report: ResearchReport,
): AnalysisReport | undefined {
  return analysisRepository
    .list(report.assetId)
    .find((r) => r.presentation.id === report.id);
}

export function metricResult(
  report: ResearchReport,
  id: string,
): CalculationResult {
  const analysis = getAnalysis(report);
  const base = {
    id,
    methodVersion: '1' as const,
    inputIds: [id],
    sourceIds: [],
    status: 'BLOCKED' as const,
    issues: ['UNVERIFIED'],
  };
  if (!analysis) {
    return base;
  }
  const calculation = analysis.calculations.find((c) => c.id === id);
  if (calculation) {
    return evaluateCalculation(analysis, calculation);
  }
  const fact = analysis.facts.find((f) => f.id === id);
  if (!fact) {
    return { ...base, issues: ['MISSING'] };
  }
  const issues = factIssues(
    fact,
    report.sources.map((s) => s.id),
  );
  if (
    analysis.facts.filter((f) => f.id === id).length !== 1 ||
    new Set(report.sources.map((s) => s.id)).size !== report.sources.length
  ) {
    issues.push('DUPLICATE');
  }
  return {
    ...base,
    sourceIds: [fact.sourceId],
    status: issues.length ? 'BLOCKED' : 'PASS',
    value: issues.length ? undefined : fact.value,
    issues,
  };
}
