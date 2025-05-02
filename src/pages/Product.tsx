
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { products } from '@/lib/mockData';
import { Product as ProductType } from '@/components/ui/ProductCard';
import { ArrowLeft } from 'lucide-react';

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const foundProduct = products.find(p => p.id === id) || null;
      setProduct(foundProduct);
      setLoading(false);
    }, 300);
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-vintage-beige/50 rounded-md mb-4"></div>
            <div className="h-64 w-64 bg-vintage-beige/30 rounded-md"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-playfair text-vintage-brown mb-4">Produto não encontrado</h2>
            <Link to="/" className="vintage-button">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow vintage-section">
        <div className="vintage-container">
          <Link to="/" className="inline-flex items-center text-vintage-brown hover:text-primary mb-6 transition-colors">
            <ArrowLeft size={18} className="mr-1" />
            Voltar para produtos
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-white rounded-md overflow-hidden border border-vintage-beige/30 shadow-sm">
              <img 
                src={product.image || "/placeholder.svg"} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="text-xs px-2 py-1 bg-vintage-beige/30 rounded-full text-vintage-brown">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-vintage-brown mb-4">
                {product.name}
              </h1>
              
              <div className="text-2xl text-primary font-medium mb-6">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(product.price)}
              </div>
              
              <div className="vintage-divider my-4"></div>
              
              <div className="mb-8">
                <h3 className="text-lg font-playfair mb-2 text-vintage-brown">Descrição</h3>
                <p className="text-vintage-dark/80">
                  {product.description}
                </p>
              </div>
              
              {/* Purchase Actions */}
              <div className="mt-auto">
                <a 
                  href={product.purchaseLink || "https://wa.me/5511999999999?text=Olá! Gostaria de informações sobre o produto: " + product.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full vintage-button flex items-center justify-center py-3"
                >
                  Comprar
                </a>
                
                <div className="mt-4 text-center text-sm text-vintage-dark/70">
                  <p>Ao clicar em comprar você será redirecionado para o checkout.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Suggested Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-playfair text-vintage-brown mb-8 text-center">
              Você também pode gostar
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products
                .filter(p => p.id !== product.id && p.category === product.category)
                .slice(0, 4)
                .map(product => (
                  <Link key={product.id} to={`/product/${product.id}`} className="block group">
                    <div className="vintage-card overflow-hidden">
                      <div className="aspect-square overflow-hidden bg-vintage-cream">
                        <img 
                          src={product.image || '/placeholder.svg'} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-playfair text-lg text-vintage-dark mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="text-primary font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(product.price)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Product;
