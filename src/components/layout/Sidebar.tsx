
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Calculator,
  DollarSign
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pdv", label: "PDV", icon: Calculator },
    { id: "revenues", label: "Receitas", icon: TrendingUp },
    { id: "expenses", label: "Despesas", icon: TrendingDown },
    { id: "products", label: "Produtos", icon: Package },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FinanceLanches</h1>
            <p className="text-sm text-gray-500">Controle Financeiro</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                    currentPage === item.id
                      ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
