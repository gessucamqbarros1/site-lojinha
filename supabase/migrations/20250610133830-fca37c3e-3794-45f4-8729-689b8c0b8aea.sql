
-- Criar bucket para imagens dos produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Criar política para permitir upload de imagens
CREATE POLICY "Allow public uploads to products bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'products');

-- Criar política para permitir visualização pública das imagens
CREATE POLICY "Allow public access to products bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

-- Criar política para permitir deleção de imagens
CREATE POLICY "Allow public delete from products bucket" ON storage.objects
FOR DELETE USING (bucket_id = 'products');
