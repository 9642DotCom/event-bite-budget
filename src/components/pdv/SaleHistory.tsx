
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export const SaleHistory = () => {
  const { data: sales } = useQuery({
    queryKey: ["recent-sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select(`
          *,
          sale_items(
            quantity,
            products(name)
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Vendas Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Observações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales?.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  {new Date(sale.created_at).toLocaleString("pt-BR")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {sale.sale_items?.map((item: any, index: number) => (
                      <Badge key={index} variant="outline">
                        {item.quantity}× {item.products?.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {sale.payment_method && (
                    <Badge variant="secondary">
                      {sale.payment_method}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-bold text-green-600">
                  R$ {Number(sale.total_amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {sale.notes}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {(!sales || sales.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma venda registrada
          </div>
        )}
      </CardContent>
    </Card>
  );
};
