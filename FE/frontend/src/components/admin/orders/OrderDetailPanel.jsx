"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Printer, Edit, CheckCircle2, Circle, ArrowRight, Quote } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge.jsx";

// Luồng xử lý tuần tự chuẩn xác theo cấu trúc Enum của Backend
const ORDER_STATUS_FLOW = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED"];

const STATUS_LABELS = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Đã giao thành công",
    CANCELLED: "Đã hủy đơn hàng"
};

const PAY_STATUS_CONFIG = {
    UNPAID: "bg-orange-100 text-orange-800 border border-orange-200",
    PAID: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    REFUNDED: "bg-gray-100 text-gray-700 border border-gray-200"
};

// Hàm helper format tiền tệ đồng bộ hệ thống
function fmt(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);
}

// Hàm helper format ngày tháng
function fmtDate(dateString) {
    if (!dateString) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    }).format(new Date(dateString));
}

export default function OrderDetailPanel({ order, isOpen, onClose, onUpdateStatus }) {
    const [mounted, setMounted] = useState(false);
    const [updateStatusTo, setUpdateStatusTo] = useState("");

    const displayOrder = order;

    useEffect(() => {
        if (displayOrder) {
            const currentStatus = (displayOrder.status || "").toUpperCase();
            if (currentStatus !== "CANCELLED" && currentStatus !== "DELIVERED") {
                const currIdx = ORDER_STATUS_FLOW.indexOf(currentStatus);
                if (currIdx >= 0 && currIdx < ORDER_STATUS_FLOW.length - 1) {
                    setUpdateStatusTo(ORDER_STATUS_FLOW[currIdx + 1]);
                }
            } else {
                setUpdateStatusTo("");
            }
        }
    }, [displayOrder]);

    useEffect(() => {
        if (isOpen) setMounted(true);
        else {
            const timer = setTimeout(() => setMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!mounted && !isOpen) return null;
    if (!displayOrder) return null;

    const currentStatusUpper = (displayOrder.status || "").toUpperCase();

    const handleUpdateClick = () => {
        if (updateStatusTo && updateStatusTo !== currentStatusUpper) {
            onUpdateStatus(displayOrder.id, updateStatusTo);
        }
    };

    // Tự động sinh danh sách Timeline động dựa theo trạng thái thực tế từ DB để tránh lỗi crash dữ liệu
    const generatedTimeline = [
        { status: "PENDING", label: "Đã đặt hàng", desc: "Khách hàng gửi đơn hàng thành công lên hệ thống." },
        { status: "CONFIRMED", label: "Xác nhận đơn", desc: "Hệ thống/Admin đã duyệt và tiến hành đóng gói." },
        { status: "SHIPPING", label: "Đang vận chuyển", desc: "Đơn hàng đã được bàn giao cho đối tác logistics." },
        { status: "DELIVERED", label: "Giao thành công", desc: "Người nhận đã hoàn thành nhận hàng và thanh toán." }
    ];

    const currentIdx = ORDER_STATUS_FLOW.indexOf(currentStatusUpper);

    // Danh sách các trạng thái hợp lệ tiếp theo để Admin có thể chuyển đổi tiếp
    const validNextStatuses = ORDER_STATUS_FLOW.filter((_, idx) => idx > currentIdx);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop nền mờ */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            {/* Khung Panel chi tiết */}
            <div
                className={`relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-250 ease-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
                {/* HEADER */}
                <div className="sticky top-0 bg-white z-10 flex flex-col gap-2 p-6 border-b border-gray-100 shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-gray-900 font-mono">#{displayOrder.id}</h2>
                            <OrderStatusBadge status={currentStatusUpper} />
                        </div>
                        <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 flex gap-2">
                        <span>Ngày tạo: <strong className="text-gray-700">{fmtDate(displayOrder.createdAt)}</strong></span>
                    </div>
                </div>

                {/* NỘI DUNG CHÍNH */}
                <div className="flex-1 overflow-y-auto">

                    {/* PHẦN 1: Tiến Trình Timeline Động */}
                    <div className="p-6 py-5 bg-gray-50/50 border-b border-gray-100">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Lịch trình xử lý đơn</h3>

                        <div className="relative pl-3 space-y-5">
                            <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gray-200" />

                            {currentStatusUpper === "CANCELLED" ? (
                                <div className="relative flex items-start gap-4 z-10">
                                    <div className="shrink-0 w-6 h-6 flex items-center justify-center bg-white">
                                        <CheckCircle2 className="w-6 h-6 text-red-500 bg-white" />
                                    </div>
                                    <div className="flex-1 pt-0.5">
                                        <span className="font-bold text-red-600">Đơn hàng đã hủy</span>
                                        <p className="text-sm text-gray-500">Đơn hàng này đã bị từ chối hoặc hủy bỏ giao dịch.</p>
                                    </div>
                                </div>
                            ) : (
                                generatedTimeline.map((step, idx) => {
                                    const isCompleted = idx <= currentIdx;
                                    const isCurrent = idx === currentIdx;

                                    return (
                                        <div key={idx} className="relative flex items-start gap-4 z-10">
                                            <div className="relative shrink-0 w-6 h-6 flex items-center justify-center bg-white">
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-6 h-6 text-indigo-600 bg-white" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-300 bg-white" />
                                                )}
                                                {isCurrent && (
                                                    <span className="absolute inset-0 rounded-full border-2 border-indigo-600 animate-ping opacity-25" />
                                                )}
                                            </div>

                                            <div className="flex-1 pt-0.5">
                                                <div className="flex justify-between items-start">
                          <span className={`font-bold text-sm ${isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                            {step.label}
                          </span>
                                                </div>
                                                <p className={`text-xs mt-0.5 ${isCurrent ? 'text-gray-600' : 'text-gray-400'}`}>
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Thanh tác vụ chuyển đổi trạng thái của Admin */}
                        {currentStatusUpper !== "CANCELLED" && currentStatusUpper !== "DELIVERED" && (
                            <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Cập nhật tiến độ tiếp theo:</span>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={updateStatusTo}
                                        onChange={(e) => setUpdateStatusTo(e.target.value)}
                                        className="p-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                                    >
                                        {validNextStatuses.map(s => (
                                            <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleUpdateClick}
                                        disabled={!updateStatusTo}
                                        className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                                    >
                                        Xác nhận chuyển
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PHẦN 2: Danh Sách Sản Phẩm Trong Đơn Hàng */}
                    <div className="p-6 py-5 border-b border-gray-100">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sản phẩm đã đặt</h3>

                        <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-2 font-semibold">Tên sản phẩm</th>
                                    <th className="px-4 py-2 font-semibold text-center">Số lượng</th>
                                    <th className="px-4 py-2 font-semibold text-right">Đơn giá</th>
                                    <th className="px-4 py-2 font-semibold text-right">Thành tiền</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                {(displayOrder.items || []).map((item, idx) => {
                                    const price = item.price || 0;
                                    const qty = item.quantity || 0;
                                    const subtotal = price * qty;
                                    return (
                                        <tr key={idx} className="text-xs">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.productImageUrl || "https://placehold.co/80x80/f3f4f6/9ca3af?text=SP"}
                                                        alt=""
                                                        className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-100 shadow-sm shrink-0"
                                                        onError={(e) => { e.target.src = "https://placehold.co/80x80/f3f4f6/9ca3af?text=SP"; }}
                                                    />
                                                    <div>
                                                        <div className="font-bold text-gray-900 leading-tight">{item.productName || "Sản phẩm hệ thống"}</div>
                                                        <div className="text-gray-400 text-[10px] mt-0.5">Mã SP: {item.productId || "—"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center font-semibold text-gray-600">{qty}</td>
                                            <td className="px-4 py-3 text-right text-gray-600">{fmt(price)}</td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-900">{fmt(subtotal)}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>

                        {/* Tổng Kết Doanh Thu */}
                        <div className="flex justify-end mb-2">
                            <div className="w-64 space-y-2 text-xs">
                                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-gray-500">Tổng thanh toán:</span>
                                    <span className="text-lg font-black text-indigo-600">{fmt(displayOrder.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Nhãn phương thức & Trạng thái thanh toán */}
                        <div className="flex justify-end gap-2 items-center mt-2">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase border">
                {displayOrder.paymentMethod || "COD"}
              </span>
                            <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded uppercase shadow-sm ${
                                PAY_STATUS_CONFIG[(displayOrder.paymentStatus || "").toUpperCase()] || "bg-gray-100 text-gray-800"
                            }`}>
                {displayOrder.paymentStatus || "CHƯA RÕ"}
              </span>
                        </div>
                    </div>

                    {/* PHẦN 3: Thông Tin Người Nhận Khách Hàng */}
                    <div className="p-6 py-5 border-b border-gray-100">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Thông tin giao nhận</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Người nhận */}
                            <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Khách nhận hàng</div>
                                <div className="font-bold text-sm text-gray-900">{displayOrder.receiverName || "Khách ẩn danh"}</div>
                                <div className="text-xs text-gray-500 mt-1">SĐT: {displayOrder.receiverPhone || "Chưa cập nhật"}</div>
                            </div>

                            {/* Địa chỉ giao hàng */}
                            <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex gap-2">
                                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Địa chỉ giao</div>
                                    <div className="text-xs text-gray-700 leading-relaxed font-medium">
                                        {displayOrder.shippingAddress || "Nhận tại cửa hàng / Chưa điền địa chỉ cụ thể"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PHẦN 4: Ghi Chú Đơn Hàng */}
                    {displayOrder.note && (
                        <div className="p-6 py-5 pb-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ghi chú từ khách hàng</h3>
                            <div className="p-3.5 bg-amber-50/60 border border-amber-100 rounded-xl flex items-start gap-2.5">
                                <Quote className="w-4 h-4 text-amber-500 shrink-0 opacity-40 mt-0.5" />
                                <p className="text-xs text-amber-900 italic font-medium leading-relaxed">
                                    "{displayOrder.note}"
                                </p>
                            </div>
                        </div>
                    )}

                </div>

                {/* STICKY FOOTER HÀNH ĐỘNG */}
                <div className="sticky bottom-0 bg-white z-10 border-t border-gray-100 p-4 flex items-center justify-between shrink-0">
                    <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
                        <Printer className="w-4 h-4" /> In hóa đơn
                    </button>

                    <div className="flex gap-2">
                        {currentStatusUpper !== "DELIVERED" && currentStatusUpper !== "CANCELLED" && (
                            <button
                                onClick={() => onUpdateStatus(displayOrder.id, "CANCELLED")}
                                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent"
                            >
                                Hủy đơn này
                            </button>
                        )}
                        <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors shadow-sm">
                            Đóng panel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}