
import React from 'react';
import { Package, Settings, Database, FolderOpen, LogOut, X } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onLogout, 
  isOpen = true,
  onClose 
}) => {
  const menuItems = [
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'categories', label: 'Categorias', icon: FolderOpen },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'backup', label: 'Backup/Restaurar', icon: Database },
  ];

  const handleItemClick = (itemId: string) => {
    setActiveTab(itemId);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 left-0 h-full w-64 bg-vintage-cream/50 border-r border-vintage-beige/30 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-4 md:p-6">
          {/* Mobile close button */}
          {onClose && (
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h1 className="font-playfair text-lg text-vintage-brown">
                Painel Admin
              </h1>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-vintage-beige/30 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}
          
          {/* Desktop title */}
          <h1 className="font-playfair text-xl text-vintage-brown mb-8 hidden md:block">
            Painel Admin
          </h1>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center px-3 md:px-4 py-3 text-left rounded-md transition-colors text-sm md:text-base ${
                    activeTab === item.id
                      ? 'bg-primary text-white'
                      : 'text-vintage-dark/80 hover:bg-vintage-beige/30'
                  }`}
                >
                  <Icon size={18} className="mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-vintage-beige/30">
            <button
              onClick={() => {
                onLogout();
                if (onClose) onClose();
              }}
              className="w-full flex items-center px-3 md:px-4 py-3 text-left rounded-md text-vintage-dark/80 hover:bg-vintage-beige/30 transition-colors text-sm md:text-base"
            >
              <LogOut size={18} className="mr-3 flex-shrink-0" />
              <span className="truncate">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
