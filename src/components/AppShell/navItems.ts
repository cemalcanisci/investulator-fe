import {
  RiDashboardLine,
  RiExchangeLine,
  RiFileExcel2Line,
  RiLineChartLine,
  RiWalletLine,
} from '@remixicon/react';
import type { ComponentType } from 'react';
import { ROUTE_PATHS } from '@/app/routePaths';

export interface NavItem {
  /** Also the i18n key suffix: `nav.<key>`. */
  readonly key: string;
  readonly path: string;
  readonly icon: ComponentType<{ readonly className?: string }>;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'dashboard', path: ROUTE_PATHS.dashboard, icon: RiDashboardLine },
  { key: 'holdings', path: ROUTE_PATHS.holdings, icon: RiWalletLine },
  { key: 'transactions', path: ROUTE_PATHS.transactions, icon: RiExchangeLine },
  { key: 'analysis', path: ROUTE_PATHS.analysis, icon: RiLineChartLine },
  {
    key: 'importExport',
    path: ROUTE_PATHS.importExport,
    icon: RiFileExcel2Line,
  },
];

/** The three destinations shown on the mobile tab bar (the rest live in the menu drawer). */
export const TAB_KEYS: readonly string[] = [
  'dashboard',
  'holdings',
  'transactions',
];
