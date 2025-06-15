
import React from 'react';
import ProductBadge from './ProductBadge';
import { Product } from './ProductCard';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Checa se é oferta (badge de oferta tem prioridade)
  const isOnSale = product.discount_percentage && product.discount_percentage > 0;
  const displayBadge = isOnSale ? "sale" : product.badge === "new" ? "new" : undefined;

  return (
    <div
      className="vintage-card vintage-card-sm overflow-hidden flex flex-col h-full justify-between items-center min-w-[100px] max-w-[130px] w-full p-2 relative"
    >
      {displayBadge && (
        <ProductBadge type={displayBadge} className="top-2 left-2 text-[10px] px-2 py-0.5" />
      )}

      <div className="w-full flex flex-col items-center space-y-2 mt-2">
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
    </div>
  );
};

export default ProductCard;
