export const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800"
};

export default function OrderStatusBadge({ status, size = "md", className = "" }) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  
  const sizeClass = size === "sm" 
    ? "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" 
    : "px-2.5 py-0.5 text-xs font-medium";

  return (
    <span className={`inline-flex items-center rounded-full ${colorClass} ${sizeClass} ${className}`}>
      {status}
    </span>
  );
}
