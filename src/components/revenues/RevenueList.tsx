
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { RevenueForm } from "./RevenueForm";
import { useToast } from "@/hooks/use-toast";

interface RevenueListProps {
  revenues: any[];
  onUpdate: () => void;
}

export const RevenueList = ({ revenues, onUpdate }: RevenueListProps) => {
  const { toast } = useToast();
  const [editingRevenue, setEditingRevenue] = useState<any>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("revenues")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Receita excluída!",
        description: "A receita foi excluída com sucesso.",
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
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revenues.map((revenue) => (
              <TableRow key={revenue.id}>
                <TableCell>
                  {new Date(revenue.payment_date).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="font-medium">{revenue.client_name}</TableCell>
                <TableCell>
                  <Badge variant={revenue.source_type === "ONG" ? "default" : "secondary"}>
                    {revenue.source_type}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-green-600">
                  R$ {Number(revenue.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="max-w-xs truncate">{revenue.notes}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingRevenue(revenue)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(revenue.id)}
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

      {editingRevenue && (
        <RevenueForm
          revenue={editingRevenue}
          onClose={() => setEditingRevenue(null)}
          onSuccess={() => {
            setEditingRevenue(null);
            onUpdate();
          }}
        />
      )}
    </>
  );
};
