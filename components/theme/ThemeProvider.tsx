'use client';

// Manages light/dark theme, persisting preference and exposing a toggle hook.
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isReady: boolean;
};

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
};

const STORAGE_KEY = 'hisense-theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isReady, setIsReady] = useState(false);

  const applyTheme = useCallback((value: Theme) => {
    const root = document.documentElement;
    root.dataset.theme = value;
    root.classList.toggle('dark', value === 'dark');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    /* eslint-disable react-hooks/set-state-in-effect */
    const storedTheme = window.localStorage.getItem(STORAGE_KEY) as Theme | null;

    if (storedTheme === 'light' || storedTheme === 'dark') {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
      setIsReady(true);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolvedTheme = prefersDark ? 'dark' : defaultTheme;
    setThemeState(resolvedTheme);
    applyTheme(resolvedTheme);
    setIsReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [applyTheme, defaultTheme]);

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') {
      return;
    }
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [applyTheme, theme, isReady]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isReady,
    }),
    [theme, setTheme, toggleTheme, isReady],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
