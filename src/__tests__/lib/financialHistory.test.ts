import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import { evaluateCalculation } from '@/lib/analysisValidation';
import { researchSectionOrder } from '@/lib/analysisPriorities';
import { AnalysisRepository } from '@/lib/analysisRepository';

const report = parseAnalysisReports(snapshots)[0];
describe('source-based financial history', () => {
  it('uses explicit revisions instead of a future-dated collection timestamp', () => {
    const older = {
      ...report,
      revision: 1,
      presentation: {
        ...report.presentation,
        id: 'older',
        retrievedAt: '2099-01-01T00:00:00Z',
      },
    };
    const newer = {
      ...report,
      revision: 2,
      presentation: {
        ...report.presentation,
        id: 'newer',
        retrievedAt: '2026-10-22T00:00:00Z',
      },
    };
    expect(
      new AnalysisRepository([older, newer]).list(
        report.presentation.assetId,
      )[0]?.presentation.id,
    ).toBe('newer');
    expect(() => parseAnalysisReports([{ ...report, revision: -1 }])).toThrow(
      'Invalid analysis schema',
    );
  });
  it('keeps five source bases without manufacturing a common-base trend', () => {
    expect(report.financialHistory?.map((r) => r.year)).toEqual([
      '2021',
      '2022',
      '2023',
      '2024',
      '2025',
    ]);
    expect(report.facts.find((f) => f.id === 'revenue2021')?.sourceId).toBe(
      'annual2022',
    );
    expect(
      report.facts.find((f) => f.id === 'revenue2023')?.basis
        .purchasingPowerDate,
    ).toBe('2023-12-31');
    expect(
      report.facts.find((f) => f.id === 'revenue2024')?.basis
        .purchasingPowerDate,
    ).toBe('2024-12-31');
  });
  it('uses restated comparatives and blocks mixing different purchasing powers', () => {
    const calculation = report.calculations.find(
      (c) => c.id === 'revenue2025Growth',
    );
    if (!calculation) {
      throw new Error('Missing history calculation');
    }
    expect(evaluateCalculation(report, calculation)).toMatchObject({
      status: 'PASS',
      value: '-21.72',
    });
    expect(
      evaluateCalculation(report, {
        ...calculation,
        inputs: ['revenue2025', 'revenue2024'],
      }).status,
    ).toBe('BLOCKED');
    const cash = report.calculations.find((c) => c.id === 'cashProxy2025');
    if (!cash) {
      throw new Error('Missing cash calculation');
    }
    expect(evaluateCalculation(report, cash)).toMatchObject({
      status: 'PASS',
      value: '30346395000',
    });
  });
  it('changes section order without changing calculations or source facts', () => {
    const before = JSON.stringify(report);
    expect(
      researchSectionOrder({ ...report.context, strategies: ['VALUE'] }).slice(
        0,
        2,
      ),
    ).toEqual(['overview', 'valuation']);
    expect(
      researchSectionOrder({
        ...report.context,
        strategies: ['DIVIDEND'],
      }).slice(0, 2),
    ).toEqual(['overview', 'dividend']);
    expect(new Set(researchSectionOrder(report.context)).size).toBe(9);
    expect(JSON.stringify(report)).toBe(before);
  });
  it('rejects malformed optional history', () => {
    expect(() =>
      parseAnalysisReports([
        {
          ...report,
          financialHistory: [{ year: '2025', factIds: 42, calculationIds: [] }],
        },
      ]),
    ).toThrow('Invalid analysis schema');
  });
});
