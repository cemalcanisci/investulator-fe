import { describe, expect, it } from 'vitest';
import { researchBundle } from '@/services/researchBundle';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import {
  evaluateValuation,
  reportValuationScenarios,
  VALUATION_METHODS,
} from '@/lib/valuation';
import { i18n } from '@/i18n';

function required<T>(value: T | null | undefined): T {
  if (value === undefined || value === null) {
    throw new Error('Missing audit fixture');
  }
  return value;
}

// Independent integer-rational oracle: no production decimal/valuation helpers.
function roundedRatio(numerator: bigint, denominator: bigint): string {
  const cents = (numerator * 200n + denominator) / (2n * denominator);
  return `${cents / 100n}.${(cents % 100n).toString().padStart(2, '0')}`;
}

// Inputs transcribed from the audit source register, not engine output.
const industrial = [
  {
    symbol: 'TUPRS',
    ebitda: 56272759000n,
    debt: -41455028000n,
    shares: 1926795598n,
    multiples: [471n, 515n, 706n],
  },
  {
    symbol: 'DOAS',
    ebitda: 14864838000n,
    debt: 25184576000n,
    shares: 220000000n,
    multiples: [720n, 780n, 980n],
  },
  {
    symbol: 'FROTO',
    ebitda: 63557627000n,
    debt: 111981980000n,
    shares: 3509100000n,
    multiples: [779n, 932n, 1425n],
  },
  {
    symbol: 'TOASO',
    ebitda: 10000000000n,
    debt: 33701681000n,
    shares: 500000000n,
    multiples: [630n, 850n, 1180n],
  },
  {
    symbol: 'AKSA',
    ebitda: 5729630000n,
    debt: 21225728000n,
    shares: 3885000000n,
    multiples: [544n, 907n, 1712n],
  },
];
const reports = parseAnalysisReports(researchBundle.reports);

