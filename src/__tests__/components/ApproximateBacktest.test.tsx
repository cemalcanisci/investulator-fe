import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { ApproximateBacktest } from '@/components/Research/ApproximateBacktest';
import { getApproximateHistory } from '@/services/approximateHistory';
import { i18n } from '@/i18n';

describe('ApproximateBacktest', () => {
  it.each(['tr', 'en'])(
    'shows separate approximate scenarios and controls in %s',
    async (language) => {
      await i18n.changeLanguage(language);
      renderWithProviders(
        <ApproximateBacktest
          history={getApproximateHistory('watch-bist-tuprs')}
        />,
      );
      expect(screen.getByLabelText(i18n.t('approximate.amount'))).toHaveValue(
        '1000',
      );
      for (const years of [10, 15, 20]) {
        expect(
          screen.getByRole('heading', {
            name: i18n.t('approximate.period', { years }),
          }),
        ).toBeVisible();
      }
      expect(
        screen.getAllByText(i18n.t('approximate.status.APPROXIMATE')),
      ).toHaveLength(3);
      await userEvent.selectOptions(
        screen.getByLabelText(i18n.t('approximate.mode')),
        'LUMP_SUM',
      );
      await userEvent.selectOptions(
        screen.getByLabelText(i18n.t('approximate.unit')),
        'local',
      );
      expect(screen.getAllByText(/TRY/).length).toBeGreaterThan(1);
      await userEvent.clear(
        screen.getByLabelText(i18n.t('approximate.amount')),
      );
      expect(
        screen.getAllByText(i18n.t('approximate.issues.INPUT')),
      ).toHaveLength(3);
      expect(
        screen.queryByRole('link', {
          name: i18n.t('approximate.verifiedLink'),
        }),
      ).not.toBeInTheDocument();
    },
  );
  it('shows an honest empty state without a snapshot', () => {
    renderWithProviders(<ApproximateBacktest />);
    expect(
      screen.getByText(i18n.t('approximate.issues.COVERAGE')),
    ).toBeVisible();
  });
});
