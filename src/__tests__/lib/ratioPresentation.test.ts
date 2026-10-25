import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { evaluateCalculation } from '@/lib/analysisValidation';
import { companyAssessment, overviewRatioIds } from '@/lib/companyAssessment';
import type { AssessmentReview } from '@/lib/companyAssessment';
import type { AnalysisReport, FinancialFact } from '@/domain/analysis';

const report = parseAnalysisReports(snapshots)[0];
describe('ratio display contract', () => {
  it.each([
    ['priceBook', '1.63', 'INDICATIVE'],
    ['peHalfYear', '14.93', 'INDICATIVE'],
    ['peRunRate', '7.46', 'SCENARIO'],
    ['marketCap', '744224799727.50', 'INDICATIVE'],
  ])('shows %s without promoting the strict result', (id, value, status) => {
    expect(ratioPresentation(report, id)).toMatchObject({ value, status });
    const calculation = report.calculations.find((c) => c.id === id);
    expect(calculation).toBeDefined();
    if (!calculation) {
      throw new Error('Missing calculation');
    }
    expect(evaluateCalculation(report, calculation).status).toBe('BLOCKED');
  });
  it('distinguishes actual TTM from half-year scenarios', () => {
    expect(ratioPresentation(report, 'peTtm').status).toBe('INDICATIVE');
    expect(ratioPresentation(report, 'peTtm').value).toBe('25.21');
    expect(ratioPresentation(report, 'peTtm').issues).toContain(
      'annualFallback',
    );
    expect(ratioPresentation(report, 'peRunRate').issues).toContain(
      'annualized',
    );
    expect(ratioPresentation(report, 'priceBook').issues).toContain(
      'purchasingPower',
    );
  });
  it.each([
    { currency: 'USD' },
    { scale: '1000' },
    { attribution: 'GROUP' as const },
    { start: 'invalid' },
    { end: '2027-06-30' },
    { periodKind: 'QUARTER' as const },
  ])('does not disguise an invalid denominator as indicative: %j', (patch) => {
    const changed = {
      ...report,
      facts: report.facts.map((f) =>
        f.id === 'profit' ? { ...f, basis: { ...f.basis, ...patch } } : f,
      ),
    };
    expect(ratioPresentation(changed, 'peHalfYear').value).toBeUndefined();
  });
  it('blocks conflicts, missing sources, duplicate facts and zero denominators', () => {
    for (const facts of [
      report.facts.filter((f) => f.id !== 'profit'),
      [...report.facts, report.facts[0]],
      report.facts.map((f) =>
        f.id === 'profit' ? { ...f, verification: 'CONFLICT' as const } : f,
      ),
      report.facts.map((f) => (f.id === 'profit' ? { ...f, value: '0' } : f)),
    ]) {
      expect(
        ratioPresentation({ ...report, facts }, 'peRunRate').value,
      ).toBeUndefined();
    }
    expect(
      ratioPresentation(
        { ...report, presentation: { ...report.presentation, sources: [] } },
        'priceBook',
      ).value,
    ).toBeUndefined();
  });
  it('rejects a share-basis mismatch and altered formulas', () => {
    const changed = {
      ...report,
      facts: report.facts.map((f) =>
        f.id === 'shares'
          ? { ...f, basis: { ...f.basis, shareBasis: 'before-split' } }
          : f,
      ),
    };
    expect(ratioPresentation(changed, 'priceBook').value).toBeUndefined();
    expect(
      ratioPresentation(
        {
          ...report,
          calculations: report.calculations.map((c) =>
            c.id === 'priceBook' ? { ...c, operation: 'SUM' as const } : c,
          ),
        },
        'priceBook',
      ).value,
    ).toBeUndefined();
  });
  it('preserves verified operating arithmetic and strategy invariance', () => {
    expect(ratioPresentation(report, 'cashProxy')).toMatchObject({
      status: 'VERIFIED',
      value: '120508319000',
    });
    for (const id of overviewRatioIds(report)) {
      expect(
        ratioPresentation(
          { ...report, context: { ...report.context, strategies: ['GROWTH'] } },
          id,
        ),
      ).toEqual(ratioPresentation(report, id));
    }
  });
  it('keeps the price verdict uncertain and shared inputs unique', () => {
    const result = companyAssessment(report);
    expect(result.classification).toBe('UNCERTAIN');
    expect(result.missing).toEqual(
      expect.arrayContaining(['history', 'peers', 'sustainability']),
    );
    expect(new Set(result.evidenceIds).size).toBe(result.evidenceIds.length);
    expect(result.findings.map((f) => f.key)).toContain('cyclical');
  });
  it('does not force industrial ratios onto banks, REITs or crypto', () => {
    for (const businessModel of ['BANK', 'REIT']) {
      const changed = {
        ...report,
        context: { ...report.context, businessModel },
      };
      expect(overviewRatioIds(changed)).not.toContain('netDebtEbitda');
      expect(
        companyAssessment(changed).findings.some((f) =>
          f.key.startsWith('debt.'),
        ),
      ).toBe(false);
    }
    expect(
      overviewRatioIds({
        ...report,
        context: { ...report.context, assetType: 'CRYPTO' },
      }),
    ).toEqual([]);
  });
});

