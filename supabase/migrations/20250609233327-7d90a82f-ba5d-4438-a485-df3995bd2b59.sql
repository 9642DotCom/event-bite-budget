
-- Criar tabela de tipos de despesas
CREATE TABLE public.expense_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Inserir tipos de despesas padrão
INSERT INTO public.expense_types (name) VALUES 
('Ingrediente'),
('Embalagem'),
('Transporte'),
('Combustível'),
('Mão de obra'),
('Equipamentos'),
('Outros');

-- Criar tabela de produtos/lanches
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cost_price decimal(10,2) NOT NULL DEFAULT 0,
  sell_price decimal(10,2) NOT NULL DEFAULT 0,
  description text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de receitas
CREATE TABLE public.revenues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL CHECK (source_type IN ('ONG', 'Evento')),
  client_name text NOT NULL,
  payment_date date NOT NULL,
  amount decimal(10,2) NOT NULL,
  notes text,
  sale_id uuid, -- Referência para vendas do PDV
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de despesas
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_type_id uuid REFERENCES public.expense_types(id),
  description text NOT NULL,
  purchase_date date NOT NULL,
  amount decimal(10,2) NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de vendas do PDV
CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_date date NOT NULL DEFAULT CURRENT_DATE,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de itens de venda
CREATE TABLE public.sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_expense_types_updated_at
  BEFORE UPDATE ON public.expense_types
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_revenues_updated_at
  BEFORE UPDATE ON public.revenues
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.expense_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (permitir acesso a usuários autenticados)
CREATE POLICY "Authenticated users can manage expense_types" ON public.expense_types
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage products" ON public.products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage revenues" ON public.revenues
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage expenses" ON public.expenses
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage sales" ON public.sales
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage sale_items" ON public.sale_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
