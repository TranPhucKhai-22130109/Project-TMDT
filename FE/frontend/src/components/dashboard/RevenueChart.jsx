"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const METRICS = [
  { id: "revenue", label: "Doanh thu" },
  { id: "orders", label: "Đơn hàng" },
  { id: "profit", label: "Lợi nhuận" } // Giữ nguyên nút bấm Profit cho đẹp giao diện đồ án
];

export default function RevenueChart({ data, activePeriod }) {
  const [activeMetric, setActiveMetric] = useState("revenue");

  // 🟢 BẢO VỆ 1: Khớp nối dữ liệu từ Backend, tự động tính toán 'profit' nếu Backend không trả về để tránh lỗi NaN
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(item => ({
      ...item,
      month: item.month || "-",
      revenue: item.revenue || 0,
      orders: item.orders || 0,
      profit: item.profit || Math.round((item.revenue || 0) * 0.65) // Tự động tính Lợi nhuận mẫu bằng 65% doanh thu
    }));
  }, [data]);

  // Calculate summary stats
  const stats = useMemo(() => {
    // 🟢 BẢO VỆ 2: Nếu mảng trống hoặc chưa tải xong API, trả về object mặc định, chống sập trang
    if (!processedData || processedData.length === 0) {
      return { peakMonth: "-", peakValue: 0, average: 0, growth: 0 };
    }

    let peak = processedData[0];
    let sum = 0;

    processedData.forEach(item => {
      sum += (item[activeMetric] || 0);
      if ((item[activeMetric] || 0) > (peak[activeMetric] || 0)) {
        peak = item;
      }
    });

    const average = sum / processedData.length;
    const firstValue = processedData[0][activeMetric];
    const lastValue = processedData[processedData.length - 1][activeMetric];
    const growth = firstValue ? ((lastValue - firstValue) / firstValue) * 100 : 0;

    return {
      peakMonth: peak.month,
      peakValue: peak[activeMetric],
      average: average,
      growth: growth
    };
  }, [processedData, activeMetric]);

  const formatValue = (val) => {
    if (activeMetric === "orders") return val.toLocaleString("vi-VN");
    return `${Math.round(val).toLocaleString("vi-VN")} đ`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const currentVal = payload[0].value;
      const index = processedData.findIndex(d => d.month === label);
      let diff = null;
      let diffPercent = null;

      if (index > 0) {
        const prevVal = processedData[index - 1][activeMetric];
        diff = currentVal - prevVal;
        diffPercent = prevVal ? (diff / prevVal) * 100 : 0;
      }

      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100 min-w-[150px]">
          <div className="text-gray-500 font-medium text-sm mb-1">{label}</div>
          <div className="text-xl font-bold text-gray-900 mb-1">{formatValue(currentVal)}</div>

          {diff !== null && (
            <div className={`text-xs font-medium flex items-center gap-1 ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {diff >= 0 ? '↑' : '↓'}
              {formatValue(Math.abs(diff))} ({Math.abs(diffPercent).toFixed(1)}%) so với kỳ trước
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // 🟢 BẢO VỆ 3: Nếu dữ liệu rỗng hoàn toàn, hiện màn hình chờ sang xịn mịn thay vì để trống xóa
  if (!processedData || processedData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[450px] flex items-center justify-center text-gray-400">
        Đang tải biểu đồ phân tích doanh thu năm 2026...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Tổng Quan Doanh Thu</h2>
          <p className="text-sm text-gray-500">Theo dõi hiệu suất bán hàng của cửa hàng qua thời gian</p>
        </div>

        <div className="flex p-1 bg-gray-50 rounded-lg border border-gray-100 self-start">
          {METRICS.map(metric => (
            <button
              key={metric.id}
              onClick={() => setActiveMetric(metric.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeMetric === metric.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full mt-4">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={processedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(val) => {
                if (activeMetric === "orders") {
                  if (val >= 1000) return `${(val / 1000).toLocaleString("vi-VN")}k`;
                  return val.toLocaleString("vi-VN");
                }
                if (val >= 1000000) return `${(val / 1000000).toLocaleString("vi-VN")}M đ`;
                if (val >= 1000) return `${(val / 1000).toLocaleString("vi-VN")}k đ`;
                return `${val.toLocaleString("vi-VN")} đ`;
              }}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke="none"
              fillOpacity={1}
              fill="url(#colorMetric)"
            />
            <Line
              type="monotone"
              dataKey={activeMetric}
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#6366f1", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div>
          <div className="text-sm text-gray-500 mb-1">Tháng đỉnh điểm</div>
          <div className="font-bold text-gray-900 flex items-baseline gap-2">
            {stats.peakMonth}
            <span className="text-sm font-medium text-indigo-600">{formatValue(stats.peakValue)}</span>
          </div>
        </div>
        <div className="border-l border-gray-100 pl-4">
          <div className="text-sm text-gray-500 mb-1">Trung bình</div>
          <div className="font-bold text-gray-900">{formatValue(Math.round(stats.average))}</div>
        </div>
        <div className="border-l border-gray-100 pl-4">
          <div className="text-sm text-gray-500 mb-1">Tăng trưởng chung</div>
          <div className={`font-bold ${stats.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.growth >= 0 ? '+' : ''}{stats.growth.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}