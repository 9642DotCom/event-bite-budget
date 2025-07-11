
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CreditCard } from "lucide-react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const PaymentMethodChart = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data: paymentData } = useQuery({
    queryKey: ["payment-methods", currentMonth],
    queryFn: async () => {
      // Calcular corretamente o último dia do mês
      const year = parseInt(currentMonth.split('-')[0]);
      const month = parseInt(currentMonth.split('-')[1]);
      const lastDay = new Date(year, month, 0).getDate();
      
      const { data, error } = await supabase
        .from("revenues")
        .select("payment_method, amount")
        .gte("payment_date", `${currentMonth}-01`)
        .lte("payment_date", `${currentMonth}-${lastDay.toString().padStart(2, '0')}`)
        .not("payment_method", "is", null);
      
      if (error) throw error;
      
      const groupedData = data?.reduce((acc: any, item) => {
        const method = item.payment_method || "Não informado";
        if (!acc[method]) {
          acc[method] = 0;
        }
        acc[method] += Number(item.amount);
        return acc;
      }, {}) || {};

      return Object.entries(groupedData).map(([method, amount]) => ({
        name: method,
        value: amount as number,
      }));
    },
  });

  const chartConfig = {
    value: {
      label: "Valor",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
          Meios de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {paymentData && paymentData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[200px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  className="md:outerRadius-80"
                  label={({ name, percent }) => 
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {paymentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [
                    `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                    "Valor"
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dado de pagamento disponível
          </div>
        )}
      </CardContent>
    </Card>
  );
};
