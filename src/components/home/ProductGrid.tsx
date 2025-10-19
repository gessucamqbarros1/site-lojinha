import React from 'react';
import ProductCard from '@/components/ui/ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import { Product } from '@/components/ui/ProductCard';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, title }) => {
  if (loading) {
    return (
      <section className="vintage-section py-8 md:py-12">
        <div className="vintage-container">
          {title && (
            <h2 className="text-2xl md:text-3xl font-playfair text-vintage-brown mb-6 md:mb-8 text-center animate-fade-up">
              {title}
            </h2>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(8)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="vintage-section py-8 md:py-12">
        <div className="vintage-container text-center">
          <div className="text-5xl mb-3">📦</div>
          <h3 className="text-lg font-playfair text-vintage-brown mb-2">
            Nenhum produto disponível
          </h3>
          <p className="text-sm text-vintage-dark/70">
            Em breve teremos novidades por aqui!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="vintage-section py-8 md:py-12">
      <div className="vintage-container">
        {title && (
          <h2 className="text-2xl md:text-3xl font-playfair text-vintage-brown mb-6 md:mb-8 text-center animate-fade-up">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${(index % 4) * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
