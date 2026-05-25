import { apiFetch } from "@/config/api";

function getRevenueChartData(period) {
  return apiFetch(`/seller/analytics/revenue?period=${period}`);
}

function getCategoryRevenueData(period = "all") {
  return apiFetch(`/seller/analytics/category-revenue?period=${period}`);
}

function getStatCardsData(period = "year") {
  return apiFetch(`/seller/analytics/stats?period=${period}`);
}

// 🟢 SỬA LẠI DÒNG NÀY: Viết gọn chuẩn cấu hình apiFetch của nhóm
function getOrderStatusData() {
  return apiFetch(`/seller/analytics/order-status`);
}

function getRecentOrders() {
  return apiFetch(`/seller/analytics/recent-orders`);
}

function getRecentActivities() {
  return apiFetch(`/seller/analytics/recent-activities`);
}

const analyticsService = {
  getRevenueChartData,
  getCategoryRevenueData,
  getStatCardsData,
  getOrderStatusData, // 🟢 Gán hàm vừa sửa vào đây
  getRecentOrders,
  getRecentActivities,
};

export default analyticsService;