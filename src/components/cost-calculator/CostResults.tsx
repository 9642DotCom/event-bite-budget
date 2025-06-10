
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Target, BarChart3 } from "lucide-react";
import { CostCalculation } from "./CostCalculatorPage";

interface CostResultsProps {
  calculation: CostCalculation;
}

export const CostResults = ({ calculation }: CostResultsProps) => {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Resultados do Cálculo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Custo por Unidade</p>
                <p className="font-semibold text-blue-700">
                  {formatCurrency(calculation.unitCost)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Lucro por Unidade</p>
                <p className="font-semibold text-green-700">
                  {formatCurrency(calculation.profit)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Margem de Lucro</p>
                <p className="font-semibold text-purple-700">
                  {formatPercentage(calculation.profitMargin)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Faturamento Bruto</p>
                <p className="font-semibold text-orange-700">
                  {formatCurrency(calculation.grossRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-gray-700 mb-2">Resumo:</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-gray-600">Ingredientes:</span>{" "}
                {formatCurrency(calculation.ingredientsCost)} para{" "}
                {calculation.unitsProduced} unidades
              </p>
              <p>
                <span className="text-gray-600">Preço de venda:</span>{" "}
                {formatCurrency(calculation.sellPrice)} por unidade
              </p>
              <p>
                <span className="text-gray-600">Projeção:</span>{" "}
                {calculation.projectedSales} vendas = {formatCurrency(calculation.grossRevenue)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
