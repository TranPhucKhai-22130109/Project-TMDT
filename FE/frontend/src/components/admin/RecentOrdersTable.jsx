import { ArrowRight } from "lucide-react";
import OrderStatusBadge from "./orders/OrderStatusBadge.jsx";

export default function RecentOrdersTable({ orders, onViewAll }) {
  if (!orders || orders.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
        <button 
          onClick={onViewAll}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 hidden sm:table-header-group">
            <tr>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Order ID</th>
              <th className="px-6 py-3 font-medium">Items</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {orders.map((order) => (
              <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={order.customerAvatar} 
                      alt={order.customerName} 
                      className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{order.customerName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{order.orderId}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  ${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 text-right">
                  <OrderStatusBadge status={order.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
        <span className="text-sm text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-900">{orders.length}</span> of <span className="font-bold text-gray-900">1,284</span> orders
        </span>
        <button 
          onClick={onViewAll}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
        >
          Go to Orders <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
