import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    localStorage.setItem('theme', 'dark');
    document.body.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    // Theme toggle is disabled, always dark mode
  };

  return { theme: 'dark' as const, toggleTheme };
};
