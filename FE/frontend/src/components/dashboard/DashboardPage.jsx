"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatCards from "./StatCards";
import RevenueChart from "./RevenueChart";
import TopProductsChart from "./TopProductsChart";
import OrderStatusChart from "./OrderStatusChart";
import RecentOrdersTable from "./RecentOrdersTable";
import ActivityFeed from "./ActivityFeed";

// import { getRevenueChartData, getCategoryRevenueData, getStatCardsData } from "../../services/analyticsService";
import analyticsService from "@/services/analyticsService";

// import {
//   DATE_PRESETS,
//   statCards,
//   revenueData,
//   topProducts,
//   orderStatusData,
//   recentOrders,
//   activityFeed,
// } from "../../data/mockAnalytics";


import {
  DATE_PRESETS,
} from "../../data/mockAnalytics";

export default function DashboardPage() {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState("year");
  const [categoryPeriod, setCategoryPeriod] = useState("all"); // 🟢 Quản lý bộ lọc của biểu đồ tròn Donut
  const [categoryStartDate, setCategoryStartDate] = useState("");
  const [categoryEndDate, setCategoryEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [realStatCards, setRealStatCards] = useState([]);
  const [realRevenueData, setRealRevenueData] = useState([]);
  const [realTopProducts, setRealTopProducts] = useState([]);
  const [realOrderStatusData, setRealOrderStatusData] = useState([]);
  const [realRecentOrders, setRealRecentOrders] = useState([]);
  const [realActivityFeed, setRealActivityFeed] = useState([]);

  // Hàm xử lý khi bấm đổi bộ lọc thời gian (Ngày/Tuần/Tháng/Năm)
  const handlePeriodChange = (periodValue) => {
    if (periodValue === activePeriod) return;
    setActivePeriod(periodValue);
  };

  // 1. useEffect nạp dữ liệu biểu đồ trạng thái đơn hàng (chạy 1 lần lúc mount)
  useEffect(() => {
    setIsLoading(true);
    analyticsService.getOrderStatusData()
      .then((statusData) => {
        setRealOrderStatusData(statusData);
      })
      .catch(err => console.error("Lỗi nạp trạng thái đơn hàng:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // 2. useEffect nạp dữ liệu biểu đồ doanh thu xe (Donut) theo kỳ lọc
  useEffect(() => {
    if (categoryPeriod === "custom" && (!categoryStartDate || !categoryEndDate)) {
      return;
    }
    setIsLoading(true);
    analyticsService.getCategoryRevenueData(categoryPeriod, categoryStartDate, categoryEndDate)
      .then((categories) => {
        setRealTopProducts(categories);
      })
      .catch(err => console.error("Lỗi nạp dữ liệu tỉ lệ xe:", err))
      .finally(() => setIsLoading(false));
  }, [categoryPeriod, categoryStartDate, categoryEndDate]);

  // 3. useEffect nạp dữ liệu biểu đồ cột doanh thu VÀ thẻ số liệu Stats khi đổi mốc thời gian lọc
  useEffect(() => {
    setIsLoading(true);
    
    Promise.all([
      analyticsService.getRevenueChartData(activePeriod),
      analyticsService.getStatCardsData(activePeriod)
    ])
      .then(([revenueData, stats]) => {
        setRealRevenueData(revenueData);
        setRealStatCards(stats);
      })
      .catch((err) => console.error("Lỗi nạp dữ liệu doanh thu & stats:", err))
      .finally(() => setIsLoading(false));
  }, [activePeriod]);
 
  // 4. useEffect nạp dữ liệu Recent Orders và Recent Activities (chạy 1 lần lúc mount)
  useEffect(() => {
    analyticsService.getRecentOrders()
      .then((orders) => setRealRecentOrders(orders || []))
      .catch((err) => console.error("Lỗi nạp đơn hàng gần đây:", err));

    analyticsService.getRecentActivities()
      .then((activities) => setRealActivityFeed(activities || []))
      .catch((err) => console.error("Lỗi nạp hoạt động gần đây:", err));
  }, []);

  // const handlePeriodChange = (periodValue) => {
  //   if (periodValue === activePeriod) return;
  //   setActivePeriod(periodValue);
  //   setIsLoading(true);

  //   // Simulate API fetch delay
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 800);
  // };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Chào buổi sáng, Seller{" "}
            <span className="inline-block origin-bottom-right hover:animate-wave">
              👋
            </span>
          </p>
        </div>

        {/* DATE PRESETS */}
        <div className="flex flex-wrap items-center gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-200 self-start">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePeriodChange(preset.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activePeriod === preset.value
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-gray-600 bg-transparent hover:bg-gray-50"
                }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* ROW 1: Stat Cards */}
      {/* <StatCards cards={statCards} isLoading={isLoading} /> */}
      <StatCards cards={realStatCards} isLoading={isLoading} />

      {/* CHARTS CONTAINER with pulse animation when loading */}
      <div
        className={`space-y-6 transition-opacity duration-300 ${isLoading ? "opacity-50 animate-pulse" : "opacity-100"}`}
      >
        {/* ROW 2: Revenue & Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            {/* <RevenueChart data={revenueData} activePeriod={activePeriod} /> */}
            <RevenueChart data={realRevenueData} activePeriod={activePeriod} />
          </div>
          <div className="lg:col-span-4">
            {/* <OrderStatusChart data={orderStatusData} /> */}
            <OrderStatusChart data={realOrderStatusData} />
          </div>
        </div>

        {/* ROW 3: Top Products & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-full">
            <TopProductsChart 
              data={realTopProducts} 
              activePeriod={categoryPeriod} 
              onPeriodChange={(period, start = "", end = "") => {
                setCategoryPeriod(period);
                setCategoryStartDate(start);
                setCategoryEndDate(end);
              }} 
              startDate={categoryStartDate}
              endDate={categoryEndDate}
            />
          </div>
          <div className="h-full">
            <ActivityFeed activities={realActivityFeed} />
          </div>
        </div>

        {/* ROW 4: Recent Orders */}
        <div className="w-full">
          <RecentOrdersTable
            orders={realRecentOrders}
            onViewAll={() => router.push("/dashboard/orders")}
          />
        </div>
      </div>
    </div>
  );
}
