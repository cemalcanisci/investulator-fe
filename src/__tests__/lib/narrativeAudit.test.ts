import { describe, expect, it } from 'vitest';
import { analysisRepository } from '@/services/analysis';
import { fetchResearch } from '@/services/research';
import { i18n } from '@/i18n';
import { reportValuationScenarios, VALUATION_METHODS } from '@/lib/valuation';
import type { AnalysisReport } from '@/domain/analysis';
import { ratioPresentation } from '@/lib/ratioPresentation';

const audited = ['TUPRS', 'DOAS', 'FROTO', 'TOASO', 'AKSA', 'ISMEN', 'PAGYO'];
const all = [...audited, 'TTRAK', 'AKMGY', 'YGGYO'];

function latest(symbol: string): AnalysisReport {
  const report = analysisRepository.list(
    `watch-bist-${symbol.toLowerCase()}`,
  )[0];
  if (!report) {
    throw new Error(`Missing ${symbol}`);
  }
  return report;
}
function fact(report: AnalysisReport, id: string): string {
  const value = report.facts.find((f) => f.id === id)?.value;
  if (value === undefined) {
    throw new Error(`Missing ${id}`);
  }
  return value;
}
function text(symbol: string, key: string, lng: string): string {
  return i18n.t(`${latest(symbol).presentation.contentKey}.${key}`, { lng });
}
function compact(value: string): string {
  return value.replace(/[.,\s]/g, '').replaceAll('−', '-');
}

