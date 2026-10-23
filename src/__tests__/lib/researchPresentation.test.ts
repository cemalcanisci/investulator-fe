import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import { interpretMetric } from '@/lib/metricInterpretation';
import { researchComparison } from '@/lib/researchComparison';
import { metricDefinition } from '@/domain/metricEducation';

const report = parseAnalysisReports(snapshots)[0];
describe('research presentation rules', () => {
  it('explains validated growth without inventing a valuation or a result for missing data', () => {
    expect(interpretMetric(report, 'profitGrowth')).toMatchObject({
      key: 'growth.positive',
      value: '319.87',
    });
    expect(interpretMetric(report, 'peRunRate').key).toBe('missing');
    expect(interpretMetric(undefined, 'profitGrowth').key).toBe('missing');
    expect(interpretMetric(report, 'absent').key).toBe('missing');
    expect(metricDefinition('unknown')).toBeUndefined();
    expect(metricDefinition('income-new', 'revenue')?.key).toBe('revenue');
  });
  it('refuses ordinary growth interpretation on a negative base and respects sector rules', () => {
    const changed = {
      ...report,
      facts: report.facts.map((f) =>
        f.id === 'profitPrevious' ? { ...f, value: '-100' } : f,
      ),
    };
    expect(interpretMetric(changed, 'profitGrowth').key).toBe('growthBase');
    expect(
      interpretMetric(
        { ...report, context: { ...report.context, businessModel: 'BANK' } },
        'netFinancialDebt',
      ),
    ).toMatchObject({ key: 'context', sectorKey: 'BANK' });
    expect(interpretMetric(report, 'netFinancialDebt').key).toBe(
      'netDebt.negative',
    );
  });
  it('separates purchasing-power bases and never interpolates missing observations', () => {
    const candidates = [2021, 2022, 2023, 2024, 2025].map((year) => ({
      label: String(year),
      report,
      factId: `revenue${year}`,
    }));
    const result = researchComparison(candidates, 'HISTORY');
    expect(result.groups.map((g) => g.points.length)).toEqual([2, 1, 1, 1]);
    expect(
      researchComparison(
        [{ label: 'missing', report, factId: 'absent' }],
        'HISTORY',
      ),
    ).toEqual({ groups: [], rejected: 1 });
    const conflict = {
      ...report,
      facts: report.facts.map((f) =>
        f.id === 'revenue2021'
          ? { ...f, verification: 'CONFLICT' as const }
          : f,
      ),
    };
    expect(
      researchComparison(
        [{ label: '2021', report: conflict, factId: 'revenue2021' }],
        'HISTORY',
      ).rejected,
    ).toBe(1);
  });
  it('separates peer sectors, periods and metric definitions even when education categories match', () => {
    const first = { label: 'Example A', report, factId: 'cash' };
    const second = {
      label: 'Example B',
      report: {
        ...report,
        context: { ...report.context, businessModel: 'BANK' },
      },
      factId: 'cash',
    };
    expect(researchComparison([first, second], 'PEERS')).toMatchObject({
      rejected: 1,
    });
    expect(
      researchComparison(
        [
          { ...first, factId: 'parentEquity' },
          { ...second, factId: 'parentEquity' },
        ],
        'PEERS',
      ).groups,
    ).toHaveLength(2);
    expect(
      researchComparison(
        [
          first,
          { label: 'Investment', report, factId: 'financialInvestments' },
        ],
        'PEERS',
      ).groups,
    ).toHaveLength(2);
    const shifted = {
      ...report,
      facts: report.facts.map((f) =>
        f.id === 'cash'
          ? {
              ...f,
              basis: { ...f.basis, start: '2026-06-29', end: '2026-06-29' },
            }
          : f,
      ),
    };
    expect(
      researchComparison(
        [first, { label: 'Other date', report: shifted, factId: 'cash' }],
        'PEERS',
      ).rejected,
    ).toBe(1);
  });
  it('does not mutate facts or results when investment strategy changes', () => {
    const before = JSON.stringify(report);
    expect(
      interpretMetric(
        { ...report, context: { ...report.context, strategies: ['GROWTH'] } },
        'profitGrowth',
      ),
    ).toEqual(interpretMetric(report, 'profitGrowth'));
    expect(JSON.stringify(report)).toBe(before);
  });
});
