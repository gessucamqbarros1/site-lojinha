
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Check } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="animate-fade-up">
      <label className="block text-sm font-medium text-vintage-dark mb-6">
        Tema do Site
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableThemes.map((theme, index) => (
          <div
            key={theme.id}
            className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-500 hover-lift animate-fade-up ${
              currentTheme.id === theme.id
                ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg scale-105'
                : 'border-vintage-beige/30 hover:border-vintage-beige hover:shadow-md'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setTheme(theme.id)}
          >
            {currentTheme.id === theme.id && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-accent text-white rounded-full p-2 shadow-lg animate-pulse-soft">
                <Check size={14} />
              </div>
            )}
            
            {/* Theme preview with gradient overlay */}
            <div
              className="w-full h-20 rounded-lg mb-4 border border-vintage-beige/30 relative overflow-hidden group transition-transform duration-300 hover:scale-105"
              style={{ background: theme.preview }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <h4 className="font-medium text-vintage-dark mb-2 text-lg gradient-text">{theme.name}</h4>
            <p className="text-sm text-vintage-dark/70 mb-4 leading-relaxed">{theme.description}</p>
            
            {/* Color palette with enhanced effects */}
            <div className="flex gap-3 mb-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-125 transition-transform duration-300"
                style={{ backgroundColor: theme.colors.primary }}
                title="Cor primária"
              ></div>
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-125 transition-transform duration-300"
                style={{ backgroundColor: theme.colors.secondary }}
                title="Cor secundária"
              ></div>
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-125 transition-transform duration-300"
                style={{ backgroundColor: theme.colors.accent }}
                title="Cor de destaque"
              ></div>
            </div>
            
            <div className="text-xs text-vintage-dark/60 font-medium">
              <div>Tipografia: {theme.fonts.heading} / {theme.fonts.body}</div>
            </div>
            
            {/* Subtle bottom accent line */}
            <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-vintage-beige/40 to-transparent"></div>
          </div>
        ))}
      </div>
      
      <p className="text-sm text-vintage-dark/60 mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        Selecione um tema para personalizar a aparência do seu site. As mudanças serão aplicadas imediatamente com animações suaves.
      </p>
    </div>
  );
};

export default ThemeSelector;
