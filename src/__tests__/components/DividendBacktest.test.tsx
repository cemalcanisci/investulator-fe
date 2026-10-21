import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DividendBacktest } from '@/components/Research/DividendBacktest';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { getDividendHistory } from '@/services/dividendHistory';
import { i18n } from '@/i18n';

describe('DividendBacktest', () => {
  it.each(['tr', 'en'])(
    'blocks unverified historical results and retains educational explanations in %s',
    async (lng) => {
      await i18n.changeLanguage(lng);
      renderWithProviders(
        <DividendBacktest history={getDividendHistory('watch-bist-tuprs')} />,
      );
      for (const count of [10, 15, 20]) {
        expect(
          screen.getByRole('heading', {
            name: i18n.t('backtest.years', { count }),
          }),
        ).toBeVisible();
      }
      expect(
        screen.getAllByText(i18n.t('analysis.historyIssues.COVERAGE')),
      ).toHaveLength(3);
      expect(screen.getByText(i18n.t('backtest.explanation'))).toBeVisible();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(
        screen.queryByText(i18n.t('backtest.trace')),
      ).not.toBeInTheDocument();
    },
  );

  it('shows missing history instead of zero return for another dividend stock', () => {
    renderWithProviders(<DividendBacktest />);
    expect(
      screen.getAllByText(i18n.t('backtest.status.MISSING_DATA')),
    ).toHaveLength(3);
    expect(screen.queryByText('0 USD')).not.toBeInTheDocument();
  });

  it('does not match ticker aliases and returns independent snapshots', () => {
    expect(getDividendHistory('TUPRS')).toBeUndefined();
    expect(getDividendHistory('watch-bist-tuprs')).not.toBe(
      getDividendHistory('watch-bist-tuprs'),
    );
  });
});
