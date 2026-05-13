'use client';

import ProductsPage from "@/components/admin/products/ProductsPage.jsx";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <ProductsPage />
    </ProtectedRoute>
  );
}
