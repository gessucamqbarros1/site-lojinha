
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  
  const validImages = images.filter(img => img && !img.includes('/placeholder.svg') && !failedImages.includes(img));
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
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-xl overflow-hidden border border-vintage-beige/30 shadow-lg group">
        <img
          src={displayImages[currentImageIndex]}
          alt={`${productName} - Imagem ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => {
            const failedImage = displayImages[currentImageIndex];
            if (failedImage !== '/placeholder.svg') {
              setFailedImages((current) => [...new Set([...current, failedImage])]);
              setCurrentImageIndex(0);
            }
          }}
        />
        
        {/* Navigation arrows - only show if more than 1 image */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"
            >
              <ChevronLeft size={20} className="text-vintage-dark" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
            >
              <ChevronRight size={20} className="text-vintage-dark" />
            </button>
          </>
        )}
        
        {/* Image counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>
      
      {/* Thumbnails - only show if more than 1 image */}
      {displayImages.length > 1 && (
        <div className="flex space-x-3 justify-center">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-vintage-beige/30 hover:border-vintage-beige/60 hover:scale-105'
              }`}
            >
              <img 
                src={image} 
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => {
                  if (image !== '/placeholder.svg') {
                    setFailedImages((current) => [...new Set([...current, image])]);
                  }
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
