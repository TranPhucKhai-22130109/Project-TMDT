"use client";

import { Eye } from "lucide-react";

// Đồng bộ bảng màu trạng thái từ backend (Chữ hoa) và hiển thị Tiếng Việt theo hệ thống
const STATUS_CONFIG = {
    PENDING:   { label: "Chờ xử lý",   color: "bg-amber-100 text-amber-800 border border-amber-200" },
    CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800 border border-blue-200" },
    SHIPPING:  { label: "Đang giao",   color: "bg-violet-100 text-violet-800 border border-violet-200" },
    DELIVERED: { label: "Đã giao",     color: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
    CANCELLED: { label: "Đã hủy",      color: "bg-red-100 text-red-800 border border-red-200" },
};

const PAY_STATUS_CONFIG = {
    UNPAID:   "bg-orange-100 text-orange-700",
    PAID:     "bg-emerald-100 text-emerald-800",
    REFUNDED: "bg-gray-100 text-gray-600",
};

// Hàm định dạng tiền tệ VND đồng bộ với OrdersPage
function fmt(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount ?? 0);
}

// Hàm định dạng ngày tháng hiển thị tường minh
function fmtDate(val) {
    if (!val) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(new Date(val));
}

export default function OrderTable({
                                       orders = [],
                                       onView,
                                       selectedIds = [],
                                       onSelectAll,
                                       onSelectOne
                                   }) {

    if (!orders || orders.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 font-medium">
                Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.
            </div>
        );
    }

    const allSelected = orders.length > 0 && selectedIds.length === orders.length;

    return (
        <div className="overflow-x-auto w-full bg-white rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4 w-12 text-center">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) => onSelectAll(e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                        />
                    </th>
                    <th className="p-4">Mã Đơn Hàng</th>
                    <th className="p-4">Thông Tin Người Nhận</th>
                    <th className="p-4">Sản Phẩm</th>
                    <th className="p-4">Tổng Tiền / Thanh Toán</th>
                    <th className="p-4">Trạng Thái Đơn</th>
                    <th className="p-4 text-right">Hành Động</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-sm">
                {orders.map((order) => {
                    const isSelected = selectedIds.includes(order.id);
                    const statusCfg = STATUS_CONFIG[order.status] || { label: order.status, color: "bg-gray-100 text-gray-800" };

                    return (
                        <tr key={order.id} className={`hover:bg-gray-50/80 transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                            <td className="p-4 text-center">
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => onSelectOne(order.id, e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                                />
                            </td>

                            {/* Order ID & Date */}
                            <td className="p-4">
                                <button
                                    onClick={() => onView(order)}
                                    className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline text-left block font-mono"
                                >
                                    {order.id}
                                </button>
                                <div className="text-gray-400 text-xs mt-1">{fmtDate(order.createdAt)}</div>
                            </td>

                            {/* Receiver Info */}
                            <td className="p-4">
                                <div>
                                    <div className="font-semibold text-gray-900">{order.receiverName || "Không rõ tên"}</div>
                                    <div className="text-gray-500 text-xs mt-0.5">{order.receiverPhone || "—"}</div>
                                </div>
                            </td>

                            {/* Order Items Images */}
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        {(order.items || []).slice(0, 2).map((item, idx) => (
                                            <img
                                                key={idx}
                                                src={item.productImageUrl || "https://placehold.co/80x80/f3f4f6/9ca3af?text=SP"}
                                                alt=""
                                                onError={(e) => { e.target.src = "https://placehold.co/80x80/f3f4f6/9ca3af?text=SP"; }}
                                                className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 object-cover shrink-0 shadow-sm"
                                                style={{ zIndex: 10 - idx }}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-xs font-semibold text-gray-600 ml-1">
                                        {(order.items || []).length} món
                                        {(order.items || []).length > 2 && (
                                            <span className="text-gray-400 font-normal"> (+{(order.items || []).length - 2})</span>
                                        )}
                                    </div>
                                </div>
                            </td>

                            {/* Total & Payment Status */}
                            <td className="p-4">
                                <div className="font-bold text-gray-900">{fmt(order.totalAmount)}</div>
                                <div className="text-gray-500 text-xs mt-1 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase">
                      {order.paymentMethod}
                    </span>
                                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${PAY_STATUS_CONFIG[order.paymentStatus] || "bg-gray-100 text-gray-800"}`}>
                      {order.paymentStatus}
                    </span>
                                </div>
                            </td>

                            {/* Order Status Badge */}
                            <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onView(order)}
                                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Xem chi tiết đơn hàng"
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