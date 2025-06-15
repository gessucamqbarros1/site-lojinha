
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, themes } from '@/types/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    // Load theme from localStorage
    const savedThemeId = localStorage.getItem('selected-theme');
    if (savedThemeId) {
      const savedTheme = themes.find(theme => theme.id === savedThemeId);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to CSS custom properties
    const root = document.documentElement;
    
    // Apply colors
    root.style.setProperty('--theme-primary', currentTheme.colors.primary);
    root.style.setProperty('--theme-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--theme-accent', currentTheme.colors.accent);
    root.style.setProperty('--theme-background', currentTheme.colors.background);
    root.style.setProperty('--theme-foreground', currentTheme.colors.foreground);
    root.style.setProperty('--theme-muted', currentTheme.colors.muted);
    root.style.setProperty('--theme-card', currentTheme.colors.card);
    root.style.setProperty('--theme-border', currentTheme.colors.border);
    
    // Apply fonts
    root.style.setProperty('--theme-font-heading', currentTheme.fonts.heading);
    root.style.setProperty('--theme-font-body', currentTheme.fonts.body);
    
    // Apply styles
    root.style.setProperty('--theme-border-radius', currentTheme.styles.borderRadius);
    root.style.setProperty('--theme-card-shadow', currentTheme.styles.cardShadow);
    
    // Update body classes for font families
    document.body.className = document.body.className.replace(/font-\w+/g, '');
    if (currentTheme.fonts.body === 'Inter') {
      document.body.classList.add('font-inter');
    } else if (currentTheme.fonts.body === 'Playfair Display') {
      document.body.classList.add('font-playfair');
    }
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('selected-theme', themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
