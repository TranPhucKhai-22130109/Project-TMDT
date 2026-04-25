export const DATE_PRESETS = [
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7days" },
  { label: "Last 30 days", value: "30days" },
  { label: "Last 6 months", value: "6months" },
  { label: "This year", value: "year" }
];

export const statCards = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "48,295",
    prefix: "$",
    suffix: "",
    change: 12.5,
    changeType: "up",
    icon: "DollarSign",
    color: "indigo"
  },
  {
    id: "orders",
    label: "Total Orders",
    value: "1,284",
    prefix: "",
    suffix: "",
    change: 8.2,
    changeType: "up",
    icon: "ShoppingBag",
    color: "green"
  },
  {
    id: "products",
    label: "Total Products",
    value: "384",
    prefix: "",
    suffix: "",
    change: -2.1,
    changeType: "down",
    icon: "Package",
    color: "orange"
  },
  {
    id: "users",
    label: "Active Users",
    value: "2,841",
    prefix: "",
    suffix: "",
    change: 18.7,
    changeType: "up",
    icon: "Users",
    color: "rose"
  }
];

export const revenueData = [
  { month: "Jan", revenue: 22000, orders: 320, profit: 13200 },
  { month: "Feb", revenue: 18500, orders: 280, profit: 11100 },
  { month: "Mar", revenue: 28000, orders: 410, profit: 16800 },
  { month: "Apr", revenue: 25000, orders: 390, profit: 15000 },
  { month: "May", revenue: 32000, orders: 480, profit: 19200 },
  { month: "Jun", revenue: 38000, orders: 550, profit: 22800 },
  { month: "Jul", revenue: 42000, orders: 620, profit: 25200 },
  { month: "Aug", revenue: 39000, orders: 580, profit: 23400 },
  { month: "Sep", revenue: 45000, orders: 650, profit: 27000 },
  { month: "Oct", revenue: 48000, orders: 690, profit: 28800 },
  { month: "Nov", revenue: 65000, orders: 920, profit: 39000 },
  { month: "Dec", revenue: 72000, orders: 1050, profit: 43200 }
];

export const topProducts = [
  { name: "Wireless Earbuds", sold: 1245, revenue: 62250, growth: 15 },
  { name: "Smart Watch Pro", sold: 856, revenue: 128400, growth: 8 },
  { name: "Running Shoes", sold: 620, revenue: 55800, growth: -5 },
  { name: "Mechanical Keyboard", sold: 480, revenue: 62400, growth: 12 },
  { name: "Coffee Maker", sold: 395, revenue: 35550, growth: 22 }
];

export const orderStatusData = [
  { name: "Delivered", value: 850, color: "text-green-800" },
  { name: "Shipped", value: 214, color: "text-purple-800" },
  { name: "Processing", value: 120, color: "text-blue-800" },
  { name: "Pending", value: 65, color: "text-yellow-800" },
  { name: "Cancelled", value: 35, color: "text-red-800" }
];

export const recentOrders = [
  { orderId: "ORD-048", customerName: "Nguyen Van A", customerAvatar: "https://picsum.photos/seed/1/32/32", amount: 145.50, status: "Pending", date: "2 hours ago", itemCount: 3 },
  { orderId: "ORD-047", customerName: "Tran Thi B", customerAvatar: "https://picsum.photos/seed/2/32/32", amount: 89.99, status: "Processing", date: "4 hours ago", itemCount: 1 },
  { orderId: "ORD-046", customerName: "Le Van C", customerAvatar: "https://picsum.photos/seed/3/32/32", amount: 320.00, status: "Shipped", date: "Yesterday", itemCount: 4 },
  { orderId: "ORD-045", customerName: "Pham Thi D", customerAvatar: "https://picsum.photos/seed/4/32/32", amount: 45.00, status: "Delivered", date: "Yesterday", itemCount: 1 },
  { orderId: "ORD-044", customerName: "Hoang Van E", customerAvatar: "https://picsum.photos/seed/5/32/32", amount: 199.99, status: "Delivered", date: "2 days ago", itemCount: 2 },
  { orderId: "ORD-043", customerName: "Vu Thi F", customerAvatar: "https://picsum.photos/seed/6/32/32", amount: 25.50, status: "Cancelled", date: "2 days ago", itemCount: 1 },
  { orderId: "ORD-042", customerName: "Ngo Van G", customerAvatar: "https://picsum.photos/seed/7/32/32", amount: 560.00, status: "Shipped", date: "3 days ago", itemCount: 5 },
  { orderId: "ORD-041", customerName: "Bui Thi H", customerAvatar: "https://picsum.photos/seed/8/32/32", amount: 75.00, status: "Delivered", date: "3 days ago", itemCount: 2 }
];

export const activityFeed = [
  { id: 1, type: "order", message: "New order #ORD-048 placed by Nguyen Van A", timestamp: "10 mins ago", icon: "ShoppingBag", color: "indigo" },
  { id: 2, type: "product", message: "Product 'Wireless Earbuds' is low on stock (4 left)", timestamp: "45 mins ago", icon: "AlertCircle", color: "orange" },
  { id: 3, type: "payment", message: "Payment of $320 confirmed for #ORD-047", timestamp: "2 hours ago", icon: "CreditCard", color: "green" },
  { id: 4, type: "user", message: "New user Mai Thi B just registered", timestamp: "3 hours ago", icon: "UserPlus", color: "indigo" },
  { id: 5, type: "order", message: "Order #ORD-045 was successfully delivered", timestamp: "5 hours ago", icon: "CheckCircle2", color: "green" },
  { id: 6, type: "product", message: "New product 'Smart Watch Pro' was added to catalog", timestamp: "Yesterday", icon: "PackagePlus", color: "indigo" },
  { id: 7, type: "user", message: "User Le Van C updated their profile information", timestamp: "Yesterday", icon: "User", color: "orange" },
  { id: 8, type: "order", message: "Order #ORD-043 was cancelled by customer", timestamp: "2 days ago", icon: "XCircle", color: "rose" },
  { id: 9, type: "payment", message: "Refund of $25.50 processed for #ORD-043", timestamp: "2 days ago", icon: "RefreshCcw", color: "rose" },
  { id: 10, type: "user", message: "Admin 'SuperUser' logged in from new device", timestamp: "3 days ago", icon: "Shield", color: "orange" }
];
