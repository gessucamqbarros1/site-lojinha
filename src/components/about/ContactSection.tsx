
import React from 'react';

interface ContactSectionProps {
  storeName: string;
  instagramLink?: string;
  whatsappNumber?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ 
  storeName, 
  instagramLink, 
  whatsappNumber 
}) => {
  const generateWhatsAppLink = () => {
    const whatsappNum = whatsappNumber || '5511999999999';
    const message = `Olá! Gostaria de saber mais sobre ${storeName}.`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappNum}?text=${encodedMessage}`;
  };

  return (
    <section className="vintage-section bg-vintage-beige/20">
      <div className="vintage-container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-playfair text-vintage-brown mb-6">
            Entre em Contato
          </h2>
          <div className="w-16 h-1 bg-vintage-beige mx-auto mb-8"></div>
          <p className="mb-8 text-vintage-dark/80">
            Estamos sempre à disposição para atender você. 
            Entre em contato conosco através de nossas redes sociais ou WhatsApp.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instagram */}
            {instagramLink ? (
              <a 
                href={instagramLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="vintage-card p-6 hover:border-primary/30 transition-colors flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-vintage-pink/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-vintage-brown">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <h3 className="font-playfair text-lg mb-2 text-vintage-brown">Instagram</h3>
                <p className="text-sm text-vintage-dark/70">Siga-nos para novidades e dicas</p>
              </a>
            ) : (
              <div className="vintage-card p-6 hover:border-primary/30 transition-colors flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-vintage-pink/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-vintage-brown">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <h3 className="font-playfair text-lg mb-2 text-vintage-brown">Instagram</h3>
                <p className="text-sm text-vintage-dark/70 mb-4">Siga-nos para novidades e dicas</p>
                <p className="text-xs text-vintage-dark/60 text-center">
                  Configure o link do Instagram nas configurações da loja
                </p>
              </div>
            )}
            
            {/* WhatsApp */}
            <a 
              href={generateWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="vintage-card p-6 hover:border-primary/30 transition-colors flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-vintage-pink/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-vintage-brown">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3 className="font-playfair text-lg mb-2 text-vintage-brown">WhatsApp</h3>
              <p className="text-sm text-vintage-dark/70">Atendimento direto e rápido</p>
              {whatsappNumber && (
                <p className="text-xs text-vintage-dark/60 mt-2">
                  {whatsappNumber}
                </p>
              )}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
