
import React from 'react';

interface ProductBadgeProps {
  type: 'new' | 'popular' | 'sale';
  className?: string;
}

// badgeConfig: nomes e cores, fonte menor, padding menor
const badgeConfig = {
  new: {
    label: 'Produto novo',
    className: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
  },
  popular: {
    label: 'Mais vendido',
    className: 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
  },
  sale: {
    label: 'Em oferta',
    className: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
  }
};

const ProductBadge: React.FC<ProductBadgeProps> = ({ type, className = '' }) => {
  const config = badgeConfig[type];
  return (
    <span 
      className={`absolute top-1.5 left-1.5 z-20 px-1.5 py-0.5 text-[9px] font-semibold rounded-full shadow animate-pulse-soft tracking-wide uppercase leading-none ${config.className} ${className}`}
      style={{ letterSpacing: '0.02em' }}
    >
      {config.label}
    </span>
  );
};

export default ProductBadge;
