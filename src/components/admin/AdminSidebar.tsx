
import React from 'react';
import { Package, Settings, Database, FolderOpen, LogOut } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'categories', label: 'Categorias', icon: FolderOpen },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'backup', label: 'Backup/Restaurar', icon: Database },
  ];

  return (
    <div className="w-64 bg-vintage-cream/50 border-r border-vintage-beige/30 min-h-screen">
      <div className="p-6">
        <h1 className="font-playfair text-xl text-vintage-brown mb-8">
          Painel Admin
        </h1>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-white'
                    : 'text-vintage-dark/80 hover:bg-vintage-beige/30'
                }`}
              >
                <Icon size={18} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="mt-8 pt-8 border-t border-vintage-beige/30">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-left rounded-md text-vintage-dark/80 hover:bg-vintage-beige/30 transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
