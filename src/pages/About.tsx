
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import OurStory from '@/components/about/OurStory';
import ContactSection from '@/components/about/ContactSection';
import { supabase } from '@/integrations/supabase/client';

// Define todos os campos que podem vir de settings
export interface StoreSettings {
  name: string;
  logo: string;
  banner: string;
  about: string;
  whatsapp_number: string;
  instagram_link: string;
  about_headline: string;
  about_headline_font: string;
  about_headline_color: string;
  about_headline_size: string;
  about_text: string;
  about_text_font: string;
  about_text_color: string;
  about_text_size: string;
  // Hero fields (mantendo compatibilidade, mesmo se não usados)
  hero_headline?: string;
  hero_headline_font?: string;
  hero_headline_color?: string;
  hero_headline_size?: string;
  hero_headline_weight?: string;
  hero_subheadline?: string;
  hero_subheadline_font?: string;
  hero_subheadline_color?: string;
  hero_subheadline_size?: string;
}

const DEFAULTS: StoreSettings = {
  name: 'Minha Lojinha',
  logo: '/placeholder.svg',
  banner: '/placeholder.svg',
  about: 'Uma boutique online que oferece produtos de beleza e acessórios selecionados com cuidado, para uma experiência de compra exclusiva e elegante.',
  whatsapp_number: '',
  instagram_link: '',
  about_headline: 'Sobre Nossa Loja',
  about_headline_font: "'Playfair Display', serif",
  about_headline_color: '#44342f',
  about_headline_size: '2rem',
  about_text: 'Uma boutique online que oferece produtos de beleza e acessórios selecionados com cuidado, para uma experiência de compra exclusiva e elegante.',
  about_text_font: 'inherit',
  about_text_color: '#44342f',
  about_text_size: '1.1rem',
  // Hero (ignorado aqui, mas mantido para compatibilidade)
  hero_headline: 'Gessica Cosméticos e Acessórios',
  hero_headline_font: "'Playfair Display', serif",
  hero_headline_color: '#44342f',
  hero_headline_size: '2.5rem',
  hero_headline_weight: '500',
  hero_subheadline: 'Uma boutique online que oferece produtos de beleza e acessórios selecionados com cuidado, para uma experiência de compra exclusiva e elegante.',
  hero_subheadline_font: 'inherit',
  hero_subheadline_color: '#44342f',
  hero_subheadline_size: '1.2rem',
};

const About = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({...DEFAULTS});

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const { data } = await supabase
          .from('store_settings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          // Misture com defaults para garantir todos os campos tipados
          setStoreSettings({
            ...DEFAULTS,
            ...data[0]
          });
        } else {
          setStoreSettings(DEFAULTS);
        }
      } catch (error) {
        setStoreSettings(DEFAULTS);
      }
    };

    fetchStoreSettings();
  }, []);

  // Os campos agora sempre existem!
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AboutHero
          storeName={storeSettings.name}
          about={storeSettings.about_text}
          aboutHeadline={storeSettings.about_headline}
          aboutHeadlineFont={storeSettings.about_headline_font}
          aboutHeadlineColor={storeSettings.about_headline_color}
          aboutHeadlineSize={storeSettings.about_headline_size}
          aboutTextFont={storeSettings.about_text_font}
          aboutTextColor={storeSettings.about_text_color}
          aboutTextSize={storeSettings.about_text_size}
        />
        <OurStory
          storeName={storeSettings.name}
          banner={storeSettings.banner}
        />
        <ContactSection
          storeName={storeSettings.name}
          instagramLink={storeSettings.instagram_link}
          whatsappNumber={storeSettings.whatsapp_number}
        />
      </main>
      <Footer />
    </div>
  );
};

export default About;

