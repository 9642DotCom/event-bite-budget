
-- Adicionar coluna payment_method na tabela sales
ALTER TABLE public.sales 
ADD COLUMN payment_method TEXT;

-- Adicionar coluna payment_method na tabela revenues
ALTER TABLE public.revenues 
ADD COLUMN payment_method TEXT;