describe('Independent financial valuation audit', () => {
  it.each(industrial)(
    '$symbol archived arithmetic agrees with rational recomputation, not financial approval',
    ({ symbol, ebitda, debt, shares, multiples }) => {
      const report = reports
        .filter(
          (r) =>
            r.presentation.symbol === symbol &&
            !r.version.includes('valuation-audit'),
        )
        .sort((a, b) => (b.revision ?? 0) - (a.revision ?? 0))[0];
      const method = required(
        VALUATION_METHODS.find((m) => m.id === 'EV_EBITDA'),
      );
      const results = required(reportValuationScenarios(report, method));
      for (const [i, caseId] of ['BEAR', 'BASE', 'BULL'].entries()) {
        expect(results.find((r) => r.case === caseId)?.result.value).toBe(
          roundedRatio(ebitda * multiples[i] - debt * 100n, shares * 100n),
        );
      }
    },
  );

  it('reconstructs PAGYO NAV from asset and liability components independently', () => {
    const nav = 13978400000n + 2296320000n + 424875054n - 1525367166n;
    expect(nav).toBe(15174227888n);
    expect(roundedRatio(nav, 87000000n)).toBe('174.42');
    const report = reports
      .filter((r) => r.presentation.symbol === 'PAGYO')
      .sort((a, b) => (b.revision ?? 0) - (a.revision ?? 0))[0];
    expect(
      report.facts.find((f) => f.id === 'adjustedNetAssetValueFY2025')?.value,
    ).toBe(nav.toString());
    expect(
      report.facts.find((f) => f.id === 'adjustedNetAssetValueFY2025')
        ?.verification,
    ).toBe('VERIFIED');
  });

  it('reconstructs ISMEN TTM ROE and each historical BOOK_ROE value independently', () => {
    const profit = 2616705000n + 8767593000n - 4037753000n;
    const equitySum = 33467259000n + 35252706000n;
    expect(roundedRatio(profit * 200n, equitySum)).toBe('21.38');
    const report = reports
      .filter(
        (r) =>
          r.presentation.symbol === 'ISMEN' &&
          !r.version.includes('valuation-audit'),
      )
      .sort((a, b) => (b.revision ?? 0) - (a.revision ?? 0))[0];
    const results = required(
      reportValuationScenarios(
        report,
        required(VALUATION_METHODS.find((m) => m.id === 'BOOK_ROE')),
      ),
    );
    for (const [i, rates] of [
      [2069n, 4532n],
      [2138n, 4232n],
      [3468n, 3932n],
    ].entries()) {
      expect(results[i].result.value).toBe(
        roundedRatio(35252706000n * rates[0], 1500000000n * rates[1]),
      );
    }
  });

  it.each([
    'TUPRS',
    'DOAS',
    'FROTO',
    'TOASO',
    'AKSA',
    'ISMEN',
    'PAGYO',
    'TTRAK',
    'AKMGY',
    'YGGYO',
  ])('%s cannot publish an unsupported current target', (symbol) => {
    const report = reports
      .filter((r) => r.presentation.symbol === symbol)
      .sort((a, b) => (b.revision ?? 0) - (a.revision ?? 0))[0];
    const methodId = ['PAGYO', 'AKMGY', 'YGGYO'].includes(symbol)
      ? 'NAV'
      : symbol === 'ISMEN'
        ? 'BOOK_ROE'
        : 'EV_EBITDA';
    const method = required(VALUATION_METHODS.find((m) => m.id === methodId));
    const cases = reportValuationScenarios(report, method);
    const results = cases?.map((c) => c.result) ?? [
      evaluateValuation(report, method),
    ];
    for (const result of results) {
      expect(result.status).toBe('BLOCKED');
      expect(result.value).toBeUndefined();
      expect(result.issues.length).toBeGreaterThan(0);
    }
  });

  it.each(['TUPRS', 'DOAS', 'FROTO', 'TOASO', 'AKSA', 'ISMEN', 'PAGYO'])(
    '%s preserves the prior facts and exposes reviewed scenario notes',
    (symbol) => {
      const versions = reports
        .filter((r) => r.presentation.symbol === symbol)
        .sort((a, b) => (b.revision ?? 0) - (a.revision ?? 0));
      const [report, previous] = versions;
      const method = required(
        VALUATION_METHODS.find(
          (m) => m.id === report.valuationScenarios?.[0].methodId,
        ),
      );
      const cases = required(reportValuationScenarios(report, method));
      expect(cases).toHaveLength(3);
      expect(
        cases.every((r) => r.result.issues.includes('REVIEW_REQUIRED')),
      ).toBe(true);
      expect(previous).toBeDefined();
      expect(report.facts).toEqual(previous.facts);
      for (const lng of ['tr', 'en']) {
        for (const caseId of ['bear', 'base', 'bull']) {
          expect(
            i18n.exists(
              `${report.presentation.contentKey}.scenarioNotes.${caseId}`,
              { lng },
            ),
          ).toBe(true);
        }
      }
    },
  );

  it.each(['NEEDS_REVIEW', 'BLOCKED'] as const)(
    'preserves %s review through parsing and blocks otherwise valid arithmetic',
    (status) => {
      const archived = required(
        reports.find((r) => r.version === 'tuprs-2026-11-02-v10'),
      );
      const sets = required(archived.valuationScenarios).map((set) => ({
        ...set,
        cases: set.cases.map((c) => ({
          ...c,
          scenario: {
            ...c.scenario,
            review: {
              status,
              checkedAt: '2026-11-07',
              rationale: 'Audit finding',
            },
          },
        })),
      }));
      const [parsed] = parseAnalysisReports([
        { ...archived, valuationScenarios: sets },
      ]);
      expect(
        parsed.valuationScenarios?.[0].cases[0].scenario.review?.status,
      ).toBe(status);
      expect(
        reportValuationScenarios(parsed, VALUATION_METHODS[0])?.every(
          (c) => c.result.status === 'BLOCKED',
        ),
      ).toBe(true);
    },
  );

  it('allows an explicit PASS review and rejects malformed review metadata', () => {
    const archived = required(
      reports.find((r) => r.version === 'tuprs-2026-11-02-v10'),
    );
    const set = required(archived.valuationScenarios)[0];
    const reviewed = {
      ...archived,
      valuationScenarios: [
        {
          ...set,
          cases: set.cases.map((c) => ({
            ...c,
            scenario: {
              ...c.scenario,
              review: {
                status: 'PASS',
                checkedAt: '2026-11-07',
                rationale: 'Synthetic acceptance-path test',
              },
            },
          })),
        },
      ],
    };
    const [parsed] = parseAnalysisReports([reviewed]);
    expect(
      reportValuationScenarios(parsed, VALUATION_METHODS[0])?.every(
        (c) => c.result.status === 'PASS',
      ),
    ).toBe(true);
    reviewed.valuationScenarios[0].cases[0].scenario.review.status = 'INVALID';
    expect(() => parseAnalysisReports([reviewed])).toThrow(
      'Invalid analysis schema',
    );
  });
});
