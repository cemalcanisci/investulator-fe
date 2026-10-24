import type { AnalysisReport } from '@/domain/analysis';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';
import { ratioPresentation } from '@/lib/ratioPresentation';
import type { RatioPresentation } from '@/lib/ratioPresentation';
import { getSign, compareDecimals } from '@/lib/decimal';
import { researchComparison } from '@/lib/researchComparison';
import type { ComparisonCandidate } from '@/lib/researchComparison';
import type { SourceEvidence } from '@/domain/evidence';
import { validEvidence } from '@/lib/sourceEvidence';

export interface AssessmentReview {
  readonly topic:
    | 'earningsQuality'
    | 'oneOffs'
    | 'cashQuality'
    | 'cycle'
    | 'inflation'
    | 'dividend';
  readonly reportVersion: string;
  readonly conclusion: 'SUPPORTED' | 'ADVERSE' | 'UNCERTAIN';
  readonly inputIds: readonly string[];
  readonly evidence: SourceEvidence;
}

export interface CompanyFinding {
  readonly key: string;
  readonly metricIds: readonly string[];
  readonly inputIds: readonly string[];
  readonly tone: 'OBSERVATION' | 'LIMITATION';
}
export interface CompanyAssessment {
  readonly classification: 'CHEAP' | 'FAIR' | 'EXPENSIVE' | 'UNCERTAIN';
  readonly findings: readonly CompanyFinding[];
  readonly missing: readonly string[];
  readonly evidenceIds: readonly string[];
}
interface AssessmentPolicy {
  readonly ratio: string;
  readonly required: readonly string[];
}
const POLICIES: Readonly<Record<string, AssessmentPolicy>> = {
  REFINING: {
    ratio: 'evEbitda',
    required: [
      'normalizedEbitda',
      'netFinancialDebt',
      'cashProxy',
      'profitGrowth',
      'nrm',
      'inventoryEffect',
    ],
  },
  AUTOMOTIVE: {
    ratio: 'evEbitda',
    required: [
      'normalizedEbitda',
      'netFinancialDebt',
      'cashProxy',
      'profitGrowth',
      'capacityUtilization',
    ],
  },
  INDUSTRIAL: {
    ratio: 'evEbitda',
    required: [
      'normalizedEbitda',
      'netFinancialDebt',
      'cashProxy',
      'profitGrowth',
    ],
  },
  BANK: {
    ratio: 'priceBook',
    required: ['sustainableRoe', 'capitalAdequacy', 'npl'],
  },
  BROKER: {
    ratio: 'priceBook',
    required: ['sustainableRoe', 'commissionIncome'],
  },
  REIT: {
    ratio: 'priceNav',
    required: ['netAssetValue', 'occupancy', 'rentalIncome'],
  },
  TECHNOLOGY: {
    ratio: 'evFcf',
    required: ['normalizedFcf', 'revenueGrowth', 'operatingMargin'],
  },
};

export function overviewRatioIds(
  report: AnalysisReport | undefined,
): readonly string[] {
  if (!report || report.context.assetType !== 'EQUITY') {
    return [];
  }
  const profile = selectAnalysisProfile(report.context);
  if (profile.id === 'UNSUPPORTED') {
    return [];
  }
  if (profile.id === 'REIT') {
    return ['marketCap', 'priceNav', 'netAssetValue'];
  }
  return [
    'marketCap',
    'peTtm',
    'priceBook',
    ...(profile.methods.includes('EV_EBITDA')
      ? ['peHalfYear', 'peRunRate', 'evEbitda', 'netDebtEbitda']
      : []),
    'roe',
    ...profile.financials.filter((id) =>
      ['operatingMargin', 'cashProxy'].includes(id),
    ),
    'dividendYield',
  ];
}

