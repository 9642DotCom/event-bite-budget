
-- Criar políticas RLS para a tabela revenues
CREATE POLICY "Allow authenticated users to insert revenues" ON public.revenues
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to select revenues" ON public.revenues
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update revenues" ON public.revenues
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete revenues" ON public.revenues
  FOR DELETE TO authenticated
  USING (true);

-- Fazer o mesmo para as outras tabelas que podem ter o mesmo problema
CREATE POLICY "Allow authenticated users to manage expense_types" ON public.expense_types
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage products" ON public.products
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage expenses" ON public.expenses
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage sales" ON public.sales
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage sale_items" ON public.sale_items
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
