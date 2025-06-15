
import React from 'react';

interface OurStoryProps {
  storeName: string;
  banner: string;
}

const OurStory: React.FC<OurStoryProps> = ({ storeName, banner }) => {
  return (
    <section className="vintage-section">
      <div className="vintage-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-playfair text-vintage-brown mb-4">
              Nossa História
            </h2>
            <div className="vintage-divider w-24 my-4"></div>
            <p className="mb-4 text-vintage-dark/80">
              A {storeName} nasceu do amor pela beleza e pela estética provençal francesa. 
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
                src={banner || "/placeholder.svg"} 
                alt="Nossa história" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
