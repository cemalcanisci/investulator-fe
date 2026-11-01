import { describe, expect, it } from 'vitest';
import { researchBundle } from '@/services/researchBundle';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { approximateBacktest } from '@/lib/approximateBacktest';
import { isApproximateHistory } from '@/lib/approximateHistorySchema';
import type { AnalysisReport } from '@/domain/analysis';
import type { ApproximateHistory } from '@/domain/approximateHistory';
import historyData from '@/data/research/akmgy-approximate-history.json';
const report = ((): AnalysisReport => {
  const found = researchBundle.reports.find(
    (r) => r.version === 'akmgy-2026-10-31-v1',
  );
  if (!found) {
    throw new Error('AKMGY report missing');
  }
  return found;
})();
const history = ((): ApproximateHistory => {
  if (!isApproximateHistory(historyData)) {
    throw new Error('Invalid AKMGY history');
  }
  return historyData;
})();
describe('AKMGY research integrity', () => {
  it('separates book NAV, same-basis trailing earnings and two profit-year distributions', () => {
    expect(report.context.businessModel).toBe('REIT');
    expect(ratioPresentation(report, 'peTtm')).toMatchObject({
      value: '7.95',
      periodBasis: 'TTM',
    });
    expect(ratioPresentation(report, 'roe').value).toBe('7.5100');
    expect(ratioPresentation(report, 'netDebt').value).toBe('-651404000');
    expect(ratioPresentation(report, 'dividendYield').value).toBe('9.10');
    expect(report.facts.find((f) => f.id === 'dividendTotal')?.value).toBe(
      '16.06',
    );
    expect(report.facts.some((f) => f.id === 'occupancy')).toBe(false);
    expect(report.presentation.valuationStatus).toBe('NOT_ASSESSED');
  });
  it('excludes duplicate and non-cash provider events without losing the bonus split', () => {
    expect(history.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ date: '2011-07-18', factor: '2.72' }),
      ]),
    );
    for (const date of ['2008-05-30', '2011-05-26', '2018-12-24']) {
      expect(history.dividends.some((d) => d.exDate === date)).toBe(false);
    }
    expect(
      history.dividends
        .filter((d) => d.exDate.startsWith('2018'))
        .map((d) => d.rawGrossPerShare),
    ).toEqual(['0.68', '1']);
    expect(history.monthly).toHaveLength(240);
  });
  it.each([10, 15, 20])(
    'calculates %i years with real monthly observations',
    (years) => {
      const result = approximateBacktest(history, years, {
        mode: 'MONTHLY',
        amountUsd: '1000',
      });
      expect(result.status).toBe('APPROXIMATE');
      expect(result.reinvest?.usd.invested).toBe(`${years * 12000}.00`);
      expect(result.reinvest?.usd.xirr).not.toBeNull();
    },
  );
});
