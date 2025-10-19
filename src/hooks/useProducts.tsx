import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/components/ui/ProductCard';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          const formattedProducts = data.map((product) => {
            let images: string[] = [];
            if (Array.isArray(product.images)) {
              images = product.images.filter((img): img is string => typeof img === 'string');
            }
            
            if (images.length === 0 && product.image) {
              images = [product.image];
            }
            
            const mainImage = images.length > 0 ? images[0] : (product.image || '/placeholder.svg');
            
            // Auto-detect badges: new (last 7 days), popular (placeholder), sale (auto from discount)
            const isNew = new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
            const isOnSale = product.discount_percentage && product.discount_percentage > 0;
            
            let badge: 'new' | 'popular' | 'sale' | undefined;
            if (isOnSale) {
              badge = 'sale';
            } else if (isNew) {
              badge = 'new';
            }
            
            return {
              id: product.id.toString(),
              name: product.name,
              description: product.description,
              price: parseFloat(product.price.toString()),
              original_price: product.original_price ? parseFloat(product.original_price.toString()) : undefined,
              discount_percentage: product.discount_percentage ? parseFloat(product.discount_percentage.toString()) : undefined,
              image: mainImage,
              images: images,
              category: product.category,
              purchaseLink: product.purchase_link,
              badge,
              created_at: product.created_at
            };
          });
          
          setProducts(formattedProducts);
          
          const uniqueCategories = ['Todos', ...new Set(formattedProducts.map(p => p.category))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar os produtos. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);

  return { products, categories, loading };
};
