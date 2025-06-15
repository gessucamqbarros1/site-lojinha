
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadProductImage, deleteProductImage } from '@/lib/fileUploader';

interface LogoUploadProps {
  logoUrl: string;
  onLogoChange: (newLogoUrl: string) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  toast: any;
}

const LogoUpload: React.FC<LogoUploadProps> = ({
  logoUrl,
  onLogoChange,
  uploading,
  setUploading,
  toast
}) => {
  const [logoUpload, setLogoUpload] = useState<File | null>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoUpload(file);
      
      try {
        setUploading(true);
        
        if (logoUrl && !logoUrl.includes('/placeholder.svg')) {
          await deleteProductImage(logoUrl);
        }
        
        const newLogoUrl = await uploadProductImage(file, 'store_logo');
        
        if (newLogoUrl) {
          onLogoChange(newLogoUrl);
          
          console.log('LogoUpload: Logo uploaded successfully:', newLogoUrl);
          
          toast({
            title: "Logo carregada",
            description: "A logo foi salva com sucesso",
          });
        }
      } catch (error) {
        console.error('LogoUpload: Error uploading logo:', error);
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

  return (
    <div>
      <label className="block text-sm font-medium text-vintage-dark mb-2">
        Logo da Loja
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="w-32 h-32 bg-vintage-cream rounded-md overflow-hidden border border-vintage-beige/30 mx-auto">
          <img 
            src={logoUpload ? URL.createObjectURL(logoUpload) : (logoUrl || '/placeholder.svg')} 
            alt="Logo Preview" 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('LogoUpload: Logo preview failed to load');
              e.currentTarget.src = '/placeholder.svg';
            }}
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
  );
};

export default LogoUpload;
