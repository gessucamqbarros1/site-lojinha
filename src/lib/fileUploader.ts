
import { supabase } from "@/integrations/supabase/client";

export async function uploadProductImage(
  file: File,
  productId: string,
  imageIndex?: number
): Promise<string | null> {
  try {
    if (!file) return null;

    console.log('Starting file upload for product:', productId, 'index:', imageIndex);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não permitido. Use JPG, PNG ou WebP.');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 5MB.');
    }

    // Create a unique file path using the productId, imageIndex, and a timestamp
    const fileExt = file.name.split('.').pop();
    const indexSuffix = imageIndex !== undefined ? `_${imageIndex}` : '';
    const fileName = `${productId}${indexSuffix}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log('Uploading file to path:', filePath);

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      throw new Error(`Erro no upload: ${error.message}`);
    }

    console.log('File uploaded successfully:', data);

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    console.log('Public URL generated:', publicUrlData.publicUrl);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    throw error; // Re-throw to let the calling function handle it
  }
}

export async function uploadMultipleProductImages(
  files: File[],
  productId: string
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => 
    uploadProductImage(file, productId, index)
  );
  
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
}

export async function deleteProductImage(url: string): Promise<boolean> {
  try {
    if (!url || url.includes('/placeholder.svg')) {
      return true; // No need to delete placeholder images
    }

    console.log('Attempting to delete image:', url);

    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Find the 'products' segment and get everything after it
    const productsIndex = pathParts.findIndex(part => part === 'products');
    if (productsIndex === -1) {
      console.warn('Invalid URL format for deletion:', url);
      return false;
    }
    
    // Get the file path relative to the bucket
    const filePath = pathParts.slice(productsIndex + 1).join('/');
    
    if (!filePath) {
      console.warn('Could not extract file path from URL:', url);
      return false;
    }

    console.log('Extracted file path for deletion:', filePath);

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage
      .from('products')
      .remove([`products/${filePath}`]);

    if (error) {
      console.error('Error deleting image from storage:', error);
      return false;
    }

    console.log('Image deleted successfully from storage');
    return true;
  } catch (error) {
    console.error('Error in deleteProductImage:', error);
    return false;
  }
}

export async function deleteMultipleProductImages(urls: string[]): Promise<boolean[]> {
  const deletePromises = urls.map(url => deleteProductImage(url));
  return await Promise.all(deletePromises);
}
