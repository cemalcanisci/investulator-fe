import { describe, expect, it } from 'vitest';
import type { ResearchCalculation, ResearchFact } from '@/domain/research';
import { calculateResearch } from '@/lib/researchCalculations';
import { tuprsReport } from '@/data/research/tuprs-2026-10-11';

function fact(id: string, value: string): ResearchFact {
  return { id, value, unit: 'TRY', period: '2026', sourceId: 'test' };
}

describe('research calculations', () => {
  it.each<[ResearchCalculation['operation'], string]>([
    ['SUM', '150.00'],
    ['SUBTRACT', '90.00'],
    ['MULTIPLY', '3600.00'],
    ['RATIO', '4.00'],
    ['PERCENT', '400.00'],
    ['GROWTH', '300.00'],
    ['MEAN', '75.00'],
  ])('replays %s with decimal arithmetic', (operation, expected) => {
    expect(
      calculateResearch(
        {
          id: 'test',
          operation,
          inputs: ['a', 'b'],
          unit: 'TRY',
          precision: 2,
        },
        [fact('a', '120'), fact('b', '30')],
      ),
    ).toBe(expected);
  });

  it('keeps precision beyond Number safe integer range', () => {
    expect(
      calculateResearch(
        {
          id: 'test',
          operation: 'SUBTRACT',
          inputs: ['a', 'b'],
          unit: 'TRY',
          precision: 2,
        },
        [fact('a', '9007199254740993.01'), fact('b', '9007199254740993')],
      ),
    ).toBe('0.01');
  });

  it('rejects missing, malformed and zero-divisor data', () => {
    const calculation: ResearchCalculation = {
      id: 'test',
      operation: 'RATIO',
      inputs: ['a', 'b'],
      unit: 'MULTIPLE',
      precision: 2,
    };
    expect(() => calculateResearch(calculation, [fact('a', '1')])).toThrow(
      'Invalid research input',
    );
    expect(() =>
      calculateResearch(calculation, [fact('a', 'NaN'), fact('b', '1')]),
    ).toThrow('Invalid research input');
    expect(() =>
      calculateResearch(calculation, [fact('a', '1'), fact('b', '0')]),
    ).toThrow(RangeError);
    expect(() => calculateResearch({ ...calculation, inputs: [] }, [])).toThrow(
      'arity',
    );
    expect(() =>
      calculateResearch({ ...calculation, inputs: ['a'] }, [fact('a', '1')]),
    ).toThrow('arity');
  });

  it('reproduces sourced dividend and technical calculations without annualising earnings', () => {
    const values = Object.fromEntries(
      tuprsReport.calculations.map((calculation) => [
        calculation.id,
        calculateResearch(calculation, tuprsReport.facts),
      ]),
    );
    expect(values.dividendYield).toBe('4.43');
    expect(values.sma5).toBe('385.75');
    expect(values.dailyChange).toBe('-1.53');
    expect(values.weeklyChange).toBe('2.45');
    expect(values.cashProxy).toBe('120508319000');
    expect(values.financialDebt).toBe('68200679000');
    expect(values).not.toHaveProperty('fairValue');
  });
});
