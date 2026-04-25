import { Shield, Briefcase, User } from "lucide-react";

export const STATUS_STYLES = {
  Active: { color: "text-green-700", dot: "bg-green-500" },
  Inactive: { color: "text-gray-500", dot: "bg-gray-400" },
  Banned: { color: "text-red-700", dot: "bg-red-500" }
};

export default function UserRoleBadge({ role, size = "md" }) {
  let bgClass, textClass, Icon;

  switch (role) {
    case "Admin":
      bgClass = "bg-red-50 border border-red-100";
      textClass = "text-red-700";
      Icon = Shield;
      break;
    case "Manager":
      bgClass = "bg-blue-50 border border-blue-100";
      textClass = "text-blue-700";
      Icon = Briefcase;
      break;
    case "Customer":
    default:
      bgClass = "bg-gray-100 border border-gray-200";
      textClass = "text-gray-700";
      Icon = User;
      break;
  }

  const isSmall = size === "sm";
  const sizeClass = isSmall ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm font-medium";
  const iconSize = isSmall ? 12 : 14;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${bgClass} ${textClass} ${sizeClass}`}>
      <Icon size={iconSize} className="shrink-0" />
      {role}
    </span>
  );
}
