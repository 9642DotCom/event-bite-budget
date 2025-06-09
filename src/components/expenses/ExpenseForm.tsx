
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ExpenseFormProps {
  onClose: () => void;
  onSuccess: () => void;
  expense?: any;
}

export const ExpenseForm = ({ onClose, onSuccess, expense }: ExpenseFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    expense_type_id: expense?.expense_type_id || "",
    description: expense?.description || "",
    purchase_date: expense?.purchase_date || new Date().toISOString().slice(0, 10),
    amount: expense?.amount || "",
    notes: expense?.notes || ""
  });

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

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (expense) {
        const { error } = await supabase
          .from("expenses")
          .update(data)
          .eq("id", expense.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("expenses")
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: expense ? "Despesa atualizada!" : "Despesa cadastrada!",
        description: "A despesa foi salva com sucesso.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a despesa.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {expense ? "Editar Despesa" : "Nova Despesa"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="expense_type_id">Tipo de Gasto</Label>
            <Select 
              value={formData.expense_type_id} 
              onValueChange={(value) => setFormData({ ...formData, expense_type_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {expenseTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descrição do Material</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="purchase_date">Data da Compra</Label>
            <Input
              id="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Valor Gasto (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
