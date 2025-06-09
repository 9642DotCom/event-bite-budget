
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseList } from "./ExpenseList";
import { ExpenseFilters } from "./ExpenseFilters";

export const ExpensesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7),
    description: "",
    expenseType: "all"
  });

  const { data: expenses, refetch } = useQuery({
    queryKey: ["expenses", filters],
    queryFn: async () => {
      let query = supabase
        .from("expenses")
        .select(`
          *,
          expense_types:expense_type_id(name)
        `);
      
      if (filters.month) {
        // Calcular o primeiro e último dia do mês corretamente
        const year = parseInt(filters.month.split('-')[0]);
        const month = parseInt(filters.month.split('-')[1]);
        const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const lastDayFormatted = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
        
        query = query
          .gte("purchase_date", firstDay)
          .lte("purchase_date", lastDayFormatted);
      }
      
      if (filters.description) {
        query = query.ilike("description", `%${filters.description}%`);
      }
      
      if (filters.expenseType !== "all") {
        query = query.eq("expense_type_id", filters.expenseType);
      }
      
      const { data, error } = await query.order("purchase_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const totalExpenses = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Despesas</h1>
          <p className="text-gray-500">Controle de gastos e despesas</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Despesa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Total do Período</span>
            <span className="text-2xl font-bold text-red-600">
              R$ {totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <ExpenseFilters filters={filters} onFiltersChange={setFilters} />
      
      <ExpenseList expenses={expenses || []} onUpdate={refetch} />

      {showForm && (
        <ExpenseForm 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            setShowForm(false);
            refetch();
          }} 
        />
      )}
    </div>
  );
};
