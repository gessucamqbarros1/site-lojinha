
import React from 'react';

interface AboutHeroProps {
  headline?: string;
  about: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({ headline = "Sobre Nossa Loja", about }) => {
  return (
    <section className="vintage-section bg-vintage-beige/20">
      <div className="vintage-container">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-playfair text-vintage-brown mb-6">
            {headline}
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
