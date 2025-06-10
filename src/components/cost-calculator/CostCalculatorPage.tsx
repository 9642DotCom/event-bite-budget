
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { CostCalculatorForm } from "./CostCalculatorForm";
import { CostResults } from "./CostResults";
import { CostCharts } from "./CostCharts";

export interface CostCalculation {
  ingredientsCost: number;
  unitsProduced: number;
  unitCost: number;
  sellPrice: number;
  profit: number;
  profitMargin: number;
}

export const CostCalculatorPage = () => {
  const [calculation, setCalculation] = useState<CostCalculation | null>(null);

  const handleCalculate = (
    ingredientsCost: number,
    unitsProduced: number,
    sellPrice: number
  ) => {
    const unitCost = ingredientsCost / unitsProduced;
    const profit = sellPrice - unitCost;
    const profitMargin = (profit / sellPrice) * 100;

    setCalculation({
      ingredientsCost,
      unitsProduced,
      unitCost,
      sellPrice,
      profit,
      profitMargin,
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Calculadora de Custos
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            Calcule custos, margem de lucro e projeções de faturamento
          </p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <Calculator className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CostCalculatorForm onCalculate={handleCalculate} />
        </div>
        
        <div>
          {calculation && <CostResults calculation={calculation} />}
        </div>
      </div>

      {calculation && (
        <div className="mt-8">
          <CostCharts calculation={calculation} />
        </div>
      )}
    </div>
  );
};
