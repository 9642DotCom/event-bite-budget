
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
