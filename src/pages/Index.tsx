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

const FALLBACK_BANNER = "/placeholder.svg";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { products, categories, loading: productsLoading } = useProducts();
  const { storeSettings, loading: settingsLoading } = useStoreSettings();
  
  const loading = productsLoading || settingsLoading;

  const title = `${storeSettings.name} - Produtos de Beleza e Acessórios`;
  const description = "Descubra nossa coleção exclusiva de produtos de beleza e acessórios com estilo provençal francês. Qualidade premium e preços justos.";
  const url = typeof window !== "undefined" ? window.location.origin : "";
  const image = storeSettings.banner || FALLBACK_BANNER;

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
        banner={storeSettings.banner || FALLBACK_BANNER}
        storeName={storeSettings.name}
      />
      
      {/* Category Filters */}
      <section className="vintage-section py-4 md:py-6">
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
