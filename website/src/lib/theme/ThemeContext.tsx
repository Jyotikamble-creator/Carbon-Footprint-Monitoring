'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme from localStorage and system preference
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return true; // Default to dark on server
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return savedTheme ? savedTheme === 'dark' : prefersDark;
    } catch {
      return true; // Default to dark if localStorage fails
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(true); // Start with dark theme

  // Apply theme to document when component mounts or theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const newDarkMode = getInitialTheme();
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;

    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    try {
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    } catch {
      // Ignore localStorage errors
    }

    const root = document.documentElement;
    if (newDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}