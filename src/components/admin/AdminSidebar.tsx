
import React from 'react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="md:w-1/4">
      <div className="vintage-card p-6">
        <h2 className="font-playfair text-xl mb-6 text-vintage-brown">
          Painel Admin
        </h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'products'
                    ? 'bg-vintage-beige text-vintage-brown'
                    : 'hover:bg-vintage-beige/30 text-vintage-dark/80'
                }`}
              >
                Produtos
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'settings'
                    ? 'bg-vintage-beige text-vintage-brown'
                    : 'hover:bg-vintage-beige/30 text-vintage-dark/80'
                }`}
              >
                Configurações
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('backup')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'backup'
                    ? 'bg-vintage-beige text-vintage-brown'
                    : 'hover:bg-vintage-beige/30 text-vintage-dark/80'
                }`}
              >
                Backup & Dados
              </button>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-vintage-beige/30 text-vintage-dark/80"
              >
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
