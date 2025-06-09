
-- Criar tabela para configurações da loja
CREATE TABLE public.store_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Minha Loja',
  logo TEXT,
  banner TEXT,
  about TEXT,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  purchase_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configurações padrão da loja
INSERT INTO public.store_settings (name, whatsapp_number) 
VALUES ('Loja Gessica', '5511999999999');

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_store_settings_updated_at
    BEFORE UPDATE ON public.store_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS nas tabelas
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso público de leitura
CREATE POLICY "Permitir leitura pública das configurações da loja" 
  ON public.store_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Permitir leitura pública dos produtos" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- Criar políticas para permitir todas as operações (para o admin)
CREATE POLICY "Permitir todas as operações nas configurações da loja" 
  ON public.store_settings 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Permitir todas as operações nos produtos" 
  ON public.products 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
