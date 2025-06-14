import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';

interface StoreSettings {
  name: string;
  logo: string;
  banner: string;
  about: string;
  whatsapp_number: string;
  instagram_link: string;
}

const About = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: 'Minha Lojinha',
    logo: '/placeholder.svg',
    banner: '',
    about: 'Uma boutique online que oferece produtos de beleza e acessórios selecionados com cuidado, para uma experiência de compra exclusiva e elegante.',
    whatsapp_number: '',
    instagram_link: ''
  });

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        console.log('About: Fetching store settings...');
        
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) {
          console.error('About: Error fetching store settings:', error);
          return;
        }
        
        console.log('About: Store settings fetched:', data);
        
        if (data && data.length > 0) {
          const settings = data[0];
          setStoreSettings({
            name: settings.name || 'Minha Lojinha',
            logo: settings.logo || '/placeholder.svg',
            banner: settings.banner || '',
            about: settings.about || 'Uma boutique online que oferece produtos de beleza e acessórios selecionados com cuidado, para uma experiência de compra exclusiva e elegante.',
            whatsapp_number: settings.whatsapp_number || '',
            instagram_link: settings.instagram_link || ''
          });
        }
      } catch (error) {
        console.error('About: Error in fetchStoreSettings:', error);
      }
    };
    
    fetchStoreSettings();
  }, []);

  const generateWhatsAppLink = () => {
    const whatsappNumber = storeSettings.whatsapp_number || '5511999999999';
    const message = `Olá! Gostaria de saber mais sobre ${storeSettings.name}.`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

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
                  A {storeSettings.name} nasceu do amor pela beleza e pela estética provençal francesa. 
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
                    src={storeSettings.banner || "/placeholder.svg"} 
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Instagram */}
                {storeSettings.instagram_link ? (
                  <a 
                    href={storeSettings.instagram_link} 
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
                  {storeSettings.whatsapp_number && (
                    <p className="text-xs text-vintage-dark/60 mt-2">
                      {storeSettings.whatsapp_number}
                    </p>
                  )}
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
