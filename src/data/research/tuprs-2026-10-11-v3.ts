import type { ResearchReport } from '@/domain/research';
import { tuprsReportV2 } from './tuprs-2026-10-11-v2';

export const tuprsReportV3: ResearchReport = {
  ...tuprsReportV2,
  id: 'tuprs-2026-10-11-v3',
  contentKey: 'researchTuprsV3',
  longTerm: {
    horizonYears: [10, 15],
    status: 'CONDITIONAL',
    opportunityKeys: ['saf', 'electricity', 'hydrogen'],
    sourceIds: ['transition', 'business', 'financials'],
  },
  sources: [
    ...tuprsReportV2.sources,
    {
      id: 'transition',
      title: 'Tüpraş · Stratejik dönüşüm',
      url: 'https://www.tupras.com.tr/tr/stratejik-donusum',
      publishedAt: null,
      period: '2026-10-11 erişimi; 2030 / 2035 / 2050 hedefleri',
      locator:
        'SAF, sıfır karbonlu elektrik, yeşil hidrojen; hedefler gerçekleşme değildir',
    },
  ],
};
