'use client';

import OrdersPage from "@/components/admin/orders/OrdersPage.jsx";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <OrdersPage />
    </ProtectedRoute>
  );
}