/** No score or vote: related metrics retain shared input IDs instead of multiplying evidence. */
export function companyAssessment(
  report: AnalysisReport | undefined,
  history: readonly ComparisonCandidate[] = [],
  peers: readonly ComparisonCandidate[] = [],
  reviews: readonly AssessmentReview[] = [],
): CompanyAssessment {
  if (!report) {
    return {
      classification: 'UNCERTAIN',
      findings: [],
      missing: ['report'],
      evidenceIds: [],
    };
  }
  const profile = selectAnalysisProfile(report.context);
  const policy = POLICIES[profile.id];
  const findings: CompanyFinding[] = [];
  function add(
    key: string,
    ids: readonly string[],
    tone: CompanyFinding['tone'] = 'OBSERVATION',
  ): void {
    findings.push({
      key,
      metricIds: ids,
      inputIds: [
        ...new Set(
          ids.flatMap((id) =>
            ratioPresentation(report, id).inputs.map((f) => f.id),
          ),
        ),
      ],
      tone,
    });
  }
  const growth = ratioPresentation(report, 'profitGrowth');
  if (growth.status === 'VERIFIED' && growth.value !== undefined) {
    add(`growth.${getSign(growth.value)}`, ['profitGrowth']);
  }
  const debt = ratioPresentation(report, 'netFinancialDebt');
  if (
    profile.methods.includes('EV_EBITDA') &&
    debt.status === 'VERIFIED' &&
    debt.value !== undefined
  ) {
    add(`debt.${getSign(debt.value)}`, ['netFinancialDebt']);
  }
  const cash = ratioPresentation(report, 'cashProxy');
  const profit = ratioPresentation(report, 'profit');
  const profitBasis = profit.inputs[0]?.basis;
  const cashBasis = cash.inputs[0]?.basis;
  if (
    profit.status === 'VERIFIED' &&
    cash.status === 'VERIFIED' &&
    profit.value !== undefined &&
    cash.value !== undefined &&
    profitBasis &&
    cashBasis &&
    (
      [
        'currency',
        'scale',
        'scope',
        'accounting',
        'purchasingPowerDate',
        'start',
        'end',
      ] as const
    ).every((key) => profitBasis[key] === cashBasis[key])
  ) {
    if (
      getSign(profit.value) === 'positive' &&
      getSign(cash.value) === 'negative'
    ) {
      add('profitWithoutCash', ['profit', 'cashProxy'], 'LIMITATION');
    } else if (
      getSign(profit.value) === 'positive' &&
      getSign(cash.value) === 'positive'
    ) {
      add('profitWithCash', ['profit', 'cashProxy', 'workingCapitalCash']);
    }
  }
  if (
    profile.financials.includes('cashProxy') &&
    !findings.some((f) =>
      ['profitWithCash', 'profitWithoutCash'].includes(f.key),
    ) &&
    cash.status === 'VERIFIED' &&
    cash.value !== undefined
  ) {
    add(`cash.${getSign(cash.value)}`, ['cashProxy', 'workingCapitalCash']);
  }
  const coverage = report.calculations.find((c) => c.metricKey === 'coverage');
  if (
    coverage &&
    ratioPresentation(report, coverage.id).status === 'VERIFIED'
  ) {
    add('dividendCoverage', [coverage.id]);
  }
  if (profile.id === 'REFINING') {
    add('cyclical', ['nrm', 'peRunRate'], 'LIMITATION');
  }
  const missing = ['history', 'peers', 'sustainability'];
  if (!policy) {
    missing.push('sector');
  }
  // Comparisons must include this asset and at least two distinct observations on one verified basis.
  function benchmark(
    candidates: readonly ComparisonCandidate[],
    mode: 'HISTORY' | 'PEERS',
    current: RatioPresentation,
  ): 'CHEAP' | 'FAIR' | 'EXPENSIVE' | undefined {
    if (
      !policy ||
      current.status !== 'VERIFIED' ||
      current.value === undefined
    ) {
      return undefined;
    }
    const eligible = candidates.filter((c) => c.factId === policy.ratio);
    const groups = researchComparison(eligible, mode).groups;
    const group = groups.find((g) =>
      g.points.some(
        (p) =>
          p.fact.id === policy.ratio &&
          p.fact.value === current.value &&
          eligible.some(
            (c) => c.report.version === report?.version && c.label === p.label,
          ),
      ),
    );
    if (!group || group.points.length < 3) {
      return undefined;
    }
    const others = group.points.filter(
      (p) =>
        !eligible.some(
          (c) => c.report.version === report?.version && c.label === p.label,
        ),
    );
    if (others.length < 2) {
      return undefined;
    }
    const observations = eligible.filter((c) =>
      others.some((p) => p.label === c.label),
    );
    if (
      new Set(
        observations.map((c) =>
          mode === 'PEERS'
            ? c.report.presentation.assetId
            : c.report.facts.find((f) => f.id === c.factId)?.basis.end,
        ),
      ).size < 2
    ) {
      return undefined;
    }
    const ordered = others.map((p) => p.fact.value).sort(compareDecimals);
    if (compareDecimals(current.value, ordered[0]) < 0) {
      return 'CHEAP';
    }
    if (compareDecimals(current.value, ordered[ordered.length - 1]) > 0) {
      return 'EXPENSIVE';
    }
    return 'FAIR';
  }
  const current = ratioPresentation(report, policy?.ratio ?? '');
  const historical = benchmark(history, 'HISTORY', current),
    peer = benchmark(peers, 'PEERS', current);
  if (historical) {
    missing.splice(missing.indexOf('history'), 1);
  }
  if (peer) {
    missing.splice(missing.indexOf('peers'), 1);
  }
  const ready =
    policy &&
    policy.required.every(
      (id) => ratioPresentation(report, id).status === 'VERIFIED',
    );
  // Presence of figures alone cannot prove normalization, one-offs or sustainable distributions.
  const topics = [
    'earningsQuality',
    'oneOffs',
    'cashQuality',
    'cycle',
    'inflation',
    'dividend',
  ];
  const reviewed = topics.every(
    (topic) =>
      reviews.filter((review) => review.topic === topic).length === 1 &&
      reviews.some(
        (review) =>
          review.topic === topic &&
          review.reportVersion === report.version &&
          review.conclusion === 'SUPPORTED' &&
          validEvidence(review.evidence) &&
          review.evidence.claims.includes(topic) &&
          report.presentation.sources.some(
            (s) => s.id === review.evidence.sourceId,
          ) &&
          review.inputIds.length > 0 &&
          review.inputIds.every(
            (id) => ratioPresentation(report, id).status === 'VERIFIED',
          ),
      ),
  );
  if (ready && reviewed) {
    missing.splice(missing.indexOf('sustainability'), 1);
  }
  for (const id of policy?.required ?? []) {
    if (ratioPresentation(report, id).status !== 'VERIFIED') {
      missing.push(id);
    }
  }
  const classification =
    missing.length === 0 && historical === peer && historical
      ? historical
      : 'UNCERTAIN';
  return {
    classification,
    findings,
    missing,
    evidenceIds: [...new Set(findings.flatMap((f) => f.inputIds))],
  };
}

export function relatedMetricIds(
  id: string,
  report?: AnalysisReport,
): readonly string[] {
  const relations: Readonly<Record<string, readonly string[]>> = {
    peTtm: ['profitGrowth', 'cashProxy'],
    peHalfYear: ['profitGrowth', 'cashProxy'],
    peRunRate: ['profitGrowth', 'nrm'],
    priceBook: ['roe', 'netFinancialDebt'],
    evEbitda: ['netDebtEbitda', 'cashProxy'],
    netDebtEbitda: ['cashProxy', 'operatingMargin'],
    roe: ['priceBook', 'profitGrowth'],
    operatingMargin: ['revenueGrowth', 'cashProxy'],
    cashProxy: ['workingCapitalCash', 'capex'],
    dividendYield: [
      ...(report?.calculations
        .filter((c) => c.metricKey === 'coverage')
        .map((c) => c.id) ?? []),
      'cashProxy',
    ],
  };
  return relations[id] ?? [];
}
