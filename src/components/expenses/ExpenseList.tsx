
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { ExpenseForm } from "./ExpenseForm";
import { useToast } from "@/hooks/use-toast";

interface ExpenseListProps {
  expenses: any[];
  onUpdate: () => void;
}

export const ExpenseList = ({ expenses, onUpdate }: ExpenseListProps) => {
  const { toast } = useToast();
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Despesa excluída!",
        description: "A despesa foi excluída com sucesso.",
      });
      onUpdate();
    },
  });

  return (
    <>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {new Date(expense.purchase_date).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {expense.expense_types?.name || "Sem tipo"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell className="font-bold text-red-600">
                  R$ {Number(expense.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="max-w-xs truncate">{expense.notes}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingExpense(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(expense.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSuccess={() => {
            setEditingExpense(null);
            onUpdate();
          }}
        />
      )}
    </>
  );
};
