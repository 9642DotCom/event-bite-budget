
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductSelector } from "./ProductSelector";
import { SaleCart } from "./SaleCart";
import { SaleHistory } from "./SaleHistory";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export const PDVPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const { data: products } = useQuery({
    queryKey: ["active-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const addToCart = (product: any, quantity: number) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { 
              ...item, 
              quantity: item.quantity + quantity,
              total: (item.quantity + quantity) * item.price 
            }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: Number(product.sell_price),
        quantity,
        total: Number(product.sell_price) * quantity
      }]);
    }
  };

  const updateCartItem = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id 
          ? { ...item, quantity, total: quantity * item.price }
          : item
      ));
    }
  };

  const clearCart = () => setCart([]);

  const onSaleComplete = () => {
    clearCart();
    setRefreshHistory(prev => prev + 1);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PDV - Ponto de Venda</h1>
          <p className="text-gray-500">Sistema rápido para registro de vendas</p>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              R$ {cartTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductSelector 
            products={products || []} 
            onAddToCart={addToCart}
          />
        </div>
        
        <div>
          <SaleCart 
            cart={cart}
            onUpdateItem={updateCartItem}
            onClearCart={clearCart}
            onSaleComplete={onSaleComplete}
          />
        </div>
      </div>

      <SaleHistory key={refreshHistory} />
    </div>
  );
};
