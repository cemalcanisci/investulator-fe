import { describe, expect, it } from 'vitest';
import snapshots from '@/data/research/ttrak-analysis-reports.json';
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
const evEbitdaMethod = VALUATION_METHODS.find((m) => m.id === 'EV_EBITDA');
if (!latest || !evEbitdaMethod) {
  throw new Error('TTRAK latest report or EV_EBITDA method missing');
}

describe('TTRAK EV/EBITDA valuation stays BLOCKED (no reliable normalized FAVÖK bridge)', () => {
  it('picks the highest-revision report', () => {
    expect(latest.revision).toBe(5);
    expect(latest.version).toBe(
      'ttrak-2026-11-09-valuation-audit-narrative-v5',
    );
    expect(latest.presentation.contentKey).toBe(
      'researchTtrakNarrativeAudit20261109',
    );
    expect(latest.context.businessModel).toBe('AUTOMOTIVE');
  });

  it('carries no normalizedEbitda/peerEvEbitda/valuationNetDebt facts: 2025 loss year has no sourced cyclical FAVÖK bridge', () => {
    for (const id of ['normalizedEbitda', 'peerEvEbitda', 'valuationNetDebt']) {
      expect(latest.facts.some((f) => f.id === id)).toBe(false);
    }
  });

  it('reportValuationScenarios returns null: no authored BEAR/BASE/BULL set for EV_EBITDA', () => {
    expect(reportValuationScenarios(latest, evEbitdaMethod)).toBeNull();
  });

  it('evaluateValuation(EV_EBITDA) is BLOCKED with the three missing required inputs', () => {
    const result = evaluateValuation(latest, evEbitdaMethod);
    expect(result.status).toBe('BLOCKED');
    expect(result.issues).toContain('MISSING:normalizedEbitda');
    expect(result.issues).toContain('MISSING:peerEvEbitda');
    expect(result.issues).toContain('MISSING:valuationNetDebt');
  });

  it.each(['tr', 'en'])(
    'explains the EV/EBITDA block for each scenario case in %s',
    (lng) => {
      for (const kase of ['bear', 'base', 'bull']) {
        const key = `researchTtrakAudit20261101.scenarioNotes.${kase}`;
        expect(i18n.exists(key, { lng })).toBe(true);
        const text = i18n.t(key, { lng });
        expect(text.length).toBeGreaterThan(0);
        expect(text).toContain('normalizedEbitda');
      }
    },
  );
});
