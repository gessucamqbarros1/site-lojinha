import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Product } from '@/components/ui/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash, Plus, ArrowLeft, Upload, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { uploadProductImage, deleteProductImage } from '@/lib/fileUploader';
import ProductImageUploader from '@/components/ui/ProductImageUploader';

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
  const [logoUpload, setLogoUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const { toast } = useToast();

  // Fetch products and store settings when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
      fetchStoreSettings();
    }
  }, [isLoggedIn]);
  
  // Auto-save product when data changes (except for new products)
  useEffect(() => {
    if (editingProduct && isEditing && editingProduct.name && editingProduct.price > 0) {
      const timeoutId = setTimeout(() => {
        handleAutoSaveProduct();
      }, 2000); // Auto-save após 2 segundos de inatividade
      
      return () => clearTimeout(timeoutId);
    }
  }, [editingProduct?.name, editingProduct?.description, editingProduct?.price, editingProduct?.category]);
  
  const fetchProducts = async () => {
    try {
      console.log('Attempting to fetch products...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Supabase error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched successfully:', data);
      
      if (data) {
        const formattedProducts = data.map(product => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description || '',
          price: parseFloat(product.price.toString()),
          image: product.image || '/placeholder.svg',
          images: Array.isArray(product.images) ? product.images : [],
          category: product.category,
          purchaseLink: product.purchase_link
        }));
        
        // Para cada produto, se não tiver imagens mas tiver uma imagem, use-a
        formattedProducts.forEach(p => {
          if ((!p.images || p.images.length === 0) && p.image && p.image !== '/placeholder.svg') {
            p.images = [p.image];
          }
        });
        
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
        description: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };
  
  const fetchStoreSettings = async () => {
    try {
      console.log('Attempting to fetch store settings...');
      
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error('Supabase error fetching store settings:', error);
        throw error;
      }
      
      console.log('Store settings fetched successfully:', data);
      
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
        description: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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
  
  const handleAutoSaveProduct = async () => {
    if (!editingProduct || !isEditing) return;
    
    try {
      console.log('Auto-saving product...');
      
      // Generate WhatsApp link automatically
      const whatsappLink = generateWhatsAppLink(editingProduct.name, editingProduct.price);
      
      const productData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        category: editingProduct.category,
        image: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images[0] : '/placeholder.svg',
        images: editingProduct.images || [],
        purchase_link: whatsappLink,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
      
      if (error) {
        throw error;
      }
      
      console.log('Product auto-saved successfully');
      
      // Update the product in the local list
      setProductList(prev => prev.map(p => 
        p.id === editingProduct.id ? { ...editingProduct, purchaseLink: whatsappLink } : p
      ));
      
    } catch (error) {
      console.error('Error auto-saving product:', error);
    }
  };
  
  const handleSaveAllData = async () => {
    try {
      setSaving(true);
      console.log('Attempting to save all data...');
      
      // First try to get existing settings
      const { data: existingData, error: fetchError } = await supabase
        .from('store_settings')
        .select('id')
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching existing data:', fetchError);
        throw fetchError;
      }
      
      console.log('Existing data check:', existingData);
      
      if (existingData) {
        // Update existing record
        console.log('Updating existing record with ID:', existingData.id);
        const { error: settingsError } = await supabase
          .from('store_settings')
          .update({
            name: storeData.name,
            logo: storeData.logo,
            banner: storeData.banner,
            about: storeData.about,
            whatsapp_number: storeData.whatsapp_number,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingData.id);
        
        if (settingsError) {
          console.error('Error updating settings:', settingsError);
          throw settingsError;
        }
        console.log('Settings updated successfully');
      } else {
        // Create new record if none exists
        console.log('Creating new record...');
        const { error: settingsError } = await supabase
          .from('store_settings')
          .insert({
            name: storeData.name,
            logo: storeData.logo,
            banner: storeData.banner,
            about: storeData.about,
            whatsapp_number: storeData.whatsapp_number,
          });
        
        if (settingsError) {
          console.error('Error inserting settings:', settingsError);
          throw settingsError;
        }
        console.log('Settings inserted successfully');
      }
      
      toast({
        title: "Dados salvos com sucesso",
        description: "Todas as configurações e produtos foram salvos",
      });
    } catch (error) {
      console.error('Error saving all data:', error);
      toast({
        title: "Erro ao salvar dados",
        description: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteAllData = async () => {
    const confirmDelete = window.confirm(
      "⚠️ ATENÇÃO: Esta ação irá apagar TODOS os produtos permanentemente. Esta ação não pode ser desfeita. Tem certeza?"
    );
    
    if (!confirmDelete) return;
    
    const confirmAgain = window.confirm(
      "Confirme novamente: Você realmente deseja apagar TODOS os produtos? Esta ação é irreversível!"
    );
    
    if (!confirmAgain) return;

    try {
      setDeleting(true);
      
      // Delete all product images first
      for (const product of productList) {
        if (product.image && !product.image.includes('/placeholder.svg')) {
          try {
            await deleteProductImage(product.image);
          } catch (imageError) {
            console.error('Error deleting image for product:', product.name, imageError);
          }
        }
      }
      
      // Delete all products from database
      const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all products
      
      if (error) {
        throw error;
      }
      
      // Clear the local product list
      setProductList([]);
      
      toast({
        title: "Todos os produtos foram apagados",
        description: "Todos os produtos e suas imagens foram removidos permanentemente",
      });
    } catch (error) {
      console.error('Error deleting all products:', error);
      toast({
        title: "Erro ao apagar produtos",
        description: "Não foi possível apagar todos os produtos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
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
    // Garantir que product.images é um array
    if (!product.images) {
      product.images = [];
      // Se não tiver imagens mas tiver uma imagem, adicione-a ao array
      if (product.image && product.image !== '/placeholder.svg') {
        product.images.push(product.image);
      }
    }

    setEditingProduct(product);
    setIsEditing(true);
  };
  
  const handleUpdateProductImages = (images: string[]) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: images,
        // Também atualiza o campo image para compatibilidade (usa a primeira imagem)
        image: images.length > 0 ? images[0] : '/placeholder.svg'
      });
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      console.log('Attempting to save settings...');
      
      // First try to get existing settings
      const { data: existingData, error: fetchError } = await supabase
        .from('store_settings')
        .select('id')
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching existing data:', fetchError);
        throw fetchError;
      }
      
      console.log('Existing data check:', existingData);
      
      if (existingData) {
        // Update existing record
        console.log('Updating existing record with ID:', existingData.id);
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
          .eq('id', existingData.id);
        
        if (error) {
          console.error('Error updating settings:', error);
          throw error;
        }
        console.log('Settings updated successfully');
      } else {
        // Create new record if none exists
        console.log('Creating new record...');
        const { error } = await supabase
          .from('store_settings')
          .insert({
            name: storeData.name,
            logo: storeData.logo,
            banner: storeData.banner,
            about: storeData.about,
            whatsapp_number: storeData.whatsapp_number,
          });
        
        if (error) {
          console.error('Error inserting settings:', error);
          throw error;
        }
        console.log('Settings inserted successfully');
      }
      
      toast({
        title: "Configurações salvas",
        description: "As configurações da loja foram atualizadas",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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
      
      // Generate WhatsApp link automatically
      const whatsappLink = generateWhatsAppLink(editingProduct.name, editingProduct.price);
      
      const productData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        category: editingProduct.category,
        image: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images[0] : '/placeholder.svg',
        images: editingProduct.images || [],
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
      images: [],
      category: categories[0] || 'Sem categoria',
    });
    
    setIsEditing(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {!isLoggedIn ? (
            // ... keep existing code (login form)
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-playfair text-center mb-6">Login Administrativo</h1>
              
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
                    required
                  />
                </div>
                
                <button type="submit" className="vintage-button w-full">
                  Entrar
                </button>
              </form>
              
              <div className="mt-4 text-center text-sm">
                <p>Use admin@example.com / password para acessar o painel</p>
              </div>
            </div>
          ) : (
            <>
              {/* Admin Panel */}
              <div className="mb-6 flex flex-wrap justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-playfair text-vintage-dark mb-4 md:mb-0">
                  Painel Administrativo
                </h1>
                
                <div className="flex space-x-4">
                  <button 
                    className={`vintage-button-secondary ${activeTab === 'products' ? 'bg-vintage-beige text-vintage-dark' : ''}`}
                    onClick={() => setActiveTab('products')}
                  >
                    Produtos
                  </button>
                  <button 
                    className={`vintage-button-secondary ${activeTab === 'settings' ? 'bg-vintage-beige text-vintage-dark' : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    Configurações
                  </button>
                </div>
              </div>
              
              {activeTab === 'products' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium text-vintage-dark">
                      {editingProduct ? (isEditing ? 'Editar Produto' : 'Novo Produto') : 'Gerenciar Produtos'}
                    </h2>
                    
                    {!editingProduct ? (
                      <button 
                        onClick={handleAddNewProduct}
                        className="vintage-button-secondary flex items-center"
                      >
                        <Plus size={16} className="mr-1" /> Novo Produto
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditingProduct(null);
                          setIsEditing(false);
                        }}
                        className="vintage-button-secondary flex items-center"
                      >
                        <ArrowLeft size={16} className="mr-1" /> Voltar
                      </button>
                    )}
                  </div>
                  
                  {editingProduct ? (
                    // Formulário de edição/criação de produto
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-vintage-dark mb-1">
                          Nome do Produto
                        </label>
                        <input
                          id="productName"
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                          className="vintage-input w-full"
                          placeholder="Ex: Batom Matte Rose Gold"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="productDesc" className="block text-sm font-medium text-vintage-dark mb-1">
                          Descrição
                        </label>
                        <textarea
                          id="productDesc"
                          rows={3}
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                          className="vintage-input w-full resize-none"
                          placeholder="Descreva as características do produto..."
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="productPrice" className="block text-sm font-medium text-vintage-dark mb-1">
                            Preço (R$)
                          </label>
                          <input
                            id="productPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                            className="vintage-input w-full"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="productCategory" className="block text-sm font-medium text-vintage-dark mb-1">
                            Categoria
                          </label>
                          <select
                            id="productCategory"
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                            className="vintage-input w-full"
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-vintage-dark mb-3">
                          Imagens do Produto
                        </label>
                        <ProductImageUploader 
                          productId={editingProduct.id || `temp_${Date.now()}`}
                          initialImages={editingProduct.images || []}
                          onChange={handleUpdateProductImages}
                          maxImages={3}
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setIsEditing(false);
                          }}
                          className="vintage-button-secondary"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveProduct}
                          disabled={saving}
                          className="vintage-button flex items-center"
                        >
                          <Save size={16} className="mr-2" />
                          {saving ? 'Salvando...' : 'Salvar Produto'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Lista de produtos
                    <>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-vintage-beige">
                          <thead>
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-vintage-dark uppercase tracking-wider">
                                Produto
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-vintage-dark uppercase tracking-wider">
                                Categoria
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-vintage-dark uppercase tracking-wider">
                                Preço
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-vintage-dark uppercase tracking-wider">
                                Ações
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-vintage-beige/30">
                            {productList.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-vintage-dark">
                                  Nenhum produto cadastrado. Clique em "Novo Produto" para adicionar.
                                </td>
                              </tr>
                            ) : (
                              productList.map(product => (
                                <tr key={product.id} className="hover:bg-vintage-beige/10">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                                        <img 
                                          src={
                                            product.images && product.images.length > 0 
                                              ? product.images[0] 
                                              : (product.image || '/placeholder.svg')
                                          } 
                                          alt={product.name}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-vintage-dark">{product.name}</div>
                                        <div className="text-xs text-vintage-dark/70 line-clamp-1">{product.description}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs rounded-full bg-vintage-beige/20 text-vintage-dark">
                                      {product.category}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-vintage-dark">
                                    {new Intl.NumberFormat('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL'
                                    }).format(product.price)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                      onClick={() => handleEditProduct(product)}
                                      className="text-vintage-dark hover:text-primary mr-3"
                                    >
                                      <Pencil size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteProduct(product.id, product.image)}
                                      className="text-vintage-dark hover:text-red-600"
                                    >
                                      <Trash size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-8 pt-4 border-t border-vintage-beige flex justify-between items-center">
                        <button
                          onClick={handleDeleteAllData}
                          disabled={deleting || productList.length === 0}
                          className="vintage-button-secondary text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <Trash2 size={16} className="mr-1" />
                          {deleting ? 'Apagando...' : 'Apagar Todos os Produtos'}
                        </button>
                        
                        <div className="text-sm text-vintage-dark/70">
                          {productList.length} {productList.length === 1 ? 'produto' : 'produtos'} no total
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-medium text-vintage-dark mb-6">Configurações da Loja</h2>
                  
                  <div className="space-y-6">
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
                      <label className="block text-sm font-medium text-vintage-dark mb-1">
                        Logo da Loja
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="w-32 h-32 bg-vintage-cream rounded-md overflow-hidden border border-vintage-beige/30 mx-auto">
                          <img 
                            src={logoUpload ? URL.createObjectURL(logoUpload) : (storeData.logo || '/placeholder.svg')} 
                            alt="Logo Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <label 
                            htmlFor="logo-upload" 
                            className="vintage-button-secondary flex items-center justify-center w-full cursor-pointer"
                          >
                            <Upload size={16} className="mr-2" />
                            {uploading ? 'Carregando...' : 'Selecionar Logo'}
                          </label>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                            disabled={uploading}
                          />
                          <p className="text-xs text-vintage-dark/60 mt-2">
                            Formatos recomendados: JPG, PNG. Formato quadrado recomendado. Tamanho máximo: 5MB
                          </p>
                        </div>
                      </div>
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
                        URL da imagem do banner (recomendado: 1200x400px)
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="aboutStore" className="block text-sm font-medium text-vintage-dark mb-1">
                        Sobre a Loja
                      </label>
                      <textarea
                        id="aboutStore"
                        rows={4}
                        value={storeData.about}
                        onChange={(e) => setStoreData({...storeData, about: e.target.value})}
                        className="vintage-input w-full"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="whatsappNumber" className="block text-sm font-medium text-vintage-dark mb-1">
                        Número de WhatsApp
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
                        Número completo com código do país e DDD, sem espaços ou caracteres especiais.
                      </p>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleSaveSettings}
                        disabled={saving || uploading}
                        className="vintage-button"
                      >
                        {saving ? 'Salvando...' : 'Salvar Configurações'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
