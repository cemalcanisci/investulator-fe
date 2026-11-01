import { describe, expect, it } from 'vitest';
import { researchBundle } from '@/services/researchBundle';
import { ratioPresentation } from '@/lib/ratioPresentation';

const template = researchBundle.reports.find(
  (report) => report.presentation.symbol === 'TTRAK',
);
if (!template) {
  throw new Error('Missing fixture');
}
const report = {
  ...template,
  facts: template.facts.filter((fact) => fact.id !== 'profitPrevious'),
};

describe('earnings period safety', () => {
  it('does not replace a newer interim loss with an older profitable year', () => {
    const result = ratioPresentation(report, 'peTtm');
    expect(result.value).toBeUndefined();
    expect(result.status).toBe('MISSING_DATA');
    expect(result.issues).toContain('nonPositiveEarnings');
  });

  it('does not label a standalone interim profit as trailing earnings', () => {
    const changed = {
      ...report,
      facts: report.facts
        .filter((fact) => fact.basis.periodKind !== 'YEAR')
        .map((fact) =>
          fact.id === 'profit' ? { ...fact, value: '100000000' } : fact,
        ),
    };
    const result = ratioPresentation(changed, 'peTtm');
    expect(result.value).toBeUndefined();
    expect(result.issues).toContain('ttm');
  });

  it('keeps the explicitly dated annual fallback when the newer period is profitable', () => {
    const changed = {
      ...report,
      facts: report.facts.map((fact) =>
        fact.id === 'profit' ? { ...fact, value: '100000000' } : fact,
      ),
    };
    const result = ratioPresentation(changed, 'peTtm');
    expect(result.periodBasis).toBe('ANNUAL');
    expect(result.issues).toContain('annualFallback');
    expect(result.value).toBeDefined();
  });
});
