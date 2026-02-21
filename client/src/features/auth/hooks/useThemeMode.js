import { useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'nexusfleet-theme';

export default function useThemeMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return stored === 'dark';
    }

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return { isDark, toggleTheme };
}
