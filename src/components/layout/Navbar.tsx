
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
    
    // Set up real-time subscription for store settings changes
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
          // Refetch settings when they change
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
    <header className="navbar">
      <nav className="vintage-container py-4 flex items-center justify-between">
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center text-theme-foreground"
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
              onError={(e) => {
                console.log('Navbar: Logo failed to load, using placeholder');
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <h1 className="text-xl md:text-2xl text-theme-foreground">
              {storeName}
            </h1>
          </Link>
        </div>
        
        {/* Desktop navigation links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-theme-foreground hover:text-theme-primary transition-colors font-medium">
            Início
          </Link>
          <Link to="/products" className="text-theme-foreground hover:text-theme-primary transition-colors font-medium">
            Produtos
          </Link>
          <Link to="/about" className="text-theme-foreground hover:text-theme-primary transition-colors font-medium">
            Sobre
          </Link>
          <Link to="/admin" className="text-theme-foreground hover:text-theme-primary transition-colors">
            <User size={20} />
          </Link>
        </div>
        
        {/* Mobile navigation - Full screen overlay */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 bg-theme-card z-50 flex flex-col animate-fade-in">
            <div className="p-4 flex justify-end">
              <button onClick={toggleMenu} aria-label="Close menu">
                <X size={24} className="text-theme-foreground" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 space-y-8 text-2xl">
              <Link 
                to="/" 
                className="text-theme-foreground hover:text-theme-primary transition-colors" 
                onClick={toggleMenu}
              >
                Início
              </Link>
              <Link 
                to="/products" 
                className="text-theme-foreground hover:text-theme-primary transition-colors" 
                onClick={toggleMenu}
              >
                Produtos
              </Link>
              <Link 
                to="/about" 
                className="text-theme-foreground hover:text-theme-primary transition-colors" 
                onClick={toggleMenu}
              >
                Sobre
              </Link>
              <Link 
                to="/admin" 
                className="text-theme-foreground hover:text-theme-primary transition-colors" 
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
