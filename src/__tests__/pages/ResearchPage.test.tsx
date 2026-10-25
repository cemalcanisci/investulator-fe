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
  it.each(['tr', 'en'])(
    'preserves the simulation and financial values across modes in %s',
    async (language) => {
      await i18n.changeLanguage(language);
      renderPage();
      const view = await screen.findByRole('combobox', {
        name: i18n.t('researchUx.view'),
      });
      expect(view).toHaveValue('EASY');
      const strategy = screen.getByRole('combobox', {
        name: i18n.t('analysis.strategySelector'),
      });
      await userEvent.selectOptions(strategy, 'VALUE');
      const simulation = document.getElementById('approximate-backtest');
      const amount = document.querySelector(
        '#overview .tabular-nums',
      )?.textContent;
      expect(amount).toBeTruthy();
      for (const mode of ['DETAILED', 'EASY']) {
        await userEvent.selectOptions(view, mode);
        expect(strategy).toHaveValue('VALUE');
        expect(
          document.querySelector('#overview .tabular-nums')?.textContent,
        ).toBe(amount);
        expect(document.getElementById('approximate-backtest')).toBe(
          simulation,
        );
        for (const count of [10, 15, 20]) {
          expect(
            screen.getByRole('heading', {
              name: i18n.t('approximate.period', { years: count }),
            }),
          ).toBeVisible();
        }
        expect(document.getElementById('dividend-backtest')).toBeNull();
        expect(simulation).not.toBeNull();
        for (const id of [
          'overview',
          'financials',
          'growth',
          'dividend',
          'valuation',
          'technical',
          'news',
          'history',
          'sources',
          'cashflow',
          'debt',
          'comparison',
        ]) {
          expect(document.getElementById(id)).not.toBeNull();
        }
      }
      expect(
        screen.getAllByText(i18n.t('metricEducation.peAnnualized.definition'))
          .length,
      ).toBeGreaterThan(0);
    },
  );
  it('reorders actual sections when the presentation strategy changes', async () => {
    renderPage();
    const selector = await screen.findByRole('combobox', {
      name: i18n.t('analysis.strategySelector'),
    });
    await userEvent.selectOptions(selector, 'VALUE');
    const nav = screen.getByRole('navigation', {
      name: i18n.t('research.contents'),
    });
    expect(within(nav).getAllByRole('link')[2]).toHaveAttribute(
      'href',
      '#valuation',
    );
    const valuation = screen.getByRole('region', {
      name: i18n.t('research.sections.valuation'),
    });
    const dividend = screen.getByRole('region', {
      name: i18n.t('research.sections.dividend'),
    });
    expect(
      valuation.compareDocumentPosition(dividend) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    await userEvent.selectOptions(selector, 'DIVIDEND');
    expect(
      dividend.compareDocumentPosition(valuation) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      screen.getByText(i18n.t('researchUx.comparison.basisNotice')),
    ).toBeInTheDocument();
  });
  it('keeps section gaps and independent review separate from calculation checks', async () => {
    renderPage();
    await userEvent.selectOptions(
      await screen.findByRole('combobox', { name: i18n.t('researchUx.view') }),
      'DETAILED',
    );
    expect(
      await screen.findByText(
        i18n.t('analysis.reconciliationV6.VALUATION.text'),
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        i18n.t('analysis.qualitySeparation', {
          sources: i18n.t('analysis.sourceState.INCOMPLETE'),
        }),
      ),
    ).toBeVisible();
    expect(
      screen.getByText(i18n.t('analysis.reconciliationV6.HISTORY.text')),
    ).toBeVisible();
  });
  it('shows a plain-language price verdict and company context', async () => {
    renderPage();
    await userEvent.selectOptions(
      await screen.findByRole('combobox', { name: i18n.t('researchUx.view') }),
      'DETAILED',
    );
    expect(
      await screen.findByText(i18n.t('researchTuprsV2.guide.verdict')),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', {
        name: i18n.t('research.guide.companyTitle'),
      }),
    ).toBeVisible();
    const education = screen.getAllByText(
      i18n.t('researchTuprsV2.education.priceBook'),
    )[0];
    const panel = education.closest('details');
    const toggle = panel?.querySelector('summary');
    if (panel && !panel.open && toggle) {
      await userEvent.click(toggle);
    }
    expect(education).toBeVisible();
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
      screen.getAllByText('TRATUPRS91E8', { exact: false })[0],
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
    const sectionLinks = within(nav).getAllByRole('link');
    expect(sectionLinks.length).toBeGreaterThanOrEqual(10);
    for (const link of sectionLinks) {
      const target = link.getAttribute('href');
      expect(target?.startsWith('#')).toBe(true);
      expect(document.getElementById(target?.slice(1) ?? '')).not.toBeNull();
    }
    expect(
      screen.getByRole('link', { name: i18n.t('research.back') }),
    ).toHaveAttribute('href', ROUTE_PATHS.strategies);
    const priceCard = screen
      .getAllByRole('heading', {
        name: i18n.t('research.metrics.price'),
      })
      .map((heading) => heading.closest('article'))
      .find(Boolean);
    if (!priceCard) {
      throw new Error('Missing price card');
    }
    const details = within(priceCard).getByText(
      i18n.t('research.calculationDetails'),
    );
    if (!details) {
      throw new Error('Missing calculation toggle');
    }
    await userEvent.click(details);
    expect(
      within(priceCard).getByText(i18n.t('researchTuprs.education.price')),
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
    expect(
      screen.getByText(i18n.t('researchUx.trust.missing')),
    ).toBeInTheDocument();
  });
});
