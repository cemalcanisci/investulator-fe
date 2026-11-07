// Historical arithmetic regression only; current financial acceptance is tested in valuationAudit.test.ts.
import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/froto-analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import {
  VALUATION_METHODS,
  reportValuationScenarios,
  scenarioUpsidePercent,
} from '@/lib/valuation';

describe('FROTO EV/EBITDA BEAR/BASE/BULL scenarios (pre-audit archive)', () => {
  const reports = parseAnalysisReports(snapshots).filter(
    (r) => !r.version.includes('valuation-audit'),
  );
  const latest = reports.reduce((best, r) =>
    (r.revision ?? 0) > (best.revision ?? 0) ? r : best,
  );
  const method = VALUATION_METHODS.find((m) => m.id === 'EV_EBITDA');
  if (!method) {
    throw new Error('EV_EBITDA method missing');
  }

  it('picks the pre-audit archived report (froto-2026-11-03-v4, revision 4)', () => {
    expect(latest.version).toBe('froto-2026-11-03-v4');
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

    // (ebitdaTtm 63,557,627,000 × peer multiple − netFinancialDebt 111,981,980,000) / shares 3,509,100,000
    // regression-checked with the project's exact BigInt decimal math (lib/decimal.ts), not float math.
    expect(byCase.BEAR?.value).toBe('109.18'); // × 7.79 (Volkswagen AG, TTM)
    expect(byCase.BASE?.value).toBe('136.89'); // × 9.32 (Renault SA, TTM)
    expect(byCase.BULL?.value).toBe('226.19'); // × 14.25 (Hyundai Motor, TTM)

    expect(Number(byCase.BEAR?.value)).toBeLessThan(Number(byCase.BASE?.value));
    expect(Number(byCase.BASE?.value)).toBeLessThan(Number(byCase.BULL?.value));
  });

  it('derives potential upside vs. the market price (69.20 TRY) for each case', () => {
    const results = reportValuationScenarios(latest, method);
    const byCase = Object.fromEntries(
      (results ?? []).map((r) => [r.case, r.result]),
    );
    const priceFact = latest.facts.find((f) => f.id === 'price');
    expect(priceFact?.value).toBe('69.20');
    expect(scenarioUpsidePercent(byCase.BEAR?.value, priceFact?.value)).toBe(
      '57.8',
    );
    expect(scenarioUpsidePercent(byCase.BASE?.value, priceFact?.value)).toBe(
      '97.8',
    );
    expect(scenarioUpsidePercent(byCase.BULL?.value, priceFact?.value)).toBe(
      '226.9',
    );
  });
});
