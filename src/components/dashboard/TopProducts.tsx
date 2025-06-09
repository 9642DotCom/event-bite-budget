
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const TopProducts = () => {
  const { data: products } = useQuery({
    queryKey: ["products-analysis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("sell_price", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const mostExpensive = products?.[0];
  const cheapest = products?.[products.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Produtos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products?.map((product, index) => {
          const margin = ((Number(product.sell_price) - Number(product.cost_price)) / Number(product.sell_price)) * 100;
          const isExpensive = product.id === mostExpensive?.id;
          const isCheap = product.id === cheapest?.id;
          
          return (
            <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{product.name}</h4>
                  {isExpensive && <Badge variant="destructive">Mais Caro</Badge>}
                  {isCheap && <Badge variant="secondary">Mais Barato</Badge>}
                </div>
                <p className="text-sm text-gray-500">
                  Custo: R$ {Number(product.cost_price).toFixed(2)} | 
                  Venda: R$ {Number(product.sell_price).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${margin > 50 ? "text-green-600" : margin > 30 ? "text-yellow-600" : "text-red-600"}`}>
                  {margin.toFixed(1)}% margem
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
