import type { AnalysisContext } from '@/domain/analysis';

export type AnalysisSection =
  'FINANCIALS' | 'DIVIDEND' | 'VALUATION' | 'GROWTH' | 'RISK' | 'TECHNICAL';
const PRIORITIES: Readonly<
  Record<AnalysisContext['strategies'][number], readonly AnalysisSection[]>
> = {
  DIVIDEND: ['DIVIDEND', 'FINANCIALS', 'RISK', 'VALUATION'],
  GROWTH: ['GROWTH', 'FINANCIALS', 'VALUATION', 'RISK'],
  VALUE: ['VALUATION', 'FINANCIALS', 'RISK'],
  LONG_TERM: ['RISK', 'FINANCIALS', 'GROWTH', 'DIVIDEND'],
};

/** Presentation priorities only: never accepts or mutates financial inputs. */
export function analysisPriorities(
  context: AnalysisContext,
): readonly AnalysisSection[] {
  const common: AnalysisSection[] = [
    'FINANCIALS',
    'VALUATION',
    'GROWTH',
    'DIVIDEND',
    'RISK',
    'TECHNICAL',
  ];
  return [
    ...new Set([
      ...context.strategies.flatMap((s) => PRIORITIES[s]),
      ...common,
    ]),
  ].filter((s) => context.assetType === 'EQUITY' || s !== 'DIVIDEND');
}

export type ResearchSectionId =
  | 'overview'
  | 'financials'
  | 'growth'
  | 'dividend'
  | 'valuation'
  | 'technical'
  | 'news'
  | 'history'
  | 'sources';

export function researchSectionOrder(
  context: AnalysisContext,
): readonly ResearchSectionId[] {
  const mapping: Readonly<Record<AnalysisSection, ResearchSectionId>> = {
    FINANCIALS: 'financials',
    DIVIDEND: 'dividend',
    VALUATION: 'valuation',
    GROWTH: 'growth',
    RISK: 'news',
    TECHNICAL: 'technical',
  };
  return [
    'overview',
    ...analysisPriorities(context).map((s) => mapping[s]),
    'history',
    'sources',
  ];
}
