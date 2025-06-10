
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { CostCalculation } from "./CostCalculatorPage";

interface CostChartsProps {
  calculation: CostCalculation;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export const CostCharts = ({ calculation }: CostChartsProps) => {
  const costBreakdown = [
    {
      name: "Custo",
      value: calculation.unitCost,
      color: COLORS[0],
    },
    {
      name: "Lucro",
      value: calculation.profit,
      color: COLORS[1],
    },
  ];

  const chartConfig = {
    value: { label: "Valor" },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <PieChartIcon className="h-4 w-4 md:h-5 md:w-5" />
            Composição do Preço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => 
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
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
        </CardContent>
      </Card>
    </div>
  );
};
