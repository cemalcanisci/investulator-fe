import { describe, expect, it } from 'vitest';
import { researchBundle } from '@/services/researchBundle';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { approximateBacktest } from '@/lib/approximateBacktest';
import { isApproximateHistory } from '@/lib/approximateHistorySchema';
import type { ApproximateHistory } from '@/domain/approximateHistory';
import type { AnalysisReport } from '@/domain/analysis';
import historyData from '@/data/research/aksa-approximate-history.json';
import tr from '@/i18n/locales/tr.json';
import en from '@/i18n/locales/en.json';

const report = ((): AnalysisReport => {
  const found = researchBundle.reports.find(
    (r) => r.version === 'aksa-2026-10-31-v1',
  );
  if (!found) {
    throw new Error('AKSA report missing');
  }
  return found;
})();
const history = ((): ApproximateHistory => {
  if (!isApproximateHistory(historyData)) {
    throw new Error('Invalid AKSA history');
  }
  return historyData;
})();

describe('AKSA research integration', () => {
  it('reconstructs trailing parent earnings without mixing annual purchasing power', () => {
    expect(ratioPresentation(report, 'peTtm')).toMatchObject({
      value: '5.97',
      periodBasis: 'TTM',
      status: 'INDICATIVE',
    });
    expect(ratioPresentation(report, 'roe')).toMatchObject({
      value: '18.0800',
      periodBasis: 'TTM',
    });
    expect(ratioPresentation(report, 'netDebt').value).toBe('23098868000');
    expect(report.presentation.review).toMatchObject({
      status: 'NEEDS_REVIEW',
      independent: false,
    });
    expect(report.presentation.valuationStatus).toBe('NOT_ASSESSED');
  });
  it('does not double count the 2009 stock dividend as cash', () => {
    expect(history.currency).toBe('TRY');
    expect(history.priceBasis).toBe('SPLIT_ONLY');
    expect(history.actions.some((a) => a.date.startsWith('2009'))).toBe(true);
    expect(history.dividends.some((d) => d.exDate.startsWith('2009'))).toBe(
      false,
    );
    expect(history.monthly).toHaveLength(240);
    expect(
      history.monthly.every(
        (m) =>
          m.fxDate <= m.date &&
          Date.parse(m.date) - Date.parse(m.fxDate) <= 4 * 86400000,
      ),
    ).toBe(true);
  });
  it.each([10, 15, 20])(
    'keeps the %i-year simulation approximate with monthly contributions',
    (years) => {
      const result = approximateBacktest(history, years, {
        mode: 'MONTHLY',
        amountUsd: '1000',
      });
      expect(result.status).toBe('APPROXIMATE');
      expect(result.reinvest?.usd.invested).toBe(`${years * 12000}.00`);
      expect(
        result.reinvest?.entries.filter((e) => e.kind === 'CONTRIBUTION'),
      ).toHaveLength(years * 12);
      expect(result.reinvest?.usd.xirr).not.toBeNull();
    },
  );
  it('provides both languages and source-specific risks', () => {
    expect(Object.keys(tr.researchAksa.education).sort()).toEqual(
      Object.keys(en.researchAksa.education).sort(),
    );
    expect(tr.researchAksa.risks).toContain('7,78');
    expect(en.researchAksa.risks).toContain('7.78');
  });
});
