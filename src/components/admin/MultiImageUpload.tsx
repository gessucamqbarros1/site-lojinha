
import React, { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

interface MultiImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onFileChange: (files: File[], index: number) => void;
  uploading: boolean;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  images,
  onImagesChange,
  onFileChange,
  uploading
}) => {
  const [fileUploads, setFileUploads] = useState<(File | null)[]>([null, null, null]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newUploads = [...fileUploads];
      newUploads[index] = file;
      setFileUploads(newUploads);
      onFileChange([file], index);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newUploads = [...fileUploads];
    newUploads[index] = null;
    setFileUploads(newUploads);
    onImagesChange(newImages);
  };

  const getImageSrc = (index: number): string => {
    if (fileUploads[index]) {
      return URL.createObjectURL(fileUploads[index]!);
    }
    return images[index] || '/placeholder.svg';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-vintage-dark mb-2">
        Imagens do Produto (até 3)
      </label>
      
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="relative">
            <div className="aspect-square bg-vintage-cream rounded-md overflow-hidden border border-vintage-beige/30">
              {(images[index] || fileUploads[index]) ? (
                <>
                  <img 
                    src={getImageSrc(index)}
                    alt={`Imagem ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image size={24} className="text-vintage-dark/40" />
                </div>
              )}
            </div>
            
            <label 
              htmlFor={`image-upload-${index}`}
              className="mt-1 vintage-button-secondary flex items-center justify-center w-full cursor-pointer text-xs py-1"
            >
              <Upload size={12} className="mr-1" />
              {images[index] ? 'Trocar' : 'Adicionar'}
            </label>
            <input
              id={`image-upload-${index}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, index)}
              disabled={uploading}
            />
          </div>
        ))}
      </div>
      
      <p className="text-xs text-vintage-dark/60 mt-2">
        Formatos recomendados: JPG, PNG. Tamanho máximo: 5MB por imagem. A primeira imagem será usada como principal.
      </p>
    </div>
  );
};

export default MultiImageUpload;
