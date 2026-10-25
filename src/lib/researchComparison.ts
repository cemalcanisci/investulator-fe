import type { AnalysisReport, FinancialFact } from '@/domain/analysis';
import { factIssues } from '@/lib/analysisValidation';
import { metricDefinition } from '@/domain/metricEducation';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';

export interface ComparisonCandidate {
  readonly label: string;
  readonly report: AnalysisReport;
  readonly factId: string;
}
export interface ComparisonPoint {
  readonly label: string;
  readonly fact: FinancialFact;
  readonly sourceUrl: string;
}
export interface ComparisonGroup {
  readonly basis: string;
  readonly points: readonly ComparisonPoint[];
}
export interface ComparisonResult {
  readonly groups: readonly ComparisonGroup[];
  readonly rejected: number;
}

/** Explicit versioned peer links never infer comparability from ticker or sector alone. */
export function peerCandidates(
  subject: AnalysisReport | undefined,
  reports: readonly AnalysisReport[],
): readonly ComparisonCandidate[] {
  if (!subject) {
    return [];
  }
  const result: ComparisonCandidate[] = [];
  for (const link of subject.peers ?? []) {
    const peer = reports.find(
      (report) =>
        report.version === link.reportVersion &&
        report.presentation.assetId === link.assetId &&
        report.presentation.asOf <= subject.presentation.asOf,
    );
    if (!peer || peer.presentation.assetId === subject.presentation.assetId) {
      continue;
    }
    if (
      !result.some(
        (candidate) =>
          candidate.report === subject &&
          candidate.factId === link.subjectFactId,
      )
    ) {
      result.push({
        label: subject.presentation.symbol,
        report: subject,
        factId: link.subjectFactId,
      });
    }
    result.push({
      label: peer.presentation.symbol,
      report: peer,
      factId: link.factId,
    });
  }
  return result;
}

/** Groups only verified, economically equivalent facts; no conversions or interpolations. */
export function researchComparison(
  candidates: readonly ComparisonCandidate[],
  mode: 'HISTORY' | 'PEERS',
): ComparisonResult {
  const groups = new Map<string, ComparisonPoint[]>();
  let rejected = 0;
  for (const candidate of candidates) {
    const { report, factId, label } = candidate,
      fact = report.facts.find((f) => f.id === factId);
    if (
      !fact ||
      report.facts.filter((f) => f.id === factId).length !== 1 ||
      new Set(report.presentation.sources.map((s) => s.id)).size !==
        report.presentation.sources.length ||
      factIssues(
        fact,
        report.presentation.sources.map((s) => s.id),
      ).length
    ) {
      rejected++;
      continue;
    }
    const definition = metricDefinition(fact.id, fact.metricKey);
    if (!definition) {
      rejected++;
      continue;
    }
    const profile = selectAnalysisProfile(report.context);
    const allowed = new Set(
      [
        ...profile.headline,
        ...profile.financials,
        ...profile.growth,
        ...profile.dividend,
        ...profile.technical,
      ].map((id) => metricDefinition(id)?.key),
    );
    if (report.context.assetType === 'EQUITY') {
      allowed.add('profit');
      allowed.add('equity');
      allowed.add('pb');
      allowed.add('pe');
      if (profile.methods.includes('EV_EBITDA')) {
        allowed.add('evEbitda');
      }
    }
    if (allowed.has('cashProxy')) {
      allowed.add('cfo');
      allowed.add('capex');
    }
    if (!allowed.has(definition.key)) {
      rejected++;
      continue;
    }
    const b = fact.basis;
    const basis = JSON.stringify([
      fact.comparisonKey ?? fact.id,
      fact.unit,
      b.currency,
      b.scale,
      b.scope,
      b.attribution,
      b.accounting,
      b.purchasingPowerDate,
      b.periodKind,
      b.shareBasis,
      mode === 'HISTORY'
        ? report.presentation.assetId
        : report.context.businessModel,
      report.context.assetType,
      mode === 'HISTORY' ? b.start.slice(5) : b.start,
      mode === 'HISTORY' ? b.end.slice(5) : b.end,
    ]);
    const points = groups.get(basis) ?? [];
    if (points.some((p) => p.label === label)) {
      rejected++;
      continue;
    }
    points.push({
      label,
      fact,
      sourceUrl:
        report.presentation.sources.find((s) => s.id === fact.sourceId)?.url ??
        '',
    });
    groups.set(basis, points);
  }
  return {
    groups: [...groups].map(([basis, points]) => ({ basis, points })),
    rejected,
  };
}
