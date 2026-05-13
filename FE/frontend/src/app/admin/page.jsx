'use client';

import DashboardLayout from "@/components/admin/layout/DashboardLayout";
import DashboardPageContent from "@/components/admin/DashboardPage";
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
