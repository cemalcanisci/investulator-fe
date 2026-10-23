export interface MetricDefinition {
  readonly key: string;
  readonly rule: 'CONTEXT' | 'GROWTH' | 'DIVIDEND' | 'NET_DEBT';
}

const KEYS = [
  'price',
  'shares',
  'revenue',
  'profit',
  'equity',
  'cash',
  'debt',
  'cfo',
  'capex',
  'cashProxy',
  'growth',
  'margin',
  'liquidity',
  'pe',
  'pb',
  'dividend',
  'yield',
  'coverage',
  'nrm',
  'technical',
  'roe',
  'capital',
  'npl',
  'nav',
  'rental',
  'occupancy',
  'commission',
  'netDebt',
  'bookPerShare',
  'marketCap',
  'debtWithinYear',
  'workingCapital',
  'peAnnualized',
  'peHalfYear',
  'priceChange',
  'movingAverage',
] as const;
export const METRIC_DICTIONARY: Readonly<Record<string, MetricDefinition>> =
  Object.fromEntries(
    KEYS.map((key) => [
      key,
      {
        key,
        rule:
          key === 'growth'
            ? 'GROWTH'
            : key === 'yield' || key === 'dividend'
              ? 'DIVIDEND'
              : key === 'netDebt'
                ? 'NET_DEBT'
                : 'CONTEXT',
      },
    ]),
  );

const ALIASES: Readonly<Record<string, string>> = {
  price: 'price',
  shares: 'shares',
  revenue: 'revenue',
  profit: 'profit',
  parentEquity: 'equity',
  cash: 'cash',
  cashAvailable: 'cash',
  financialInvestments: 'cash',
  financialDebt: 'debt',
  debtShort: 'debt',
  debtCurrent: 'debt',
  debtLong: 'debt',
  debtWithinYear: 'debtWithinYear',
  operatingCash: 'cfo',
  workingCapitalCash: 'workingCapital',
  capex: 'capex',
  cashProxy: 'cashProxy',
  revenueGrowth: 'growth',
  profitGrowth: 'growth',
  rentalGrowth: 'growth',
  operatingMargin: 'margin',
  currentRatio: 'liquidity',
  peRunRate: 'peAnnualized',
  peHalfYear: 'peHalfYear',
  priceBook: 'pb',
  bookPerShare: 'bookPerShare',
  marketCap: 'marketCap',
  dividend1: 'dividend',
  dividend2: 'dividend',
  dividendTotal: 'dividend',
  dividendYield: 'yield',
  nrm: 'nrm',
  dailyChange: 'priceChange',
  weeklyChange: 'priceChange',
  sma5: 'movingAverage',
  roe: 'roe',
  capitalAdequacy: 'capital',
  npl: 'npl',
  netAssetValue: 'nav',
  rentalIncome: 'rental',
  occupancy: 'occupancy',
  commissionIncome: 'commission',
  netFinancialDebt: 'netDebt',
};

export function metricDefinition(
  id: string,
  explicitKey?: string,
): MetricDefinition | undefined {
  return METRIC_DICTIONARY[explicitKey ?? ALIASES[id] ?? ''];
}
