import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Product } from '@/components/ui/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash, Plus, ArrowLeft, Upload, Save, Trash2 } from 'lucide-react';
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
          description: product.description,
          price: parseFloat(product.price.toString()),
          image: product.image || '/placeholder.svg',
          images: Array.isArray(product.images) ? 
            product.images.filter((img): img is string => typeof img === 'string') : 
            [],
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
        // Only throw if it's not a "no rows" error
        if (error.code !== 'PGRST116') {
          throw error;
        }
      }
      
      console.log('Store settings fetched successfully:', data);
      
      if (data) {
        setStoreData({
          name: data.name || '',
          logo: data.logo || '',
          banner: data.banner || '',
          about: data.about || '',
          whatsapp_number: data.whatsapp_number || '',
        });
      } else {
        // Set default values when no settings exist yet
        console.log('No store settings found, using defaults');
        setStoreData({
          name: '',
          logo: '',
          banner: '',
          about: '',
          whatsapp_number: '',
        });
      }
    } catch (error) {
      console.error('Error fetching store settings:', error);
      // Don't show error toast for missing settings, just use defaults
      setStoreData({
        name: '',
        logo: '',
        banner: '',
        about: '',
        whatsapp_number: '',
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
        image: editingProduct.image,
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
    setEditingProduct(product);
    setIsEditing(true);
    setFileUpload(null);
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingProduct) {
      const file = e.target.files[0];
      setFileUpload(file);
      
      // Upload image immediately when selected
      try {
        setUploading(true);
        
        // Generate a temporary ID for new products or use existing ID
        const productId = editingProduct.id || `temp_${Date.now()}`;
        
        // If there's an old image and it's not the placeholder, delete it
        if (editingProduct.image && !editingProduct.image.includes('/placeholder.svg')) {
          await deleteProductImage(editingProduct.image);
        }
        
        // Upload the new image
        const newImageUrl = await uploadProductImage(file, productId);
        
        if (newImageUrl) {
          // Update the editing product with the new image URL
          setEditingProduct({
            ...editingProduct,
            image: newImageUrl
          });
          
          toast({
            title: "Imagem carregada",
            description: "A imagem foi salva com sucesso",
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Erro no upload",
          description: error instanceof Error ? error.message : "Erro ao fazer upload da imagem",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoUpload(file);
      
      // Upload logo immediately when selected
      try {
        setUploading(true);
        
        // If there's an old logo and it's not the placeholder, delete it
        if (storeData.logo && !storeData.logo.includes('/placeholder.svg')) {
          await deleteProductImage(storeData.logo);
        }
        
        // Upload the new logo using a fixed logo ID
        const newLogoUrl = await uploadProductImage(file, 'store_logo');
        
        if (newLogoUrl) {
          // Update the store data with the new logo URL
          setStoreData({
            ...storeData,
            logo: newLogoUrl
          });
          
          toast({
            title: "Logo carregada",
            description: "A logo foi salva com sucesso",
          });
        }
      } catch (error) {
        console.error('Error uploading logo:', error);
        toast({
          title: "Erro no upload da logo",
          description: error instanceof Error ? error.message : "Erro ao fazer upload da logo",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
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
      images: [],
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
                    disabled={saving || uploading}
                    className="vintage-button"
                  >
                    {saving ? 'Salvando...' : 'Salvar Configurações'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="vintage-card p-6">
              <h2 className="font-playfair text-xl mb-6 text-vintage-brown">
                Backup & Gerenciamento de Dados
              </h2>
              
              <div className="space-y-6">
                <div className="bg-vintage-beige/20 p-4 rounded-md">
                  <h3 className="font-medium text-vintage-brown mb-2">Salvar Todos os Dados</h3>
                  <p className="text-sm text-vintage-dark/80 mb-4">
                    Salva todas as configurações da loja no banco de dados.
                  </p>
                  <button
                    onClick={handleSaveAllData}
                    disabled={saving}
                    className="vintage-button flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    {saving ? 'Salvando...' : 'Salvar Todos os Dados'}
                  </button>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                  <h3 className="font-medium text-red-800 mb-2 flex items-center">
                    <Trash2 size={16} className="mr-2" />
                    Apagar Todos os Produtos
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    ⚠️ <strong>ATENÇÃO:</strong> Esta ação irá apagar permanentemente TODOS os produtos e suas imagens. 
                    Esta ação não pode ser desfeita!
                  </p>
                  <button
                    onClick={handleDeleteAllData}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    {deleting ? 'Apagando...' : 'Apagar Todos os Produtos'}
                  </button>
                </div>

                <div className="bg-vintage-beige/10 p-4 rounded-md">
                  <h3 className="font-medium text-vintage-brown mb-2">Informações do Sistema</h3>
                  <div className="text-sm text-vintage-dark/80 space-y-1">
                    <p>Total de produtos: <strong>{productList.length}</strong></p>
                    <p>Nome da loja: <strong>{storeData.name || 'Não definido'}</strong></p>
                    <p>WhatsApp configurado: <strong>{storeData.whatsapp_number ? 'Sim' : 'Não'}</strong></p>
                  </div>
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
