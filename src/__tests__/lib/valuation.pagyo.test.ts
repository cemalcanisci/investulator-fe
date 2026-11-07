import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/pagyo-analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import {
  VALUATION_METHODS,
  reportValuationScenarios,
  scenarioUpsidePercent,
} from '@/lib/valuation';
import { i18n } from '@/i18n';

const reports = parseAnalysisReports(snapshots);
const latest = reports.reduce((best, r) =>
  (r.revision ?? 0) > (best.revision ?? 0) ? r : best,
);
const navMethod = VALUATION_METHODS.find((m) => m.id === 'NAV');
if (!navMethod) {
  throw new Error('NAV method missing');
}

describe('PAGYO NAV valuation: BASE resolved from a single verified NAD bridge, BEAR/BULL blocked', () => {
  it('picks the highest-revision report (pagyo-2026-11-03-v5, revision 5)', () => {
    expect(latest.version).toBe('pagyo-2026-11-03-v5');
    expect(latest.revision).toBe(5);
    expect(latest.presentation.contentKey).toBe('researchPagyoAudit20261101');
  });

  it('carries the generic netAssetValue fact as CONFLICT, distinct from the resolved FY2025 bridge', () => {
    const generic = latest.facts.find((f) => f.id === 'netAssetValue');
    const resolved = latest.facts.find(
      (f) => f.id === 'adjustedNetAssetValueFY2025',
    );
    expect(generic?.verification).toBe('CONFLICT');
    expect(resolved?.verification).toBe('VERIFIED');
    expect(resolved?.value).toBe('15174227888');
  });

  it('adds a 2025-12-31 share count fact matching the 2026-06-30 count (no capital change)', () => {
    const sharesFy2025End = latest.facts.find(
      (f) => f.id === 'sharesFy2025End',
    );
    const shares = latest.facts.find((f) => f.id === 'shares');
    expect(sharesFy2025End?.value).toBe('87000000');
    expect(sharesFy2025End?.value).toBe(shares?.value);
  });

  it('computes a PASS BASE fair value from the resolved NAD bridge; BEAR/BULL stay BLOCKED', () => {
    const results = reportValuationScenarios(latest, navMethod);
    expect(results).not.toBeNull();
    const byCase = Object.fromEntries(
      (results ?? []).map((r) => [r.case, r.result]),
    );

    // adjustedNetAssetValueFY2025 (15,174,227,888) / sharesFy2025End (87,000,000),
    // verified independently with the project's exact BigInt decimal math
    // (lib/decimal.ts), not float math.
    expect(byCase.BASE?.status).toBe('PASS');
    expect(byCase.BASE?.value).toBe('174.42');
    expect(byCase.BASE?.issues).toEqual([]);

    expect(byCase.BEAR?.status).toBe('BLOCKED');
    expect(byCase.BEAR?.issues).toContain('ASSUMPTIONS');
    expect(byCase.BULL?.status).toBe('BLOCKED');
    expect(byCase.BULL?.issues).toContain('ASSUMPTIONS');
  });

  it('derives potential upside vs. the market price (113 TRY) for the BASE case only', () => {
    const results = reportValuationScenarios(latest, navMethod);
    const byCase = Object.fromEntries(
      (results ?? []).map((r) => [r.case, r.result]),
    );
    const priceFact = latest.facts.find((f) => f.id === 'price');
    expect(priceFact?.value).toBe('113');
    expect(scenarioUpsidePercent(byCase.BASE?.value, priceFact?.value)).toBe(
      '54.4',
    );
    expect(scenarioUpsidePercent(byCase.BEAR?.value, priceFact?.value)).toBe(
      null,
    );
  });

  it.each(['tr', 'en'])(
    'explains the BEAR/BULL block and the BASE result for each scenario case in %s',
    (lng) => {
      for (const kase of ['bear', 'base', 'bull']) {
        const key = `researchPagyoAudit20261101.scenarioNotes.${kase}`;
        expect(i18n.exists(key, { lng })).toBe(true);
        const text = i18n.t(key, { lng });
        expect(text.length).toBeGreaterThan(0);
      }
    },
  );
});
