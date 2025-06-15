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
  about_headline: string;
  about_headline_font: string;
  about_headline_color: string;
  about_headline_size: string;
  about_text_font: string;
  about_text_color: string;
  about_text_size: string;
}

const About = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: 'Minha Lojinha',
    logo: '/placeholder.svg',
    banner: '/placeholder.svg',
    about: 'Uma boutique online que oferece produtos de beleza e acessórios selecionados com cuidado, para uma experiência de compra exclusiva e elegante.',
    whatsapp_number: '',
    instagram_link: '',
    about_headline: 'Sobre Nossa Loja',
    about_headline_font: 'Arial',
    about_headline_color: '#333',
    about_headline_size: '16px',
    about_text_font: 'Arial',
    about_text_color: '#666',
    about_text_size: '14px'
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
        
        console.log('About: Store settings fetched:', data);
        
        if (data && data.length > 0) {
          const settings = data[0];
          console.log('About: Banner URL:', settings.banner);
          
          setStoreSettings({
            name: settings.name || 'Minha Lojinha',
            logo: settings.logo || '/placeholder.svg',
            banner: settings.banner || '/placeholder.svg',
            about: settings.about_text || settings.about || '',
            whatsapp_number: settings.whatsapp_number || '',
            instagram_link: settings.instagram_link || '',
            about_headline: settings.about_headline || 'Sobre Nossa Loja',
            about_headline_font: settings.about_headline_font,
            about_headline_color: settings.about_headline_color,
            about_headline_size: settings.about_headline_size,
            about_text_font: settings.about_text_font,
            about_text_color: settings.about_text_color,
            about_text_size: settings.about_text_size,
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
          about={storeSettings.about}
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
