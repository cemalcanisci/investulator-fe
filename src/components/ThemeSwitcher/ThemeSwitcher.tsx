import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Segmented } from '@/components/ui/Segmented';
import { useTheme } from '@/hooks/useTheme';
import { THEME_NAMES } from '@/theme/themes';

export function ThemeSwitcher(): JSX.Element {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const options = THEME_NAMES.map((name) => ({
    value: name,
    label: t(`theme.${name}`),
  }));

  return (
    <Segmented
      options={options}
      value={theme}
      onChange={setTheme}
      aria-label={t('theme.label')}
    />
  );
}
