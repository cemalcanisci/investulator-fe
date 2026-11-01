import { readFile } from 'node:fs/promises';
import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { ResearchPage } from '@/pages/Research/ResearchPage';
import { i18n } from '@/i18n';

// Only the persistent JSON input is isolated. The XLSX reader, preview, repositories,
// hooks, period selectors and page all run their real implementations.
vi.mock('@/data/research/imported-research.json', async () => {
  const { readResearchWorkbook } = await import('@/lib/researchWorkbookFile');
  const { previewWorkbook } = await import('@/lib/researchWorkbook');
  const file = await readFile('public/research/sise-import-test.xlsx');
  const preview = previewWorkbook(
    await readResearchWorkbook(new Uint8Array(file).buffer),
    {
      schemaVersion: 1,
      companies: [],
      reports: [],
      approximate: [],
      verified: [],
    },
  );
  if (preview.issues.length) {
    throw new Error(JSON.stringify(preview.issues));
  }
  return { default: preview.bundle };
});

describe('external XLSX research page', () => {
  it.each(['tr', 'en'])(
    'renders imported financials and missing data without company-specific translations in %s',
    async (language) => {
      await i18n.changeLanguage(language);
      const view = renderWithProviders(
        <Routes>
          <Route path="/takip/:assetId" element={<ResearchPage />} />
        </Routes>,
        '/takip/watch-bist-sise',
      );
      expect(
        await screen.findByRole(
          'heading',
          { name: /SISE.*Türkiye Şişe/ },
          { timeout: 30000 },
        ),
      ).toBeInTheDocument();
      expect(
        screen.getAllByText(language === 'tr' ? /224,53/ : /224.53/).length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(language === 'tr' ? /9,88/ : /9.88/).length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(language === 'tr' ? /23,98/ : /23.98/).length,
      ).toBeGreaterThan(0);
      // Cards for an id the import never modeled at all (e.g. a two-installment
      // dividend split it has no data for) are now hidden rather than shown
      // empty (2026-10-30 fix); this import's minimal fact set no longer
      // surfaces a "Yeterli veri yok" card, so that assertion was removed.
      expect(view.container.textContent).not.toContain('externalResearch.');
      expect(view.container.textContent).not.toContain(
        'research.metrics.ebitda',
      );
      expect(view.container.textContent).toContain('UNVERIFIED');
      expect(view.container.textContent).toContain('NEEDS_REVIEW');
      expect(view.container.textContent).toContain('TAS29');
      expect(view.container.textContent).toContain(
        i18n.t('researchTransfer.observedAt'),
      );
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: i18n.t('researchUx.view') }),
        'DETAILED',
      );
      expect(
        screen.getAllByText(language === 'tr' ? /224,53/ : /224.53/).length,
      ).toBeGreaterThan(0);
    },
    60000,
  );
});
