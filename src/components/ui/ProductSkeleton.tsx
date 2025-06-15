
import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="vintage-card overflow-hidden animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-vintage-beige/20 to-vintage-beige/40 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>
      <div className="p-6 space-y-3">
        <div className="h-6 bg-vintage-beige/30 rounded-md w-3/4"></div>
        <div className="h-4 bg-vintage-beige/20 rounded w-full"></div>
        <div className="h-4 bg-vintage-beige/20 rounded w-2/3"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-vintage-beige/40 rounded-md w-1/3"></div>
          <div className="h-6 bg-vintage-beige/20 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
