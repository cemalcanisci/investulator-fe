import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/components/AppShell/navItems';

export interface SidebarNavProps {
  /** `always` shows labels (drawer); `wide` hides them until the XL breakpoint (icon rail). */
  readonly labels: 'always' | 'wide';
  readonly onNavigate?: () => void;
}

const BASE =
  'flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors';

export function SidebarNav({
  labels,
  onNavigate,
}: SidebarNavProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('nav.label')}>
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const label = t(`nav.${item.key}`);
          return (
            <li key={item.key}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                title={label}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `${BASE} ${isActive ? 'bg-nav-active text-nav-fg-active' : 'text-nav-fg hover:bg-nav-active hover:text-nav-fg-active'}`
                }
              >
                <Icon className="size-5 flex-none" />
                <span className={labels === 'always' ? '' : 'hidden xl:inline'}>
                  {label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
