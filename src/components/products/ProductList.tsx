
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { ProductForm } from "./ProductForm";
import { useToast } from "@/hooks/use-toast";

interface ProductListProps {
  products: any[];
  onUpdate: () => void;
  mostExpensive?: any;
  cheapest?: any;
}

export const ProductList = ({ products, onUpdate, mostExpensive, cheapest }: ProductListProps) => {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Produto excluído!",
        description: "O produto foi excluído com sucesso.",
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
              <TableHead>Nome</TableHead>
              <TableHead>Custo</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Margem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Destaque</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const margin = ((Number(product.sell_price) - Number(product.cost_price)) / Number(product.sell_price)) * 100;
              const isMostExpensive = mostExpensive && product.id === mostExpensive.id;
              const isCheapest = cheapest && product.id === cheapest.id;
              
              return (
                <TableRow key={product.id} className={
                  isMostExpensive ? "bg-red-50" : isCheapest ? "bg-green-50" : ""
                }>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    R$ {Number(product.cost_price).toFixed(2)}
                  </TableCell>
                  <TableCell className="font-bold">
                    R$ {Number(product.sell_price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={
                      margin > 50 ? "text-green-600" : 
                      margin > 30 ? "text-yellow-600" : "text-red-600"
                    }>
                      {margin.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.active ? "default" : "secondary"}>
                      {product.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isMostExpensive && (
                      <Badge variant="destructive">Mais Caro</Badge>
                    )}
                    {isCheapest && (
                      <Badge className="bg-green-500">Mais Barato</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(product.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            onUpdate();
          }}
        />
      )}
    </>
  );
};
