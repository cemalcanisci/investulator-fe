import type { AnalysisReport } from '@/domain/analysis';
import { evaluateCalculation, factIssues } from '@/lib/analysisValidation';

export function analysisQuality(report: AnalysisReport): {
  calculationPassed: number;
  calculationTotal: number;
  sources: 'PRIMARY_ONLY' | 'INCOMPLETE';
  completeness: 'PARTIAL';
  independentReview: 'NOT_REVIEWED';
} {
  return {
    calculationPassed: report.calculations.filter(
      (c) => evaluateCalculation(report, c).status === 'PASS',
    ).length,
    calculationTotal: report.calculations.length,
    sources:
      report.facts.length > 0 &&
      report.facts.every(
        (f) =>
          !factIssues(
            f,
            report.presentation.sources.map((s) => s.id),
          ).length,
      )
        ? 'PRIMARY_ONLY'
        : 'INCOMPLETE',
    // No independent review artifact or complete section dossier exists in this schema yet.
    completeness: 'PARTIAL',
    independentReview: 'NOT_REVIEWED',
  };
}
