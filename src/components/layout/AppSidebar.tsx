
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Calculator,
  DollarSign,
  PieChart
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const AppSidebar = ({ currentPage, onPageChange }: AppSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pdv", label: "PDV", icon: Calculator },
    { id: "revenues", label: "Receitas", icon: TrendingUp },
    { id: "expenses", label: "Despesas", icon: TrendingDown },
    { id: "products", label: "Produtos", icon: Package },
    { id: "cost-calculator", label: "Calculadora de Custos", icon: PieChart },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="p-2 bg-green-500 rounded-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-xl font-bold text-foreground">FinanceLanches</h1>
            <p className="text-sm text-muted-foreground">Controle Financeiro</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => onPageChange(item.id)}
                      isActive={currentPage === item.id}
                      className="w-full"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
