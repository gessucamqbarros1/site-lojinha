
import React from 'react';

interface ProductBadgeProps {
  type: 'new' | 'popular' | 'sale';
  className?: string;
}

const ProductBadge: React.FC<ProductBadgeProps> = ({ type, className = '' }) => {
  const badgeConfig = {
    new: {
      label: 'Novo',
      className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
    },
    popular: {
      label: 'Popular',
      className: 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
    },
    sale: {
      label: 'Oferta',
      className: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
    }
  };

  const config = badgeConfig[type];

  return (
    <span 
      className={`absolute top-2 left-2 z-20 px-2 py-1 text-xs font-medium rounded-full shadow-md animate-pulse-soft ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default ProductBadge;
