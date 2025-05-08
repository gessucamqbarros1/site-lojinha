
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [storeName, setStoreName] = useState("Minha Lojinha");
  const [logo, setLogo] = useState("/placeholder.svg");
  
  useEffect(() => {
    // Fetch store settings
    const fetchStoreSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('name, logo')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching store settings:', error);
          return;
        }
        
        if (data) {
          setStoreName(data.name);
          if (data.logo) setLogo(data.logo);
        }
      } catch (error) {
        console.error('Error in fetchStoreSettings:', error);
      }
    };
    
    fetchStoreSettings();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white border-b border-vintage-beige/30">
      <nav className="vintage-container py-4 flex items-center justify-between">
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center text-vintage-brown"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        {/* Logo and store name */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt={`${storeName} logo`}
              className="h-10 w-10 object-contain mr-2"
            />
            <h1 className="text-xl md:text-2xl font-playfair font-medium text-vintage-brown">
              {storeName}
            </h1>
          </Link>
        </div>
        
        {/* Desktop navigation links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-vintage-brown hover:text-primary transition-colors font-medium">
            Início
          </Link>
          <Link to="/products" className="text-vintage-brown hover:text-primary transition-colors font-medium">
            Produtos
          </Link>
          <Link to="/about" className="text-vintage-brown hover:text-primary transition-colors font-medium">
            Sobre
          </Link>
          <Link to="/admin" className="text-vintage-brown hover:text-primary transition-colors">
            <User size={20} />
          </Link>
        </div>
        
        {/* Mobile navigation - Full screen overlay */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col animate-fade-in">
            <div className="p-4 flex justify-end">
              <button onClick={toggleMenu} aria-label="Close menu">
                <X size={24} className="text-vintage-brown" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 space-y-8 text-2xl">
              <Link 
                to="/" 
                className="text-vintage-brown hover:text-primary transition-colors" 
                onClick={toggleMenu}
              >
                Início
              </Link>
              <Link 
                to="/products" 
                className="text-vintage-brown hover:text-primary transition-colors" 
                onClick={toggleMenu}
              >
                Produtos
              </Link>
              <Link 
                to="/about" 
                className="text-vintage-brown hover:text-primary transition-colors" 
                onClick={toggleMenu}
              >
                Sobre
              </Link>
              <Link 
                to="/admin" 
                className="text-vintage-brown hover:text-primary transition-colors" 
                onClick={toggleMenu}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
