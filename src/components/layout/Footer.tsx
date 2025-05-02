
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-vintage-beige/30 pt-12 pb-6">
      <div className="vintage-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About section */}
          <div>
            <h3 className="text-lg font-playfair font-medium mb-4 text-vintage-brown">Minha Lojinha</h3>
            <p className="text-sm text-vintage-dark/80 mb-4">
              Uma boutique online que oferece produtos de beleza e acessórios selecionados 
              com cuidado, para uma experiência de compra exclusiva e elegante.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-playfair font-medium mb-4 text-vintage-brown">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-vintage-dark/80 hover:text-primary transition-colors">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-vintage-dark/80 hover:text-primary transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-vintage-dark/80 hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-vintage-dark/80 hover:text-primary transition-colors">
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact section */}
          <div>
            <h3 className="text-lg font-playfair font-medium mb-4 text-vintage-brown">Contato</h3>
            <p className="text-sm text-vintage-dark/80 mb-2">
              Entre em contato conosco pelas redes sociais
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-vintage-brown hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-vintage-brown hover:text-primary transition-colors">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M20.505 3.495C18.867 1.857 16.692 1 14.495 1 10.005 1 6.35 4.655 6.35 9.145c0 1.842.483 3.617 1.402 5.193L6 19l4.662-1.752a8.203 8.203 0 004.372 1.297h.004c4.487 0 8.695-3.654 8.695-8.145 0-2.197-.898-4.372-2.53-6.01zM14.495 17.045h-.003a6.816 6.816 0 01-3.77-1.108l-.27-.164-2.803 1.052.66-2.803-.18-.292a6.77 6.77 0 01-1.037-3.585c0-3.735 3.042-6.775 6.778-6.775 1.81 0 3.514.705 4.794 1.985 1.28 1.28 1.988 2.983 1.985 4.792.003 3.737-3.543 6.777-6.277 6.777zm3.45-5.07c-.204-.102-1.205-.595-1.392-.664-.187-.068-.323-.102-.46.102-.136.204-.528.664-.647.8-.12.136-.24.152-.443.05-.204-.102-.863-.318-1.644-1.016-.607-.54-1.018-1.208-1.136-1.412-.12-.204-.013-.314.09-.417.09-.09.203-.238.305-.357.101-.12.134-.204.202-.34.068-.135.034-.251-.017-.35-.05-.102-.46-1.11-.63-1.52-.166-.4-.336-.345-.46-.352-.12-.007-.257-.007-.392-.007-.137 0-.358.05-.546.254-.187.204-.714.696-.714 1.7s.73 1.967.833 2.102c.102.136 1.44 2.2 3.487 3.09.488.21.868.336 1.164.43.49.157.935.135 1.29.082.392-.056 1.207-.493 1.376-.97.17-.478.17-.888.12-.973-.05-.085-.184-.136-.39-.238z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="vintage-divider"></div>
        <div className="text-center text-xs text-vintage-dark/60">
          <p>&copy; {currentYear} Minha Lojinha. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
