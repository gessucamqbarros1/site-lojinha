
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

  // Verificar se o produto está em oferta
  const isOnSale = editingProduct.discount_percentage && editingProduct.discount_percentage > 0;

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
        
        {/* Indicador de oferta */}
        {isOnSale && (
          <div className="ml-4 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            🔥 Em Oferta (-{editingProduct.discount_percentage}%)
          </div>
        )}
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
              Preço Atual (R$)
              {isOnSale && (
                <span className="text-red-600 text-xs ml-2">
                  (Oferta ativa)
                </span>
              )}
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

        {/* Mostrar informações de preço original se existir */}
        {editingProduct.original_price && editingProduct.original_price !== editingProduct.price && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-amber-800 mb-2">Informações da Oferta</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-amber-700">Preço Original:</span>
                <div className="font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(editingProduct.original_price)}
                </div>
              </div>
              <div>
                <span className="text-amber-700">Preço Atual:</span>
                <div className="font-medium text-green-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(editingProduct.price)}
                </div>
              </div>
              <div>
                <span className="text-amber-700">Desconto:</span>
                <div className="font-medium text-red-600">
                  -{editingProduct.discount_percentage}%
                </div>
              </div>
            </div>
          </div>
        )}
        
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
