import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageContent from "@/components/dashboard/DashboardPage";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <DashboardPageContent />
    </DashboardLayout>
  );
}
