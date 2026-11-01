import { describe, expect, it } from 'vitest';
import { researchBundle } from '@/services/researchBundle';
import { factIssues } from '@/lib/analysisValidation';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { approximateBacktest } from '@/lib/approximateBacktest';
import { isApproximateHistory } from '@/lib/approximateHistorySchema';
import type { AnalysisReport } from '@/domain/analysis';

const reports = researchBundle.reports.filter((report) =>
  report.version.includes('2026-11-01'),
);
const find = (symbol: string): AnalysisReport => {
  const report = reports.find((r) => r.presentation.symbol === symbol);
  if (!report) {
    throw new Error(`Missing audited report: ${symbol}`);
  }
  return report;
};

describe('BIST source audit', () => {
  it('retains previous reports and validates every verified claim', () => {
    expect(reports).toHaveLength(10);
    for (const report of reports) {
      expect(
        researchBundle.reports.some(
          (other) =>
            other.presentation.assetId === report.presentation.assetId &&
            other.version !== report.version,
        ),
      ).toBe(true);
      expect(report.presentation.review.independent).toBe(false);
      for (const fact of report.facts.filter(
        (fact) => fact.verification === 'VERIFIED',
      )) {
        expect(
          factIssues(
            fact,
            report.presentation.sources.map((s) => s.id),
          ),
          `${report.presentation.symbol}:${fact.id}`,
        ).toEqual([]);
      }
    }
  });

  it('reconstructs debt, TTM and cash coverage from reconciled inputs', () => {
    expect(ratioPresentation(find('DOAS'), 'netDebt').value).toBe(
      '32227304000',
    );
    expect(ratioPresentation(find('DOAS'), 'peTtm').periodBasis).toBe('TTM');
    expect(ratioPresentation(find('ISMEN'), 'roe')).toMatchObject({
      value: '21.3800',
      periodBasis: 'TTM',
    });
    expect(
      ratioPresentation(find('YGGYO'), 'operatingCashExInterest').value,
    ).toBe('909351305');
    expect(ratioPresentation(find('YGGYO'), 'dividendCashCoverage').value).toBe(
      '66.440',
    );
    expect(ratioPresentation(find('TTRAK'), 'peTtm').value).toBeUndefined();
  });

  it('does not promote book equity to adjusted property NAV', () => {
    for (const symbol of ['YGGYO', 'AKMGY', 'PAGYO']) {
      expect(ratioPresentation(find(symbol), 'priceNav').value).toBeUndefined();
      expect(ratioPresentation(find(symbol), 'priceBook').value).toBeDefined();
    }
  });

  it('blocks dividend returns for unresolved event histories but retains price results', () => {
    for (const symbol of ['FROTO', 'TOASO', 'TTRAK', 'ISMEN', 'YGGYO']) {
      const history = researchBundle.approximate
        .flatMap((value) => (isApproximateHistory(value) ? [value] : []))
        .find((h) => h.assetId === find(symbol).presentation.assetId);
      if (!history) {
        throw new Error('Missing history');
      }
      const result = approximateBacktest(history, 10, {
        mode: 'MONTHLY',
        amountUsd: '1000',
      });
      expect(result.status).toBe('PRICE_ONLY');
      expect(result.priceOnly?.usd.xirr).not.toBeNull();
      expect(result.cash).toBeUndefined();
      expect(result.reinvest).toBeUndefined();
      expect(history.monthly.every((m) => m.fxDate <= m.date)).toBe(true);
    }
  });
});
