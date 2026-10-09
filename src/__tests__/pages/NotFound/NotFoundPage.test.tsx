import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ROUTE_PATHS } from '@/app/routePaths';
import { i18n } from '@/i18n';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';

describe('NotFoundPage', () => {
  it('explains the page is missing and links back to the dashboard', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: i18n.t('notFound.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: i18n.t('common.backToHome') }),
    ).toHaveAttribute('href', ROUTE_PATHS.dashboard);
  });
});
