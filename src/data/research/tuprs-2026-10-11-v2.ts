import type { ResearchReport } from '@/domain/research';
import { tuprsReport as previous } from './tuprs-2026-10-11';

export const tuprsReportV2: ResearchReport = {
  ...previous,
  id: 'tuprs-2026-10-11-v2',
  contentKey: 'researchTuprsV2',
  sources: [
    ...previous.sources,
    {
      id: 'ownership',
      title: 'Tüpraş · Ortaklık yapısı',
      url: 'https://www.tupras.com.tr/tr/ortaklik-yapisi',
      publishedAt: null,
      period: '2026-10-11 erişimi; sayfa güncelleme tarihi belirtilmemiş',
      locator: 'Ortaklık ve kontrol şeması',
    },
    {
      id: 'business',
      title: 'Tüpraş · Yatırımcı ilişkileri SSS',
      url: 'https://www.tupras.com.tr/tr/yatirimci-iliskileri-sss',
      publishedAt: null,
      period: '2026-10-11 erişimi',
      locator: 'Faaliyetler ve ortaklık',
    },
    {
      id: 'annualRisks',
      title: 'Tüpraş · 2025 Integrated Annual Report',
      url: 'https://www.tupras.com.tr/assets/uploads/integrated-report/tupras-2025-integrated-annual-report.pdf',
      publishedAt: null,
      period: '2025',
      locator: 'Oil markets, geopolitical risks, p. 40',
    },
  ],
  calculations: [
    ...previous.calculations,
    {
      id: 'priceBook',
      operation: 'PRODUCT_OVER_SUM',
      inputs: ['price', 'shares', 'parentEquity'],
      unit: 'MULTIPLE',
      precision: 2,
    },
    {
      id: 'peHalfYear',
      operation: 'PRODUCT_OVER_SUM',
      inputs: ['price', 'shares', 'profit'],
      unit: 'MULTIPLE',
      precision: 2,
    },
    {
      id: 'peRunRate',
      operation: 'PRODUCT_OVER_SUM',
      inputs: ['price', 'shares', 'profit', 'profit'],
      unit: 'MULTIPLE',
      precision: 2,
    },
  ],
  coverage: previous.coverage.map((item) =>
    item.section === 'valuation' ? { ...item, status: 'PARTIAL' } : item,
  ),
};
