import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/yggyo-analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import {
  VALUATION_METHODS,
  evaluateValuation,
  reportValuationScenarios,
} from '@/lib/valuation';
import { i18n } from '@/i18n';

const reports = parseAnalysisReports(snapshots);
const latest = [...reports].sort(
  (a, b) => (b.revision ?? 0) - (a.revision ?? 0),
)[0];
const navMethod = VALUATION_METHODS.find((m) => m.id === 'NAV');
if (!latest || !navMethod) {
  throw new Error('YGGYO latest report or NAV method missing');
}

describe('YGGYO NAV valuation stays BLOCKED (CONFLICT, no verified NAV bridge)', () => {
  it('picks the highest-revision report', () => {
    expect(latest.revision).toBe(5);
    expect(latest.presentation.contentKey).toBe(
      'researchYggyoNarrativeAudit20261109',
    );
  });

  it('carries a netAssetValue fact flagged CONFLICT, not VERIFIED', () => {
    const fact = latest.facts.find((f) => f.id === 'netAssetValue');
    expect(fact?.verification).toBe('CONFLICT');
  });

  it('reportValuationScenarios returns null: no authored BEAR/BASE/BULL set for NAV', () => {
    expect(reportValuationScenarios(latest, navMethod)).toBeNull();
  });

  it('evaluateValuation(NAV) is BLOCKED because netAssetValue is unresolved (CONFLICT)', () => {
    const result = evaluateValuation(latest, navMethod);
    expect(result.status).toBe('BLOCKED');
    expect(result.issues).toContain('CONFLICT');
  });

  it.each(['tr', 'en'])(
    'explains the NAV block for each scenario case in %s',
    (lng) => {
      for (const kase of ['bear', 'base', 'bull']) {
        const key = `researchYggyoAudit20261101.scenarioNotes.${kase}`;
        expect(i18n.exists(key, { lng })).toBe(true);
        const text = i18n.t(key, { lng });
        expect(text.length).toBeGreaterThan(0);
      }
    },
  );
});
