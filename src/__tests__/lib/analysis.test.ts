import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import { evaluateCalculation } from '@/lib/analysisValidation';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';
import { AnalysisRepository, compareReports } from '@/lib/analysisRepository';
import { evaluateValuation, VALUATION_METHODS } from '@/lib/valuation';

const report = parseAnalysisReports(snapshots)[0];
function namedCalculation(id: string): (typeof report.calculations)[number] {
  const found = report.calculations.find((c) => c.id === id);
  if (!found) {
    throw new Error('Missing calculation fixture');
  }
  return found;
}
const calculation = namedCalculation('currentRatio');
describe('analysis contracts', () => {
  it('preserves verified arithmetic and blocks unverified market inputs', () => {
    expect(evaluateCalculation(report, calculation)).toMatchObject({
      status: 'PASS',
      value: '1.35',
    });
    expect(
      evaluateCalculation(report, namedCalculation('peRunRate')).status,
    ).toBe('BLOCKED');
    expect(
      evaluateCalculation(report, namedCalculation('cashProxy')).value,
    ).toBe('120508319000');
  });
  it.each([
    { currency: 'USD' },
    { scale: '1000' },
    { scope: 'SOLO' as const },
    { accounting: 'NOMINAL' as const },
    { purchasingPowerDate: '2025-12-31' },
    { end: '2025-12-31' },
    { attribution: 'PARENT' as const },
  ])('rejects incompatible basis %j', (patch) => {
    const changed = {
      ...report,
      facts: report.facts.map((f) =>
        f.id === 'currentLiabilities'
          ? { ...f, basis: { ...f.basis, ...patch } }
          : f,
      ),
    };
    expect(evaluateCalculation(changed, calculation).status).toBe('BLOCKED');
  });
  it('rejects missing facts, source conflicts, invalid units, zero denominator and duplicates', () => {
    const changes = [
      report.facts.filter((f) => f.id !== 'currentLiabilities'),
      report.facts.map((f) =>
        f.id === 'currentLiabilities'
          ? { ...f, verification: 'CONFLICT' as const }
          : f,
      ),
      report.facts.map((f) =>
        f.id === 'currentLiabilities'
          ? { ...f, unit: 'USD_BARREL' as const }
          : f,
      ),
      report.facts.map((f) =>
        f.id === 'currentLiabilities' ? { ...f, value: '0' } : f,
      ),
      [...report.facts, report.facts[0]],
    ];
    for (const facts of changes) {
      expect(
        evaluateCalculation({ ...report, facts }, calculation).status,
      ).toBe('BLOCKED');
    }
  });
  it('selects by business model and does not change financial facts by strategy', () => {
    expect(
      selectAnalysisProfile({ ...report.context, businessModel: 'BANK' })
        .methods,
    ).not.toContain('EV_EBITDA');
    expect(
      selectAnalysisProfile({ ...report.context, businessModel: 'REIT' })
        .methods,
    ).toEqual(['NAV']);
    expect(
      selectAnalysisProfile({ ...report.context, assetType: 'CRYPTO' })
        .dividend,
    ).toEqual([]);
    expect(
      selectAnalysisProfile({ ...report.context, strategies: ['GROWTH'] })
        .financials,
    ).toEqual(selectAnalysisProfile(report.context).financials);
    expect(evaluateValuation(report, VALUATION_METHODS[0])).toMatchObject({
      status: 'BLOCKED',
    });
  });
  it('retains immutable reports after refresh failure and distinguishes evidence changes', () => {
    const repository = new AnalysisRepository([report]);
    repository.failedRefresh(report.presentation.assetId, '2026-10-22');
    expect(repository.list(report.presentation.assetId)[0]).toEqual(report);
    expect(repository.list(report.presentation.assetId)[0]).not.toBe(report);
    const changed = {
      ...report,
      facts: report.facts.map((f) => ({ ...f, checkedAt: '2026-10-22' })),
    };
    expect(
      compareReports(report, changed).every((d) => d.kind === 'EVIDENCE'),
    ).toBe(true);
    expect(() =>
      parseAnalysisReports([{ ...report, facts: [{ id: 'bad' }] }]),
    ).toThrow('Invalid analysis schema');
  });
});
