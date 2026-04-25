"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatCards from "./StatCards";
import RevenueChart from "./RevenueChart";
import TopProductsChart from "./TopProductsChart";
import OrderStatusChart from "./OrderStatusChart";
import RecentOrdersTable from "./RecentOrdersTable";
import ActivityFeed from "./ActivityFeed";

import {
  DATE_PRESETS,
  statCards,
  revenueData,
  topProducts,
  orderStatusData,
  recentOrders,
  activityFeed,
} from "../../data/mockAnalytics";

export default function DashboardPage() {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState("year");
  const [isLoading, setIsLoading] = useState(false);

  const handlePeriodChange = (periodValue) => {
    if (periodValue === activePeriod) return;
    setActivePeriod(periodValue);
    setIsLoading(true);

    // Simulate API fetch delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Good morning, Admin{" "}
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
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activePeriod === preset.value
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
      <StatCards cards={statCards} isLoading={isLoading} />

      {/* CHARTS CONTAINER with pulse animation when loading */}
      <div
        className={`space-y-6 transition-opacity duration-300 ${isLoading ? "opacity-50 animate-pulse" : "opacity-100"}`}
      >
        {/* ROW 2: Revenue & Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <RevenueChart data={revenueData} activePeriod={activePeriod} />
          </div>
          <div className="lg:col-span-4">
            <OrderStatusChart data={orderStatusData} />
          </div>
        </div>

        {/* ROW 3: Top Products & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-full">
            <TopProductsChart data={topProducts} />
          </div>
          <div className="h-full">
            <ActivityFeed activities={activityFeed} />
          </div>
        </div>

        {/* ROW 4: Recent Orders */}
        <div className="w-full">
          <RecentOrdersTable
            orders={recentOrders}
            onViewAll={() => router.push("/dashboard/orders")}
          />
        </div>
      </div>
    </div>
  );
}
