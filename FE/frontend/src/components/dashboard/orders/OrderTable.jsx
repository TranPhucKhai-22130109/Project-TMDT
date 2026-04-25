"use client";

import { Eye, ChevronLeft, ChevronRight, Check } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge.jsx";

export default function OrderTable({ 
  orders, 
  onView, 
  selectedIds, 
  onSelectAll, 
  onSelectOne 
}) {
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Refunded": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No orders found matching the current filters.
      </div>
    );
  }

  const allSelected = orders.length > 0 && selectedIds.length === orders.length;

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="p-4 w-12">
              <input 
                type="checkbox" 
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
              />
            </th>
            <th className="p-4">Order Details</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Items</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-sm">
          {orders.map((order) => {
            const isSelected = selectedIds.includes(order.id);
            return (
              <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                <td className="p-4">
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => onSelectOne(order.id, e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                  />
                </td>
                
                {/* Order Details */}
                <td className="p-4">
                  <button 
                    onClick={() => onView(order)}
                    className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline text-left block"
                  >
                    {order.id}
                  </button>
                  <div className="text-gray-400 text-xs mt-1">{order.createdAt}</div>
                </td>
                
                {/* Customer */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.customer.avatar}
                      alt={order.customer.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 bg-gray-50"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{order.customer.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{order.customer.email}</div>
                    </div>
                  </div>
                </td>
                
                {/* Items */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <img 
                          key={idx} 
                          src={item.image} 
                          alt="" 
                          className="w-8 h-8 rounded-md border-2 border-white bg-gray-100 object-cover z-10" 
                          style={{ zIndex: 10 - idx }}
                        />
                      ))}
                    </div>
                    <div className="text-xs font-medium text-gray-600 ml-1">
                      {order.items.length} items
                      {order.items.length > 2 && <span className="text-gray-400 font-normal"> (+{order.items.length - 2})</span>}
                    </div>
                  </div>
                </td>
                
                {/* Total */}
                <td className="p-4">
                  <div className="font-bold text-gray-900">${order.total.toLocaleString()}</div>
                  <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-1.5">
                    {order.paymentMethod}
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </td>
                
                {/* Status */}
                <td className="p-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                
                {/* Actions */}
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onView(order)} 
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
