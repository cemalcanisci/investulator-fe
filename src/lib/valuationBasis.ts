import type { FinancialFact } from '@/domain/analysis';
import type { SourceEvidence } from '@/domain/evidence';
import { validDate } from '@/lib/analysisValidation';
import { validEvidence } from '@/lib/sourceEvidence';

export interface ValuationInputRule {
  readonly id: string;
  readonly role: 'FLOW' | 'STOCK' | 'MULTIPLE' | 'SHARES';
}
export interface ValuationAssumption {
  readonly inputId: string;
  readonly value: string;
  readonly rationale: string;
  readonly evidence: SourceEvidence;
}
export interface ValuationScenario {
  readonly id: 'BEAR' | 'BASE' | 'BULL';
  readonly valuationAt: string;
  readonly knowledgeAt: string;
  readonly flowStart: string;
  readonly flowEnd: string;
  readonly stockAt: string;
  readonly shareBasis: string;
  readonly purchasingPowerDate: string | null;
  readonly assumptions: readonly ValuationAssumption[];
}

/** Date bridges require a documented assumption for each input, not equal flow/stock periods. */
export function valuationBasisIssues(
  inputs: readonly FinancialFact[],
  rules: readonly ValuationInputRule[],
  scenario?: ValuationScenario,
): string[] {
  if (!scenario) {
    return ['ASSUMPTIONS'];
  }
  const issues: string[] = [];
  if (
    ![
      scenario.valuationAt,
      scenario.knowledgeAt,
      scenario.flowStart,
      scenario.flowEnd,
      scenario.stockAt,
    ].every(validDate) ||
    scenario.knowledgeAt > scenario.valuationAt ||
    scenario.flowStart > scenario.flowEnd ||
    scenario.flowEnd > scenario.valuationAt ||
    scenario.stockAt > scenario.valuationAt ||
    !scenario.shareBasis
  ) {
    issues.push('PERIOD');
  }
  for (const rule of rules) {
    const f = inputs.find((v) => v.id === rule.id);
    if (!f) {
      continue;
    }
    const b = f.basis;
    const assumptions = scenario.assumptions.filter((a) => a.inputId === f.id);
    const a = assumptions[0];
    if (
      assumptions.length !== 1 ||
      !a ||
      a.value !== f.value ||
      !a.rationale.trim() ||
      !validEvidence(a.evidence) ||
      !a.evidence.claims.includes(f.id) ||
      a.evidence.publishedAt > scenario.knowledgeAt ||
      a.evidence.from > b.start ||
      a.evidence.to < b.end
    ) {
      issues.push('ASSUMPTIONS');
    }
    if (!f.evidence || f.evidence.publishedAt > scenario.knowledgeAt) {
      issues.push('LOOKAHEAD');
    }
    if (
      rule.role === 'FLOW' &&
      (!['YEAR', 'TTM'].includes(b.periodKind) ||
        b.start !== scenario.flowStart ||
        b.end !== scenario.flowEnd)
    ) {
      issues.push('PERIOD');
    }
    if (
      ['STOCK', 'SHARES'].includes(rule.role) &&
      (b.periodKind !== 'INSTANT' || b.end !== scenario.stockAt)
    ) {
      issues.push('PERIOD');
    }
    if (
      rule.role === 'MULTIPLE' &&
      (b.periodKind !== 'INSTANT' || b.end !== scenario.valuationAt)
    ) {
      issues.push('PERIOD');
    }
    if (b.shareBasis && b.shareBasis !== scenario.shareBasis) {
      issues.push('SHARE_BASIS');
    }
    if (
      b.accounting === 'TAS29' &&
      b.purchasingPowerDate !== scenario.purchasingPowerDate
    ) {
      issues.push('RESTATEMENT');
    }
  }
  const money = inputs.filter((f) => ['TRY', 'USD'].includes(f.unit));
  if (
    money.some((f) =>
      [
        'currency',
        'scale',
        'scope',
        'attribution',
        'accounting',
        'purchasingPowerDate',
      ].some(
        (key) =>
          Object.entries(f.basis).find(([k]) => k === key)?.[1] !==
          Object.entries(money[0].basis).find(([k]) => k === key)?.[1],
      ),
    )
  ) {
    issues.push('BASIS');
  }
  return [...new Set(issues)];
}
