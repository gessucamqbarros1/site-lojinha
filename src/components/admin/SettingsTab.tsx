
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { uploadProductImage, deleteProductImage } from '@/lib/fileUploader';

interface SettingsTabProps {
  storeData: any;
  setStoreData: (data: any) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  toast: any;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  storeData,
  setStoreData,
  uploading,
  setUploading,
  saving,
  setSaving,
  toast
}) => {
  const [logoUpload, setLogoUpload] = useState<File | null>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoUpload(file);
      
      try {
        setUploading(true);
        
        if (storeData.logo && !storeData.logo.includes('/placeholder.svg')) {
          await deleteProductImage(storeData.logo);
        }
        
        const newLogoUrl = await uploadProductImage(file, 'store_logo');
        
        if (newLogoUrl) {
          const updatedStoreData = {
            ...storeData,
            logo: newLogoUrl
          };
          
          setStoreData(updatedStoreData);
          
          console.log('SettingsTab: Logo uploaded successfully:', newLogoUrl);
          
          toast({
            title: "Logo carregada",
            description: "A logo foi salva com sucesso",
          });
        }
      } catch (error) {
        console.error('SettingsTab: Error uploading logo:', error);
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
      console.log('SettingsTab: Attempting to save settings...', storeData);
      
      if (!storeData.name || storeData.name.trim() === '') {
        throw new Error('Nome da loja é obrigatório');
      }
      
      // Primeiro, vamos buscar se já existe alguma configuração
      const { data: existingData, error: fetchError } = await supabase
        .from('store_settings')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (fetchError) {
        console.error('SettingsTab: Error fetching existing data:', fetchError);
        throw new Error(`Erro ao buscar configurações: ${fetchError.message}`);
      }
      
      console.log('SettingsTab: Existing data check:', existingData);
      
      const settingsPayload = {
        name: storeData.name.trim(),
        logo: storeData.logo || null,
        banner: storeData.banner || null,
        about: storeData.about || null,
        whatsapp_number: storeData.whatsapp_number || null,
        updated_at: new Date().toISOString(),
      };
      
      console.log('SettingsTab: Settings payload:', settingsPayload);
      
      if (existingData && existingData.length > 0) {
        // Atualiza a primeira configuração encontrada
        const { error } = await supabase
          .from('store_settings')
          .update(settingsPayload)
          .eq('id', existingData[0].id);
        
        if (error) {
          console.error('SettingsTab: Error updating settings:', error);
          throw new Error(`Erro ao atualizar: ${error.message}`);
        }
        console.log('SettingsTab: Settings updated successfully');
      } else {
        // Cria uma nova configuração
        const { error } = await supabase
          .from('store_settings')
          .insert({
            ...settingsPayload,
            created_at: new Date().toISOString(),
          });
        
        if (error) {
          console.error('SettingsTab: Error inserting settings:', error);
          throw new Error(`Erro ao criar: ${error.message}`);
        }
        console.log('SettingsTab: Settings inserted successfully');
      }
      
      toast({
        title: "Configurações salvas",
        description: "As configurações da loja foram atualizadas com sucesso. A página será atualizada automaticamente.",
      });
      
      // Force a page refresh after a short delay to ensure changes are visible
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('SettingsTab: Error saving settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "Erro ao salvar configurações",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
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
            placeholder="Digite o nome da sua loja"
          />
          <p className="text-xs text-vintage-dark/60 mt-1">
            Este nome aparecerá ao lado da logo no site
          </p>
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
                onError={(e) => {
                  console.log('SettingsTab: Logo preview failed to load');
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
            placeholder="https://exemplo.com/banner.jpg"
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
            placeholder="Conte um pouco sobre sua loja..."
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
  );
};

export default SettingsTab;
