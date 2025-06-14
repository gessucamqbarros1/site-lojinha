
import { useState } from 'react';
import { Product } from '@/components/ui/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StoreData {
  name: string;
  logo: string;
  banner: string;
  about: string;
  whatsapp_number: string;
}

export const useAdminData = () => {
  const [storeData, setStoreData] = useState<StoreData>({
    name: '',
    logo: '',
    banner: '',
    about: '',
    whatsapp_number: '',
  });
  
  const [productList, setProductList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Maquiagem', 'Skincare', 'Perfumaria', 'Acessórios']);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from Supabase...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched successfully:', data);
      
      if (data) {
        const formattedProducts: Product[] = data.map(product => ({
          id: product.id.toString(),
          name: product.name || '',
          description: product.description || '',
          price: parseFloat(product.price?.toString() || '0'),
          image: product.image || '/placeholder.svg',
          images: Array.isArray(product.images) ? 
            product.images.filter((img): img is string => typeof img === 'string') : 
            [],
          category: product.category || 'Maquiagem',
          purchaseLink: product.purchase_link || ''
        }));
        
        setProductList(formattedProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(formattedProducts.map(p => p.category).filter(Boolean))];
        if (uniqueCategories.length > 0) {
          setCategories(prevCategories => {
            const combinedCategories = [...new Set([...prevCategories, ...uniqueCategories])];
            return combinedCategories;
          });
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };
  
  const fetchStoreSettings = async () => {
    try {
      console.log('useAdminData: Fetching store settings from Supabase...');
      
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('useAdminData: Supabase error fetching store settings:', error);
        throw error;
      }
      
      console.log('useAdminData: Store settings fetched successfully:', data);
      
      if (data && data.length > 0) {
        const settings = data[0];
        const newStoreData = {
          name: settings.name || '',
          logo: settings.logo || '',
          banner: settings.banner || '',
          about: settings.about || '',
          whatsapp_number: settings.whatsapp_number || '',
        };
        
        console.log('useAdminData: Setting store data to:', newStoreData);
        setStoreData(newStoreData);
      } else {
        console.log('useAdminData: No store settings found, using defaults');
      }
    } catch (error) {
      console.error('useAdminData: Error fetching store settings:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };

  const generateWhatsAppLink = (productName: string, productPrice: number): string => {
    const whatsappNumber = storeData.whatsapp_number || '5511999999999';
    const storeName = storeData.name || 'Gessica';
    
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(productPrice);
    
    const message = `Olá, ${storeName}! Quero mais informações sobre o ${productName} de ${formattedPrice}.`;
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  return {
    storeData,
    setStoreData,
    productList,
    setProductList,
    categories,
    uploading,
    setUploading,
    saving,
    setSaving,
    deleting,
    setDeleting,
    fetchProducts,
    fetchStoreSettings,
    generateWhatsAppLink,
    toast
  };
};
