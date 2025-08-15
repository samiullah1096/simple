import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Apply theme to document
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(newTheme);
  };

  return { theme, toggleTheme };
}
