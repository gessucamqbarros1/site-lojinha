
import React from 'react';

interface AboutHeroProps {
  storeName: string;
  about: string;
  aboutHeadline?: string;
  aboutHeadlineFont?: string;
  aboutHeadlineColor?: string;
  aboutHeadlineSize?: string;
  aboutTextFont?: string;
  aboutTextColor?: string;
  aboutTextSize?: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({
  storeName,
  about,
  aboutHeadline = "Sobre Nossa Loja",
  aboutHeadlineFont = "'Playfair Display', serif",
  aboutHeadlineColor = "#44342f",
  aboutHeadlineSize = "2rem",
  aboutTextFont = "inherit",
  aboutTextColor = "#44342f",
  aboutTextSize = "1.1rem",
}) => {
  return (
    <section className="vintage-section bg-vintage-beige/20">
      <div className="vintage-container">
        <div className="text-center max-w-3xl mx-auto">
          <h1
            style={{
              color: aboutHeadlineColor,
              fontFamily: aboutHeadlineFont,
              fontSize: aboutHeadlineSize,
              fontWeight: 500,
            }}
            className="mb-6"
          >
            {aboutHeadline}
          </h1>
          <div className="w-16 h-1 bg-vintage-beige mx-auto mb-8"></div>
          <div
            className="prose prose-vintage mx-auto"
            style={{
              color: aboutTextColor,
              fontFamily: aboutTextFont,
              fontSize: aboutTextSize,
            }}
            dangerouslySetInnerHTML={{ __html: about }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
