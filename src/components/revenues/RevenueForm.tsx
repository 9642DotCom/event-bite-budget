
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface RevenueFormProps {
  onClose: () => void;
  onSuccess: () => void;
  revenue?: any;
}

export const RevenueForm = ({ onClose, onSuccess, revenue }: RevenueFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    source_type: revenue?.source_type || "ONG",
    client_name: revenue?.client_name || "",
    payment_date: revenue?.payment_date || new Date().toISOString().slice(0, 10),
    amount: revenue?.amount ? revenue.amount.toString() : "",
    notes: revenue?.notes || ""
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        source_type: data.source_type,
        client_name: data.client_name,
        payment_date: data.payment_date,
        amount: parseFloat(data.amount),
        notes: data.notes || null
      };

      console.log("Enviando dados:", payload);

      if (revenue) {
        const { error } = await supabase
          .from("revenues")
          .update(payload)
          .eq("id", revenue.id);
        if (error) {
          console.error("Erro ao atualizar:", error);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("revenues")
          .insert([payload]);
        if (error) {
          console.error("Erro ao inserir:", error);
          throw error;
        }
      }
    },
    onSuccess: () => {
      toast({
        title: revenue ? "Receita atualizada!" : "Receita cadastrada!",
        description: "A receita foi salva com sucesso.",
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Erro na mutação:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar a receita.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.client_name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do cliente é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Erro",
        description: "Valor deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.payment_date) {
      toast({
        title: "Erro",
        description: "Data do pagamento é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {revenue ? "Editar Receita" : "Nova Receita"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="source_type">Fonte da Receita</Label>
            <Select 
              value={formData.source_type} 
              onValueChange={(value) => setFormData({ ...formData, source_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONG">ONG</SelectItem>
                <SelectItem value="Evento">Evento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="client_name">Nome do Cliente/ONG</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              required
              placeholder="Digite o nome do cliente ou ONG"
            />
          </div>

          <div>
            <Label htmlFor="payment_date">Data do Pagamento</Label>
            <Input
              id="payment_date"
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Valor Recebido (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              placeholder="0,00"
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Observações opcionais..."
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
