import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

export interface ComingSoonPageProps {
  /** i18n key of the page title, e.g. `nav.holdings`. */
  readonly titleKey: string;
}

/** Placeholder for pages that are designed and built one at a time. */
export function ComingSoonPage({ titleKey }: ComingSoonPageProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">{t(titleKey)}</h1>
      <p className="text-fg-2">{t('comingSoon.description')}</p>
    </div>
  );
}
