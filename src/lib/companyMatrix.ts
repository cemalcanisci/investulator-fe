import type { AnalysisProfile, AnalysisReport } from '@/domain/analysis';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';
import {
  companyAssessment,
  valuationGroupRatio,
} from '@/lib/companyAssessment';
import type { CompanyAssessment } from '@/lib/companyAssessment';
import { reportValuationScenarios, VALUATION_METHODS } from '@/lib/valuation';
import type { ValuationMethod } from '@/lib/valuation';

export interface CompanyReliability {
  readonly reviewStatus: 'PASS' | 'NEEDS_REVIEW';
  readonly reviewIndependent: boolean;
  /** Fact ids the source audit itself flags as unresolved, not a derived judgment call. */
  readonly conflictFactIds: readonly string[];
  readonly incompleteCoverageSections: readonly string[];
  /** 'NONE': no scenario set authored at all. 'BLOCKED': authored but none of BEAR/BASE/BULL passed review. 'AVAILABLE': at least one case cleared review. */
  readonly valuationAvailability: 'NONE' | 'BLOCKED' | 'AVAILABLE';
}

export interface CompanyMatrixEntry {
  readonly assetId: string;
  readonly symbol: string;
  readonly report: AnalysisReport;
  readonly profile: AnalysisProfile;
  readonly assessment: CompanyAssessment;
  /** Sector-shared multiple id (e.g. 'evEbitda'); absent profiles never get grouped for cross-company comparison. */
  readonly valuationRatioId?: string;
  readonly reliability: CompanyReliability;
}

/** Mirrors AnalysisRepository.list()[0]'s ordering (revision desc, then retrievedAt desc) across every asset at once. */
function latestPerAsset(
  reports: readonly AnalysisReport[],
): readonly AnalysisReport[] {
  const byAsset = new Map<string, AnalysisReport>();
  for (const report of reports) {
    if (report.context.assetType !== 'EQUITY') {
      continue;
    }
    const assetId = report.presentation.assetId;
    const current = byAsset.get(assetId);
    if (
      !current ||
      (report.revision ?? 0) > (current.revision ?? 0) ||
      ((report.revision ?? 0) === (current.revision ?? 0) &&
        report.presentation.retrievedAt > current.presentation.retrievedAt)
    ) {
      byAsset.set(assetId, report);
    }
  }
  return [...byAsset.values()];
}

function valuationAvailability(
  report: AnalysisReport,
  methods: readonly ValuationMethod[],
): CompanyReliability['valuationAvailability'] {
  if (!report.valuationScenarios?.length) {
    return 'NONE';
  }
  const evaluated = methods.flatMap(
    (method) => reportValuationScenarios(report, method) ?? [],
  );
  return evaluated.some((entry) => entry.result.status === 'PASS')
    ? 'AVAILABLE'
    : 'BLOCKED';
}

function reliabilityOf(
  report: AnalysisReport,
  profile: AnalysisProfile,
): CompanyReliability {
  const methods = profile.methods
    .map((id) => VALUATION_METHODS.find((method) => method.id === id))
    .filter((method): method is ValuationMethod => method !== undefined);
  return {
    reviewStatus: report.presentation.review.status,
    reviewIndependent: report.presentation.review.independent,
    conflictFactIds: [
      ...new Set(
        report.facts
          .filter((fact) => fact.verification === 'CONFLICT')
          .map((fact) => fact.id),
      ),
    ],
    incompleteCoverageSections: report.presentation.coverage
      .filter((entry) => entry.status !== 'COMPLETE')
      .map((entry) => entry.section),
    valuationAvailability: valuationAvailability(report, methods),
  };
}

/**
 * One row per covered company, latest revision only. Sorted by sector profile then symbol
 * (a stable, neutral order) — never by a computed score, so grouping stays visible but no
 * cross-sector ranking is implied.
 */
