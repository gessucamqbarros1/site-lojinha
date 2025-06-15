
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
  about_headline?: string;
  about_text?: string;
  whatsapp_number: string;
  instagram_link: string;
  story_text?: string;
  story_image?: string;
}

const About = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: 'Minha Lojinha',
    logo: '/placeholder.svg',
    banner: '/placeholder.svg',
    about_headline: 'Sobre Nossa Loja',
    about_text: 'Uma boutique online que oferece produtos de beleza e acessórios selecionados com cuidado, para uma experiência de compra exclusiva e elegante.',
    whatsapp_number: '',
    instagram_link: '',
    story_text: '', // novo
    story_image: '', // novo
  });

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        console.log('About: Fetching store settings...');
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
          const settings = data[0];
          setStoreSettings({
            name: settings.name || 'Minha Lojinha',
            logo: settings.logo || '/placeholder.svg',
            banner: settings.banner || '/placeholder.svg',
            about_headline: settings.about_headline || 'Sobre Nossa Loja',
            about_text: settings.about_text || 'Uma boutique online que oferece produtos de beleza e acessórios selecionados com cuidado, para uma experiência de compra exclusiva e elegante.',
            whatsapp_number: settings.whatsapp_number || '',
            instagram_link: settings.instagram_link || '',
            story_text: settings.story_text || '',
            story_image: settings.story_image || '',
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
          headline={storeSettings.about_headline || 'Sobre Nossa Loja'}
          about={storeSettings.about_text || ''}
        />
        <OurStory 
          storeName={storeSettings.name}
          banner={storeSettings.story_image || storeSettings.banner}
          storyText={storeSettings.story_text}
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
