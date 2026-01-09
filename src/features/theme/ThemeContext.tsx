import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ThemeId = 'dark' | 'white' | 'lotus' | 'zen';

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'zen-theme-pref';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem(STORAGE_KEY) as ThemeId) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    // Remove old classes
    document.body.classList.remove('theme-dark', 'theme-white', 'theme-lotus', 'theme-zen');
    // Add new class
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
