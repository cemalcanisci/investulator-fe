import type { ResearchReport } from '@/domain/research';
import { tuprsReport } from '@/data/research/tuprs-2026-10-11';
import { tuprsReportV2 } from '@/data/research/tuprs-2026-10-11-v2';
import { tuprsReportV3 } from '@/data/research/tuprs-2026-10-11-v3';

const REPORTS: readonly ResearchReport[] = [
  tuprsReportV3,
  tuprsReportV2,
  tuprsReport,
];

export async function fetchResearch(
  assetId: string,
): Promise<readonly ResearchReport[]> {
  return structuredClone(
    REPORTS.filter((report) => report.assetId === assetId),
  );
}

export function hasResearch(assetId: string): boolean {
  return REPORTS.some((report) => report.assetId === assetId);
}
