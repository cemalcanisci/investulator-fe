import type { AnalysisContext, AnalysisProfile } from '@/domain/analysis';

const INDUSTRIAL: AnalysisProfile = {
  id: 'INDUSTRIAL',
  methods: ['EV_EBITDA', 'FCF'],
  headline: ['price', 'profit'],
  financials: [
    'revenue',
    'operatingMargin',
    'currentRatio',
    'cash',
    'financialDebt',
    'cashProxy',
  ],
  growth: ['revenueGrowth', 'profitGrowth'],
  dividend: ['dividend1', 'dividend2', 'dividendYield'],
  technical: ['dailyChange', 'weeklyChange', 'sma5'],
};
const PROFILES: Readonly<Record<string, AnalysisProfile>> = {
  REFINING: {
    ...INDUSTRIAL,
    id: 'REFINING',
    headline: ['price', 'profit', 'nrm'],
  },
  AUTOMOTIVE: { ...INDUSTRIAL, id: 'AUTOMOTIVE' },
  INDUSTRIAL,
  BANK: {
    ...INDUSTRIAL,
    id: 'BANK',
    methods: ['BOOK_ROE'],
    financials: ['parentEquity', 'roe', 'capitalAdequacy', 'npl'],
    growth: ['profitGrowth'],
  },
  REIT: {
    ...INDUSTRIAL,
    id: 'REIT',
    methods: ['NAV'],
    financials: ['netAssetValue', 'rentalIncome', 'occupancy'],
    growth: ['rentalGrowth'],
  },
  BROKER: {
    ...INDUSTRIAL,
    id: 'BROKER',
    methods: ['BOOK_ROE'],
    financials: ['parentEquity', 'roe', 'commissionIncome'],
    growth: ['profitGrowth'],
  },
  TECHNOLOGY: {
    ...INDUSTRIAL,
    id: 'TECHNOLOGY',
    methods: ['FCF'],
    financials: ['revenue', 'operatingMargin', 'cashProxy'],
  },
};
export function selectAnalysisProfile(
  context: AnalysisContext,
): AnalysisProfile {
  if (context.assetType !== 'EQUITY') {
    return {
      id: context.assetType,
      methods: [],
      headline: ['price'],
      financials: [],
      growth: [],
      dividend: [],
      technical: [],
    };
  }
  return (
    PROFILES[context.businessModel] ?? {
      id: 'UNSUPPORTED',
      methods: [],
      headline: ['price'],
      financials: [],
      growth: [],
      dividend: [],
      technical: [],
    }
  );
}
