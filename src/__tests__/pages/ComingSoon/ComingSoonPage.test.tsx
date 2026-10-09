import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { i18n } from '@/i18n';
import { ComingSoonPage } from '@/pages/ComingSoon/ComingSoonPage';

describe('ComingSoonPage', () => {
  it('names the page and explains it is not ready yet', () => {
    render(<ComingSoonPage titleKey="nav.holdings" />);

    expect(
      screen.getByRole('heading', { name: i18n.t('nav.holdings') }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('comingSoon.description')),
    ).toBeInTheDocument();
  });
});
