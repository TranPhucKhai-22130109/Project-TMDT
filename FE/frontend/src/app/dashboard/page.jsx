'use client';

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageContent from "@/components/dashboard/DashboardPage";
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
