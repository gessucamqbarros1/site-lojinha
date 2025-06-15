import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import SearchBar from '@/components/ui/SearchBar';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import Newsletter from '@/components/ui/Newsletter';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/components/ui/ProductCard';
import SEOHead from "@/components/SEO/SEOHead";
import CategoryFilter from "@/components/ui/CategoryFilter";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ minPrice?: number; maxPrice?: number; category?: string }>({});
  const { toast } = useToast();
  const title = "Nossos Produtos | Minha Lojinha";
  const description = "Conheça nossos produtos de beleza e acessórios estilo provençal francês. Produtos exclusivos, promoções e novidades da sua lojinha favorita!";
  const url = typeof window !== "undefined" ? window.location.origin + "/products" : "";
  const image = "/opengraph-image-p98pqg.png";

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
          const formattedProducts = data.map((product, index) => {
            // Handle images array - ensure it's properly formatted
            let images: string[] = [];
            if (Array.isArray(product.images)) {
              images = product.images.filter((img): img is string => typeof img === 'string');
            }
            
            // If no images in array but has main image, add it to array
            if (images.length === 0 && product.image) {
              images = [product.image];
            }
            
            // Ensure main image is the first one in the array
            const mainImage = images.length > 0 ? images[0] : (product.image || '/placeholder.svg');
            
            // Add random badges for demonstration - mas não se já estiver em oferta
            const badges: ('new' | 'popular' | 'sale')[] = ['new', 'popular', 'sale'];
            const randomBadge = Math.random() > 0.7 ? badges[index % 3] : undefined;
            
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
              badge: randomBadge
            };
          });
          
          setProducts(formattedProducts);
          setFilteredProducts(formattedProducts);
          
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

  useEffect(() => {
    let filtered = products;

    // Apply category filter
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filters
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    // Apply category filter from advanced filters
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: { minPrice?: number; maxPrice?: number; category?: string }) => {
    setFilters(newFilters);
    if (newFilters.category) {
      setSelectedCategory(newFilters.category);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={title} description={description} url={url} image={image} />
      <Navbar />
      
      {/* Hero Section with Search */}
      <section className="vintage-section pt-8 pb-4 bg-gradient-to-br from-vintage-cream to-vintage-beige/30">
        <div className="vintage-container">
          <h1 className="text-4xl md:text-5xl font-playfair text-vintage-brown mb-4 text-center animate-fade-up">
            Nossos Produtos
          </h1>
          <p className="text-center text-vintage-dark/70 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Descubra nossa coleção cuidadosamente selecionada
          </p>
          
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <SearchBar
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              categories={categories}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </section>
      
      {/* Category Filters */}
      <section className="vintage-section py-4">
        <div className="vintage-container">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
            products={products}
          />
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="vintage-section py-8 flex-grow">
        <div className="vintage-container">
          {selectedCategory !== "Todos" && !filters.category && (
            <h2 className="text-2xl md:text-3xl font-playfair text-vintage-brown mb-8 text-center animate-fade-up">
              {selectedCategory}
            </h2>
          )}
          
          {searchQuery && (
            <p className="text-center text-vintage-dark/70 mb-6 animate-fade-up">
              {filteredProducts.length} resultado(s) para "{searchQuery}"
            </p>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 animate-fade-up">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-playfair text-vintage-brown mb-2">Nenhum produto encontrado</h3>
                  <p className="text-vintage-dark/70">Tente ajustar os filtros ou buscar por outros termos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="vintage-section py-8 bg-gradient-to-r from-vintage-beige/20 to-vintage-pink/20">
        <div className="vintage-container max-w-2xl">
          <Newsletter />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Products;
