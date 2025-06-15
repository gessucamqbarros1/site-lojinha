
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Check } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div>
      <label className="block text-sm font-medium text-theme-foreground mb-4">
        Tema do Site
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableThemes.map((theme) => (
          <div
            key={theme.id}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              currentTheme.id === theme.id
                ? 'border-theme-primary bg-theme-primary/5'
                : 'border-theme-border hover:border-theme-primary'
            }`}
            onClick={() => setTheme(theme.id)}
          >
            {currentTheme.id === theme.id && (
              <div className="absolute top-2 right-2 bg-theme-primary text-theme-background rounded-full p-1">
                <Check size={12} />
              </div>
            )}
            
            <div
              className="w-full h-16 rounded-md mb-3 border border-theme-border"
              style={{ background: theme.preview }}
            ></div>
            
            <h4 className="font-medium text-theme-foreground mb-1">{theme.name}</h4>
            <p className="text-xs text-theme-foreground opacity-70 mb-3">{theme.description}</p>
            
            <div className="flex gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full border border-theme-border"
                style={{ backgroundColor: theme.colors.primary }}
                title="Cor primária"
              ></div>
              <div
                className="w-4 h-4 rounded-full border border-theme-border"
                style={{ backgroundColor: theme.colors.secondary }}
                title="Cor secundária"
              ></div>
              <div
                className="w-4 h-4 rounded-full border border-theme-border"
                style={{ backgroundColor: theme.colors.accent }}
                title="Cor de destaque"
              ></div>
            </div>
            
            <div className="text-xs text-theme-foreground opacity-60">
              <div>Tipografia: {theme.fonts.heading} / {theme.fonts.body}</div>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-theme-foreground opacity-60 mt-4">
        Selecione um tema para personalizar a aparência do seu site. As mudanças serão aplicadas imediatamente.
      </p>
    </div>
  );
};

export default ThemeSelector;
