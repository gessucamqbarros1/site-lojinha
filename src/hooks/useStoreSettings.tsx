import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StoreSettings {
  id?: string;
  name: string;
  logo: string;
  banner: string;
  about: string;
  whatsapp_number: string;
  instagram_link: string;
}

export const useStoreSettings = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: 'Minha Loja',
    logo: '',
    banner: '',
    about: '',
    whatsapp_number: '',
    instagram_link: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .limit(1)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setStoreSettings({
            id: data.id,
            name: data.name || 'Minha Loja',
            logo: data.logo || '',
            banner: data.banner || '',
            about: data.about || '',
            whatsapp_number: data.whatsapp_number || '',
            instagram_link: data.instagram_link || ''
          });
        }
      } catch (error) {
        console.error('Error fetching store settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  return { storeSettings, loading };
};
