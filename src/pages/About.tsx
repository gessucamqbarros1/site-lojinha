
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
}

const About = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: 'Minha Lojinha',
    logo: '/placeholder.svg',
    banner: '',
    about: 'Uma boutique online que oferece produtos de beleza e acessórios selecionados com cuidado, para uma experiência de compra exclusiva e elegante.',
    whatsapp_number: '',
    instagram_link: ''
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
          setStoreSettings({
            name: settings.name || 'Minha Lojinha',
            logo: settings.logo || '/placeholder.svg',
            banner: settings.banner || '',
            about: settings.about || 'Uma boutique online que oferece produtos de beleza e acessórios selecionados com cuidado, para uma experiência de compra exclusiva e elegante.',
            whatsapp_number: settings.whatsapp_number || '',
            instagram_link: settings.instagram_link || ''
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
