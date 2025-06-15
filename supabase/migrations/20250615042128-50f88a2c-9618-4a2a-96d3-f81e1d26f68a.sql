
-- Adicionar campos para sistema de ofertas automáticas
ALTER TABLE products 
ADD COLUMN original_price NUMERIC,
ADD COLUMN discount_percentage NUMERIC DEFAULT 0;

-- Função para calcular desconto automaticamente
CREATE OR REPLACE FUNCTION calculate_discount()
RETURNS TRIGGER AS $$
BEGIN
  -- Se é um novo produto (INSERT), definir original_price igual ao price
  IF TG_OP = 'INSERT' THEN
    NEW.original_price := NEW.price;
    NEW.discount_percentage := 0;
    RETURN NEW;
  END IF;
  
  -- Se é uma atualização (UPDATE)
  IF TG_OP = 'UPDATE' THEN
    -- Se original_price está NULL, definir como o preço anterior
    IF OLD.original_price IS NULL THEN
      NEW.original_price := OLD.price;
    ELSE
      NEW.original_price := OLD.original_price;
    END IF;
    
    -- Se o novo preço é menor que o original, calcular desconto
    IF NEW.price < NEW.original_price THEN
      NEW.discount_percentage := ROUND(((NEW.original_price - NEW.price) / NEW.original_price) * 100, 0);
    ELSE
      -- Se o preço subiu ou é igual, resetar desconto
      NEW.discount_percentage := 0;
      -- Se o preço subiu acima do original, atualizar o original_price
      IF NEW.price > NEW.original_price THEN
        NEW.original_price := NEW.price;
      END IF;
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para executar a função automaticamente
DROP TRIGGER IF EXISTS trigger_calculate_discount ON products;
CREATE TRIGGER trigger_calculate_discount
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION calculate_discount();

-- Atualizar produtos existentes para definir original_price
UPDATE products 
SET original_price = price, discount_percentage = 0 
WHERE original_price IS NULL;
