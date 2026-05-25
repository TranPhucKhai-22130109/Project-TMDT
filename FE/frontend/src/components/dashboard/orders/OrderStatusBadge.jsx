export const STATUS_COLORS = {
  // English mock keys
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",

  // DB Keys
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPING: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",

  // Tiếng Việt
  "Chờ xử lý": "bg-yellow-100 text-yellow-800",
  "Đã xác nhận": "bg-blue-100 text-blue-800",
  "Đang giao hàng": "bg-purple-100 text-purple-800",
  "Đã giao thành công": "bg-green-100 text-green-800",
  "Đã hủy đơn": "bg-red-100 text-red-800",
};

export const STATUS_LABELS = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao thành công",
  CANCELLED: "Đã hủy đơn",
  Pending: "Chờ xử lý",
  Processing: "Đang xử lý",
  Shipped: "Đang giao hàng",
  Delivered: "Đã giao thành công",
  Cancelled: "Đã hủy đơn",
};

export default function OrderStatusBadge({ status, size = "md", className = "" }) {
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS[STATUS_LABELS[status]] || "bg-gray-100 text-gray-800";
  const label = STATUS_LABELS[status] || status;
  
  const sizeClass = size === "sm" 
    ? "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" 
    : "px-2.5 py-0.5 text-xs font-medium";

  return (
    <span className={`inline-flex items-center rounded-full ${colorClass} ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}
