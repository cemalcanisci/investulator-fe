import type { JSX } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useTheme } from '@/hooks/useTheme';
import { ThemeProvider } from '@/theme/ThemeProvider';

function Probe(): JSX.Element {
  const { theme, setTheme } = useTheme();
  return (
    <button type="button" onClick={() => setTheme('dark')}>
      {theme}
    </button>
  );
}

describe('ThemeProvider', () => {
  it('starts with the default theme and applies it to <html>', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('default');
    expect(document.documentElement.dataset.theme).toBe('default');
  });

  it('starts with the stored theme', () => {
    localStorage.setItem('inv-theme', 'light');

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('switches the theme, applies it and remembers it', async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toHaveTextContent('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('inv-theme')).toBe('dark');
  });
});
