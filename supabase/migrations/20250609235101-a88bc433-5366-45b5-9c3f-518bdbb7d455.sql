
-- Remover políticas existentes que podem estar causando problemas
DROP POLICY IF EXISTS "Allow authenticated users to manage expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can manage expenses" ON public.expenses;

-- Criar políticas RLS mais específicas para expenses
CREATE POLICY "Users can view all expenses" ON public.expenses
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can insert expenses" ON public.expenses
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update expenses" ON public.expenses
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete expenses" ON public.expenses
  FOR DELETE TO authenticated
  USING (true);

-- Fazer o mesmo para expense_types para garantir que funcione
DROP POLICY IF EXISTS "Allow authenticated users to manage expense_types" ON public.expense_types;
DROP POLICY IF EXISTS "Authenticated users can manage expense_types" ON public.expense_types;

CREATE POLICY "Users can view expense types" ON public.expense_types
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage expense types" ON public.expense_types
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
