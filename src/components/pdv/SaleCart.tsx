
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ShoppingCart, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "./PDVPage";
import { useState } from "react";

interface SaleCartProps {
  cart: CartItem[];
  onUpdateItem: (id: string, quantity: number) => void;
  onClearCart: () => void;
  onSaleComplete: () => void;
}

export const SaleCart = ({ cart, onUpdateItem, onClearCart, onSaleComplete }: SaleCartProps) => {
  const { toast } = useToast();
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const total = cart.reduce((sum, item) => sum + item.total, 0);

  const completeSaleMutation = useMutation({
    mutationFn: async () => {
      if (cart.length === 0) throw new Error("Carrinho vazio");
      if (!paymentMethod) throw new Error("Selecione o meio de pagamento");

      // Criar a venda
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert([{
          total_amount: total,
          notes: notes || null,
          payment_method: paymentMethod
        }])
        .select()
        .single();

      if (saleError) throw saleError;

      // Criar os itens da venda
      const saleItems = cart.map(item => ({
        sale_id: sale.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total
      }));

      const { error: itemsError } = await supabase
        .from("sale_items")
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // Criar receita automaticamente
      const { error: revenueError } = await supabase
        .from("revenues")
        .insert([{
          source_type: "Evento",
          client_name: clientName || "Venda PDV",
          payment_date: new Date().toISOString().split('T')[0],
          amount: total,
          notes: notes || `Venda PDV - ${cart.length} itens - ${paymentMethod}`,
          sale_id: sale.id,
          payment_method: paymentMethod
        }]);

      if (revenueError) throw revenueError;

      return sale;
    },
    onSuccess: () => {
      toast({
        title: "Venda finalizada!",
        description: "Venda registrada e receita criada automaticamente.",
      });
      setClientName("");
      setNotes("");
      setPaymentMethod("");
      onSaleComplete();
    },
    onError: (error) => {
      toast({
        title: "Erro na venda",
        description: error.message || "Ocorreu um erro ao finalizar a venda.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho ({cart.length})
          </span>
          {cart.length > 0 && (
            <Button variant="outline" size="sm" onClick={onClearCart}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Carrinho vazio
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      R$ {item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateItem(item.id, Number(e.target.value))}
                      className="w-16"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onUpdateItem(item.id, 0)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div>
                <Label htmlFor="client_name">Cliente (opcional)</Label>
                <Input
                  id="client_name"
                  placeholder="Nome do cliente..."
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="payment_method">Meio de Pagamento *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o meio de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                    <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Transferência">Transferência</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações da venda..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="text-2xl font-bold text-green-600 text-center">
                Total: R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>

              <Button 
                onClick={() => completeSaleMutation.mutate()}
                disabled={completeSaleMutation.isPending || !paymentMethod}
                className="w-full"
                size="lg"
              >
                {completeSaleMutation.isPending ? "Finalizando..." : "Finalizar Venda"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
