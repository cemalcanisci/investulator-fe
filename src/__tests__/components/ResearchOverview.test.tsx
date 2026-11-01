import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResearchOverview } from '@/components/Research/ResearchOverview';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { researchBundle } from '@/services/researchBundle';
import { i18n } from '@/i18n';
import type { ResearchReport } from '@/domain/research';

const report = ((): ResearchReport => {
  const found = researchBundle.reports.find(
    (r) => r.version === 'aksa-2026-10-31-v1',
  );
  if (!found) {
    throw new Error('AKSA report missing');
  }
  return found.presentation;
})();

describe('ResearchOverview risk summary', () => {
  it('uses the source-specific risk narrative when available', async () => {
    await i18n.changeLanguage('tr');
    renderWithProviders(<ResearchOverview report={report} />);
    expect(screen.getByText(i18n.t('researchAksa.risks'))).toBeVisible();
  });
  it('retains a readable sector fallback for reports without a narrative', async () => {
    await i18n.changeLanguage('tr');
    renderWithProviders(
      <ResearchOverview
        report={{ ...report, contentKey: 'fictionalResearch' }}
      />,
    );
    const heading = screen.getByRole('heading', {
      name: i18n.t('researchUx.overview.risks'),
    });
    expect(heading.parentElement?.querySelector('p')?.textContent).toBeTruthy();
    expect(heading.parentElement?.textContent).not.toContain(
      'fictionalResearch',
    );
  });
});
