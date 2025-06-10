
import React, { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadProductImage, deleteProductImage, validateImageFile } from '@/lib/fileUploader';

interface ProductImageUploaderProps {
  productId: string;
  initialImages: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ProductImageUploader = ({
  productId,
  initialImages,
  onChange,
  maxImages = 3
}: ProductImageUploaderProps) => {
  const [images, setImages] = useState<string[]>(initialImages || []);
  const [uploading, setUploading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];

    try {
      // Verificar se já atingiu o limite de imagens
      if (images.length >= maxImages) {
        toast({
          title: "Limite de imagens atingido",
          description: `Remova alguma imagem antes de adicionar uma nova. Máximo: ${maxImages} imagens.`,
          variant: "destructive",
        });
        return;
      }

      // Validar o arquivo
      validateImageFile(file);
      
      setUploading(true);

      // Upload da imagem
      const imageUrl = await uploadProductImage(file, productId);
      
      // Atualizar a lista de imagens
      const updatedImages = [...images, imageUrl];
      setImages(updatedImages);
      onChange(updatedImages);
      
      toast({
        title: "Imagem adicionada",
        description: "A imagem foi adicionada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro ao fazer upload da imagem",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Limpar o input de arquivo
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const imageToRemove = images[index];
      
      // Não tentar excluir o placeholder
      if (imageToRemove && !imageToRemove.includes('/placeholder.svg')) {
        await deleteProductImage(imageToRemove);
      }
      
      // Remover da lista
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      onChange(updatedImages);
      
      toast({
        title: "Imagem removida",
        description: "A imagem foi removida com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover imagem",
        description: error instanceof Error ? error.message : "Erro ao remover a imagem",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative border border-vintage-beige/50 rounded-md overflow-hidden aspect-square">
            <img 
              src={image} 
              alt={`Imagem do produto ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1 text-red-500 hover:text-red-700"
              aria-label="Remover imagem"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        
        {/* Espaços vazios para completar o grid */}
        {Array.from({ length: Math.max(0, maxImages - images.length) }).map((_, index) => (
          <div 
            key={`empty-${index}`}
            className="border border-dashed border-vintage-beige/50 rounded-md aspect-square flex items-center justify-center bg-vintage-beige/10"
          >
            <Image size={24} className="text-vintage-beige/50" />
          </div>
        ))}
      </div>
      
      {images.length < maxImages && (
        <div>
          <label
            htmlFor="product-image-upload"
            className="vintage-button-secondary flex items-center justify-center w-full cursor-pointer"
          >
            <Upload size={16} className="mr-2" />
            {uploading ? 'Carregando...' : 'Adicionar Imagem'}
          </label>
          <input
            id="product-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading || images.length >= maxImages}
          />
          <p className="text-xs text-vintage-dark/60 mt-2 text-center">
            {`${images.length}/${maxImages} imagens. Formatos: JPG, PNG. Tamanho máximo: 5MB`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductImageUploader;
