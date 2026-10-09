import { createContext } from 'react';
import type { ThemeName } from '@/theme/themes';

export interface ThemeContextValue {
  readonly theme: ThemeName;
  readonly setTheme: (theme: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
