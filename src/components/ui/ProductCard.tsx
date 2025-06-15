
import React from 'react';
import { Link } from 'react-router-dom';
import ProductImageCarousel from './ProductImageCarousel';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  purchaseLink?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : ['/placeholder.svg']);
  
  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="vintage-card overflow-hidden flex flex-col h-full hover-lift animate-fade-up relative">
        {/* Subtle shimmer effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-10 pointer-events-none"></div>
        
        {/* Product image carousel with enhanced effects */}
        <div className="relative overflow-hidden">
          <ProductImageCarousel 
            images={productImages}
            productName={product.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        {/* Product info with enhanced spacing and animations */}
        <div className="p-6 flex flex-col flex-grow relative z-20">
          <h3 className="font-playfair text-lg text-vintage-dark mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-vintage-dark/70 mb-4 line-clamp-2 flex-grow leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-black font-semibold text-lg">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(product.price)}
            </span>
            <span className="text-xs px-3 py-1.5 bg-gradient-to-r from-vintage-beige/20 to-vintage-beige/30 backdrop-blur-sm rounded-full text-vintage-brown border border-vintage-beige/40 group-hover:scale-110 transition-transform duration-300">
              {product.category}
            </span>
          </div>
          
          {/* Subtle bottom border effect */}
          <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-vintage-beige/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
