
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
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
        {/* Mobile menu button with better positioning */}
        <button 
          className="md:hidden flex items-center text-vintage-brown hover:text-primary transition-all duration-300 hover:scale-110 z-60"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-6 h-6">
            <div className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'}`}>
              <Menu size={24} />
            </div>
            <div className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'}`}>
              <X size={24} />
            </div>
          </div>
        </button>
        
        {/* Logo and store name - centered on mobile */}
        <div className="flex items-center md:flex-none flex-1 justify-center md:justify-start">
          <Link to="/" className="flex items-center group">
            <div className="relative overflow-hidden rounded-full mr-3">
              <img 
                src={logo} 
                alt={`${storeName} logo`}
                className="h-10 w-10 md:h-12 md:w-12 object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                onError={(e) => {
                  console.log('Navbar: Logo failed to load, using placeholder');
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-lg md:text-2xl font-playfair font-medium text-black transition-all duration-300">
              {storeName}
            </h1>
          </Link>
        </div>
        
        {/* Desktop navigation links */}
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

        {/* Admin icon for mobile */}
        <div className="md:hidden">
          <Link to="/admin" className="text-vintage-brown hover:text-primary transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-vintage-beige/20">
            <User size={20} />
          </Link>
        </div>
        
        {/* Mobile navigation - Improved design */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
              onClick={toggleMenu}
            />
            
            {/* Mobile menu */}
            <div className="md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out animate-slide-in-left">
              {/* Header */}
              <div className="p-6 border-b border-vintage-beige/30 bg-gradient-to-r from-vintage-cream to-vintage-beige/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={logo} 
                      alt={`${storeName} logo`}
                      className="h-8 w-8 object-contain mr-2 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <h2 className="text-lg font-playfair font-medium text-vintage-brown">
                      {storeName}
                    </h2>
                  </div>
                  <button 
                    onClick={toggleMenu} 
                    className="p-2 rounded-full hover:bg-vintage-beige/30 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} className="text-vintage-brown" />
                  </button>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="p-6">
                <nav className="space-y-4">
                  <Link 
                    to="/" 
                    className="flex items-center p-3 rounded-lg text-vintage-brown hover:bg-vintage-beige/30 hover:text-primary transition-all duration-300 font-medium"
                    onClick={toggleMenu}
                  >
                    <span className="text-lg">🏠</span>
                    <span className="ml-3">Início</span>
                  </Link>
                  <Link 
                    to="/products" 
                    className="flex items-center p-3 rounded-lg text-vintage-brown hover:bg-vintage-beige/30 hover:text-primary transition-all duration-300 font-medium"
                    onClick={toggleMenu}
                  >
                    <span className="text-lg">🛍️</span>
                    <span className="ml-3">Produtos</span>
                  </Link>
                  <Link 
                    to="/about" 
                    className="flex items-center p-3 rounded-lg text-vintage-brown hover:bg-vintage-beige/30 hover:text-primary transition-all duration-300 font-medium"
                    onClick={toggleMenu}
                  >
                    <span className="text-lg">ℹ️</span>
                    <span className="ml-3">Sobre</span>
                  </Link>
                  <Link 
                    to="/admin" 
                    className="flex items-center p-3 rounded-lg text-vintage-brown hover:bg-vintage-beige/30 hover:text-primary transition-all duration-300 font-medium"
                    onClick={toggleMenu}
                  >
                    <User size={18} className="ml-1" />
                    <span className="ml-3">Admin</span>
                  </Link>
                </nav>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
