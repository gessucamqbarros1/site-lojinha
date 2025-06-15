
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import OurStory from '@/components/about/OurStory';
import ContactSection from '@/components/about/ContactSection';
import { supabase } from '@/integrations/supabase/client';

interface StoreSettings {
  name: string;
  logo: string;
  banner: string;
  about: string;
  whatsapp_number: string;
  instagram_link: string;
  // Novos campos:
  about_headline: string;
  about_headline_font: string;
  about_headline_color: string;
  about_headline_size: string;
  about_text: string;
  about_text_font: string;
  about_text_color: string;
  about_text_size: string;
}

const DEFAULTS = {
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
};

const About = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({...DEFAULTS});

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('About: Error fetching store settings:', error);
          return;
        }

        if (data && data.length > 0) {
          const settings = data[0] || {};
          setStoreSettings({
            name: settings.name || DEFAULTS.name,
            logo: settings.logo || DEFAULTS.logo,
            banner: settings.banner || DEFAULTS.banner,
            about: settings.about || DEFAULTS.about,
            whatsapp_number: settings.whatsapp_number || DEFAULTS.whatsapp_number,
            instagram_link: settings.instagram_link || DEFAULTS.instagram_link,
            about_headline: settings.about_headline || DEFAULTS.about_headline,
            about_headline_font: settings.about_headline_font || DEFAULTS.about_headline_font,
            about_headline_color: settings.about_headline_color || DEFAULTS.about_headline_color,
            about_headline_size: settings.about_headline_size || DEFAULTS.about_headline_size,
            about_text: settings.about_text || DEFAULTS.about_text,
            about_text_font: settings.about_text_font || DEFAULTS.about_text_font,
            about_text_color: settings.about_text_color || DEFAULTS.about_text_color,
            about_text_size: settings.about_text_size || DEFAULTS.about_text_size,
          });
        }
      } catch (error) {
        console.error('About: Error in fetchStoreSettings:', error);
      }
    };

    fetchStoreSettings();
  }, []);

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

