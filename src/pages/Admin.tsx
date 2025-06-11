
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/components/ui/ProductCard';
import ProductImageUploader from '@/components/ui/ProductImageUploader';
import { uploadProductImage, deleteProductImage } from '@/lib/fileUploader';

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeSettings, setStoreSettings] = useState({
    name: '',
    logo: '',
    banner: '',
    about: '',
    whatsapp_number: ''
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    purchase_link: ''
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchStoreSettings();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedProducts: Product[] = data.map(product => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description,
          price: parseFloat(product.price.toString()),
          image: product.image || '/placeholder.svg',
          images: Array.isArray(product.images) ? 
            (product.images as string[]).filter((img): img is string => typeof img === 'string') : 
            [],
          category: product.category,
          purchaseLink: product.purchase_link
        }));
        
        // Garantir que cada produto tenha pelo menos uma imagem
        formattedProducts.forEach(p => {
          if ((!p.images || p.images.length === 0) && p.image) {
            p.images = [p.image];
          }
          if (!p.images || p.images.length === 0) {
            p.images = ['/placeholder.svg'];
          }
        });
        
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    }
  };

  const fetchStoreSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setStoreSettings({
          name: data.name || '',
          logo: data.logo || '',
          banner: data.banner || '',
          about: data.about || '',
          whatsapp_number: data.whatsapp_number || ''
        });
        setLogoPreview(data.logo || '');
      }
    } catch (error) {
      console.error('Error fetching store settings:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações da loja.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        purchase_link: newProduct.purchase_link,
        images: []
      };

      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) throw error;

      toast({
        title: "Produto adicionado!",
        description: "O produto foi adicionado com sucesso.",
      });

      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        purchase_link: ''
      });
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: "Não foi possível adicionar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          category: editingProduct.category,
          purchase_link: editingProduct.purchaseLink,
          images: editingProduct.images
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast({
        title: "Produto atualizado!",
        description: "O produto foi atualizado com sucesso.",
      });

      setEditingProduct(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Erro ao atualizar produto",
        description: "Não foi possível atualizar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Produto excluído!",
        description: "O produto foi excluído com sucesso.",
      });

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro ao excluir produto",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    }
  };

  const handleStoreSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let logoUrl = storeSettings.logo;

      // Upload da nova logo se foi selecionada
      if (logoFile) {
        try {
          // Deletar logo antiga se existir
          if (storeSettings.logo && storeSettings.logo !== '/placeholder.svg') {
            await deleteProductImage(storeSettings.logo);
          }
          
          // Upload da nova logo
          logoUrl = await uploadProductImage(logoFile, 'logo');
        } catch (uploadError) {
          console.error('Error uploading logo:', uploadError);
          toast({
            title: "Erro no upload da logo",
            description: "Não foi possível fazer upload da logo.",
            variant: "destructive",
          });
          return;
        }
      }

      const updatedSettings = {
        ...storeSettings,
        logo: logoUrl
      };

      const { error } = await supabase
        .from('store_settings')
        .upsert([updatedSettings], { onConflict: 'id' });

      if (error) throw error;

      setStoreSettings(updatedSettings);
      setLogoFile(null);
      setLogoPreview(logoUrl);

      toast({
        title: "Configurações atualizadas!",
        description: "As configurações da loja foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating store settings:', error);
      toast({
        title: "Erro ao atualizar configurações",
        description: "Não foi possível atualizar as configurações.",
        variant: "destructive",
      });
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // Criar preview da nova logo
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-vintage-brown">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream">
      <div className="vintage-container py-8">
        <h1 className="text-3xl font-playfair text-vintage-brown mb-8">
          Painel Administrativo
        </h1>

        {/* Store Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-vintage-brown font-playfair">
              Configurações da Loja
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStoreSettingsUpdate} className="space-y-4">
              <div>
                <Label htmlFor="store-name">Nome da Loja</Label>
                <Input
                  id="store-name"
                  value={storeSettings.name}
                  onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})}
                  placeholder="Nome da loja"
                />
              </div>

              <div>
                <Label htmlFor="logo-upload">Logo da Loja</Label>
                <div className="space-y-4">
                  {logoPreview && (
                    <div className="w-32 h-32 border border-vintage-beige rounded-md overflow-hidden">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-vintage-beige file:text-vintage-dark hover:file:bg-vintage-beige/80"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={storeSettings.whatsapp_number}
                  onChange={(e) => setStoreSettings({...storeSettings, whatsapp_number: e.target.value})}
                  placeholder="5511999999999"
                />
              </div>

              <div>
                <Label htmlFor="about">Sobre a Loja</Label>
                <Textarea
                  id="about"
                  value={storeSettings.about}
                  onChange={(e) => setStoreSettings({...storeSettings, about: e.target.value})}
                  placeholder="Descrição da loja"
                  rows={4}
                />
              </div>

              <Button type="submit" className="vintage-button">
                Salvar Configurações
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Products Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-vintage-brown font-playfair">
              Gerenciar Produtos
            </CardTitle>
            <Button 
              onClick={() => {
                setShowForm(!showForm);
                setEditingProduct(null);
                setNewProduct({
                  name: '',
                  description: '',
                  price: '',
                  category: '',
                  purchase_link: ''
                });
              }}
              className="vintage-button flex items-center gap-2"
            >
              {showForm ? <EyeOff size={16} /> : <Eye size={16} />}
              {showForm ? 'Ocultar Formulário' : 'Adicionar Produto'}
            </Button>
          </CardHeader>
          
          <CardContent>
            {showForm && (
              <form onSubmit={editingProduct ? handleUpdate : handleSubmit} className="space-y-4 mb-8 p-4 bg-vintage-gray rounded-md">
                <h3 className="text-lg font-playfair text-vintage-brown">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={editingProduct ? editingProduct.name : newProduct.name}
                      onChange={(e) => {
                        if (editingProduct) {
                          setEditingProduct({...editingProduct, name: e.target.value});
                        } else {
                          setNewProduct({...newProduct, name: e.target.value});
                        }
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Preço</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={editingProduct ? editingProduct.price.toString() : newProduct.price}
                      onChange={(e) => {
                        if (editingProduct) {
                          setEditingProduct({...editingProduct, price: parseFloat(e.target.value)});
                        } else {
                          setNewProduct({...newProduct, price: e.target.value});
                        }
                      }}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={editingProduct ? editingProduct.category : newProduct.category}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({...editingProduct, category: e.target.value});
                      } else {
                        setNewProduct({...newProduct, category: e.target.value});
                      }
                    }}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={editingProduct ? editingProduct.description : newProduct.description}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({...editingProduct, description: e.target.value});
                      } else {
                        setNewProduct({...newProduct, description: e.target.value});
                      }
                    }}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="purchase_link">Link de Compra (opcional)</Label>
                  <Input
                    id="purchase_link"
                    type="url"
                    value={editingProduct ? (editingProduct.purchaseLink || '') : newProduct.purchase_link}
                    onChange={(e) => {
                      if (editingProduct) {
                        setEditingProduct({...editingProduct, purchaseLink: e.target.value});
                      } else {
                        setNewProduct({...newProduct, purchase_link: e.target.value});
                      }
                    }}
                    placeholder="https://wa.me/5511999999999"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="vintage-button">
                    {editingProduct ? 'Atualizar' : 'Adicionar'}
                  </Button>
                  {editingProduct && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setEditingProduct(null);
                        setShowForm(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            )}

            {/* Products List */}
            <div className="space-y-4">
              {products.length === 0 ? (
                <p className="text-center text-vintage-dark/70 py-8">
                  Nenhum produto cadastrado ainda.
                </p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="flex flex-col md:flex-row gap-4 p-4 border border-vintage-beige rounded-md">
                    <div className="w-full md:w-48 h-32 bg-vintage-cream rounded overflow-hidden">
                      <img 
                        src={product.images[0] || product.image || '/placeholder.svg'} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow space-y-2">
                      <h3 className="font-playfair text-lg text-vintage-brown">
                        {product.name}
                      </h3>
                      <p className="text-sm text-vintage-dark/70 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-primary font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(product.price)}
                        </span>
                        <span className="text-xs px-2 py-1 bg-vintage-beige/30 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Image Uploader */}
                      <div className="mt-4">
                        <ProductImageUploader
                          productId={product.id}
                          initialImages={product.images || []}
                          onChange={(images) => {
                            setProducts(prevProducts => 
                              prevProducts.map(p => 
                                p.id === product.id 
                                  ? { ...p, images }
                                  : p
                              )
                            );
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
