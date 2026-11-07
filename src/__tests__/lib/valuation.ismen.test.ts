import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/ismen-analysis-reports.json';
import en from '@/i18n/locales/en.json';
import tr from '@/i18n/locales/tr.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import {
  VALUATION_METHODS,
  reportValuationScenarios,
  scenarioUpsidePercent,
} from '@/lib/valuation';

describe('ISMEN BOOK_ROE BEAR/BASE/BULL scenarios (highest revision)', () => {
  const reports = parseAnalysisReports(snapshots);
  const latest = reports.reduce((best, r) =>
    (r.revision ?? 0) > (best.revision ?? 0) ? r : best,
  );
  const method = VALUATION_METHODS.find((m) => m.id === 'BOOK_ROE');
  if (!method) {
    throw new Error('BOOK_ROE method missing');
  }

  it('picks the highest-revision report (ismen-2026-11-03-v4, revision 4)', () => {
    expect(latest.version).toBe('ismen-2026-11-03-v4');
    expect(latest.revision).toBe(4);
  });

  it('computes PASS fair values for all three cases from sourced ROE/Ke assumptions', () => {
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

    // (parentEquity 35,252,706,000 / shares 1,500,000,000) × (sustainableRoe / costOfEquity)
    // Independently verified with the project's own BigInt decimal math (lib/decimal.ts
    // semantics, not float math): node -e computed BEAR=10.73, BASE=11.87, BULL=20.73.
    expect(byCase.BEAR?.value).toBe('10.73'); // ROE %20.69 (FY2024, ending equity) / Ke %45.32 (CAPM +3pt buffer)
    expect(byCase.BASE?.value).toBe('11.87'); // ROE %21.38 (TTM, average equity) / Ke %42.32 (CAPM base)
    expect(byCase.BULL?.value).toBe('20.73'); // ROE %34.68 (FY2023, ending equity) / Ke %39.32 (CAPM -3pt buffer)

    expect(Number(byCase.BEAR?.value)).toBeLessThan(Number(byCase.BASE?.value));
    expect(Number(byCase.BASE?.value)).toBeLessThan(Number(byCase.BULL?.value));
  });

  it('derives potential upside vs. the market price (25.22 TRY) for each case', () => {
    const results = reportValuationScenarios(latest, method);
    const byCase = Object.fromEntries(
      (results ?? []).map((r) => [r.case, r.result]),
    );
    const priceFact = latest.facts.find((f) => f.id === 'price');
    expect(priceFact?.value).toBe('25.22');
    expect(scenarioUpsidePercent(byCase.BEAR?.value, priceFact?.value)).toBe(
      '-57.5',
    );
    expect(scenarioUpsidePercent(byCase.BASE?.value, priceFact?.value)).toBe(
      '-52.9',
    );
    expect(scenarioUpsidePercent(byCase.BULL?.value, priceFact?.value)).toBe(
      '-17.8',
    );
  });

  it('shares the parentEquity/shares/capitalAdequacy facts across cases, varying only ROE/Ke', () => {
    const set = latest.valuationScenarios?.find(
      (s) => s.methodId === 'BOOK_ROE',
    );
    expect(set).toBeDefined();
    const bear = set?.cases.find((c) => c.case === 'BEAR');
    expect(bear?.idMap).toEqual({
      sustainableRoe: 'sustainableRoeBear',
      costOfEquity: 'costOfEquityBear',
    });
    expect(bear?.scenario.stockAt).toBe('2026-06-30');
    expect(bear?.scenario.flowStart).toBe('2025-07-01');
    expect(bear?.scenario.flowEnd).toBe('2026-06-30');
    expect(bear?.scenario.purchasingPowerDate).toBe('2026-06-30');
  });

  it('has non-empty tr/en scenario note copy for each case', () => {
    interface LocaleWithScenarioNotes {
      readonly researchIsmenAudit20261101?: {
        readonly scenarioNotes?: Record<string, string>;
      };
    }
    const trLocale: LocaleWithScenarioNotes = tr;
    const enLocale: LocaleWithScenarioNotes = en;
    const trNotes = trLocale.researchIsmenAudit20261101?.scenarioNotes;
    const enNotes = enLocale.researchIsmenAudit20261101?.scenarioNotes;
    for (const key of ['bear', 'base', 'bull']) {
      expect(trNotes?.[key]?.trim()).not.toBe('');
      expect(enNotes?.[key]?.trim()).not.toBe('');
    }
  });
});
