
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RevenueForm } from "./RevenueForm";
import { RevenueList } from "./RevenueList";
import { RevenueFilters } from "./RevenueFilters";

export const RevenuesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7),
    client: "",
    sourceType: "all"
  });

  const { data: revenues, refetch } = useQuery({
    queryKey: ["revenues", filters],
    queryFn: async () => {
      let query = supabase.from("revenues").select("*");
      
      if (filters.month) {
        // Calcular corretamente o último dia do mês para evitar datas inválidas
        const year = parseInt(filters.month.split('-')[0]);
        const month = parseInt(filters.month.split('-')[1]);
        const lastDay = new Date(year, month, 0).getDate();
        
        query = query
          .gte("payment_date", `${filters.month}-01`)
          .lte("payment_date", `${filters.month}-${lastDay.toString().padStart(2, '0')}`);
      }
      
      if (filters.client) {
        query = query.ilike("client_name", `%${filters.client}%`);
      }
      
      if (filters.sourceType !== "all") {
        query = query.eq("source_type", filters.sourceType);
      }
      
      const { data, error } = await query.order("payment_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const totalRevenues = revenues?.reduce((sum, revenue) => sum + Number(revenue.amount), 0) || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receitas</h1>
          <p className="text-gray-500">Controle de receitas de ONGs e eventos</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Receita
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Total do Período</span>
            <span className="text-2xl font-bold text-green-600">
              R$ {totalRevenues.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <RevenueFilters filters={filters} onFiltersChange={setFilters} />
      
      <RevenueList revenues={revenues || []} onUpdate={refetch} />

      {showForm && (
        <RevenueForm 
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
