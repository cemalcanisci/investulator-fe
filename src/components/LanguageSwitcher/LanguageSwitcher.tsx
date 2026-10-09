import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Segmented } from '@/components/ui/Segmented';
import { useLanguage } from '@/hooks/useLanguage';
import { LANGUAGES } from '@/i18n/languages';

export function LanguageSwitcher(): JSX.Element {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const options = LANGUAGES.map((code) => ({
    value: code,
    label: t(`language.${code}`),
  }));

  return (
    <Segmented
      options={options}
      value={language}
      onChange={setLanguage}
      aria-label={t('language.label')}
    />
  );
}
