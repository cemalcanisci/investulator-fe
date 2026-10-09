import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorSwatches } from '@/components/Foundations/ColorSwatches';
import { TypeSpecimen } from '@/components/Foundations/TypeSpecimen';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher/ThemeSwitcher';

export function FoundationsPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {t('foundations.title')}
          </h1>
          <p className="mt-2 max-w-prose text-fg-2">
            {t('foundations.description')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header>
      <ColorSwatches />
      <TypeSpecimen />
    </div>
  );
}
