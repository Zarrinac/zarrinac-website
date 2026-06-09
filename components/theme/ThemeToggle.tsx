'use client';

// Small button that flips between light/dark themes once ThemeProvider is ready.
import { HiMoon, HiSun } from 'react-icons/hi2';
import { useTheme } from './ThemeProvider';

type ThemeToggleProps = {
  className?: string;
  lightLabel: string;
  darkLabel: string;
};

export default function ThemeToggle({ className, lightLabel, darkLabel }: ThemeToggleProps) {
  const { theme, toggleTheme, isReady } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? lightLabel : darkLabel;

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      onClick={toggleTheme}
      disabled={!isReady}
    >
      {isDark ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
    </button>
  );
}
