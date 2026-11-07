import { describe, expect, it } from 'vitest';
import type { AnalysisReport, FinancialFact } from '@/domain/analysis';
import type { SourceEvidence } from '@/domain/evidence';
import type { ValuationScenario } from '@/lib/valuationBasis';
import snapshots from '@/data/research/analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import {
  VALUATION_METHODS,
  evaluateValuationScenarios,
  scenarioMethod,
} from '@/lib/valuation';

const latest = parseAnalysisReports(snapshots)[0];
const SOURCE_ID = latest.presentation.sources[0]?.id ?? 'financials';

function evidenceFor(
  id: string,
  from: string,
  to: string,
  publishedAt = '2026-01-01',
): SourceEvidence {
  return {
    id: `ev-${id}`,
    sourceId: SOURCE_ID,
    originId: 'issuer',
    collectionId: 'synthetic-run',
    reviewerId: 'researcher',
    ancestorIds: [],
    documentUrl: 'https://example.invalid',
    locator: 'p1',
    excerpt: 'Synthetic',
    checkedAt: '2026-03-01',
    publishedAt,
    method: 'DOCUMENT_RECONCILIATION',
    claims: [id],
    from,
    to,
    purchasingPowerDate: null,
  };
}

function flowFact(
  id: string,
  value: string,
  unit: FinancialFact['unit'],
): FinancialFact {
  return {
    id,
    value,
    unit,
    period: '2025',
    sourceId: SOURCE_ID,
    verification: 'VERIFIED',
    checkedAt: '2026-03-01',
    locator: 'Synthetic statement',
    basis: {
      currency: 'TRY',
      scale: '1',
      scope: 'CONSOLIDATED',
      attribution: 'GROUP',
      accounting: 'NOMINAL',
      purchasingPowerDate: null,
      start: '2025-01-01',
      end: '2025-12-31',
      periodKind: 'YEAR',
      shareBasis: null,
    },
    evidence: evidenceFor(id, '2025-01-01', '2025-12-31'),
  };
}

function instantFact(
  id: string,
  value: string,
  unit: FinancialFact['unit'],
  at: string,
  shareBasis: string | null = null,
): FinancialFact {
  return {
    id,
    value,
    unit,
    period: at,
    sourceId: SOURCE_ID,
    verification: 'VERIFIED',
    checkedAt: '2026-03-01',
    locator: 'Synthetic statement',
    basis: {
      currency: unit.startsWith('TRY') ? 'TRY' : 'TRY',
      scale: '1',
      scope: unit === 'MULTIPLE' ? 'MARKET' : 'CONSOLIDATED',
      attribution: 'GROUP',
      accounting: 'NOMINAL',
      purchasingPowerDate: null,
      start: at,
      end: at,
      periodKind: 'INSTANT',
      shareBasis,
    },
    evidence: evidenceFor(id, at, at),
  };
}

describe('implemented valuation methods compute real decimal results', () => {
  it('FCF: ((FCF - plan) × (100+g) / (r-g)) / shares', () => {
    const method = VALUATION_METHODS.find((m) => m.id === 'FCF');
    expect(method?.calculate).toBeDefined();
    expect(
      method?.calculate?.({
        normalizedFcf: '1000',
        investmentPlan: '200',
        discountRate: '15',
        terminalGrowth: '5',
        shares: '100',
      }),
    ).toBe('84.00');
  });

  it('BOOK_ROE: (equity/shares) × (ROE/Ke)', () => {
    const method = VALUATION_METHODS.find((m) => m.id === 'BOOK_ROE');
    expect(
      method?.calculate?.({
        parentEquity: '100000',
        shares: '1000',
        sustainableRoe: '20',
        costOfEquity: '25',
        capitalAdequacy: '12',
      }),
    ).toBe('80.00');
  });

  it('NAV: netAssetValue / shares', () => {
    const method = VALUATION_METHODS.find((m) => m.id === 'NAV');
    expect(
      method?.calculate?.({ netAssetValue: '500000', shares: '10000' }),
    ).toBe('50.00');
  });
});

