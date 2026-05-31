import { DollarSign, ShoppingBag, Package, Users, TrendingUp, TrendingDown } from "lucide-react";

const iconMap = {
  DollarSign,
  ShoppingBag,
  Package,
  Users
};

const colorMap = {
  indigo: { bg: "bg-indigo-500", border: "border-l-indigo-500" },
  green: { bg: "bg-green-500", border: "border-l-green-500" },
  orange: { bg: "bg-orange-500", border: "border-l-orange-500" },
  rose: { bg: "bg-rose-500", border: "border-l-rose-500" }
};

export default function StatCards({ cards, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="w-9 h-9 rounded-lg bg-gray-200 animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse my-1"></div>
            <div className="flex items-center gap-2 mt-auto">
              <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const cardIcon = card.icon || (card.id === "revenue" ? "DollarSign" : card.id === "orders" ? "ShoppingBag" : "Package");
        const IconComponent = iconMap[cardIcon];
        const colors = colorMap[card.color] || colorMap.indigo;
        
        return (
          <div 
            key={card.id} 
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border-l-4 ${colors.border}`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-500">{card.label || card.title}</span>
              <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center text-white shrink-0`}>
                {IconComponent && <IconComponent className="w-5 h-5" />}
              </div>
            </div>
            
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl font-bold text-gray-900">
                {card.id === "revenue" || card.type === "currency" || card.prefix === "$"
                  ? `${Math.round(Number(card.value || 0)).toLocaleString("vi-VN")} đ`
                  : Number(card.value || 0).toLocaleString("vi-VN")}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-auto">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                card.changeType === 'down' || (card.change && String(card.change).startsWith("-"))
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {card.changeType === 'down' || (card.change && String(card.change).startsWith("-")) ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {card.change || "Thực tế"}
              </span>
              <span className="text-xs text-gray-400">vs kỳ trước</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
