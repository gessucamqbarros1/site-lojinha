
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { products, categories, storeSettings } from '@/lib/mockData';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const filteredProducts = selectedCategory === "Todos" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Banner Section */}
      <section 
        className="relative bg-center bg-cover h-[30vh] sm:h-[40vh] md:h-[50vh]" 
        style={{ 
          backgroundImage: `url(${storeSettings.banner || "/placeholder.svg"})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-vintage-brown/30"></div>
        <div className="relative z-10 vintage-container h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-playfair font-medium drop-shadow-lg mb-4">
              {storeSettings.name}
            </h1>
            <p className="text-white text-lg md:text-xl max-w-lg mx-auto drop-shadow-md">
              Produtos de beleza e acessórios com estilo único e elegante
            </p>
          </div>
        </div>
      </section>
      
      {/* Category Filters */}
      <section className="vintage-section pt-8 pb-4">
        <div className="vintage-container">
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
          <h2 className="text-2xl md:text-3xl font-playfair text-vintage-brown mb-8 text-center">
            {selectedCategory === "Todos" ? "Nossos Produtos" : selectedCategory}
          </h2>
          
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
        </div>
      </section>
      
      {/* Features Section */}
      <section className="vintage-section bg-vintage-beige/20 py-12">
        <div className="vintage-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-vintage-beige rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-vintage-brown">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl mb-2 text-vintage-brown">Produtos Selecionados</h3>
              <p className="text-vintage-dark/80 text-sm">
                Curadoria especial de produtos de beleza e acessórios com qualidade premium.
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-vintage-beige rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-vintage-brown">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl mb-2 text-vintage-brown">Estilo Único</h3>
              <p className="text-vintage-dark/80 text-sm">
                Design inspirado no estilo provençal francês, trazendo elegância e sofisticação.
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-vintage-beige rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-vintage-brown">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607l-9.581-9.581A2.25 2.25 0 0010.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl mb-2 text-vintage-brown">Preço Justo</h3>
              <p className="text-vintage-dark/80 text-sm">
                Produtos de qualidade com preços acessíveis para nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
