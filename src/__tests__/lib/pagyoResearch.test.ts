import { describe, expect, it } from 'vitest';
import { researchBundle } from '@/services/researchBundle';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { approximateBacktest } from '@/lib/approximateBacktest';
import { isApproximateHistory } from '@/lib/approximateHistorySchema';
import historyData from '@/data/research/pagyo-approximate-history.json';

const report = researchBundle.reports.find(
  (r) => r.version === 'pagyo-2026-10-31-v1',
);
if (!report || !isApproximateHistory(historyData)) {
  throw new Error('PAGYO research data missing or invalid');
}
const history = historyData;

describe('PAGYO research integrity', () => {
  it('uses same-purchasing-power trailing earnings and does not treat appraisal occupancy as current', () => {
    expect(ratioPresentation(report, 'peTtm')).toMatchObject({
      value: '5.35',
      periodBasis: 'TTM',
    });
    expect(ratioPresentation(report, 'roe').value).toBe('10.7400');
    expect(ratioPresentation(report, 'cashProxy').value).toBe('477655723');
    expect(ratioPresentation(report, 'dividendYield').value).toBe('5.09');
    expect(report.facts.some((f) => f.id === 'occupancy')).toBe(false);
    expect(report.presentation.valuationStatus).toBe('NOT_ASSESSED');
  });
  it('corrects the deferred 2020 dividend and preserves the final 2026 settlement', () => {
    expect(
      history.dividends.find((d) => d.exDate === '2020-04-13'),
    ).toMatchObject({ rawGrossPerShare: '0.023', sourceId: 'correction2020' });
    expect(
      history.dividends.find((d) => d.exDate === '2026-05-11'),
    ).toMatchObject({ rawGrossPerShare: '5.7545', payDate: '2026-05-13' });
    expect(
      history.dividends.filter((d) => d.exDate === '2018-06-04'),
    ).toHaveLength(1);
    expect(history.actions).toEqual([]);
  });
  it('calculates ten years while distinguishing nonexistent listing history from missing data', () => {
    const result = approximateBacktest(history, 10, {
      mode: 'MONTHLY',
      amountUsd: '1000',
    });
    expect(result.status).toBe('APPROXIMATE');
    expect(result.reinvest?.usd.invested).toBe('120000.00');
    expect(result.reinvest?.usd.balance).toBe('400365.48');
    for (const years of [15, 20]) {
      const unavailable = approximateBacktest(history, years, {
        mode: 'MONTHLY',
        amountUsd: '1000',
      });
      expect(unavailable.status).toBe('INSUFFICIENT_HISTORY');
      expect(unavailable.issues).toContain('LISTING');
      expect(unavailable.reinvest).toBeUndefined();
    }
  });
});
