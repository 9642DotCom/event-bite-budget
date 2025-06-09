
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductForm } from "./ProductForm";
import { ProductList } from "./ProductList";

export const ProductsPage = () => {
  const [showForm, setShowForm] = useState(false);

  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const activeProducts = products?.filter(p => p.active) || [];
  const mostExpensive = activeProducts.reduce((max, product) => 
    Number(product.sell_price) > Number(max.sell_price) ? product : max, 
    activeProducts[0]
  );
  const cheapest = activeProducts.reduce((min, product) => 
    Number(product.sell_price) < Number(min.sell_price) ? product : min, 
    activeProducts[0]
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-500">Cadastro e controle de lanches</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <ProductList 
        products={products || []} 
        onUpdate={refetch}
        mostExpensive={mostExpensive}
        cheapest={cheapest}
      />

      {showForm && (
        <ProductForm 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            setShowForm(false);
            refetch();
          }} 
        />
      )}
    </div>
  );
};
