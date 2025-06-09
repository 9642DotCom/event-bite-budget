
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

interface ProductSelectorProps {
  products: any[];
  onAddToCart: (product: any, quantity: number) => void;
}

export const ProductSelector = ({ products, onAddToCart }: ProductSelectorProps) => {
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    onAddToCart(product, quantity);
    setQuantities({ ...quantities, [product.id]: 1 });
  };

  const setQuantity = (productId: string, quantity: number) => {
    setQuantities({ ...quantities, [productId]: Math.max(1, quantity) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Selecionar Produtos
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 space-y-3">
              <div>
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-2xl font-bold text-green-600">
                  R$ {Number(product.sell_price).toFixed(2)}
                </p>
                {product.description && (
                  <p className="text-sm text-gray-500">{product.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => setQuantity(product.id, Number(e.target.value))}
                  className="w-20"
                />
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 gap-2"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {search ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
