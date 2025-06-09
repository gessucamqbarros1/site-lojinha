
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/components/ui/ProductCard';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
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
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedProducts = data.map(product => ({
            id: product.id.toString(), // Convert ID to string
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            image: product.image || '/placeholder.svg',
            category: product.category,
            purchaseLink: product.purchase_link
          }));
          
          setProducts(formattedProducts);
          
          // Extract unique categories from products
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

  const filteredProducts = selectedCategory === "Todos" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Category Filters */}
      <section className="vintage-section pt-8 pb-4">
        <div className="vintage-container">
          <h1 className="text-3xl font-playfair text-vintage-brown mb-6 text-center">Nossos Produtos</h1>
          
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm md:text-base transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-vintage-beige/30 text-vintage-brown hover:bg-vintage-beige/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="vintage-section py-8 flex-grow">
        <div className="vintage-container">
          {selectedCategory !== "Todos" && (
            <h2 className="text-2xl md:text-3xl font-playfair text-vintage-brown mb-8 text-center">
              {selectedCategory}
            </h2>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="vintage-card overflow-hidden animate-pulse">
                  <div className="aspect-square bg-vintage-beige/30"></div>
                  <div className="p-4">
                    <div className="h-6 bg-vintage-beige/30 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-vintage-beige/30 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p>Nenhum produto encontrado nesta categoria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Products;
