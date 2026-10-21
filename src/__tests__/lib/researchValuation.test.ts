import { describe, expect, it } from 'vitest';
import { tuprsReportV2 } from '@/data/research/tuprs-2026-10-11-v2';
import { calculateResearch } from '@/lib/researchCalculations';
import { i18n } from '@/i18n';

describe('research valuation explanation', () => {
  it('distinguishes book, half-year and hypothetical annual multiples', () => {
    const results = Object.fromEntries(
      tuprsReportV2.calculations.map((item) => [
        item.id,
        calculateResearch(item, tuprsReportV2.facts),
      ]),
    );
    expect(results.priceBook).toBe('1.63');
    expect(results.peHalfYear).toBe('14.93');
    expect(results.peRunRate).toBe('7.46');
    expect(results).not.toHaveProperty('fairValue');
    expect(tuprsReportV2.valuationStatus).toBe('NOT_ASSESSED');
  });
  it.each(['tr', 'en'])('explains each new ratio in %s', (lng) => {
    for (const id of ['priceBook', 'peHalfYear', 'peRunRate']) {
      expect(i18n.exists(`research.metrics.${id}`, { lng })).toBe(true);
      expect(i18n.exists(`research.formulas.${id}`, { lng })).toBe(true);
      expect(i18n.exists(`researchTuprsV2.education.${id}`, { lng })).toBe(
        true,
      );
    }
  });
  it('rejects incomplete product-ratio inputs', () => {
    expect(() =>
      calculateResearch(
        {
          id: 'invalid',
          operation: 'PRODUCT_OVER_SUM',
          inputs: ['price', 'shares'],
          unit: 'MULTIPLE',
          precision: 2,
        },
        tuprsReportV2.facts,
      ),
    ).toThrow('arity');
  });
});
