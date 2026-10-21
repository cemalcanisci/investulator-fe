import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { ResearchPage } from '@/pages/Research/ResearchPage';
import { ResearchMetric } from '@/components/Research/ResearchMetric';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { researchPath, ROUTE_PATHS } from '@/app/routePaths';
import { i18n } from '@/i18n';
import * as research from '@/services/research';
import { tuprsReport } from '@/data/research/tuprs-2026-10-11';

function renderPage(id = 'watch-bist-tuprs'): void {
  renderWithProviders(
    <Routes>
      <Route path={ROUTE_PATHS.research} element={<ResearchPage />} />
    </Routes>,
    researchPath(id),
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ResearchPage', () => {
  it('shows a plain-language price verdict and company context', async () => {
    renderPage();
    expect(
      await screen.findByText(i18n.t('researchTuprsV2.guide.verdict')),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', {
        name: i18n.t('research.guide.companyTitle'),
      }),
    ).toBeVisible();
    expect(
      screen.getAllByText(i18n.t('researchTuprsV2.education.priceBook'))[0],
    ).toBeVisible();
    expect(
      screen.getByText(i18n.t('researchTuprsV2.guide.missing.earnings')),
    ).toBeVisible();
  });
  it('shows source-backed research, honest review limits and all research sections', async () => {
    renderPage();
    expect(screen.getByRole('status')).toHaveTextContent(
      i18n.t('common.loading'),
    );
    expect(
      await screen.findByRole('heading', { name: /TUPRS/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('TRATUPRS91E8', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: i18n.t('research.notAssessed') }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('researchTuprs.scanLimit')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('researchTuprs.review')),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: /KAP #1643118/ }).length,
    ).toBeGreaterThan(0);
    const nav = screen.getByRole('navigation', {
      name: i18n.t('research.contents'),
    });
    expect(within(nav).getAllByRole('link')).toHaveLength(9);
    expect(
      screen.getByRole('link', { name: i18n.t('research.back') }),
    ).toHaveAttribute('href', ROUTE_PATHS.strategies);
    const details = screen.getAllByText(
      i18n.t('research.calculationDetails'),
    )[0];
    if (!details) {
      throw new Error('Missing calculation toggle');
    }
    await userEvent.click(details);
    expect(
      screen.getByText(i18n.t('researchTuprs.education.price')),
    ).toBeVisible();
  });

  it.each(['watch-bist-doas', 'watch-crypto-candidate-ai', 'unknown'])(
    'does not fabricate a report for %s',
    async (id) => {
      renderPage(id);
      expect(
        await screen.findByText(i18n.t('research.noReport')),
      ).toBeInTheDocument();
      expect(screen.queryByText('386,25')).not.toBeInTheDocument();
    },
  );

  it('explains missing crypto research', async () => {
    renderPage('watch-crypto-candidate-ai');
    expect(
      await screen.findByText(i18n.t('research.noCryptoReportHint')),
    ).toBeInTheDocument();
  });

  it('retries a failed report read', async () => {
    vi.spyOn(research, 'fetchResearch').mockRejectedValueOnce(
      new Error('read failed'),
    );
    renderPage();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('common.retryButton') }),
    );
    expect(
      await screen.findByRole('heading', { name: /TUPRS/ }),
    ).toBeInTheDocument();
  });

  it('renders the English report and original currency notice', async () => {
    await i18n.changeLanguage('en');
    renderPage();
    expect(
      await screen.findByRole('heading', { name: /TUPRS/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('research.originalCurrency')),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Price analysis and fair value' }),
    ).toBeInTheDocument();
  });

  it('shows a missing metric without rendering a fabricated zero', () => {
    renderWithProviders(
      <ResearchMetric report={tuprsReport} id="not-present" />,
    );
    expect(screen.getByText(i18n.t('research.missing'))).toBeInTheDocument();
  });
});
