
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { products, storeSettings, categories } from '@/lib/mockData';
import { Product } from '@/components/ui/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash, Plus, ArrowLeft } from 'lucide-react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  
  const [storeData, setStoreData] = useState({
    name: storeSettings.name,
    logo: storeSettings.logo,
    banner: storeSettings.banner,
    about: storeSettings.about,
  });
  
  const [productList, setProductList] = useState<Product[]>(products);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { toast } = useToast();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock login - in a real app, this would connect to Supabase
    if (email === 'admin@example.com' && password === 'password') {
      setIsLoggedIn(true);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo",
      });
    } else {
      toast({
        title: "Erro de login",
        description: "Email ou senha inválidos",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteProduct = (id: string) => {
    setProductList(productList.filter(product => product.id !== id));
    toast({
      title: "Produto excluído",
      description: "O produto foi removido com sucesso",
    });
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save to Supabase
    toast({
      title: "Configurações salvas",
      description: "As configurações da loja foram atualizadas",
    });
  };
  
  const handleSaveProduct = () => {
    if (!editingProduct) return;
    
    if (isEditing) {
      setProductList(productList.map(p => p.id === editingProduct.id ? editingProduct : p));
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso",
      });
    } else {
      // Generate a random ID for the new product
      const newProduct = {
        ...editingProduct,
        id: Date.now().toString(),
      };
      setProductList([...productList, newProduct]);
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado com sucesso",
      });
    }
    
    setIsEditing(false);
    setEditingProduct(null);
  };
  
  const handleAddNewProduct = () => {
    setEditingProduct({
      id: '',
      name: '',
      description: '',
      price: 0,
      image: '/placeholder.svg',
      category: categories[1], // Default to first category after "Todos"
      purchaseLink: '',
    });
    setIsEditing(false);
  };
  
  const renderLoginForm = () => (
    <div className="vintage-container py-12">
      <div className="max-w-md mx-auto vintage-card p-8">
        <h1 className="text-2xl font-playfair text-vintage-brown mb-6 text-center">
          Acesso Administrativo
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-vintage-dark mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="vintage-input w-full"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-vintage-dark mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="vintage-input w-full"
              placeholder="Digite sua senha"
              required
            />
            <p className="text-xs text-vintage-dark/60 mt-1">
              (Use o email: admin@example.com e senha: password)
            </p>
          </div>
          
          <button type="submit" className="vintage-button w-full py-2">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
  
  const renderAdminPanel = () => (
    <div className="vintage-container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
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
                    onClick={() => setIsLoggedIn(false)}
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-vintage-beige/30 text-vintage-dark/80"
                  >
                    Sair
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:w-3/4">
          {activeTab === 'products' && (
            <>
              {isEditing || editingProduct ? (
                <div className="vintage-card p-6">
                  <div className="flex items-center mb-6">
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setEditingProduct(null);
                      }}
                      className="text-vintage-dark/80 hover:text-vintage-brown flex items-center"
                    >
                      <ArrowLeft size={18} className="mr-1" />
                      Voltar
                    </button>
                    <h2 className="font-playfair text-xl text-vintage-brown ml-4">
                      {isEditing ? "Editar Produto" : "Novo Produto"}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-vintage-dark mb-1">
                        Nome do Produto
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={editingProduct?.name || ''}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct!,
                          name: e.target.value
                        })}
                        className="vintage-input w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-vintage-dark mb-1">
                        Descrição
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        value={editingProduct?.description || ''}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct!,
                          description: e.target.value
                        })}
                        className="vintage-input w-full"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-vintage-dark mb-1">
                          Preço (R$)
                        </label>
                        <input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingProduct?.price || 0}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct!,
                            price: parseFloat(e.target.value)
                          })}
                          className="vintage-input w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-vintage-dark mb-1">
                          Categoria
                        </label>
                        <select
                          id="category"
                          value={editingProduct?.category || ''}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct!,
                            category: e.target.value
                          })}
                          className="vintage-input w-full"
                          required
                        >
                          {categories.slice(1).map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-vintage-dark mb-1">
                        URL da Imagem
                      </label>
                      <input
                        id="image"
                        type="text"
                        value={editingProduct?.image || ''}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct!,
                          image: e.target.value
                        })}
                        className="vintage-input w-full"
                      />
                      <p className="text-xs text-vintage-dark/60 mt-1">
                        Use uma URL válida ou deixe em branco para usar a imagem padrão
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="purchaseLink" className="block text-sm font-medium text-vintage-dark mb-1">
                        Link de Compra
                      </label>
                      <input
                        id="purchaseLink"
                        type="text"
                        value={editingProduct?.purchaseLink || ''}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct!,
                          purchaseLink: e.target.value
                        })}
                        className="vintage-input w-full"
                      />
                      <p className="text-xs text-vintage-dark/60 mt-1">
                        Ex: Link do WhatsApp ou página de checkout
                      </p>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleSaveProduct}
                        className="vintage-button"
                      >
                        Salvar Produto
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="vintage-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-playfair text-xl text-vintage-brown">
                      Gerenciar Produtos
                    </h2>
                    <button
                      onClick={handleAddNewProduct}
                      className="vintage-button-secondary flex items-center"
                    >
                      <Plus size={16} className="mr-1" />
                      Novo Produto
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-vintage-beige/30">
                          <th className="text-left py-3 px-4">Nome</th>
                          <th className="text-left py-3 px-4 hidden md:table-cell">Categoria</th>
                          <th className="text-right py-3 px-4">Preço</th>
                          <th className="text-right py-3 px-4">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productList.map((product) => (
                          <tr key={product.id} className="border-b border-vintage-beige/30 hover:bg-vintage-beige/5">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 mr-3 bg-vintage-cream rounded-md overflow-hidden">
                                  <img 
                                    src={product.image || "/placeholder.svg"} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              {product.category}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(product.price)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="p-1 rounded-md hover:bg-vintage-beige/30 text-vintage-dark/80"
                                  aria-label="Editar produto"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-1 rounded-md hover:bg-vintage-beige/30 text-vintage-dark/80"
                                  aria-label="Excluir produto"
                                >
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'settings' && (
            <div className="vintage-card p-6">
              <h2 className="font-playfair text-xl mb-6 text-vintage-brown">
                Configurações da Loja
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-vintage-dark mb-1">
                    Nome da Loja
                  </label>
                  <input
                    id="storeName"
                    type="text"
                    value={storeData.name}
                    onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                    className="vintage-input w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-vintage-dark mb-1">
                    URL da Logo
                  </label>
                  <input
                    id="logoUrl"
                    type="text"
                    value={storeData.logo}
                    onChange={(e) => setStoreData({...storeData, logo: e.target.value})}
                    className="vintage-input w-full"
                  />
                  <p className="text-xs text-vintage-dark/60 mt-1">
                    URL da imagem da logo (recomendado: formato quadrado)
                  </p>
                </div>
                
                <div>
                  <label htmlFor="bannerUrl" className="block text-sm font-medium text-vintage-dark mb-1">
                    URL do Banner
                  </label>
                  <input
                    id="bannerUrl"
                    type="text"
                    value={storeData.banner}
                    onChange={(e) => setStoreData({...storeData, banner: e.target.value})}
                    className="vintage-input w-full"
                  />
                  <p className="text-xs text-vintage-dark/60 mt-1">
                    URL da imagem do banner (recomendado: formato 16:9)
                  </p>
                </div>
                
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-vintage-dark mb-1">
                    Texto Sobre a Loja
                  </label>
                  <textarea
                    id="about"
                    rows={6}
                    value={storeData.about}
                    onChange={(e) => setStoreData({...storeData, about: e.target.value})}
                    className="vintage-input w-full"
                  />
                  <p className="text-xs text-vintage-dark/60 mt-1">
                    Você pode usar HTML básico para formatação
                  </p>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveSettings}
                    className="vintage-button"
                  >
                    Salvar Configurações
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {isLoggedIn ? renderAdminPanel() : renderLoginForm()}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
