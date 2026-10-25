import type {
  ResearchCalculation,
  ResearchFact,
  ResearchReport,
} from '@/domain/research';
import type { SourceEvidence } from '@/domain/evidence';

export interface FactBasis {
  readonly fiscalYearStart?: string;
  readonly currency: string;
  readonly scale: string;
  readonly scope: 'CONSOLIDATED' | 'SOLO' | 'MARKET';
  readonly attribution: 'GROUP' | 'PARENT' | 'SHARE';
  readonly accounting: 'TAS29' | 'NOMINAL' | 'IFRS';
  readonly purchasingPowerDate: string | null;
  readonly start: string;
  readonly end: string;
  readonly periodKind: 'INSTANT' | 'H1' | 'YTD' | 'QUARTER' | 'YEAR' | 'TTM';
  readonly shareBasis: string | null;
}

export interface FinancialFact extends ResearchFact {
  readonly unreviewedEvidence?: SourceEvidence;
  readonly evidence?: SourceEvidence;
  readonly basis: FactBasis;
  readonly verification: 'VERIFIED' | 'UNVERIFIED' | 'CONFLICT';
  readonly checkedAt: string;
  readonly locator: string;
}

export interface CalculationContract {
  readonly id: string;
  readonly units: readonly ResearchFact['unit'][];
  readonly periodPolicy: 'SAME' | 'COMPARABLE' | 'DATED_MARKET';
  readonly earningsBasis:
    'REPORTED' | 'ANNUALIZED_ESTIMATE' | 'NORMALIZED' | 'TTM';
}

export interface CalculationResult {
  readonly id: string;
  readonly methodVersion: '1';
  readonly status: 'PASS' | 'BLOCKED';
  readonly value?: string;
  readonly inputIds: readonly string[];
  readonly sourceIds: readonly string[];
  readonly issues: readonly string[];
}

export interface AnalysisContext {
  readonly assetType: 'EQUITY' | 'CRYPTO' | 'FUND';
  readonly businessModel: string;
  readonly strategies: readonly (
    'DIVIDEND' | 'GROWTH' | 'VALUE' | 'LONG_TERM'
  )[];
}

export interface AnalysisProfile {
  readonly id: string;
  readonly methods: readonly string[];
  readonly headline: readonly string[];
  readonly financials: readonly string[];
  readonly growth: readonly string[];
  readonly dividend: readonly string[];
  readonly technical: readonly string[];
}

export interface AnalysisReport {
  readonly peers?: readonly {
    readonly assetId: string;
    readonly reportVersion: string;
    readonly factId: string;
    readonly subjectFactId: string;
  }[];
  readonly revision?: number;
  readonly financialHistory?: readonly {
    readonly year: string;
    readonly factIds: readonly string[];
    readonly calculationIds: readonly string[];
  }[];
  readonly sections?: readonly {
    readonly id: string;
    readonly status: 'PARTIAL' | 'MISSING' | 'COMPLETE';
    readonly contentKey: string;
    readonly sourceIds: readonly string[];
  }[];
  readonly schemaVersion: 2;
  readonly version: string;
  readonly context: AnalysisContext;
  readonly profileVersion: '1';
  readonly facts: readonly FinancialFact[];
  readonly contracts: readonly CalculationContract[];
  readonly calculations: readonly ResearchCalculation[];
  /** Presentation and old narrative are retained without promoting their claims to verified facts. */
  readonly presentation: ResearchReport;
}
