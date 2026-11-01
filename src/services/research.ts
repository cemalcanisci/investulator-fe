import type { ResearchReport } from '@/domain/research';
import { tuprsReport } from '@/data/research/tuprs-2026-10-11';
import { tuprsReportV2 } from '@/data/research/tuprs-2026-10-11-v2';
import { tuprsReportV3 } from '@/data/research/tuprs-2026-10-11-v3';
import { doasReport } from '@/data/research/doas-2026-10-27';
import { analysisRepository } from '@/services/analysis';

const REPORTS: readonly ResearchReport[] = [
  tuprsReportV3,
  tuprsReportV2,
  tuprsReport,
  doasReport,
];

export async function fetchResearch(
  assetId: string,
): Promise<readonly ResearchReport[]> {
  return structuredClone([
    ...analysisRepository.list(assetId).map((r) => r.presentation),
    ...REPORTS.filter((report) => report.assetId === assetId),
  ]);
}

export function hasResearch(assetId: string): boolean {
  return (
    analysisRepository.list(assetId).length > 0 ||
    REPORTS.some((report) => report.assetId === assetId)
  );
}
