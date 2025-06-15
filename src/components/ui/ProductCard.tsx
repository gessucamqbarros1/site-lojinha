
import React from 'react';
import ProductBadge from './ProductBadge';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  image: string;
  images?: string[];
  category?: string;
  purchaseLink?: string;
  badge?: "new" | "popular" | "sale";
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Checa se é oferta (badge de oferta tem prioridade)
  const isOnSale = !!product.discount_percentage && product.discount_percentage > 0;
  const displayBadge = isOnSale ? "sale" : product.badge === "new" ? "new" : undefined;

  return (
    <div className="vintage-card vintage-card-sm overflow-hidden flex flex-col h-full items-center min-w-[90px] max-w-[120px] w-full p-2 relative">
      {/* Badge */}
      {displayBadge && (
        <ProductBadge type={displayBadge} className="top-2 left-2 text-[10px] px-2 py-0.5" />
      )}
      {/* Imagem */}
      <div className="w-full aspect-[1/1] rounded-lg overflow-hidden bg-vintage-cream mb-2 mt-1 flex items-center justify-center">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {/* Preço */}
      <span className="text-primary font-bold text-xs sm:text-sm mb-1">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(product.price)}
      </span>
      {/* Nome */}
      <h3 className="font-playfair text-xs text-vintage-dark line-clamp-2 text-center leading-tight">
        {product.name}
      </h3>
    </div>
  );
};

export default ProductCard;
