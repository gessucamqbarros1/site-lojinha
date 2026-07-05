
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  autoRotate?: boolean;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ 
  images, 
  productName, 
  autoRotate = false 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const validImages = images.filter(img => img && !img.includes('/placeholder.svg') && !failedImages.includes(img));
  const displayImages = validImages.length > 0 ? validImages : ['/placeholder.svg'];
  const hasMultipleImages = displayImages.length > 1;

  const nextImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToImage = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex(index);
  };

  return (
    <div 
      className="relative aspect-square overflow-hidden bg-vintage-cream group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <img 
        src={displayImages[currentImageIndex]} 
        alt={`${productName} - Imagem ${currentImageIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={() => {
          const failedImage = displayImages[currentImageIndex];
          if (failedImage !== '/placeholder.svg') {
            setFailedImages((current) => [...new Set([...current, failedImage])]);
            setCurrentImageIndex(0);
          }
        }}
      />
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-vintage-brown/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Navigation arrows - only show if multiple images and on hover */}
      {hasMultipleImages && isHovered && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all z-10"
            aria-label="Imagem anterior"
          >
            <ChevronLeft size={14} className="text-vintage-dark" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all z-10"
            aria-label="Próxima imagem"
          >
            <ChevronRight size={14} className="text-vintage-dark" />
          </button>
        </>
      )}
      
      {/* Dots indicator - always visible if multiple images */}
      {hasMultipleImages && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToImage(index, e)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-white shadow-md scale-110' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Image counter - only show on hover if multiple images */}
      {hasMultipleImages && isHovered && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {currentImageIndex + 1}/{displayImages.length}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
