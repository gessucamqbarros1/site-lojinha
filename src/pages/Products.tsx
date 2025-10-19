import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import SearchBar from '@/components/ui/SearchBar';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import Newsletter from '@/components/ui/Newsletter';
import { Product } from '@/components/ui/ProductCard';
import SEOHead from "@/components/SEO/SEOHead";
import CategoryFilter from "@/components/ui/CategoryFilter";
import ProductPagination from "@/components/ui/ProductPagination";
import { useProducts } from '@/hooks/useProducts';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { products, categories, loading } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ minPrice?: number; maxPrice?: number; category?: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;
  const title = "Nossos Produtos | Minha Lojinha";
  const description = "Conheça nossos produtos de beleza e acessórios estilo provençal francês. Produtos exclusivos, promoções e novidades da sua lojinha favorita!";
  const url = typeof window !== "undefined" ? window.location.origin + "/products" : "";
  const image = "/opengraph-image-p98pqg.png";

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((newFilters: { minPrice?: number; maxPrice?: number; category?: string }) => {
    setFilters(newFilters);
    if (newFilters.category) {
      setSelectedCategory(newFilters.category);
    }
  }, []);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, filters]);

  // Cálculo de paginação
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);

  useEffect(() => {
    // Resetar para a primeira página se filtro muda
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, filters]);

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
          
          <div className="mb-3 text-center text-xs text-vintage-dark/60">
            {filteredProducts.length === 0
              ? "Nenhum produto encontrado"
              : `Mostrando ${startIdx + 1}–${Math.min(startIdx + currentProducts.length, filteredProducts.length)} de ${filteredProducts.length} produto(s)`}
          </div>
          
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
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="animate-fade-up"
                        style={{ animationDelay: `${(index % 4) * 0.1}s` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={setCurrentPage}
                  />
                </>
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
