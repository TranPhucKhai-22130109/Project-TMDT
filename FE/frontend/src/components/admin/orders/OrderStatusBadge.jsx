"use client";

export const STATUS_CONFIG = {
    PENDING: { label: "Chờ xử lý", color: "bg-amber-100 text-amber-800 border border-amber-200" },
    CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800 border border-blue-200" },
    SHIPPING: { label: "Đang giao", color: "bg-violet-100 text-violet-800 border border-violet-200" },
    DELIVERED: { label: "Đã giao thành công", color: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
    CANCELLED: { label: "Đã hủy đơn", color: "bg-red-100 text-red-800 border border-red-200" }
};

export default function OrderStatusBadge({ status, size = "md", className = "" }) {
    // Chuẩn hóa chuỗi trạng thái thành chữ hoa để khớp chính xác Enum Backend
    const upperStatus = (status || "").toUpperCase();
    const config = STATUS_CONFIG[upperStatus] || { label: status, color: "bg-gray-100 text-gray-800 border border-gray-200" };

    const sizeClass = size === "sm"
        ? "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
        : "px-2.5 py-1 text-xs font-semibold border rounded-full shadow-sm";

    return (
        <span className={`inline-flex items-center rounded-full ${config.color} ${sizeClass} ${className}`}>
      {config.label}
    </span>
    );
}