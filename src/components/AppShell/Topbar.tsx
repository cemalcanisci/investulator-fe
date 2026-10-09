import { RiAddLine, RiMenuLine } from '@remixicon/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routePaths';
import { AppearanceMenu } from '@/components/AppShell/AppearanceMenu';
import { Brand } from '@/components/AppShell/Brand';
import { CurrencySwitcher } from '@/components/CurrencySwitcher/CurrencySwitcher';
import { Button } from '@/components/ui/Button';

export interface TopbarProps {
  readonly onOpenMenu: () => void;
}

export function Topbar({ onOpenMenu }: TopbarProps): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line bg-surface px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        {/* Menu button only where the sidebar is hidden but the tab bar is not shown (S and MD). */}
        <span className="hidden sm:inline-flex lg:hidden">
          <Button
            type="text"
            icon={<RiMenuLine className="size-5" aria-hidden="true" />}
            aria-label={t('nav.openMenu')}
            onClick={onOpenMenu}
          />
        </span>
        <Brand className="lg:hidden" />
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex">
          <Button
            type="primary"
            icon={<RiAddLine className="size-4" aria-hidden="true" />}
            onClick={() => void navigate(ROUTE_PATHS.transactionsNew)}
          >
            {t('nav.addInvestment')}
          </Button>
        </span>
        <CurrencySwitcher />
        <AppearanceMenu />
        {/* Placeholder until sign-in (Keycloak) exists. */}
        <span
          className="grid size-8 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary"
          title={t('user.label')}
          role="img"
          aria-label={t('user.label')}
        >
          U
        </span>
      </div>
    </header>
  );
}
