"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TopProductsChart({ data }) {
  const [activeMetric, setActiveMetric] = useState("revenue");

  const sortedData = [...data].sort((a, b) => b[activeMetric] - a[activeMetric]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100 min-w-[150px]">
          <div className="font-bold text-gray-900 mb-2">{p.name}</div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Revenue:</span>
            <span className="font-medium text-gray-900">${p.revenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Units Sold:</span>
            <span className="font-medium text-gray-900">{p.sold.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
        <div className="flex p-1 bg-gray-50 rounded-lg border border-gray-100">
          <button
            onClick={() => setActiveMetric("revenue")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeMetric === "revenue"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            By Revenue
          </button>
          <button
            onClick={() => setActiveMetric("sold")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeMetric === "sold"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            By Units
          </button>
        </div>
      </div>

      <div className="w-full mb-6 mt-4">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart 
            data={sortedData} 
            layout="vertical" 
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={120}
              tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
            <Bar 
              dataKey={activeMetric} 
              fill="#6366f1" 
              radius={[0, 4, 4, 0]}
              barSize={24}
            >
              <LabelList 
                dataKey={activeMetric} 
                position="right" 
                formatter={(val) => activeMetric === "revenue" ? `$${val.toLocaleString()}` : val.toLocaleString()}
                style={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-auto">
        <div className="overflow-hidden rounded-lg border border-gray-100">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-gray-100">
              {sortedData.map((product, idx) => (
                <tr key={product.name} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 w-8 text-center text-gray-400 font-medium">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium text-gray-900">{product.name}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{product.sold.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right font-medium text-gray-900">${product.revenue.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(product.growth)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
