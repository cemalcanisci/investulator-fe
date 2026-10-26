import reports from '@/data/research/analysis-reports.json';
import approximate from '@/data/research/tuprs-approximate-history.json';
import verified from '@/data/research/tuprs-dividend-history.json';
import imported from '@/data/research/imported-research.json';
import { createStrategySeed } from '@/services/mockStrategies';
import { parseResearchBundle } from '@/lib/researchWorkbook';
import type { ResearchBundle } from '@/lib/researchWorkbook';

const baseline = parseResearchBundle({
  schemaVersion: 1,
  companies: createStrategySeed().assets,
  reports,
  approximate: [approximate],
  verified: [verified],
});
const overlay = parseResearchBundle(imported);

function merge<T>(
  original: readonly T[],
  updated: readonly T[],
  key: (value: T) => string,
): readonly T[] {
  return [
    ...new Map(
      [...original, ...updated].map((value) => [key(value), value]),
    ).values(),
  ];
}
function historyKey(value: ResearchBundle['approximate'][number]): string {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value) ||
    typeof value.assetId !== 'string'
  ) {
    throw new Error('history');
  }
  return value.assetId;
}
/** One source overlay feeds the existing repositories. No portfolio data are included. */
export function mergeResearchBundles(
  baseline: ResearchBundle,
  overlay: ResearchBundle,
): ResearchBundle {
  return {
    schemaVersion: 1,
    companies: merge(
      baseline.companies,
      overlay.companies,
      (company) => company.id,
    ),
    reports: merge(
      baseline.reports,
      overlay.reports,
      (report) => report.version,
    ),
    approximate: merge(baseline.approximate, overlay.approximate, historyKey),
    verified: merge(baseline.verified, overlay.verified, historyKey),
  };
}
export const researchBundle: ResearchBundle = mergeResearchBundles(
  baseline,
  overlay,
);
