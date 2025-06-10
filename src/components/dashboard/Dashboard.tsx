
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Target } from "lucide-react";
import { MonthlyChart } from "./MonthlyChart";
import { TopProducts } from "./TopProducts";
import { PaymentMethodChart } from "./PaymentMethodChart";

export const Dashboard = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data: monthlyRevenues } = useQuery({
    queryKey: ["monthly-revenues", currentMonth],
    queryFn: async () => {
      // Calcular corretamente o último dia do mês
      const year = parseInt(currentMonth.split('-')[0]);
      const month = parseInt(currentMonth.split('-')[1]);
      const lastDay = new Date(year, month, 0).getDate();
      
      const { data, error } = await supabase
        .from("revenues")
        .select("amount")
        .gte("payment_date", `${currentMonth}-01`)
        .lte("payment_date", `${currentMonth}-${lastDay.toString().padStart(2, '0')}`);
      
      if (error) throw error;
      return data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    },
  });

  const { data: monthlyExpenses } = useQuery({
    queryKey: ["monthly-expenses", currentMonth],
    queryFn: async () => {
      // Calcular corretamente o último dia do mês
      const year = parseInt(currentMonth.split('-')[0]);
      const month = parseInt(currentMonth.split('-')[1]);
      const lastDay = new Date(year, month, 0).getDate();
      
      const { data, error } = await supabase
        .from("expenses")
        .select("amount")
        .gte("purchase_date", `${currentMonth}-01`)
        .lte("purchase_date", `${currentMonth}-${lastDay.toString().padStart(2, '0')}`);
      
      if (error) throw error;
      return data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    },
  });

  const profit = (monthlyRevenues || 0) - (monthlyExpenses || 0);
  const isProfitable = profit >= 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString("pt-BR", { 
            month: "long", 
            year: "numeric" 
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {(monthlyRevenues || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {(monthlyExpenses || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isProfitable ? "Lucro" : "Prejuízo"}
            </CardTitle>
            <Target className={`h-4 w-4 ${isProfitable ? "text-green-600" : "text-red-600"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isProfitable ? "text-green-600" : "text-red-600"}`}>
              R$ {Math.abs(profit).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {monthlyRevenues ? ((profit / monthlyRevenues) * 100).toFixed(1) : "0.0"}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyChart />
        </div>
        <div>
          <PaymentMethodChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <TopProducts />
      </div>
    </div>
  );
};
