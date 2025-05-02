
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { storeSettings } from '@/lib/mockData';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="vintage-section bg-vintage-beige/20">
          <div className="vintage-container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-playfair text-vintage-brown mb-6">
                Sobre Nossa Loja
              </h1>
              <div className="w-16 h-1 bg-vintage-beige mx-auto mb-8"></div>
              <div 
                className="prose prose-vintage mx-auto"
                dangerouslySetInnerHTML={{ __html: storeSettings.about }}
              />
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="vintage-section">
          <div className="vintage-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl md:text-3xl font-playfair text-vintage-brown mb-4">
                  Nossa História
                </h2>
                <div className="vintage-divider w-24 my-4"></div>
                <p className="mb-4 text-vintage-dark/80">
                  A Minha Lojinha nasceu do amor pela beleza e pela estética provençal francesa. 
                  Nossa fundadora sempre foi apaixonada por produtos de beleza e acessórios 
                  com design elegante e refinado.
                </p>
                <p className="mb-4 text-vintage-dark/80">
                  Após anos trabalhando no mercado de cosméticos, ela decidiu criar 
                  um espaço onde pudesse compartilhar sua curadoria de produtos especiais, 
                  selecionados com carinho para clientes que valorizam qualidade e design.
                </p>
                <p className="text-vintage-dark/80">
                  Hoje, nossa missão é oferecer uma experiência de compra única, 
                  com produtos que combinam qualidade, estética e funcionalidade, 
                  em um ambiente virtual que reflete a elegância e o charme do estilo francês.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <div className="aspect-square rounded-md overflow-hidden shadow-lg border border-vintage-beige/30">
                  <img 
                    src="/placeholder.svg" 
                    alt="Nossa história" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Instagram */}
                <a 
                  href={storeSettings.contact.instagram} 
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
                
                {/* WhatsApp */}
                <a 
                  href={storeSettings.contact.whatsapp} 
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
                </a>
                
                {/* Email */}
                <a 
                  href={`mailto:${storeSettings.contact.email}`} 
                  className="vintage-card p-6 hover:border-primary/30 transition-colors flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-vintage-pink/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-vintage-brown">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <h3 className="font-playfair text-lg mb-2 text-vintage-brown">Email</h3>
                  <p className="text-sm text-vintage-dark/70">{storeSettings.contact.email}</p>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