describe('scenarioMethod + evaluateValuationScenarios', () => {
  const baseMethod = VALUATION_METHODS.find((m) => m.id === 'EV_EBITDA');
  if (!baseMethod) {
    throw new Error('EV_EBITDA method missing');
  }
  const shared: readonly FinancialFact[] = [
    flowFact('normalizedEbitda', '10000000000', 'TRY'),
    instantFact('valuationNetDebt', '2000000000', 'TRY', '2025-12-31'),
    instantFact('shares', '1000000000', 'SHARES', '2025-12-31', 'current'),
  ];
  const multiples: Record<'BEAR' | 'BASE' | 'BULL', FinancialFact> = {
    BEAR: instantFact('peerEvEbitdaBear', '4', 'MULTIPLE', '2026-03-01'),
    BASE: instantFact('peerEvEbitdaBase', '6', 'MULTIPLE', '2026-03-01'),
    BULL: instantFact('peerEvEbitdaBull', '8', 'MULTIPLE', '2026-03-01'),
  };
  const report: AnalysisReport = {
    ...latest,
    context: { ...latest.context, businessModel: 'REFINING' },
    facts: [...shared, ...Object.values(multiples)],
  };

  function scenarioFor(
    testCase: 'BEAR' | 'BASE' | 'BULL',
    peerId: string,
  ): ValuationScenario {
    return {
      id: testCase,
      valuationAt: '2026-03-01',
      knowledgeAt: '2026-03-01',
      flowStart: '2025-01-01',
      flowEnd: '2025-12-31',
      stockAt: '2025-12-31',
      shareBasis: 'current',
      purchasingPowerDate: null,
      assumptions: [
        ...shared.map((f) => ({
          inputId: f.id,
          value: f.value,
          rationale: 'Son doğrulanmış yıllık veri; senaryolar arasında sabit.',
          evidence: evidenceFor(f.id, f.basis.start, f.basis.end),
        })),
        {
          inputId: peerId,
          value: multiples[testCase].value,
          rationale: `Sentetik ${testCase} emsal FD/FAVÖK varsayımı.`,
          evidence: evidenceFor(peerId, '2026-03-01', '2026-03-01'),
        },
      ],
    };
  }

  const cases = (['BEAR', 'BASE', 'BULL'] as const).map((testCase) => ({
    case: testCase,
    idMap: {
      peerEvEbitda: `peerEvEbitda${testCase[0]}${testCase.slice(1).toLowerCase()}`,
    },
    scenario: scenarioFor(
      testCase,
      `peerEvEbitda${testCase[0]}${testCase.slice(1).toLowerCase()}`,
    ),
  }));

  it('renames the varying input per case and keeps shared inputs untouched', () => {
    const renamed = scenarioMethod(baseMethod, {
      peerEvEbitda: 'peerEvEbitdaBear',
    });
    expect(renamed.required).toEqual([
      'normalizedEbitda',
      'peerEvEbitdaBear',
      'valuationNetDebt',
      'shares',
    ]);
  });

  it('computes distinct PASS fair values for bear/base/bull from the same actuals', () => {
    const results = evaluateValuationScenarios(report, baseMethod, cases);
    const byCase = Object.fromEntries(results.map((r) => [r.case, r.result]));
    expect(byCase.BEAR?.status).toBe('PASS');
    expect(byCase.BASE?.status).toBe('PASS');
    expect(byCase.BULL?.status).toBe('PASS');
    // (10,000,000,000 × multiple − 2,000,000,000) / 1,000,000,000
    expect(byCase.BEAR?.value).toBe('38.00');
    expect(byCase.BASE?.value).toBe('58.00');
    expect(byCase.BULL?.value).toBe('78.00');
    expect(Number(byCase.BEAR?.value)).toBeLessThan(Number(byCase.BASE?.value));
    expect(Number(byCase.BASE?.value)).toBeLessThan(Number(byCase.BULL?.value));
  });

  it('blocks a case when its sourced assumption is missing', () => {
    const incomplete = cases.map((c) =>
      c.case === 'BULL'
        ? { ...c, scenario: { ...c.scenario, assumptions: [] } }
        : c,
    );
    const results = evaluateValuationScenarios(report, baseMethod, incomplete);
    const bull = results.find((r) => r.case === 'BULL');
    expect(bull?.result.status).toBe('BLOCKED');
    expect(bull?.result.issues).toContain('ASSUMPTIONS');
  });

  it('round-trips a report carrying valuationScenarios through the schema parser', () => {
    const withScenarios = {
      ...report,
      valuationScenarios: [{ methodId: 'EV_EBITDA', cases }],
    };
    const [parsed] = parseAnalysisReports([withScenarios]);
    expect(parsed?.valuationScenarios?.[0]?.cases).toHaveLength(3);
  });
});
