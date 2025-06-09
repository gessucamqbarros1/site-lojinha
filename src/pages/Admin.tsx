import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Product } from '@/components/ui/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash, Plus, ArrowLeft, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { uploadProductImage, deleteProductImage } from '@/lib/fileUploader';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  
  const [storeData, setStoreData] = useState({
    name: '',
    logo: '',
    banner: '',
    about: '',
    whatsapp_number: '',
  });
  
  const [productList, setProductList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Maquiagem', 'Skincare', 'Perfumaria', 'Acessórios']);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const { toast } = useToast();

  // Fetch products and store settings when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
      fetchStoreSettings();
    }
  }, [isLoggedIn]);
  
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedProducts = data.map(product => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description,
          price: parseFloat(product.price.toString()),
          image: product.image || '/placeholder.svg',
          category: product.category,
          purchaseLink: product.purchase_link
        }));
        
        setProductList(formattedProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(formattedProducts.map(p => p.category))];
        if (uniqueCategories.length > 0) {
          setCategories(uniqueCategories);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const fetchStoreSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setStoreData({
          name: data.name,
          logo: data.logo || '',
          banner: data.banner || '',
          about: data.about || '',
          whatsapp_number: data.whatsapp_number || '',
        });
      }
    } catch (error) {
      console.error('Error fetching store settings:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações da loja.",
        variant: "destructive",
      });
    }
  };

  // Generate WhatsApp link based on store settings and product info
  const generateWhatsAppLink = (productName: string, productPrice: number) => {
    const whatsappNumber = storeData.whatsapp_number || '5511999999999';
    const storeName = storeData.name || 'Gessica';
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(productPrice);
    
    const message = `Olá, ${storeName}! Quero mais informações sobre o ${productName} de ${formattedPrice}.`;
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock login - in a real app, this would connect to Supabase Auth
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
  
  const handleDeleteProduct = async (id: string, imageUrl?: string) => {
    try {
      // If there's an image and it's not the placeholder, delete it from storage
      if (imageUrl && !imageUrl.includes('/placeholder.svg')) {
        await deleteProductImage(imageUrl);
      }
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setProductList(productList.filter(product => product.id !== id));
      
      toast({
        title: "Produto excluído",
        description: "O produto foi removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro ao excluir produto",
        description: "Não foi possível excluir o produto. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUpload(e.target.files[0]);
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('store_settings')
        .update({
          name: storeData.name,
          logo: storeData.logo,
          banner: storeData.banner,
          about: storeData.about,
          whatsapp_number: storeData.whatsapp_number,
          updated_at: new Date().toISOString(),
        })
        .eq('id', (await supabase.from('store_settings').select('id').single()).data?.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Configurações salvas",
        description: "As configurações da loja foram atualizadas",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    
    try {
      setSaving(true);
      
      let imageUrl = editingProduct.image;
      
      // If there's a new file to upload
      if (fileUpload) {
        setUploading(true);
        // If there's an old image and it's not the placeholder, delete it
        if (isEditing && editingProduct.image && !editingProduct.image.includes('/placeholder.svg')) {
          await deleteProductImage(editingProduct.image);
        }
        
        // Generate a temporary ID for new products
        const tempId = isEditing ? editingProduct.id : `temp_${Date.now()}`;
        
        // Upload the new image
        const newImageUrl = await uploadProductImage(fileUpload, tempId);
        if (newImageUrl) {
          imageUrl = newImageUrl;
        }
        setUploading(false);
      }

      // Generate WhatsApp link automatically
      const whatsappLink = generateWhatsAppLink(editingProduct.name, editingProduct.price);
      
      const productData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        category: editingProduct.category,
        image: imageUrl,
        purchase_link: whatsappLink,
        updated_at: new Date().toISOString()
      };
      
      let result;
      
      if (isEditing) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
      } else {
        // Create new product
        result = await supabase
          .from('products')
          .insert(productData)
          .select();
      }
      
      if (result.error) {
        throw result.error;
      }
      
      // Refresh the product list
      fetchProducts();
      
      toast({
        title: isEditing ? "Produto atualizado" : "Produto adicionado",
        description: isEditing
          ? "O produto foi atualizado com sucesso"
          : "O produto foi adicionado com sucesso",
      });
      
      // Reset form
      setIsEditing(false);
      setEditingProduct(null);
      setFileUpload(null);
      
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro ao salvar produto",
        description: "Não foi possível salvar o produto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleAddNewProduct = () => {
    setEditingProduct({
      id: '',
      name: '',
      description: '',
      price: 0,
      image: '/placeholder.svg',
      category: categories[0] || 'Maquiagem',
      purchaseLink: '',
    });
    setIsEditing(false);
    setFileUpload(null);
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
                        setFileUpload(null);
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
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-vintage-dark mb-1">
                        Imagem do Produto
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="w-full aspect-square bg-vintage-cream rounded-md overflow-hidden border border-vintage-beige/30">
                          <img 
                            src={fileUpload ? URL.createObjectURL(fileUpload) : (editingProduct?.image || '/placeholder.svg')} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <label 
                            htmlFor="image-upload" 
                            className="vintage-button-secondary flex items-center justify-center w-full cursor-pointer"
                          >
                            <Upload size={16} className="mr-2" />
                            Selecionar Imagem
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <p className="text-xs text-vintage-dark/60 mt-2">
                            Formatos recomendados: JPG, PNG. Tamanho máximo: 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {editingProduct && editingProduct.name && editingProduct.price > 0 && (
                      <div className="bg-vintage-beige/20 p-4 rounded-md">
                        <h4 className="text-sm font-medium text-vintage-dark mb-2">Preview do Link do WhatsApp:</h4>
                        <p className="text-xs text-vintage-dark/80 break-all">
                          {generateWhatsAppLink(editingProduct.name, editingProduct.price)}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleSaveProduct}
                        disabled={uploading || saving}
                        className="vintage-button"
                      >
                        {(uploading || saving) ? 'Salvando...' : 'Salvar Produto'}
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
                        {productList.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-vintage-dark/70">
                              Nenhum produto cadastrado ainda.
                              <div className="mt-2">
                                <button
                                  onClick={handleAddNewProduct}
                                  className="text-primary hover:text-primary-dark underline"
                                >
                                  Adicionar primeiro produto
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          productList.map((product) => (
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
                                    onClick={() => handleDeleteProduct(product.id, product.image)}
                                    className="p-1 rounded-md hover:bg-vintage-beige/30 text-vintage-dark/80"
                                    aria-label="Excluir produto"
                                  >
                                    <Trash size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
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
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium text-vintage-dark mb-1">
                    Número do WhatsApp
                  </label>
                  <input
                    id="whatsappNumber"
                    type="text"
                    value={storeData.whatsapp_number}
                    onChange={(e) => setStoreData({...storeData, whatsapp_number: e.target.value})}
                    className="vintage-input w-full"
                    placeholder="5511999999999"
                  />
                  <p className="text-xs text-vintage-dark/60 mt-1">
                    Número no formato: 5511999999999 (código do país + DDD + número)
                  </p>
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
                    disabled={saving}
                    className="vintage-button"
                  >
                    {saving ? 'Salvando...' : 'Salvar Configurações'}
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
