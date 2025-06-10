
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface CostCalculatorFormProps {
  onCalculate: (
    ingredientsCost: number,
    unitsProduced: number,
    sellPrice: number,
    projectedSales: number
  ) => void;
}

export const CostCalculatorForm = ({ onCalculate }: CostCalculatorFormProps) => {
  const [formData, setFormData] = useState({
    ingredientsCost: "",
    unitsProduced: "",
    sellPrice: "",
    projectedSales: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ingredientsCost = parseFloat(formData.ingredientsCost);
    const unitsProduced = parseInt(formData.unitsProduced);
    const sellPrice = parseFloat(formData.sellPrice);
    const projectedSales = parseInt(formData.projectedSales);

    if (
      !isNaN(ingredientsCost) &&
      !isNaN(unitsProduced) &&
      !isNaN(sellPrice) &&
      !isNaN(projectedSales) &&
      unitsProduced > 0
    ) {
      onCalculate(ingredientsCost, unitsProduced, sellPrice, projectedSales);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Dados do Produto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ingredientsCost">
              Custo Total dos Ingredientes (R$)
            </Label>
            <Input
              id="ingredientsCost"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.ingredientsCost}
              onChange={(e) => handleInputChange("ingredientsCost", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitsProduced">
              Quantidade de Lanches Produzidos
            </Label>
            <Input
              id="unitsProduced"
              type="number"
              placeholder="0"
              value={formData.unitsProduced}
              onChange={(e) => handleInputChange("unitsProduced", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellPrice">
              Preço de Venda por Lanche (R$)
            </Label>
            <Input
              id="sellPrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.sellPrice}
              onChange={(e) => handleInputChange("sellPrice", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectedSales">
              Vendas Projetadas (unidades)
            </Label>
            <Input
              id="projectedSales"
              type="number"
              placeholder="0"
              value={formData.projectedSales}
              onChange={(e) => handleInputChange("projectedSales", e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Calcular
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
