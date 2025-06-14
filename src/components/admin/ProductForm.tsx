
import React, { useState } from 'react';
import { Product } from '@/components/ui/ProductCard';
import { ArrowLeft, Upload } from 'lucide-react';

interface ProductFormProps {
  editingProduct: Product | null;
  isEditing: boolean;
  categories: string[];
  onBack: () => void;
  onSave: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  onFileChange,
  onProductChange,
  generateWhatsAppLink,
  uploading,
  saving
}) => {
  const [fileUpload, setFileUpload] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUpload(e.target.files[0]);
    }
    onFileChange(e);
  };

  if (!editingProduct) return null;

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
        
        <div>
          <label className="block text-sm font-medium text-vintage-dark mb-1">
            Imagem do Produto
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="w-full aspect-square bg-vintage-cream rounded-md overflow-hidden border border-vintage-beige/30">
              <img 
                src={fileUpload ? URL.createObjectURL(fileUpload) : (editingProduct.image || '/placeholder.svg')} 
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
