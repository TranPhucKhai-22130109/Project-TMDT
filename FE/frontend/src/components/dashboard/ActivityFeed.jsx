import { 
  ShoppingBag, 
  AlertCircle, 
  CreditCard, 
  UserPlus, 
  CheckCircle2, 
  PackagePlus, 
  User, 
  XCircle, 
  RefreshCcw, 
  Shield 
} from "lucide-react";

const iconMap = {
  ShoppingBag,
  AlertCircle,
  CreditCard,
  UserPlus,
  CheckCircle2,
  PackagePlus,
  User,
  XCircle,
  RefreshCcw,
  Shield
};

const colorStyles = {
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600", dot: "bg-indigo-500" },
  green: { bg: "bg-green-100", text: "text-green-600", dot: "bg-green-500" },
  orange: { bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-500" },
  rose: { bg: "bg-rose-100", text: "text-rose-600", dot: "bg-rose-500" }
};

export default function ActivityFeed({ activities }) {
  // Simple parser to highlight Order IDs, items in quotes, and prices
  const highlightMessage = (msg) => {
    const parts = msg.split(/(#ORD-\d+|'[^']+'|\$[0-9,.]+)/g);
    return parts.map((part, index) => {
      if (/(#ORD-\d+|'[^']+'|\$[0-9,.]+)/.test(part)) {
        return <span key={index} className="font-bold text-gray-900">{part.replace(/'/g, '')}</span>;
      }
      return part;
    });
  };

  const unreadCount = 3; // First 3 are unread

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
          {unreadCount} new
        </span>
      </div>

      {/* FEED LIST */}
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        <div className="divide-y divide-gray-100">
          {activities.map((activity, idx) => {
            const Icon = iconMap[activity.icon] || AlertCircle;
            const style = colorStyles[activity.color] || colorStyles.indigo;
            const isUnread = idx < unreadCount;

            return (
              <div 
                key={activity.id} 
                className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm text-gray-600 leading-snug pr-4">
                    {highlightMessage(activity.message)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5 font-medium">
                    {activity.timestamp}
                  </p>
                </div>
                
                {/* Unread Indicator */}
                <div className="shrink-0 pt-2 w-2 flex justify-center">
                  {isUnread && (
                    <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-gray-100 bg-white shrink-0 text-center">
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors w-full">
          Load more activity
        </button>
      </div>
    </div>
  );
}
