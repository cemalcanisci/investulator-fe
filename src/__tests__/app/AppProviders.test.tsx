import type { JSX } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '@/app/AppProviders';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

function CurrentPath(): JSX.Element {
  return <p>{useLocation().pathname}</p>;
}

function Controls(): JSX.Element {
  const { setTheme } = useTheme();
  const { setLanguage } = useLanguage();
  return (
    <>
      <button type="button" onClick={() => setTheme('dark')}>
        dark
      </button>
      <button type="button" onClick={() => setLanguage('en')}>
        english
      </button>
    </>
  );
}

describe('AppProviders', () => {
  it('provides a router to its children', () => {
    render(
      <AppProviders>
        <CurrentPath />
      </AppProviders>,
    );

    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('applies the default theme and the Turkish document language', () => {
    render(
      <AppProviders>
        <CurrentPath />
      </AppProviders>,
    );

    expect(document.documentElement.dataset.theme).toBe('default');
    expect(document.documentElement.lang).toBe('tr');
  });

  it('follows theme and language changes', async () => {
    render(
      <AppProviders>
        <Controls />
      </AppProviders>,
    );

    await userEvent.click(screen.getByText('dark'));
    await userEvent.click(screen.getByText('english'));

    expect(document.documentElement.dataset.theme).toBe('dark');
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('en');
    });
  });
});
