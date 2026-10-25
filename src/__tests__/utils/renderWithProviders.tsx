import type { ReactElement } from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { CurrencyProvider } from '@/currency/CurrencyProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ConfigProvider } from '@/components/ui/ConfigProvider';

export function createTestQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

export function renderWithProviders(
  ui: ReactElement,
  route = '/',
): RenderResult {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider>
          <CurrencyProvider>
            <ConfigProvider theme={{ token: { motion: false } }}>
              {ui}
            </ConfigProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
