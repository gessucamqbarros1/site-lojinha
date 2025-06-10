import { supabase } from "@/integrations/supabase/client";

export const uploadProductImage = async (file: File, productId: string) => {
  try {
    // Generate unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file to the products bucket
    const { data, error } = await supabase
      .storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    // Get the public URL for the uploaded file
    const { data: publicURL } = supabase
      .storage
      .from('products')
      .getPublicUrl(data.path);

    return publicURL.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Error uploading image. Please try again.');
  }
};

export const deleteProductImage = async (imageUrl: string) => {
  try {
    // Extract the file name from the URL
    const fileName = imageUrl.split('/').pop();
    
    if (!fileName) {
      throw new Error('Invalid image URL');
    }
    
    const { error } = await supabase
      .storage
      .from('products')
      .remove([fileName]);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Error deleting image. Please try again.');
  }
};

// Função para verificar se um arquivo é uma imagem válida
export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo de arquivo inválido. Apenas imagens JPG, PNG, WEBP ou GIF são permitidas.');
  }
  
  if (file.size > maxSize) {
    throw new Error('Arquivo muito grande. O tamanho máximo permitido é 5MB.');
  }
  
  return true;
};
