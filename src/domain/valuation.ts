import type { SourceEvidence } from '@/domain/evidence';

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
