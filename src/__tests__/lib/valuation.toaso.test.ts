import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/toaso-analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import {
  VALUATION_METHODS,
  reportValuationScenarios,
  scenarioUpsidePercent,
} from '@/lib/valuation';

describe('TOASO EV/EBITDA BEAR/BASE/BULL scenarios (highest revision)', () => {
  const reports = parseAnalysisReports(snapshots);
  const latest = reports.reduce((best, r) =>
    (r.revision ?? 0) > (best.revision ?? 0) ? r : best,
  );
  const method = VALUATION_METHODS.find((m) => m.id === 'EV_EBITDA');
  if (!method) {
    throw new Error('EV_EBITDA method missing');
  }

  it('picks the highest-revision report (toaso-2026-11-03-v4, revision 4)', () => {
    expect(latest.version).toBe('toaso-2026-11-03-v4');
    expect(latest.revision).toBe(4);
  });

  it('computes PASS fair values for all three cases from sourced peer multiples', () => {
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

    // (ebitdaFy2025 10,000,000,000 × peer multiple − netFinancialDebtFy2025End 33,701,681,000) /
    // sharesFy2025End 500,000,000 — verified independently with the project's exact BigInt
    // decimal math (lib/decimal.ts), not float math.
    expect(byCase.BEAR?.value).toBe('58.60'); // × 6.3 (Siblis Research, Europe regional median)
    expect(byCase.BASE?.value).toBe('102.60'); // × 8.5 (Siblis Research, worldwide median)
    expect(byCase.BULL?.value).toBe('168.60'); // × 11.8 (Siblis Research, Emerging Asia median)

    expect(Number(byCase.BEAR?.value)).toBeLessThan(Number(byCase.BASE?.value));
    expect(Number(byCase.BASE?.value)).toBeLessThan(Number(byCase.BULL?.value));
  });

  it('derives potential upside vs. the market price (211.20 TRY) for each case', () => {
    const results = reportValuationScenarios(latest, method);
    const byCase = Object.fromEntries(
      (results ?? []).map((r) => [r.case, r.result]),
    );
    const priceFact = latest.facts.find((f) => f.id === 'price');
    expect(priceFact?.value).toBe('211.20');
    expect(scenarioUpsidePercent(byCase.BEAR?.value, priceFact?.value)).toBe(
      '-72.3',
    );
    expect(scenarioUpsidePercent(byCase.BASE?.value, priceFact?.value)).toBe(
      '-51.4',
    );
    expect(scenarioUpsidePercent(byCase.BULL?.value, priceFact?.value)).toBe(
      '-20.2',
    );
  });
});
