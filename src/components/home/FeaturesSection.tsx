import React from 'react';
import { Package, Heart, Sparkles } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Package,
      title: "Entrega Rápida",
      description: "Receba seus produtos com segurança e agilidade"
    },
    {
      icon: Heart,
      title: "Produtos Selecionados",
      description: "Cada item é escolhido com carinho e cuidado"
    },
    {
      icon: Sparkles,
      title: "Qualidade Premium",
      description: "Apenas produtos de alta qualidade em nossa loja"
    }
  ];

  return (
    <section className="vintage-section py-16 bg-gradient-to-r from-vintage-beige/20 to-vintage-pink/20">
      <div className="vintage-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="vintage-card p-8 text-center group hover:shadow-xl transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-playfair text-vintage-brown mb-3 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-vintage-dark/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
