
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const MonthlyChart = () => {
  const { data: chartData } = useQuery({
    queryKey: ["monthly-chart"],
    queryFn: async () => {
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toISOString().slice(0, 7);
      }).reverse();

      const monthlyData = await Promise.all(
        last6Months.map(async (month) => {
          const [revenuesResult, expensesResult] = await Promise.all([
            supabase
              .from("revenues")
              .select("amount")
              .gte("payment_date", `${month}-01`)
              .lt("payment_date", `${month}-32`),
            supabase
              .from("expenses")
              .select("amount")
              .gte("purchase_date", `${month}-01`)
              .lt("purchase_date", `${month}-32`)
          ]);

          const revenues = revenuesResult.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
          const expenses = expensesResult.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

          return {
            month: new Date(month).toLocaleDateString("pt-BR", { month: "short" }),
            receitas: revenues,
            despesas: expenses,
            lucro: revenues - expenses
          };
        })
      );

      return monthlyData;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [
                `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
              ]}
            />
            <Legend />
            <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
            <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
