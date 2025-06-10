
-- Adicionar coluna para múltiplas imagens no formato JSON
ALTER TABLE products ADD COLUMN images jsonb DEFAULT '[]'::jsonb;

-- Atualizar produtos existentes para mover a imagem atual para o array de imagens
UPDATE products 
SET images = CASE 
  WHEN image IS NOT NULL AND image != '' AND image != '/placeholder.svg' 
  THEN jsonb_build_array(image)
  ELSE '[]'::jsonb
END
WHERE images = '[]'::jsonb;
