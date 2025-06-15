
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Home, Package, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [storeName, setStoreName] = useState("Minha Lojinha");
  const [logo, setLogo] = useState("/placeholder.svg");
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Fetch store settings
    const fetchStoreSettings = async () => {
      try {
        console.log('Navbar: Fetching store settings...');
        
        const { data, error } = await supabase
          .from('store_settings')
          .select('name, logo')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) {
          console.error('Navbar: Error fetching store settings:', error);
          return;
        }
        
        console.log('Navbar: Store settings fetched:', data);
        
        if (data && data.length > 0) {
          const settings = data[0];
          console.log('Navbar: Setting store name to:', settings.name);
          console.log('Navbar: Setting logo to:', settings.logo);
          
          if (settings.name) setStoreName(settings.name);
          if (settings.logo) setLogo(settings.logo);
        }
      } catch (error) {
        console.error('Navbar: Error in fetchStoreSettings:', error);
      }
    };
    
    fetchStoreSettings();
    
    const subscription = supabase
      .channel('store_settings_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'store_settings' 
        }, 
        (payload) => {
          console.log('Navbar: Store settings changed:', payload);
          fetchStoreSettings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={`navbar sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'shadow-lg backdrop-blur-lg' : ''}`}>
      <nav className="vintage-container py-4 flex items-center justify-between">
        {/* Mobile menu button with enhanced animation */}
        <button 
          className="md:hidden flex items-center text-vintage-brown hover:text-primary transition-all duration-300 hover:scale-110"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-6 h-6">
            <div className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'}`}>
              <Menu size={20} />
            </div>
            <div className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'}`}>
              <X size={20} />
            </div>
          </div>
        </button>
        
        {/* Logo and store name with enhanced hover effects */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <div className="relative overflow-hidden rounded-full mr-3">
              <img 
                src={logo} 
                alt={`${storeName} logo`}
                className="h-12 w-12 object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                onError={(e) => {
                  console.log('Navbar: Logo failed to load, using placeholder');
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-xl md:text-2xl font-playfair font-medium text-black transition-all duration-300">
              {storeName}
            </h1>
          </Link>
        </div>
        
        {/* Desktop navigation links with premium hover effects */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="premium-link text-vintage-brown hover:text-primary font-medium">
            Início
          </Link>
          <Link to="/products" className="premium-link text-vintage-brown hover:text-primary font-medium">
            Produtos
          </Link>
          <Link to="/about" className="premium-link text-vintage-brown hover:text-primary font-medium">
            Sobre
          </Link>
          <Link to="/admin" className="text-vintage-brown hover:text-primary transition-all duration-300 hover:scale-110 hover:rotate-3 p-2 rounded-full hover:bg-vintage-beige/20">
            <User size={20} />
          </Link>
        </div>
        
        {/* Mobile navigation - Enhanced sidebar menu */}
        {isOpen && (
          <>
            {/* Dark backdrop */}
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
              onClick={toggleMenu}
            ></div>
            
            {/* Sidebar menu */}
            <div className="md:hidden fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl animate-slide-in-right">
              {/* Header with close button */}
              <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-lg font-playfair font-medium text-vintage-brown">Menu</h2>
                <button 
                  onClick={toggleMenu} 
                  aria-label="Close menu"
                  className="hover:scale-110 transition-transform duration-300 p-2 rounded-full hover:bg-vintage-beige/20"
                >
                  <X size={24} className="text-vintage-brown" />
                </button>
              </div>
              
              {/* Menu items */}
              <div className="p-6 space-y-4">
                <Link 
                  to="/" 
                  className="flex items-center p-4 bg-vintage-beige/20 rounded-xl text-vintage-brown hover:bg-vintage-beige/40 hover:text-primary transition-all duration-300 hover:scale-105 hover:shadow-md group" 
                  onClick={toggleMenu}
                >
                  <Home size={20} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Início</span>
                </Link>
                
                <Link 
                  to="/products" 
                  className="flex items-center p-4 bg-vintage-beige/20 rounded-xl text-vintage-brown hover:bg-vintage-beige/40 hover:text-primary transition-all duration-300 hover:scale-105 hover:shadow-md group" 
                  onClick={toggleMenu}
                >
                  <Package size={20} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Produtos</span>
                </Link>
                
                <Link 
                  to="/about" 
                  className="flex items-center p-4 bg-vintage-beige/20 rounded-xl text-vintage-brown hover:bg-vintage-beige/40 hover:text-primary transition-all duration-300 hover:scale-105 hover:shadow-md group" 
                  onClick={toggleMenu}
                >
                  <Info size={20} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Sobre</span>
                </Link>
                
                <Link 
                  to="/admin" 
                  className="flex items-center p-4 bg-vintage-beige/20 rounded-xl text-vintage-brown hover:bg-vintage-beige/40 hover:text-primary transition-all duration-300 hover:scale-105 hover:shadow-md group" 
                  onClick={toggleMenu}
                >
                  <User size={20} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Admin</span>
                </Link>
              </div>
              
              {/* Decorative bottom section */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-vintage-beige to-transparent"></div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-vintage-brown/60 font-playfair italic">{storeName}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
