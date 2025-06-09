
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RevenueFiltersProps {
  filters: {
    month: string;
    client: string;
    sourceType: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const RevenueFilters = ({ filters, onFiltersChange }: RevenueFiltersProps) => {
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
        <Label htmlFor="client-filter">Cliente</Label>
        <Input
          id="client-filter"
          placeholder="Buscar por cliente..."
          value={filters.client}
          onChange={(e) => onFiltersChange({ ...filters, client: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="source-filter">Tipo</Label>
        <Select 
          value={filters.sourceType} 
          onValueChange={(value) => onFiltersChange({ ...filters, sourceType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ONG">ONG</SelectItem>
            <SelectItem value="Evento">Evento</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
