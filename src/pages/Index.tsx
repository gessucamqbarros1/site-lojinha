import React, { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryFilter from "@/components/ui/CategoryFilter";
import HeroBanner from "@/components/home/HeroBanner";
import ProductGrid from "@/components/home/ProductGrid";
import FeaturesSection from "@/components/home/FeaturesSection";
import SEOHead from "@/components/SEO/SEOHead";
import { useProducts } from "@/hooks/useProducts";
import { useStoreSettings } from "@/hooks/useStoreSettings";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { products, categories, loading: productsLoading } = useProducts();
  const { storeSettings, loading: settingsLoading } = useStoreSettings();
  
  const loading = productsLoading || settingsLoading;

  const title = `${storeSettings.name} - Produtos de Beleza e Acessórios`;
  const description = "Descubra nossa coleção exclusiva de produtos de beleza e acessórios com estilo provençal francês. Qualidade premium e preços justos.";
  const url = typeof window !== "undefined" ? window.location.origin : "";
  const image = storeSettings.banner || "/lovable-uploads/b0a2f738-0c82-4bc0-baef-73ecd1437c15.png";

  // Memoize filtered products to avoid unnecessary recalculations
  const filteredProducts = useMemo(
    () => selectedCategory === "Todos"
      ? products
      : products.filter(product => product.category === selectedCategory),
    [products, selectedCategory]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={title} description={description} url={url} image={image} />
      <Navbar />
      
      {/* Hero Banner */}
      <HeroBanner
        banner={storeSettings.banner || "/lovable-uploads/b0a2f738-0c82-4bc0-baef-73ecd1437c15.png"}
        storeName={storeSettings.name}
      />
      
      {/* Category Filters */}
      <section className="vintage-section pt-8 pb-4">
        <div className="vintage-container">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
            products={products}
          />
        </div>
      </section>
      
      {/* Products Section */}
      <ProductGrid
        products={filteredProducts}
        loading={loading}
        title={selectedCategory === "Todos" ? "Nossos Produtos" : selectedCategory}
      />
      
      {/* Features Section */}
      <FeaturesSection />
      
      <Footer />
    </div>
  );
};

export default Index;
