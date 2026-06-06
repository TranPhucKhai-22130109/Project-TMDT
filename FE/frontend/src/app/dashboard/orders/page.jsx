'use client';

import OrdersPage from "@/components/dashboard/orders/OrdersPage.jsx";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
            <OrdersPage />
        </ProtectedRoute>
    );
}