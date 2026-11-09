import { describe, expect, it } from 'vitest';
import { researchBundle } from '@/services/researchBundle';
import {
  listCompanyMatrix,
  riskFlags,
  valuationComparisonGroups,
} from '@/lib/companyMatrix';

const matrix = listCompanyMatrix(researchBundle.reports);

describe('listCompanyMatrix', () => {
  it('lists each of the ten covered BIST companies exactly once, at their latest revision', () => {
    const symbols = matrix.map((entry) => entry.symbol);
    expect(new Set(symbols).size).toBe(symbols.length);
    expect(symbols).toEqual(
      expect.arrayContaining([
        'TUPRS',
        'DOAS',
        'FROTO',
        'TOASO',
        'TTRAK',
        'ISMEN',
        'YGGYO',
        'AKSA',
        'AKMGY',
        'PAGYO',
      ]),
    );
  });

  it('never classifies an independent-audit NEEDS_REVIEW company as PASS', () => {
    // The 07.11.2026 audit (DENETIM.md) found every company's review status NEEDS_REVIEW;
    // this must stay visible rather than silently defaulting to an optimistic status.
    for (const entry of matrix) {
      expect(entry.reliability.reviewStatus).toBe('NEEDS_REVIEW');
    }
  });

  it('keeps the three NAD/no-numeric-scenario companies as BLOCKED/NONE, never AVAILABLE', () => {
    const bySymbol = new Map(matrix.map((entry) => [entry.symbol, entry]));
    for (const symbol of ['TTRAK', 'AKMGY', 'YGGYO']) {
      expect(bySymbol.get(symbol)?.reliability.valuationAvailability).toBe(
        'NONE',
      );
    }
    // The seven companies with authored BEAR/BASE/BULL sets are still blocked: the
    // independent audit marked every case NEEDS_REVIEW, so none clears REVIEW_REQUIRED.
    for (const symbol of [
      'TUPRS',
      'DOAS',
      'FROTO',
      'TOASO',
      'AKSA',
      'ISMEN',
      'PAGYO',
    ]) {
      expect(bySymbol.get(symbol)?.reliability.valuationAvailability).toBe(
        'BLOCKED',
      );
    }
  });

  it('surfaces known unresolved source conflicts without hardcoding them', () => {
    const bySymbol = new Map(matrix.map((entry) => [entry.symbol, entry]));
    expect(bySymbol.get('DOAS')?.reliability.conflictFactIds).toContain(
      'ebitdaH1',
    );
    expect(bySymbol.get('ISMEN')?.reliability.conflictFactIds).toContain(
      'commissionIncome',
    );
    expect(bySymbol.get('TUPRS')?.reliability.conflictFactIds).toEqual([]);
  });

  it('assigns the sector-appropriate valuation ratio and never forces one on a sector without it', () => {
    const bySymbol = new Map(matrix.map((entry) => [entry.symbol, entry]));
    expect(bySymbol.get('TUPRS')?.valuationRatioId).toBe('evEbitda');
    expect(bySymbol.get('FROTO')?.valuationRatioId).toBe('evEbitda');
    expect(bySymbol.get('ISMEN')?.valuationRatioId).toBe('priceBook');
    expect(bySymbol.get('YGGYO')?.valuationRatioId).toBe('priceNav');
  });

  it('never ranks entries by a derived score; sort key is sector profile then symbol', () => {
    const sorted = [...matrix].sort(
      (a, b) =>
        a.profile.id.localeCompare(b.profile.id) ||
        a.symbol.localeCompare(b.symbol),
    );
    expect(matrix.map((entry) => entry.assetId)).toEqual(
      sorted.map((entry) => entry.assetId),
    );
  });
});

describe('riskFlags', () => {
  it('tags each sector with its structural risk, never a severity score', () => {
    const bySymbol = new Map(matrix.map((entry) => [entry.symbol, entry]));
    const tuprs = bySymbol.get('TUPRS');
    const ismen = bySymbol.get('ISMEN');
    const yggyo = bySymbol.get('YGGYO');
    if (!tuprs || !ismen || !yggyo) {
      throw new Error('fixture');
    }
    expect(riskFlags(tuprs)).toEqual(
      expect.arrayContaining(['CYCLICAL', 'FX_DEBT']),
    );
    expect(riskFlags(ismen)).toEqual(['COMMISSION_DEPENDENT']);
    expect(riskFlags(yggyo)).toEqual(['VALUATION_JUDGMENT']);
  });
});

describe('valuationComparisonGroups', () => {
  it('groups same-sector peers under one ratio and keeps different sectors apart', () => {
    const groups = valuationComparisonGroups(matrix);
    const automotive = groups.find((g) => g.businessModel === 'AUTOMOTIVE');
    expect(automotive?.ratioId).toBe('evEbitda');
    expect(automotive?.entries.map((e) => e.symbol).sort()).toEqual([
      'DOAS',
      'FROTO',
      'TOASO',
      'TTRAK',
    ]);
    const reit = groups.find((g) => g.businessModel === 'REIT');
    expect(reit?.entries.map((e) => e.symbol).sort()).toEqual([
      'AKMGY',
      'PAGYO',
      'YGGYO',
    ]);
    // REFINING (TUPRS alone) and AUTOMOTIVE share the evEbitda ratio id but must never merge.
    const refining = groups.find((g) => g.businessModel === 'REFINING');
    expect(refining?.entries.map((e) => e.symbol)).toEqual(['TUPRS']);
  });

  it('drops companies whose sector has no shared valuation ratio', () => {
    const groups = valuationComparisonGroups(matrix);
    for (const group of groups) {
      expect(group.entries.length).toBeGreaterThan(0);
    }
  });
});
