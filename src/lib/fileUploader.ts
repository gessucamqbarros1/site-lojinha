
import { supabase } from "@/integrations/supabase/client";

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string | null> {
  try {
    if (!file) return null;

    // Create a unique file path using the productId and a timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    return null;
  }
}

export async function deleteProductImage(url: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const filePath = pathParts[pathParts.length - 1];

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage
      .from('products')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProductImage:', error);
    return false;
  }
}
