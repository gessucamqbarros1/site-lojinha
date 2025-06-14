
import { useState, useEffect } from 'react';
import { Product } from '@/components/ui/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadProductImage, deleteProductImage } from '@/lib/fileUploader';

export const useAdminData = () => {
  const [storeData, setStoreData] = useState({
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
      console.log('Attempting to fetch products...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Supabase error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched successfully:', data);
      
      if (data) {
        const formattedProducts = data.map(product => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description,
          price: parseFloat(product.price.toString()),
          image: product.image || '/placeholder.svg',
          images: Array.isArray(product.images) ? 
            product.images.filter((img): img is string => typeof img === 'string') : 
            [],
          category: product.category,
          purchaseLink: product.purchase_link
        }));
        
        setProductList(formattedProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(formattedProducts.map(p => p.category))];
        if (uniqueCategories.length > 0) {
          setCategories(uniqueCategories);
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
      console.log('Attempting to fetch store settings...');
      
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Supabase error fetching store settings:', error);
        if (error.code !== 'PGRST116') {
          throw error;
        }
      }
      
      console.log('Store settings fetched successfully:', data);
      
      if (data) {
        setStoreData({
          name: data.name || '',
          logo: data.logo || '',
          banner: data.banner || '',
          about: data.about || '',
          whatsapp_number: data.whatsapp_number || '',
        });
      } else {
        console.log('No store settings found, using defaults');
        setStoreData({
          name: '',
          logo: '',
          banner: '',
          about: '',
          whatsapp_number: '',
        });
      }
    } catch (error) {
      console.error('Error fetching store settings:', error);
      setStoreData({
        name: '',
        logo: '',
        banner: '',
        about: '',
        whatsapp_number: '',
      });
    }
  };

  const generateWhatsAppLink = (productName: string, productPrice: number) => {
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
