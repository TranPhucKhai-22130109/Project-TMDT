"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const colorMap = {
  "text-green-800": { hex: "#22c55e", bg: "bg-green-500" },
  "text-purple-800": { hex: "#a855f7", bg: "bg-purple-500" },
  "text-blue-800": { hex: "#3b82f6", bg: "bg-blue-500" },
  "text-yellow-800": { hex: "#eab308", bg: "bg-yellow-500" },
  "text-red-800": { hex: "#ef4444", bg: "bg-red-500" },
};

export default function OrderStatusChart({ data }) {
  const totalOrders = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalOrders) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100 min-w-[120px]">
          <div className="font-bold text-gray-900 mb-1">{data.name}</div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Orders:</span>
            <span className="font-medium text-gray-900">{data.value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Share:</span>
            <span className="font-medium text-gray-900">{percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 flex-1">
        
        {/* CHART - LEFT */}
        <div className="relative w-full sm:w-1/2 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => {
                  const colorInfo = colorMap[entry.color] || { hex: "#6366f1" };
                  return <Cell key={`cell-${index}`} fill={colorInfo.hex} />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-gray-900 leading-none mb-1">{totalOrders.toLocaleString()}</span>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Orders</span>
          </div>
        </div>

        {/* LEGEND - RIGHT */}
        <div className="w-full sm:w-1/2 flex flex-col justify-center space-y-4">
          {data.map((item, idx) => {
            const percentage = ((item.value / totalOrders) * 100).toFixed(1);
            const colorInfo = colorMap[item.color] || { bg: "bg-indigo-500" };
            
            return (
              <div key={item.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${colorInfo.bg}`}></span>
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-gray-900">{item.value.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 w-10 text-right">{percentage}%</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${colorInfo.bg}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