describe('Complete narrative audit against financial evidence', () => {
  it.each(['tr', 'en'])(
    'keeps missing TTM explanations and REIT cash coverage consistent in %s',
    (lng) => {
      for (const symbol of ['DOAS', 'TTRAK']) {
        expect(
          i18n.exists(
            `${latest(symbol).presentation.contentKey}.education.peTtm`,
            { lng },
          ),
        ).toBe(true);
        expect(text(symbol, 'education.peTtm', lng)).toContain('TTM');
      }
      const report = latest('YGGYO');
      const cash = Number(fact(report, 'operatingCash'));
      const dividends = Number(fact(report, 'dividendsPaid'));
      expect((cash / dividends) * 100).toBeCloseTo(66.44, 2);
      expect(text('YGGYO', 'cashBridge', lng)).toMatch(/66[,.]44/);
      expect(text('YGGYO', 'guide.verdict', lng)).toContain('CONFLICT');
      expect(text('YGGYO', 'guide.verdict', lng)).toContain('BLOCKED');
      expect(text('TTRAK', 'methods.pe', lng)).toMatch(/7[,.]89/);
    },
  );
  it.each(all)(
    '%s keeps dated prices and blocked valuations despite fresh narratives',
    (symbol) => {
      const report = latest(symbol);
      expect(report.presentation.narrativeStale).toBe(false);
      const price = report.facts.find((f) => f.id === 'price');
      expect(report.presentation.priceAt.slice(0, 10)).toBe(price?.basis.end);
      for (const set of report.valuationScenarios ?? []) {
        const method = VALUATION_METHODS.find((m) => m.id === set.methodId);
        if (!method) {
          throw new Error('Missing method');
        }
        const results = reportValuationScenarios(report, method);
        expect(results).toHaveLength(3);
        for (const entry of results ?? []) {
          expect(entry.result.status).toBe('BLOCKED');
          expect(entry.result.value).toBeUndefined();
        }
      }
    },
  );

  it.each(audited)(
    '%s preserves the previous financial evidence and historical narrative',
    async (symbol) => {
      const [report, previous] = analysisRepository.list(
        `watch-bist-${symbol.toLowerCase()}`,
      );
      expect(report.version).toContain('2026-11-09');
      expect(report.facts).toEqual(previous.facts);
      expect(report.calculations).toEqual(previous.calculations);
      expect(report.contracts).toEqual(previous.contracts);
      expect(report.valuationScenarios).toEqual(previous.valuationScenarios);
      expect(report.presentation.sources).toEqual(
        previous.presentation.sources,
      );
      expect(report.presentation.contentKey).not.toBe(
        previous.presentation.contentKey,
      );
      expect(previous.presentation.narrativeStale).toBe(true);
      expect((await fetchResearch(report.presentation.assetId))[0].id).toBe(
        report.presentation.id,
      );
      for (const lng of ['tr', 'en']) {
        const price = report.facts.find((f) => f.id === 'price');
        expect(text(symbol, 'education.price', lng)).toContain(price?.period);
        expect(text(symbol, 'education.price', lng)).toContain(
          fact(report, 'price'),
        );
        expect(text(symbol, 'scenarios', lng)).toMatch(/bloke|blocked/);
        const notes = ['bear', 'base', 'bull'].map((c) =>
          text(symbol, `scenarioNotes.${c}`, lng),
        );
        expect(new Set(notes).size).toBe(3);
        expect(notes.every((note) => note.includes('BLOCKED'))).toBe(true);
      }
    },
  );

  it.each(['tr', 'en'])(
    'FROTO %s debt, dividend and TTM explanations match the actual inputs',
    (lng) => {
      const report = latest('FROTO');
      const debt =
        BigInt(fact(report, 'financialDebt')) - BigInt(fact(report, 'cash'));
      expect(debt).toBe(111981980000n);
      expect(fact(report, 'netFinancialDebt')).toBe(debt.toString());
      expect(compact(text('FROTO', 'education.netDebt', lng))).toContain(
        debt.toString(),
      );
      for (const field of [
        'headline',
        'summary',
        'debtMeaning',
        'guide.verdict',
      ]) {
        expect(text('FROTO', field, lng)).not.toMatch(
          /net nakde yakın|near.net.cash/i,
        );
        expect(text('FROTO', field, lng)).toMatch(
          /net borç|net debt|net financial debt|net finansal borç/i,
        );
      }
      const paid = fact(report, 'dividendTotal');
      expect(paid).toBe('3.64');
      expect(compact(text('FROTO', 'education.dividendTotal', lng))).toContain(
        compact(paid),
      );
      expect(text('FROTO', 'education.dividendYield', lng)).toMatch(/5[,.]26/);
      const ttm =
        BigInt(fact(report, 'fyProfit2025')) +
        BigInt(fact(report, 'profit')) -
        BigInt(fact(report, 'profitPrevious'));
      expect(ttm).toBe(33200368000n);
      expect(compact(text('FROTO', 'education.peTtm', lng))).toContain(
        ttm.toString(),
      );
      expect(ratioPresentation(report, 'peTtm').periodBasis).toBe('TTM');
    },
  );

  it.each(['tr', 'en'])(
    'TUPRS %s distinguishes the available TTM bridge, cash flow and FX exposure',
    (lng) => {
      const report = latest('TUPRS');
      const ttm =
        BigInt(fact(report, 'profit2025RestatedJun2026')) +
        BigInt(fact(report, 'profit')) -
        BigInt(fact(report, 'profitPrevious'));
      expect(ttm).toBe(72741357000n);
      expect(compact(text('TUPRS', 'accounting', lng))).toContain(
        ttm.toString(),
      );
      const cash =
        BigInt(fact(report, 'operatingCash')) - BigInt(fact(report, 'capex'));
      expect(compact(text('TUPRS', 'cashBridge', lng))).toContain(
        cash.toString(),
      );
      expect(compact(text('TUPRS', 'fxMeaning', lng))).toContain(
        compact(fact(report, 'fxBeforeNatural')),
      );
      expect(text('TUPRS', 'guide.price', lng)).toMatch(/10[,.]23/);
      expect(
        new Set(
          [
            'accounting',
            'cashBridge',
            'cashQuality',
            'technical',
            'debtMeaning',
            'fxMeaning',
            'review',
          ].map((key) => text('TUPRS', key, lng)),
        ).size,
      ).toBe(7);
    },
  );

  it.each(['tr', 'en'])(
    'DOAS %s reflects conflicting EBITDA, verified cash outflow and tangible/intangible capex',
    (lng) => {
      const report = latest('DOAS');
      expect(report.facts.find((f) => f.id === 'ebitdaH1')?.verification).toBe(
        'CONFLICT',
      );
      expect(text('DOAS', 'education.ebitdaH1', lng)).toContain('CONFLICT');
      const cash =
        BigInt(fact(report, 'operatingCash')) - BigInt(fact(report, 'capex'));
      expect(cash).toBe(-4448889000n);
      expect(compact(text('DOAS', 'cashBridge', lng))).toContain('4448889000');
      expect(text('DOAS', 'education.capex', lng)).toMatch(
        /maddi olmayan|intangible/,
      );
      expect(text('DOAS', 'education.dividendYield', lng)).toMatch(/134[,.]30/);
      expect(text('DOAS', 'education.netDebtChange', lng)).toContain(
        'UNVERIFIED',
      );
    },
  );

  it.each(['tr', 'en'])(
    'TOASO and AKSA %s retain different gross/net conventions and purchasing-power limits',
    (lng) => {
      expect(fact(latest('TOASO'), 'dividendTotal')).toBe('20');
      expect(text('TOASO', 'education.dividendYield', lng)).toMatch(/9[,.]47/);
      expect(text('TOASO', 'dividend', lng)).toMatch(
        /25[.]03[.]2026|2026-03-25/,
      );
      expect(text('TOASO', 'history', lng)).toContain('APPROXIMATE');
      expect(fact(latest('AKSA'), 'dividendTotal')).toBe('0.58');
      expect(text('AKSA', 'education.dividendYield', lng)).toMatch(/5[,.]81/);
      expect(text('AKSA', 'education.dividendTotal', lng)).toMatch(/0[,.]493/);
      expect(text('AKSA', 'education.netDebtEbitda', lng)).toMatch(/3[,.]70/);
      for (const symbol of ['TOASO', 'AKSA']) {
        expect(text(symbol, 'sustainability', lng)).toContain('nominal');
        expect(text(symbol, 'sustainability', lng)).toMatch(
          /baz|basis|bases|restated/,
        );
      }
    },
  );

  it.each(['tr', 'en'])(
    'ISMEN %s uses real TTM ROE and does not label conflicting aggregates as commissions',
    (lng) => {
      const report = latest('ISMEN');
      const ttm =
        BigInt(fact(report, 'fyProfit2025')) +
        BigInt(fact(report, 'profit')) -
        BigInt(fact(report, 'profitPrevious'));
      expect(ttm).toBe(7346545000n);
      expect(compact(text('ISMEN', 'education.roe', lng))).toContain(
        ttm.toString(),
      );
      expect(text('ISMEN', 'education.roe', lng)).toMatch(/21[,.]38/);
      expect(text('ISMEN', 'education.profitGrowth', lng)).toMatch(/reel|real/);
      expect(text('ISMEN', 'education.commissionIncome', lng)).toContain(
        'CONFLICT',
      );
      expect(compact(text('ISMEN', 'growth', lng))).toContain(
        fact(report, 'serviceIncome'),
      );
      expect(text('ISMEN', 'sustainability', lng)).toMatch(/44[,.]12/);
    },
  );

  it.each(['tr', 'en'])(
    'PAGYO %s separates dated NAV, current review and the cash-flow bridge',
    (lng) => {
      const report = latest('PAGYO');
      expect(fact(report, 'adjustedNetAssetValueFY2025')).toBe('15174227888');
      expect(compact(text('PAGYO', 'summary', lng))).toContain('15174227888');
      expect(text('PAGYO', 'scenarioNotes.base', lng)).toContain(
        'NEEDS_REVIEW',
      );
      expect(text('PAGYO', 'scenarioNotes.bear', lng)).toContain('ASSUMPTIONS');
      const cash =
        BigInt(fact(report, 'operatingCash')) - BigInt(fact(report, 'capex'));
      expect(cash).toBe(477655723n);
      expect(compact(text('PAGYO', 'cashBridge', lng))).toContain(
        cash.toString(),
      );
      expect(text('PAGYO', 'education.sma5', lng)).not.toMatch(
        /accounting value|muhasebe tutarı/,
      );
    },
  );
});
