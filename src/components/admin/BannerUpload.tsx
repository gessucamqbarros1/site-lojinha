
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadProductImage, deleteProductImage } from '@/lib/fileUploader';

interface BannerUploadProps {
  bannerUrl: string;
  onBannerChange: (newBannerUrl: string) => void;
  onBannerUrlChange: (url: string) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  toast: any;
}

const BannerUpload: React.FC<BannerUploadProps> = ({
  bannerUrl,
  onBannerChange,
  onBannerUrlChange,
  uploading,
  setUploading,
  toast
}) => {
  const [bannerUpload, setBannerUpload] = useState<File | null>(null);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerUpload(file);
      
      try {
        setUploading(true);
        
        if (bannerUrl && !bannerUrl.includes('/placeholder.svg')) {
          await deleteProductImage(bannerUrl);
        }
        
        const newBannerUrl = await uploadProductImage(file, 'store_banner');
        
        if (newBannerUrl) {
          onBannerChange(newBannerUrl);
          
          console.log('BannerUpload: Banner uploaded successfully:', newBannerUrl);
          
          toast({
            title: "Banner carregado",
            description: "O banner foi salvo com sucesso",
          });
        }
      } catch (error) {
        console.error('BannerUpload: Error uploading banner:', error);
        toast({
          title: "Erro no upload do banner",
          description: error instanceof Error ? error.message : "Erro ao fazer upload do banner",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-vintage-dark mb-2">
        Banner da Loja
      </label>
      <div className="space-y-4">
        <div className="w-full h-32 bg-vintage-cream rounded-md overflow-hidden border border-vintage-beige/30">
          <img 
            src={bannerUpload ? URL.createObjectURL(bannerUpload) : (bannerUrl || '/placeholder.svg')} 
            alt="Banner Preview" 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('BannerUpload: Banner preview failed to load');
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="banner-upload" 
              className="vintage-button-secondary flex items-center justify-center w-full cursor-pointer"
            >
              <Upload size={16} className="mr-2" />
              {uploading ? 'Carregando...' : 'Upload Banner'}
            </label>
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
              disabled={uploading}
            />
          </div>
          <div>
            <input
              type="text"
              value={bannerUrl}
              onChange={(e) => onBannerUrlChange(e.target.value)}
              className="vintage-input w-full"
              placeholder="ou cole uma URL"
            />
          </div>
        </div>
        <p className="text-xs text-vintage-dark/60">
          Faça upload de uma imagem ou cole uma URL. Formato recomendado: 16:9. Tamanho máximo: 5MB
        </p>
      </div>
    </div>
  );
};

export default BannerUpload;
