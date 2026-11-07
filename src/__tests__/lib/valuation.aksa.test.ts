import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/aksa-analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import {
  VALUATION_METHODS,
  reportValuationScenarios,
  scenarioUpsidePercent,
} from '@/lib/valuation';
import { i18n } from '@/i18n';

describe('AKSA EV/EBITDA BEAR/BASE/BULL scenarios (highest revision)', () => {
  const reports = parseAnalysisReports(snapshots);
  const latest = reports.reduce((best, r) =>
    (r.revision ?? 0) > (best.revision ?? 0) ? r : best,
  );
  const method = VALUATION_METHODS.find((m) => m.id === 'EV_EBITDA');
  if (!method) {
    throw new Error('EV_EBITDA method missing');
  }

  it('picks the highest-revision report (aksa-2026-11-03-v4, revision 4)', () => {
    expect(latest.version).toBe('aksa-2026-11-03-v4');
    expect(latest.revision).toBe(4);
    expect(latest.presentation.contentKey).toBe('researchAksaAudit20261101');
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

    // (ebitdaFy2025 5,729,630,000 TRY × peer multiple − netFinancialDebtFy2025 21,225,728,000 TRY)
    // / sharesFy2025End 3,885,000,000, verified independently with the project's exact BigInt
    // decimal math (lib/decimal.ts), not float math.
    expect(byCase.BEAR?.value).toBe('2.56'); // × 5.44 (SGL Carbon SE, TTM)
    expect(byCase.BASE?.value).toBe('7.91'); // × 9.07 (Toray Industries, TTM)
    expect(byCase.BULL?.value).toBe('19.79'); // × 17.12 (Hexcel Corporation, TTM)

    expect(Number(byCase.BEAR?.value)).toBeLessThan(Number(byCase.BASE?.value));
    expect(Number(byCase.BASE?.value)).toBeLessThan(Number(byCase.BULL?.value));
  });

  it('derives potential upside vs. the market price (9.99 TRY) for each case', () => {
    const results = reportValuationScenarios(latest, method);
    const byCase = Object.fromEntries(
      (results ?? []).map((r) => [r.case, r.result]),
    );
    const priceFact = latest.facts.find((f) => f.id === 'price');
    expect(priceFact?.value).toBe('9.99');
    expect(scenarioUpsidePercent(byCase.BEAR?.value, priceFact?.value)).toBe(
      '-74.4',
    );
    expect(scenarioUpsidePercent(byCase.BASE?.value, priceFact?.value)).toBe(
      '-20.8',
    );
    expect(scenarioUpsidePercent(byCase.BULL?.value, priceFact?.value)).toBe(
      '98.1',
    );
  });

  it.each(['tr', 'en'])(
    'has non-empty scenario notes for each case in %s',
    (lng) => {
      for (const kase of ['bear', 'base', 'bull']) {
        const key = `researchAksaAudit20261101.scenarioNotes.${kase}`;
        expect(i18n.exists(key, { lng })).toBe(true);
        const text = i18n.t(key, { lng });
        expect(text.length).toBeGreaterThan(0);
      }
    },
  );
});
