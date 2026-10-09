import { RiAddLine, RiMoreLine } from '@remixicon/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routePaths';
import { NAV_ITEMS, TAB_KEYS } from '@/components/AppShell/navItems';

export interface BottomTabsProps {
  readonly onOpenMenu: () => void;
}

const TAB = 'flex flex-col items-center gap-0.5 py-2 text-xs font-medium';

export function BottomTabs({ onOpenMenu }: BottomTabsProps): JSX.Element {
  const { t } = useTranslation();
  const tabs = NAV_ITEMS.filter((item) => TAB_KEYS.includes(item.key));
  const [first, second, third] = tabs;

  function renderTab(item: (typeof tabs)[number]): JSX.Element {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.key}
        to={item.path}
        end={item.path === '/'}
        className={({ isActive }) =>
          `${TAB} ${isActive ? 'text-primary' : 'text-fg-2'}`
        }
      >
        <Icon className="size-5" />
        {t(`nav.${item.key}`)}
      </NavLink>
    );
  }

  return (
    <nav
      aria-label={t('nav.mobileLabel')}
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 items-center border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] sm:hidden"
    >
      {renderTab(first)}
      {renderTab(second)}
      <Link
        to={ROUTE_PATHS.transactionsNew}
        aria-label={t('nav.addInvestment')}
        className="mx-auto -mt-6 grid size-12 place-items-center rounded-full bg-primary text-on-primary shadow-overlay"
      >
        <RiAddLine className="size-6" aria-hidden="true" />
      </Link>
      {renderTab(third)}
      <button type="button" className={`${TAB} text-fg-2`} onClick={onOpenMenu}>
        <RiMoreLine className="size-5" aria-hidden="true" />
        {t('nav.more')}
      </button>
    </nav>
  );
}
