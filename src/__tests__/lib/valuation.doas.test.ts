import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/doas-analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import {
  VALUATION_METHODS,
  reportValuationScenarios,
  scenarioUpsidePercent,
} from '@/lib/valuation';

describe('DOAS EV/EBITDA BEAR/BASE/BULL scenarios (highest revision)', () => {
  const reports = parseAnalysisReports(snapshots);
  const latest = reports.reduce((best, r) =>
    (r.revision ?? 0) > (best.revision ?? 0) ? r : best,
  );
  const method = VALUATION_METHODS.find((m) => m.id === 'EV_EBITDA');
  if (!method) {
    throw new Error('EV_EBITDA method missing');
  }

  it('picks the highest-revision report (doas-2026-11-03-v4, revision 4)', () => {
    expect(latest.version).toBe('doas-2026-11-03-v4');
    expect(latest.revision).toBe(4);
  });

  it('computes PASS fair values for all three cases from sourced retail-sector peer multiples', () => {
    const results = reportValuationScenarios(latest, method);
    expect(results).not.toBeNull();
    const byCase = Object.fromEntries(
      (results ?? []).map((r) => [r.case, r.result]),
    );
    expect(byCase.BEAR?.status).toBe('PASS');
    expect(byCase.BASE?.status).toBe('PASS');
    expect(byCase.BULL?.status).toBe('PASS');
    expect(byCase.BEAR?.issues).toEqual([]);
    expect(byCase.BASE?.issues).toEqual([]);
    expect(byCase.BULL?.issues).toEqual([]);

    // (fyEbitda2025 14,864,838,000 × peer multiple − fyNetFinancialDebt2025 25,184,576,000) / sharesFy2025End 220,000,000
    // Independently verified with the project's own BigInt decimal math (lib/decimal.ts semantics,
    // not float math): node -e computed BEAR=37201, BASE=41255, BULL=54769 (value × 100).
    expect(byCase.BEAR?.value).toBe('372.01'); // × 7.2 (Siblis Research retail sector, Europe median)
    expect(byCase.BASE?.value).toBe('412.55'); // × 7.8 (Siblis Research retail sector, worldwide median)
    expect(byCase.BULL?.value).toBe('547.69'); // × 9.8 (Siblis Research retail sector, Emerging Asia median)

    expect(Number(byCase.BEAR?.value)).toBeLessThan(Number(byCase.BASE?.value));
    expect(Number(byCase.BASE?.value)).toBeLessThan(Number(byCase.BULL?.value));
  });

  it('derives potential upside vs. the market price (134.30 TRY) for each case', () => {
    const results = reportValuationScenarios(latest, method);
    const byCase = Object.fromEntries(
      (results ?? []).map((r) => [r.case, r.result]),
    );
    const priceFact = latest.facts.find((f) => f.id === 'price');
    expect(priceFact?.value).toBe('134.30');
    expect(scenarioUpsidePercent(byCase.BEAR?.value, priceFact?.value)).toBe(
      '177.0',
    );
    expect(scenarioUpsidePercent(byCase.BASE?.value, priceFact?.value)).toBe(
      '207.2',
    );
    expect(scenarioUpsidePercent(byCase.BULL?.value, priceFact?.value)).toBe(
      '307.8',
    );
  });

  it('uses FY2025-end inputs (flow/stock basis), not the current H1 2026 shares/debt facts', () => {
    const set = latest.valuationScenarios?.find(
      (s) => s.methodId === 'EV_EBITDA',
    );
    expect(set).toBeDefined();
    const bear = set?.cases.find((c) => c.case === 'BEAR');
    expect(bear?.idMap).toEqual({
      normalizedEbitda: 'fyEbitda2025',
      valuationNetDebt: 'fyNetFinancialDebt2025',
      shares: 'sharesFy2025End',
      peerEvEbitda: 'peerEvEbitdaBear',
    });
    expect(bear?.scenario.stockAt).toBe('2025-12-31');
    expect(bear?.scenario.flowStart).toBe('2025-01-01');
    expect(bear?.scenario.flowEnd).toBe('2025-12-31');
  });
});
