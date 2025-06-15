
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
    
    // Apply colors to both theme variables and Tailwind CSS variables
    root.style.setProperty('--theme-primary', currentTheme.colors.primary);
    root.style.setProperty('--theme-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--theme-accent', currentTheme.colors.accent);
    root.style.setProperty('--theme-background', currentTheme.colors.background);
    root.style.setProperty('--theme-foreground', currentTheme.colors.foreground);
    root.style.setProperty('--theme-muted', currentTheme.colors.muted);
    root.style.setProperty('--theme-card', currentTheme.colors.card);
    root.style.setProperty('--theme-border', currentTheme.colors.border);
    
    // Update Tailwind variables to match theme
    const primaryHsl = hexToHsl(currentTheme.colors.primary);
    const secondaryHsl = hexToHsl(currentTheme.colors.secondary);
    const backgroundHsl = hexToHsl(currentTheme.colors.background);
    const foregroundHsl = hexToHsl(currentTheme.colors.foreground);
    const mutedHsl = hexToHsl(currentTheme.colors.muted);
    const cardHsl = hexToHsl(currentTheme.colors.card);
    const borderHsl = hexToHsl(currentTheme.colors.border);
    const accentHsl = hexToHsl(currentTheme.colors.accent);
    
    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--primary-foreground', backgroundHsl);
    root.style.setProperty('--secondary', secondaryHsl);
    root.style.setProperty('--secondary-foreground', foregroundHsl);
    root.style.setProperty('--background', backgroundHsl);
    root.style.setProperty('--foreground', foregroundHsl);
    root.style.setProperty('--muted', mutedHsl);
    root.style.setProperty('--muted-foreground', foregroundHsl);
    root.style.setProperty('--card', cardHsl);
    root.style.setProperty('--card-foreground', foregroundHsl);
    root.style.setProperty('--border', borderHsl);
    root.style.setProperty('--input', borderHsl);
    root.style.setProperty('--accent', accentHsl);
    root.style.setProperty('--accent-foreground', foregroundHsl);
    
    // Apply fonts
    root.style.setProperty('--theme-font-heading', currentTheme.fonts.heading);
    root.style.setProperty('--theme-font-body', currentTheme.fonts.body);
    
    // Apply styles
    root.style.setProperty('--theme-border-radius', currentTheme.styles.borderRadius);
    root.style.setProperty('--theme-card-shadow', currentTheme.styles.cardShadow);
    root.style.setProperty('--radius', currentTheme.styles.borderRadius);
    
    // Update body classes for font families
    document.body.className = document.body.className.replace(/font-\w+/g, '');
    if (currentTheme.fonts.body === 'Inter') {
      document.body.classList.add('font-inter');
    } else if (currentTheme.fonts.body === 'Playfair Display') {
      document.body.classList.add('font-playfair');
    }
    
    // Update body background
    document.body.style.backgroundColor = currentTheme.colors.background;
    document.body.style.color = currentTheme.colors.foreground;
    
    console.log('Theme applied:', currentTheme.name, currentTheme.colors);
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('selected-theme', themeId);
      console.log('Theme changed to:', theme.name);
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

// Helper function to convert hex to HSL
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
