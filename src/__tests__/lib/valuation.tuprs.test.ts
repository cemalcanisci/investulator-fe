// Historical arithmetic regression only; current financial acceptance is tested in valuationAudit.test.ts.
import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import {
  VALUATION_METHODS,
  reportValuationScenarios,
  scenarioUpsidePercent,
} from '@/lib/valuation';

describe('TUPRS EV/EBITDA BEAR/BASE/BULL scenarios (pre-audit archive)', () => {
  const reports = parseAnalysisReports(snapshots).filter(
    (r) => !r.version.includes('valuation-audit'),
  );
  const tuprsReports = reports.filter((r) => r.version.startsWith('tuprs-'));
  const latest = tuprsReports.reduce((best, r) =>
    (r.revision ?? 0) > (best.revision ?? 0) ? r : best,
  );
  const method = VALUATION_METHODS.find((m) => m.id === 'EV_EBITDA');
  if (!method) {
    throw new Error('EV_EBITDA method missing');
  }

  it('picks the pre-audit archived TUPRS report (tuprs-2026-11-02-v10, revision 10)', () => {
    expect(latest.version).toBe('tuprs-2026-11-02-v10');
    expect(latest.revision).toBe(10);
  });

  it('computes PASS fair values for all three cases from the FY2025 normalized FAVÖK', () => {
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

    // (ebitdaFy2025 56,272,759,000 × peer multiple − netFinancialDebtFy2025End -41,455,028,000) /
    // sharesFy2025End 1,926,795,598 — regression-checked with the project's exact BigInt
    // decimal math (lib/decimal.ts), not float math. Net debt is negative (net cash), so
    // subtracting it adds back to the numerator.
    expect(byCase.BEAR?.value).toBe('159.07'); // × 4.71 (stockanalysis.com, Valero Energy / VLO, EV/EBITDA ttm, 2026-11-07)
    expect(byCase.BASE?.value).toBe('171.92'); // × 5.15 (stockanalysis.com, Marathon Petroleum / MPC, EV/EBITDA ttm, 2026-11-07)
    expect(byCase.BULL?.value).toBe('227.70'); // × 7.06 (stockanalysis.com, Phillips 66 / PSX, EV/EBITDA ttm, 2026-11-07)

    expect(Number(byCase.BEAR?.value)).toBeLessThan(Number(byCase.BASE?.value));
    expect(Number(byCase.BASE?.value)).toBeLessThan(Number(byCase.BULL?.value));
  });

  it('derives potential upside vs. the market price (386.25 TRY) for each case', () => {
    const results = reportValuationScenarios(latest, method);
    const byCase = Object.fromEntries(
      (results ?? []).map((r) => [r.case, r.result]),
    );
    const priceFact = latest.facts.find((f) => f.id === 'price');
    expect(priceFact?.value).toBe('386.25');
    expect(scenarioUpsidePercent(byCase.BEAR?.value, priceFact?.value)).toBe(
      '-58.8',
    );
    expect(scenarioUpsidePercent(byCase.BASE?.value, priceFact?.value)).toBe(
      '-55.5',
    );
    expect(scenarioUpsidePercent(byCase.BULL?.value, priceFact?.value)).toBe(
      '-41.0',
    );
  });
});
