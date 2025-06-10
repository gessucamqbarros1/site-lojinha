
import React from 'react';
import { Link } from 'react-router-dom';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Mantido para compatibilidade
  images: string[]; // Array de URLs de imagem
  category: string;
  purchaseLink?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Usa a primeira imagem do array ou a imagem antiga para compatibilidade
  const mainImage = product.images?.length > 0 
    ? product.images[0] 
    : (product.image || '/placeholder.svg');

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="vintage-card overflow-hidden flex flex-col h-full transition-transform duration-300 group-hover:-translate-y-1 shadow-sm hover:shadow-md">
        {/* Product image with overlay on hover */}
        <div className="relative aspect-square overflow-hidden bg-vintage-cream">
          <img 
            src={mainImage} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-vintage-brown/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Indicador de múltiplas imagens */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded-full text-xs font-medium text-vintage-dark flex items-center">
              <span className="mr-1">{product.images.length}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="14" x="3" y="5" rx="2" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Product info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-playfair text-lg text-vintage-dark mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-vintage-dark/70 mb-2 line-clamp-2 flex-grow">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-primary font-medium">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(product.price)}
            </span>
            <span className="text-xs px-2 py-1 bg-vintage-beige/30 rounded-full text-vintage-brown">
              {product.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
