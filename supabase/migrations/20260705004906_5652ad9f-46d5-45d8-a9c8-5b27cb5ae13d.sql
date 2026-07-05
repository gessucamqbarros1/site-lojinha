
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS about_headline TEXT;
