
import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { RevenuesPage } from "@/components/revenues/RevenuesPage";
import { ExpensesPage } from "@/components/expenses/ExpensesPage";
import { ProductsPage } from "@/components/products/ProductsPage";
import { PDVPage } from "@/components/pdv/PDVPage";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "revenues":
        return <RevenuesPage />;
      case "expenses":
        return <ExpensesPage />;
      case "products":
        return <ProductsPage />;
      case "pdv":
        return <PDVPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <SidebarInset>
          <Header />
          <main className="flex-1 overflow-auto">
            {renderPage()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
