import { ImportExportPage } from '@/pages/ImportExport/ImportExportPage';
import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routePaths';
import { AppShell } from '@/components/AppShell/AppShell';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { FoundationsPage } from '@/pages/Foundations/FoundationsPage';
import { HoldingsPage } from '@/pages/Holdings/HoldingsPage';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';
import { AnalysisPage } from '@/pages/Analysis/AnalysisPage';
import { AssetDetailPage } from '@/pages/AssetDetail/AssetDetailPage';
import { TransactionsPage } from '@/pages/Transactions/TransactionsPage';
import { StrategiesPage } from '@/pages/Strategies/StrategiesPage';
import { ResearchPage } from '@/pages/Research/ResearchPage';

export function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path={ROUTE_PATHS.dashboard} element={<DashboardPage />} />
        <Route path={ROUTE_PATHS.holdings} element={<HoldingsPage />} />
        <Route path={ROUTE_PATHS.assetDetail} element={<AssetDetailPage />} />
        <Route path={ROUTE_PATHS.transactions} element={<TransactionsPage />} />
        <Route path={ROUTE_PATHS.analysis} element={<AnalysisPage />} />
        <Route path={ROUTE_PATHS.strategies} element={<StrategiesPage />} />
        <Route path={ROUTE_PATHS.research} element={<ResearchPage />} />
        <Route path={ROUTE_PATHS.importExport} element={<ImportExportPage />} />
        <Route path={ROUTE_PATHS.foundations} element={<FoundationsPage />} />
        {/* Must stay the last route: it catches every path nothing else matched. */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