function fixtureFact(id: string, value: string, year: string): FinancialFact {
  const source = report.facts.find((f) => f.id === 'parentEquity');
  if (!source?.evidence) {
    throw new Error('Missing evidence fixture');
  }
  return {
    ...source,
    id,
    value,
    unit: 'MULTIPLE',
    metricKey: id === 'priceBook' ? 'pb' : undefined,
    basis: {
      ...source.basis,
      accounting: 'IFRS',
      purchasingPowerDate: null,
      start: `${year}-06-30`,
      end: `${year}-06-30`,
    },
    evidence: {
      ...source.evidence,
      id: `${id}-${year}`,
      claims: [id],
      from: `${year}-06-30`,
      to: `${year}-06-30`,
      purchasingPowerDate: null,
    },
  };
}
function bankFixture(id: string, value: string, year: string): AnalysisReport {
  return {
    ...report,
    version: id,
    context: { assetType: 'EQUITY', businessModel: 'BANK', strategies: [] },
    facts: ['priceBook', 'sustainableRoe', 'capitalAdequacy', 'npl'].map(
      (key) => fixtureFact(key, key === 'priceBook' ? value : '2', year),
    ),
    calculations: [],
    contracts: [],
    presentation: {
      ...report.presentation,
      assetId: id.startsWith('history') ? 'subject' : id,
    },
  };
}
describe('sector-relative classification gates', () => {
  it('computes actual TTM from four compatible quarters and blocks mixed purchasing-power bases', () => {
    const periods = [
      ['2025-07-01', '2025-09-30'],
      ['2025-10-01', '2025-12-31'],
      ['2026-01-01', '2026-03-31'],
      ['2026-04-01', '2026-06-30'],
    ];
    const quarters: FinancialFact[] = periods.map(([start, end], i) => {
      const fact = fixtureFact(`q${i}`, '1000000000', '2026');
      if (!fact.evidence) {
        throw new Error('Missing evidence');
      }
      return {
        ...fact,
        unit: 'TRY',
        metricKey: 'profit',
        basis: { ...fact.basis, start, end, periodKind: 'QUARTER' },
        evidence: { ...fact.evidence, from: start, to: end },
      };
    });
    expect(
      ratioPresentation(
        { ...report, facts: [...report.facts, ...quarters] },
        'peTtm',
      ),
    ).toMatchObject({ value: '186.06', status: 'INDICATIVE' });
    const changed = quarters.map((q, i) =>
      i === 0
        ? {
            ...q,
            basis: {
              ...q.basis,
              accounting: 'TAS29' as const,
              purchasingPowerDate: '2025-09-30',
            },
          }
        : q,
    );
    expect(
      ratioPresentation(
        { ...report, facts: [...report.facts, ...changed] },
        'peTtm',
      ).periodBasis,
    ).toBe('ANNUAL');
  });
  it.each([
    ['1', 'CHEAP'],
    ['3', 'FAIR'],
    ['5', 'EXPENSIVE'],
  ])(
    'uses comparable ranges, not a universal threshold: %s',
    (value, expected) => {
      const current = bankFixture('subject', value, '2026');
      const candidate = (
        r: AnalysisReport,
      ): { label: string; report: AnalysisReport; factId: string } => ({
        label: r.version,
        report: r,
        factId: 'priceBook',
      });
      const history = [
        current,
        bankFixture('history1', '2', '2024'),
        bankFixture('history2', '4', '2025'),
      ].map(candidate);
      const peers = [
        current,
        bankFixture('peer1', '2', '2026'),
        bankFixture('peer2', '4', '2026'),
      ].map(candidate);
      const source = current.facts[0].evidence;
      if (!source) {
        throw new Error('Missing fixture evidence');
      }
      const topics: AssessmentReview['topic'][] = [
        'earningsQuality',
        'oneOffs',
        'cashQuality',
        'cycle',
        'inflation',
        'dividend',
      ];
      const reviews: AssessmentReview[] = topics.map((topic) => ({
        topic,
        reportVersion: current.version,
        conclusion: 'SUPPORTED',
        inputIds: ['sustainableRoe'],
        evidence: { ...source, claims: [topic] },
      }));
      expect(
        companyAssessment(current, history, peers, reviews).classification,
      ).toBe(expected);
      expect(companyAssessment(current, history, peers).classification).toBe(
        'UNCERTAIN',
      );
      expect(
        companyAssessment(current, history, [], reviews).classification,
      ).toBe('UNCERTAIN');
    },
  );
});
