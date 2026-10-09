import { useEffect, type JSX, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import enUS from 'antd/locale/en_US';
import trTR from 'antd/locale/tr_TR';
import { ConfigProvider } from '@/components/ui/ConfigProvider';
import { CurrencyProvider } from '@/currency/CurrencyProvider';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import type { SupportedLanguage } from '@/i18n/languages';
import { queryClient } from '@/app/queryClient';
import { createAntdTheme } from '@/app/theme';
import { ThemeProvider } from '@/theme/ThemeProvider';

const ANTD_LOCALES: Readonly<Record<SupportedLanguage, typeof trTR>> = {
  tr: trTR,
  en: enUS,
};

export interface AppProvidersProps {
  readonly children: ReactNode;
}

function ThemedConfig({ children }: AppProvidersProps): JSX.Element {
  const { theme } = useTheme();
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <ConfigProvider
      locale={ANTD_LOCALES[language]}
      theme={createAntdTheme(theme)}
    >
      {children}
    </ConfigProvider>
  );
}

export function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <CurrencyProvider>
            <ThemedConfig>{children}</ThemedConfig>
          </CurrencyProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
