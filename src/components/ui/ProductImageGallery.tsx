
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const validImages = images.filter(img => img && !img.includes('/placeholder.svg'));
  const displayImages = validImages.length > 0 ? validImages : ['/placeholder.svg'];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };
  
  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };
  
  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-md overflow-hidden border border-vintage-beige/30 shadow-sm">
        <img 
          src={displayImages[currentImageIndex]} 
          alt={`${productName} - Imagem ${currentImageIndex + 1}`} 
          className="w-full h-full object-cover"
        />
        
        {/* Navigation arrows - only show if more than 1 image */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all"
            >
              <ChevronLeft size={16} className="text-vintage-dark" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all"
            >
              <ChevronRight size={16} className="text-vintage-dark" />
            </button>
          </>
        )}
        
        {/* Image counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>
      
      {/* Thumbnails - only show if more than 1 image */}
      {displayImages.length > 1 && (
        <div className="flex space-x-2 justify-center">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                index === currentImageIndex 
                  ? 'border-primary shadow-md' 
                  : 'border-vintage-beige/30 hover:border-vintage-beige/60'
              }`}
            >
              <img 
                src={image} 
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
