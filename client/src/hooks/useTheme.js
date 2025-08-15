import { useEffect } from 'react';

export function useTheme() {
  useEffect(() => {
    // Always use dark theme
    const html = document.documentElement;
    html.classList.remove('light');
    html.classList.add('dark');
  }, []);

  return { theme: 'dark' };
}
