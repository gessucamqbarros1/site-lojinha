
import React from 'react';
import { Product } from '@/components/ui/ProductCard';
import { ArrowLeft } from 'lucide-react';
import MultiImageUpload from './MultiImageUpload';

interface ProductFormProps {
  editingProduct: Product | null;
  isEditing: boolean;
  categories: string[];
  onBack: () => void;
  onSave: () => void;
  onMultiFileChange: (files: File[], index: number) => void;
  onProductChange: (product: Product) => void;
  generateWhatsAppLink: (name: string, price: number) => string;
  uploading: boolean;
  saving: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  editingProduct,
  isEditing,
  categories,
  onBack,
  onSave,
  onMultiFileChange,
  onProductChange,
  generateWhatsAppLink,
  uploading,
  saving
}) => {
  if (!editingProduct) return null;

  const handleImagesChange = (images: string[]) => {
    onProductChange({
      ...editingProduct,
      images,
      image: images[0] || '/placeholder.svg'
    });
  };

  const getCurrentImages = (): string[] => {
    if (editingProduct.images && editingProduct.images.length > 0) {
      return editingProduct.images;
    }
    return editingProduct.image ? [editingProduct.image] : [];
  };

  return (
    <div className="vintage-card p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
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
            value={editingProduct.name || ''}
            onChange={(e) => onProductChange({
              ...editingProduct,
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
            value={editingProduct.description || ''}
            onChange={(e) => onProductChange({
              ...editingProduct,
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
              value={editingProduct.price || 0}
              onChange={(e) => onProductChange({
                ...editingProduct,
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
              value={editingProduct.category || ''}
              onChange={(e) => onProductChange({
                ...editingProduct,
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
        
        <MultiImageUpload
          images={getCurrentImages()}
          onImagesChange={handleImagesChange}
          onFileChange={onMultiFileChange}
          uploading={uploading}
        />
        
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
            onClick={onSave}
            disabled={uploading || saving}
            className="vintage-button"
          >
            {(uploading || saving) ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
