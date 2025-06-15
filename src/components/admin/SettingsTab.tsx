import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import PhoneInput from './PhoneInput';
import LogoUpload from './LogoUpload';
import BannerUpload from './BannerUpload';
import ThemeSelector from './ThemeSelector';

interface SettingsTabProps {
  storeData: any;
  setStoreData: (data: any) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  fetchStoreSettings: () => Promise<void>;
  toast: any;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  storeData,
  setStoreData,
  uploading,
  setUploading,
  saving,
  setSaving,
  fetchStoreSettings,
  toast
}) => {
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
        instagram_link: storeData.instagram_link || null,
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
    <div className="p-4 md:p-6">
      <h2 className="font-playfair text-lg md:text-xl mb-4 md:mb-6 text-vintage-brown">
        Configurações da Loja
      </h2>
      <div className="space-y-6 md:space-y-8">
        {/* Theme Selection */}
        <div>
          <ThemeSelector />
          <div className="vintage-divider"></div>
        </div>
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-vintage-dark mb-1">
            Nome da Loja
          </label>
          <input
            id="storeName"
            type="text"
            value={storeData.name}
            onChange={(e) => setStoreData({...storeData, name: e.target.value})}
            className="vintage-input w-full text-sm md:text-base"
            placeholder="Digite o nome da sua loja"
          />
          <p className="text-xs text-vintage-dark/60 mt-1">
            Este nome aparecerá ao lado da logo no site
          </p>
        </div>
        <PhoneInput
          value={storeData.whatsapp_number}
          onChange={(value) => setStoreData({...storeData, whatsapp_number: value})}
        />
        <div>
          <label htmlFor="instagramLink" className="block text-sm font-medium text-vintage-dark mb-1">
            Link do Instagram
          </label>
          <input
            id="instagramLink"
            type="text"
            value={storeData.instagram_link}
            onChange={(e) => setStoreData({...storeData, instagram_link: e.target.value})}
            className="vintage-input w-full text-sm md:text-base"
            placeholder="https://instagram.com/seuusuario"
          />
          <p className="text-xs text-vintage-dark/60 mt-1">
            Link completo do seu perfil no Instagram
          </p>
        </div>
        <LogoUpload
          logoUrl={storeData.logo}
          onLogoChange={(newLogoUrl) => setStoreData({...storeData, logo: newLogoUrl})}
          uploading={uploading}
          setUploading={setUploading}
          toast={toast}
        />
        <BannerUpload
          bannerUrl={storeData.banner}
          onBannerChange={(newBannerUrl) => setStoreData({...storeData, banner: newBannerUrl})}
          onBannerUrlChange={(url) => setStoreData({...storeData, banner: url})}
          uploading={uploading}
          setUploading={setUploading}
          toast={toast}
        />
        <div>
          <label htmlFor="about" className="block text-sm font-medium text-vintage-dark mb-1">
            Texto Sobre a Loja
          </label>
          <textarea
            id="about"
            rows={4}
            value={storeData.about}
            onChange={(e) => setStoreData({...storeData, about: e.target.value})}
            className="vintage-input w-full text-sm md:text-base resize-none"
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
            className="vintage-button w-full md:w-auto text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
