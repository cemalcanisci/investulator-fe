import type { AnalysisReport } from '@/domain/analysis';

export interface ReportDifference {
  readonly factId: string;
  readonly before?: string;
  readonly after?: string;
  readonly kind: 'VALUE' | 'EVIDENCE';
}

export function compareReports(
  before: AnalysisReport,
  after: AnalysisReport,
): readonly ReportDifference[] {
  if (before.presentation.assetId !== after.presentation.assetId) {
    throw new Error('Different assets');
  }
  return [
    ...new Set([...before.facts, ...after.facts].map((f) => f.id)),
  ].flatMap((id) => {
    const a = before.facts.find((f) => f.id === id);
    const b = after.facts.find((f) => f.id === id);
    if (JSON.stringify(a) === JSON.stringify(b)) {
      return [];
    }
    return [
      {
        factId: id,
        before: a?.value,
        after: b?.value,
        kind:
          a?.value === b?.value ? ('EVIDENCE' as const) : ('VALUE' as const),
      },
    ];
  });
}

/** Failed refreshes never replace an immutable local snapshot. No network or portfolio access. */
export class AnalysisRepository {
  private readonly reports: AnalysisReport[];
  private readonly failures = new Map<string, string>();
  constructor(reports: readonly AnalysisReport[]) {
    this.reports = structuredClone([...reports]);
  }
  list(assetId: string): readonly AnalysisReport[] {
    return structuredClone(
      this.reports
        .filter((r) => r.presentation.assetId === assetId)
        .sort(
          (a, b) =>
            (b.revision ?? 0) - (a.revision ?? 0) ||
            b.presentation.retrievedAt.localeCompare(
              a.presentation.retrievedAt,
            ),
        ),
    );
  }
  failedRefresh(assetId: string, at: string): void {
    this.failures.set(assetId, at);
  }
  lastFailure(assetId: string): string | undefined {
    return this.failures.get(assetId);
  }
}
