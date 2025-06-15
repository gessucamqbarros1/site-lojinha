
export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    card: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  styles: {
    borderRadius: string;
    cardShadow: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Provençal Clássico',
    description: 'Tema padrão com tons terrosos e elegância francesa',
    preview: 'linear-gradient(135deg, #8B6F61 0%, #DCC8B6 100%)',
    colors: {
      primary: '#8B6F61',
      secondary: '#DCC8B6',
      accent: '#DCC8B6',
      background: '#FAF9F6',
      foreground: '#4A3D35',
      muted: '#F5F5F5',
      card: '#FFFFFF',
      border: '#DCC8B6',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    styles: {
      borderRadius: '0.5rem',
      cardShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    },
  },
  {
    id: 'minimal-beige',
    name: 'Minimal Bege',
    description: 'Tons neutros e clean para um visual minimalista',
    preview: 'linear-gradient(135deg, #C4A484 0%, #F5F1EB 100%)',
    colors: {
      primary: '#C4A484',
      secondary: '#F5F1EB',
      accent: '#E8DDD4',
      background: '#FEFEFE',
      foreground: '#2D2D2D',
      muted: '#F8F6F3',
      card: '#FFFFFF',
      border: '#E8DDD4',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    styles: {
      borderRadius: '0.375rem',
      cardShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    },
  },
  {
    id: 'provence-lavender',
    name: 'Provence Lavanda',
    description: 'Inspirado nos campos de lavanda da Provença',
    preview: 'linear-gradient(135deg, #8B7BA7 0%, #E6E0F0 100%)',
    colors: {
      primary: '#8B7BA7',
      secondary: '#E6E0F0',
      accent: '#C8B8D8',
      background: '#FDFCFF',
      foreground: '#3A3547',
      muted: '#F7F5FA',
      card: '#FFFFFF',
      border: '#E6E0F0',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    styles: {
      borderRadius: '0.5rem',
      cardShadow: '0 2px 4px 0 rgb(139 123 167 / 0.1)',
    },
  },
  {
    id: 'minimal-sage',
    name: 'Minimal Sálvia',
    description: 'Verde suave e natural para um ambiente sereno',
    preview: 'linear-gradient(135deg, #9CAF88 0%, #E8F0E3 100%)',
    colors: {
      primary: '#9CAF88',
      secondary: '#E8F0E3',
      accent: '#D1E0C4',
      background: '#FDFFFE',
      foreground: '#2A342A',
      muted: '#F5F8F3',
      card: '#FFFFFF',
      border: '#E8F0E3',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    styles: {
      borderRadius: '0.375rem',
      cardShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    },
  },
  {
    id: 'provence-rose',
    name: 'Provence Rosa',
    description: 'Rosa suave inspirado nas rosas francesas',
    preview: 'linear-gradient(135deg, #D4A5A5 0%, #F5E8E8 100%)',
    colors: {
      primary: '#D4A5A5',
      secondary: '#F5E8E8',
      accent: '#E8CDD0',
      background: '#FFFEFE',
      foreground: '#4A3838',
      muted: '#FAF7F7',
      card: '#FFFFFF',
      border: '#F5E8E8',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    styles: {
      borderRadius: '0.5rem',
      cardShadow: '0 2px 4px 0 rgb(212 165 165 / 0.1)',
    },
  },
  {
    id: 'minimal-charcoal',
    name: 'Minimal Carvão',
    description: 'Elegância moderna com tons escuros e contrastes suaves',
    preview: 'linear-gradient(135deg, #6B7280 0%, #F3F4F6 100%)',
    colors: {
      primary: '#6B7280',
      secondary: '#F3F4F6',
      accent: '#E5E7EB',
      background: '#FFFFFF',
      foreground: '#1F2937',
      muted: '#F9FAFB',
      card: '#FFFFFF',
      border: '#E5E7EB',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    styles: {
      borderRadius: '0.25rem',
      cardShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    },
  },
];
