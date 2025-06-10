
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
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

  const revenueProjections = [
    {
      scenario: "25% das vendas",
      vendas: Math.floor(calculation.projectedSales * 0.25),
      faturamento: calculation.sellPrice * Math.floor(calculation.projectedSales * 0.25),
    },
    {
      scenario: "50% das vendas",
      vendas: Math.floor(calculation.projectedSales * 0.5),
      faturamento: calculation.sellPrice * Math.floor(calculation.projectedSales * 0.5),
    },
    {
      scenario: "75% das vendas",
      vendas: Math.floor(calculation.projectedSales * 0.75),
      faturamento: calculation.sellPrice * Math.floor(calculation.projectedSales * 0.75),
    },
    {
      scenario: "100% das vendas",
      vendas: calculation.projectedSales,
      faturamento: calculation.grossRevenue,
    },
  ];

  const chartConfig = {
    value: { label: "Valor" },
    faturamento: { label: "Faturamento" },
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
            Projeções de Faturamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueProjections}>
                <XAxis 
                  dataKey="scenario" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  fontSize={10}
                  tickFormatter={(value) => 
                    `R$ ${(value / 1000).toFixed(0)}k`
                  }
                />
                <Bar 
                  dataKey="faturamento" 
                  fill={COLORS[2]}
                  radius={[4, 4, 0, 0]}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                    "Faturamento"
                  ]}
                  labelFormatter={(label, payload) => {
                    const data = payload?.[0]?.payload;
                    return data ? `${label} (${data.vendas} vendas)` : label;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
