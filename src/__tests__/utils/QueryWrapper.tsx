import type { ReactElement, ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/__tests__/utils/renderWithProviders';

/** `renderHook` wrapper that gives hooks a fresh, retry-free query client. */
export function QueryWrapper({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
