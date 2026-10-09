import { useLayoutEffect, useState, type JSX, type ReactNode } from 'react';
import { applyTheme, readStoredTheme, storeTheme } from '@/theme/applyTheme';
import { ThemeContext } from '@/theme/themeContext';
import type { ThemeName } from '@/theme/themes';

export interface ThemeProviderProps {
  readonly children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, setThemeState] = useState<ThemeName>(readStoredTheme);

  // Layout effect, so the tokens are on <html> before the first paint (no theme flash).
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function setTheme(next: ThemeName): void {
    storeTheme(next);
    setThemeState(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
