
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
}

export const ProductForm = ({ onClose, onSuccess, product }: ProductFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    cost_price: product?.cost_price || "",
    sell_price: product?.sell_price || "",
    description: product?.description || "",
    active: product?.active ?? true
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (product) {
        const { error } = await supabase
          .from("products")
          .update(data)
          .eq("id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: product ? "Produto atualizado!" : "Produto cadastrado!",
        description: "O produto foi salvo com sucesso.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o produto.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const margin = formData.cost_price && formData.sell_price 
    ? ((Number(formData.sell_price) - Number(formData.cost_price)) / Number(formData.sell_price)) * 100
    : 0;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Lanche</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost_price">Custo de Produção (R$)</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="sell_price">Preço de Venda (R$)</Label>
              <Input
                id="sell_price"
                type="number"
                step="0.01"
                value={formData.sell_price}
                onChange={(e) => setFormData({ ...formData, sell_price: e.target.value })}
                required
              />
            </div>
          </div>

          {margin > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Margem de lucro: <span className="font-bold text-green-600">{margin.toFixed(1)}%</span>
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <Label htmlFor="active">Produto ativo</Label>
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
