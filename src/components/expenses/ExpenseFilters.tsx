
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExpenseFiltersProps {
  filters: {
    month: string;
    description: string;
    expenseType: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const ExpenseFilters = ({ filters, onFiltersChange }: ExpenseFiltersProps) => {
  const { data: expenseTypes } = useQuery({
    queryKey: ["expense-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expense_types")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
      <div>
        <Label htmlFor="month-filter">Mês</Label>
        <Input
          id="month-filter"
          type="month"
          value={filters.month}
          onChange={(e) => onFiltersChange({ ...filters, month: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="description-filter">Descrição</Label>
        <Input
          id="description-filter"
          placeholder="Buscar por descrição..."
          value={filters.description}
          onChange={(e) => onFiltersChange({ ...filters, description: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="type-filter">Tipo de Despesa</Label>
        <Select 
          value={filters.expenseType} 
          onValueChange={(value) => onFiltersChange({ ...filters, expenseType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {expenseTypes?.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
