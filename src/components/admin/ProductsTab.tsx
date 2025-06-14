
import React, { useState, useEffect } from 'react';
import { Product } from '@/components/ui/ProductCard';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import { supabase } from '@/integrations/supabase/client';
import { uploadProductImage, deleteProductImage } from '@/lib/fileUploader';

interface ProductsTabProps {
  productList: Product[];
  setProductList: (products: Product[]) => void;
  categories: string[];
  fetchProducts: () => void;
  generateWhatsAppLink: (name: string, price: number) => string;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  toast: any;
}

const ProductsTab: React.FC<ProductsTabProps> = ({
  productList,
  setProductList,
  categories,
  fetchProducts,
  generateWhatsAppLink,
  uploading,
  setUploading,
  saving,
  setSaving,
  toast
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);

  // Auto-save product when data changes
  useEffect(() => {
    if (editingProduct && isEditing && editingProduct.name && editingProduct.price > 0) {
      const timeoutId = setTimeout(() => {
        handleAutoSaveProduct();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [editingProduct?.name, editingProduct?.description, editingProduct?.price, editingProduct?.category]);

  const handleAutoSaveProduct = async () => {
    if (!editingProduct || !isEditing) return;
    
    try {
      console.log('Auto-saving product...');
      
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
      
      setProductList(prev => prev.map(p => 
        p.id === editingProduct.id ? { ...editingProduct, purchaseLink: whatsappLink } : p
      ));
      
    } catch (error) {
      console.error('Error auto-saving product:', error);
    }
  };

  const handleDeleteProduct = async (id: string, imageUrl?: string) => {
    try {
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
      
      try {
        setUploading(true);
        
        const productId = editingProduct.id || `temp_${Date.now()}`;
        
        if (editingProduct.image && !editingProduct.image.includes('/placeholder.svg')) {
          await deleteProductImage(editingProduct.image);
        }
        
        const newImageUrl = await uploadProductImage(file, productId);
        
        if (newImageUrl) {
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

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    
    try {
      setSaving(true);
      
      let imageUrl = editingProduct.image;
      
      if (fileUpload) {
        setUploading(true);
        if (isEditing && editingProduct.image && !editingProduct.image.includes('/placeholder.svg')) {
          await deleteProductImage(editingProduct.image);
        }
        
        const tempId = isEditing ? editingProduct.id : `temp_${Date.now()}`;
        
        const newImageUrl = await uploadProductImage(fileUpload, tempId);
        if (newImageUrl) {
          imageUrl = newImageUrl;
        }
        setUploading(false);
      }

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
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
      } else {
        result = await supabase
          .from('products')
          .insert(productData)
          .select();
      }
      
      if (result.error) {
        throw result.error;
      }
      
      fetchProducts();
      
      toast({
        title: isEditing ? "Produto atualizado" : "Produto adicionado",
        description: isEditing
          ? "O produto foi atualizado com sucesso"
          : "O produto foi adicionado com sucesso",
      });
      
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

  const handleBack = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setFileUpload(null);
  };

  if (isEditing || editingProduct) {
    return (
      <ProductForm
        editingProduct={editingProduct}
        isEditing={isEditing}
        categories={categories}
        onBack={handleBack}
        onSave={handleSaveProduct}
        onFileChange={handleFileChange}
        onProductChange={setEditingProduct}
        generateWhatsAppLink={generateWhatsAppLink}
        uploading={uploading}
        saving={saving}
      />
    );
  }

  return (
    <ProductList
      productList={productList}
      onEditProduct={handleEditProduct}
      onDeleteProduct={handleDeleteProduct}
      onAddNewProduct={handleAddNewProduct}
    />
  );
};

export default ProductsTab;
