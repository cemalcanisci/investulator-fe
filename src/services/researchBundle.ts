import pagyoReports from '@/data/research/pagyo-analysis-reports.json';
import pagyoApproximate from '@/data/research/pagyo-approximate-history.json';
import akmgyReports from '@/data/research/akmgy-analysis-reports.json';
import akmgyApproximate from '@/data/research/akmgy-approximate-history.json';
import aksaReports from '@/data/research/aksa-analysis-reports.json';
import aksaApproximate from '@/data/research/aksa-approximate-history.json';
import reports from '@/data/research/analysis-reports.json';
import doasReports from '@/data/research/doas-analysis-reports.json';
import yggyoReports from '@/data/research/yggyo-analysis-reports.json';
import ttrakReports from '@/data/research/ttrak-analysis-reports.json';
import frotoReports from '@/data/research/froto-analysis-reports.json';
import ismenReports from '@/data/research/ismen-analysis-reports.json';
import toasoReports from '@/data/research/toaso-analysis-reports.json';
import approximate from '@/data/research/tuprs-approximate-history.json';
import doasApproximate from '@/data/research/doas-approximate-history.json';
import yggyoApproximate from '@/data/research/yggyo-approximate-history.json';
import ttrakApproximate from '@/data/research/ttrak-approximate-history.json';
import frotoApproximate from '@/data/research/froto-approximate-history.json';
import ismenApproximate from '@/data/research/ismen-approximate-history.json';
import toasoApproximate from '@/data/research/toaso-approximate-history.json';
import verified from '@/data/research/tuprs-dividend-history.json';
import imported from '@/data/research/imported-research.json';
import { createStrategySeed } from '@/services/mockStrategies';
import { parseResearchBundle } from '@/lib/researchWorkbook';
import type { ResearchBundle } from '@/lib/researchWorkbook';

const baseline = parseResearchBundle({
  schemaVersion: 1,
  companies: createStrategySeed().assets,
  reports: [
    ...reports,
    ...doasReports,
    ...yggyoReports,
    ...ttrakReports,
    ...frotoReports,
    ...ismenReports,
    ...toasoReports,
    ...aksaReports,
    ...akmgyReports,
    ...pagyoReports,
  ],
  approximate: [
    approximate,
    doasApproximate,
    yggyoApproximate,
    ttrakApproximate,
    frotoApproximate,
    ismenApproximate,
    toasoApproximate,
    aksaApproximate,
    akmgyApproximate,
    pagyoApproximate,
  ],
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
