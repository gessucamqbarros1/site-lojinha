
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
      <div className="vintage-card overflow-hidden flex flex-col h-full transition-transform duration-300 group-hover:-translate-y-1">
        {/* Product image carousel */}
        <ProductImageCarousel 
          images={productImages}
          productName={product.name}
        />
        
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
