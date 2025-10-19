import React, { useState } from 'react';

interface HeroBannerProps {
  banner: string;
  storeName: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ banner, storeName }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="relative h-[35vh] md:h-[45vh] overflow-hidden group">
      {/* Blur placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-vintage-beige/40 to-vintage-pink/40 animate-pulse" />
      )}
      
      <img
        src={banner}
        alt={`Banner da loja ${storeName}`}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
          imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        loading="eager"
        onLoad={() => setImageLoaded(true)}
      />
      
      {/* Parallax overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-70"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="text-white animate-fade-up">
          <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-2 md:mb-3 drop-shadow-2xl">
            Bem-vindo à {storeName}
          </h1>
          <p className="text-base md:text-xl font-light drop-shadow-lg max-w-xl mx-auto">
            Descubra nossa coleção exclusiva
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
