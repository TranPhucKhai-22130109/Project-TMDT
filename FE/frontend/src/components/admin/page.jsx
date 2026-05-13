'use client';

import DashboardLayout from "@/app/admin/layout/DashboardLayout";
import DashboardPageContent from "@/app/admin/AdminPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard">
        <DashboardPageContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
