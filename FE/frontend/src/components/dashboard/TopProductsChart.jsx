"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Calendar } from "lucide-react";

// Bảng màu rực rỡ và hài hòa theo phong cách hiện đại
const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#eab308", // Yellow
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#f43f5e"  // Rose
];

const PERIOD_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "month", label: "Tháng này" },
  { value: "quarter", label: "Quý này" },
  { value: "year", label: "Năm nay" }
];

export default function TopProductsChart({ data, activePeriod = "all", onPeriodChange }) {
  const [activeMetric, setActiveMetric] = useState("revenue");

  // Tính tổng doanh thu thực tế trong kỳ lọc từ DB
  const totalRevenue = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  }, [data]);

  // Tính tổng số lượng bán thực tế trong kỳ lọc từ DB
  const totalSold = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, item) => sum + (item.sold || 0), 0);
  }, [data]);

  // Sắp xếp dữ liệu theo metric lựa chọn
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data].sort((a, b) => (b[activeMetric] || 0) - (a[activeMetric] || 0));
  }, [data, activeMetric]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      const percentage = totalRevenue > 0 ? ((p.revenue / totalRevenue) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 min-w-[160px] text-xs">
          <div className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].fill }}></span>
            {p.name}
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Doanh thu:</span>
            <span className="font-semibold text-gray-900">{(p.revenue || 0).toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Số lượng:</span>
            <span className="font-semibold text-gray-900">{(p.sold || 0).toLocaleString()} chiếc</span>
          </div>
          <div className="flex justify-between text-sm pt-1.5 border-t border-gray-50">
            <span className="text-gray-500">Tỷ trọng:</span>
            <span className="font-bold text-indigo-600">{percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const isEmpty = !data || data.length === 0;

  // Dữ liệu giả lập donut xám trống để giữ vững UI khi không có dữ liệu thực tế
  const emptyChartData = [{ name: "Chưa có dữ liệu", value: 1 }];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Doanh Thu Theo Tỉ Lệ Xe</h2>
          <p className="text-xs text-gray-500 mt-0.5">Phân tích thị phần doanh số theo phân loại tỉ lệ mô hình</p>
        </div>

        {/* PERIOD SELECTOR BUTTONS */}
        <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100 self-start">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onPeriodChange && onPeriodChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activePeriod === opt.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC TOGGLE BUTTONS */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveMetric("revenue")}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            activeMetric === "revenue"
              ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Theo doanh thu
        </button>
        <button
          onClick={() => setActiveMetric("sold")}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            activeMetric === "sold"
              ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Theo số lượng
        </button>
      </div>

      {/* DONUT PIE CHART CONTAINER */}
      <div className="relative w-full h-[240px] flex items-center justify-center mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={isEmpty ? emptyChartData : data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={isEmpty ? 0 : 3}
              dataKey={isEmpty ? "value" : activeMetric}
              nameKey="name"
              stroke="none"
            >
              {isEmpty ? (
                <Cell fill="#f3f4f6" />
              ) : (
                data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-opacity duration-300 hover:opacity-90 cursor-pointer"
                  />
                ))
              )}
            </Pie>
            {!isEmpty && <Tooltip content={<CustomTooltip />} />}
          </PieChart>
        </ResponsiveContainer>

        {/* CENTER TEXT: Đặt tại tâm vòng tròn Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            {activeMetric === "revenue" ? "Tổng doanh thu" : "Tổng đã bán"}
          </span>
          <span className="text-xl font-extrabold text-gray-900 leading-none">
            {activeMetric === "revenue"
              ? `${Math.round(totalRevenue).toLocaleString("vi-VN")} đ`
              : `${totalSold.toLocaleString("vi-VN")} chiếc`}
          </span>
          <span className="text-[10px] font-medium text-indigo-500 mt-1 flex items-center gap-0.5">
            <Calendar className="w-3 h-3" />
            {PERIOD_OPTIONS.find((o) => o.value === activePeriod)?.label || "Tất cả"}
          </span>
        </div>
      </div>

      {/* DETAILED DATA TABLE */}
      <div className="mt-auto">
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                <th className="px-3 py-2 text-center w-8 font-semibold">STT</th>
                <th className="px-3 py-2 font-semibold">Tỉ lệ</th>
                <th className="px-3 py-2 text-right font-semibold">Đã bán</th>
                <th className="px-3 py-2 text-right font-semibold">Doanh thu</th>
                <th className="px-3 py-2 text-right font-semibold">Tỷ trọng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isEmpty ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-gray-400 italic">
                    Chưa có dữ liệu doanh thu tỉ lệ xe trong kỳ này.
                  </td>
                </tr>
              ) : (
                sortedData.map((item, idx) => {
                  const percentage = totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100).toFixed(1) : 0;
                  const itemColor = COLORS[data.findIndex((d) => d.name === item.name) % COLORS.length];
                  return (
                    <tr key={item.name} className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2.5 text-center text-gray-400 font-semibold">{idx + 1}</td>
                      <td className="px-3 py-2.5 font-bold text-gray-800 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: itemColor }}></span>
                        {item.name}
                      </td>
                      <td className="px-3 py-2.5 text-right text-gray-600">{(item.sold || 0).toLocaleString()} chiếc</td>
                      <td className="px-3 py-2.5 text-right font-bold text-gray-900">{(item.revenue || 0).toLocaleString("vi-VN")} đ</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-indigo-600">{percentage}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}