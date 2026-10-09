import { RiPaletteLine } from '@remixicon/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routePaths';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher/ThemeSwitcher';
import { Button } from '@/components/ui/Button';
import { Popover } from '@/components/ui/Popover';

export function AppearanceMenu(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      title={t('appearance.title')}
      content={
        <div className="flex w-72 max-w-full flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-fg-2">{t('theme.label')}</span>
            <ThemeSwitcher />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-fg-2">{t('language.label')}</span>
            <LanguageSwitcher />
          </div>
          <Link className="text-sm text-primary" to={ROUTE_PATHS.foundations}>
            {t('appearance.foundations')}
          </Link>
        </div>
      }
    >
      <Button
        type="text"
        icon={<RiPaletteLine className="size-5" aria-hidden="true" />}
        aria-label={t('appearance.title')}
      />
    </Popover>
  );
}
