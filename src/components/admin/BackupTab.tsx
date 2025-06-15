import React from 'react';
import { Save, Trash2 } from 'lucide-react';
import { Product } from '@/components/ui/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { deleteProductImage } from '@/lib/fileUploader';

interface BackupTabProps {
  storeData: any;
  productList: Product[];
  setProductList: (products: Product[]) => void;
  setStoreData: (data: any) => void;
  fetchProducts: () => Promise<void>;
  fetchStoreSettings: () => Promise<void>;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  deleting: boolean;
  setDeleting: (deleting: boolean) => void;
  toast: any;
}

const BackupTab: React.FC<BackupTabProps> = ({
  storeData,
  productList,
  setProductList,
  setStoreData,
  fetchProducts,
  fetchStoreSettings,
  saving,
  setSaving,
  deleting,
  setDeleting,
  toast
}) => {
  const handleSaveAllData = async () => {
    try {
      setSaving(true);
      console.log('Attempting to save all data...');
      
      const { data: existingData, error: fetchError } = await supabase
        .from('store_settings')
        .select('id')
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching existing data:', fetchError);
        throw fetchError;
      }
      
      console.log('Existing data check:', existingData);
      
      if (existingData) {
        console.log('Updating existing record with ID:', existingData.id);
        const { error: settingsError } = await supabase
          .from('store_settings')
          .update({
            name: storeData.name,
            logo: storeData.logo,
            banner: storeData.banner,
            about: storeData.about,
            whatsapp_number: storeData.whatsapp_number,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingData.id);
        
        if (settingsError) {
          console.error('Error updating settings:', settingsError);
          throw settingsError;
        }
        console.log('Settings updated successfully');
      } else {
        console.log('Creating new record...');
        const { error: settingsError } = await supabase
          .from('store_settings')
          .insert({
            name: storeData.name,
            logo: storeData.logo,
            banner: storeData.banner,
            about: storeData.about,
            whatsapp_number: storeData.whatsapp_number,
          });
        
        if (settingsError) {
          console.error('Error inserting settings:', settingsError);
          throw settingsError;
        }
        console.log('Settings inserted successfully');
      }
      
      toast({
        title: "Dados salvos com sucesso",
        description: "Todas as configurações e produtos foram salvos",
      });
    } catch (error) {
      console.error('Error saving all data:', error);
      toast({
        title: "Erro ao salvar dados",
        description: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllData = async () => {
    const confirmDelete = window.confirm(
      "⚠️ ATENÇÃO: Esta ação irá apagar TODOS os produtos permanentemente. Esta ação não pode ser desfeita. Tem certeza?"
    );
    
    if (!confirmDelete) return;
    
    const confirmAgain = window.confirm(
      "Confirme novamente: Você realmente deseja apagar TODOS os produtos? Esta ação é irreversível!"
    );
    
    if (!confirmAgain) return;

    try {
      setDeleting(true);
      
      for (const product of productList) {
        if (product.image && !product.image.includes('/placeholder.svg')) {
          try {
            await deleteProductImage(product.image);
          } catch (imageError) {
            console.error('Error deleting image for product:', product.name, imageError);
          }
        }
      }
      
      const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error) {
        throw error;
      }
      
      setProductList([]);
      
      toast({
        title: "Todos os produtos foram apagados",
        description: "Todos os produtos e suas imagens foram removidos permanentemente",
      });
    } catch (error) {
      console.error('Error deleting all products:', error);
      toast({
        title: "Erro ao apagar produtos",
        description: "Não foi possível apagar todos os produtos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="vintage-card p-6">
      <h2 className="font-playfair text-xl mb-6 text-vintage-brown">
        Backup & Gerenciamento de Dados
      </h2>
      
      <div className="space-y-6">
        <div className="bg-vintage-beige/20 p-4 rounded-md">
          <h3 className="font-medium text-vintage-brown mb-2">Salvar Todos os Dados</h3>
          <p className="text-sm text-vintage-dark/80 mb-4">
            Salva todas as configurações da loja no banco de dados.
          </p>
          <button
            onClick={handleSaveAllData}
            disabled={saving}
            className="vintage-button flex items-center"
          >
            <Save size={16} className="mr-2" />
            {saving ? 'Salvando...' : 'Salvar Todos os Dados'}
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h3 className="font-medium text-red-800 mb-2 flex items-center">
            <Trash2 size={16} className="mr-2" />
            Apagar Todos os Produtos
          </h3>
          <p className="text-sm text-red-700 mb-4">
            ⚠️ <strong>ATENÇÃO:</strong> Esta ação irá apagar permanentemente TODOS os produtos e suas imagens. 
            Esta ação não pode ser desfeita!
          </p>
          <button
            onClick={handleDeleteAllData}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            {deleting ? 'Apagando...' : 'Apagar Todos os Produtos'}
          </button>
        </div>

        <div className="bg-vintage-beige/10 p-4 rounded-md">
          <h3 className="font-medium text-vintage-brown mb-2">Informações do Sistema</h3>
          <div className="text-sm text-vintage-dark/80 space-y-1">
            <p>Total de produtos: <strong>{productList.length}</strong></p>
            <p>Nome da loja: <strong>{storeData.name || 'Não definido'}</strong></p>
            <p>WhatsApp configurado: <strong>{storeData.whatsapp_number ? 'Sim' : 'Não'}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupTab;
