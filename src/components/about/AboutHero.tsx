
import React from 'react';

interface AboutHeroProps {
  storeName: string;
  about: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({ storeName, about }) => {
  return (
    <section className="vintage-section bg-vintage-beige/20">
      <div className="vintage-container">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-playfair text-vintage-brown mb-6">
            Sobre Nossa Loja
          </h1>
          <div className="w-16 h-1 bg-vintage-beige mx-auto mb-8"></div>
          <div 
            className="prose prose-vintage mx-auto"
            dangerouslySetInnerHTML={{ __html: about }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