export function listCompanyMatrix(
  reports: readonly AnalysisReport[],
): readonly CompanyMatrixEntry[] {
  return latestPerAsset(reports)
    .map((report) => {
      const profile = selectAnalysisProfile(report.context);
      return {
        assetId: report.presentation.assetId,
        symbol: report.presentation.symbol,
        report,
        profile,
        assessment: companyAssessment(report),
        valuationRatioId: valuationGroupRatio(profile.id),
        reliability: reliabilityOf(report, profile),
      };
    })
    .sort(
      (a, b) =>
        a.profile.id.localeCompare(b.profile.id) ||
        a.symbol.localeCompare(b.symbol),
    );
}

export type RiskFlag =
  | 'CYCLICAL'
  | 'REGULATORY_CAPITAL'
  | 'COMMISSION_DEPENDENT'
  | 'VALUATION_JUDGMENT'
  | 'FX_DEBT';

const SECTOR_RISK: Readonly<Record<string, RiskFlag | undefined>> = {
  REFINING: 'CYCLICAL',
  AUTOMOTIVE: 'CYCLICAL',
  INDUSTRIAL: 'CYCLICAL',
  BANK: 'REGULATORY_CAPITAL',
  BROKER: 'COMMISSION_DEPENDENT',
  REIT: 'VALUATION_JUDGMENT',
};

/**
 * Structural flags only (sector + recorded debt currency), never a severity score. A company with
 * no recorded FX debt line is not claimed to be free of currency risk — only that this report
 * does not carry one.
 */
export function riskFlags(entry: CompanyMatrixEntry): readonly RiskFlag[] {
  const flags: RiskFlag[] = [];
  const sectorFlag = SECTOR_RISK[entry.profile.id];
  if (sectorFlag) {
    flags.push(sectorFlag);
  }
  if (
    entry.report.presentation.debtLines.some((line) => line.currency !== 'TRY')
  ) {
    flags.push('FX_DEBT');
  }
  return flags;
}

export interface ValuationComparisonGroup {
  readonly businessModel: string;
  /**
   * The group's economic peer set id. Equals `businessModel` when the sector itself is already
   * the narrowest known peer set; otherwise a sub-group (e.g. AUTOMOTIVE's 'AUTOMOTIVE_OEM').
   * This, not `businessModel`, is what the table heading/grouping key uses — sharing a sector
   * never implies sharing a peer set (a distributor and an OEM assembler both tag AUTOMOTIVE).
   */
  readonly peerGroup: string;
  readonly ratioId: string;
  readonly entries: readonly CompanyMatrixEntry[];
}

/** Falls back to the business model itself when no narrower peer set is recorded. */
function peerGroupId(entry: CompanyMatrixEntry): string {
  return entry.report.context.peerGroup ?? entry.profile.id;
}

/**
 * Groups entries that share both a recorded economic peer set and its sector multiple (e.g.
 * AUTOMOTIVE's OEM assemblers sharing evEbitda). Never mixes business models even when they
 * happen to share a ratio id (e.g. REFINING and AUTOMOTIVE both use evEbitda but are not the
 * same economic peer set), and never mixes peer sets within one business model (e.g. a
 * distributor and an OEM assembler both tag AUTOMOTIVE but are not directly comparable).
 */
export function valuationComparisonGroups(
  entries: readonly CompanyMatrixEntry[],
): readonly ValuationComparisonGroup[] {
  const groups = new Map<string, ValuationComparisonGroup>();
  for (const entry of entries) {
    if (!entry.valuationRatioId) {
      continue;
    }
    const peerGroup = peerGroupId(entry);
    const key = `${peerGroup}::${entry.valuationRatioId}`;
    const existing = groups.get(key);
    groups.set(key, {
      businessModel: entry.profile.id,
      peerGroup,
      ratioId: entry.valuationRatioId,
      entries: [...(existing?.entries ?? []), entry],
    });
  }
  return [...groups.values()].sort((a, b) =>
    a.peerGroup.localeCompare(b.peerGroup),
  );
}
