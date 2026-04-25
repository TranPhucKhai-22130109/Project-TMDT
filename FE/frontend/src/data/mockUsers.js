export const mockUsers = [
  {
    id: "USR-001",
    name: "Alex Johnson",
    email: "alex.admin@example.com",
    phone: "+1 (555) 111-2222",
    avatar: "https://picsum.photos/seed/alex1/128/128",
    role: "Admin",
    status: "Active",
    joinedAt: "2023-01-15T08:30:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    address: { street: "100 Admin Way", city: "San Francisco", province: "CA", zip: "94105" },
    stats: { totalOrders: 0, totalSpent: 0, avgOrderValue: 0, returnRate: 0 },
    recentOrders: [],
    activityData: [
      { month: "Jan", orders: 0, spent: 0 },
      { month: "Feb", orders: 0, spent: 0 },
      { month: "Mar", orders: 0, spent: 0 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ],
    note: "System administrator. Do not revoke access."
  },
  {
    id: "USR-002",
    name: "Sarah Williams",
    email: "sarah.admin@example.com",
    phone: "+1 (555) 222-3333",
    avatar: "https://picsum.photos/seed/sarah2/128/128",
    role: "Admin",
    status: "Active",
    joinedAt: "2023-02-10T14:15:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    address: { street: "200 Tech Blvd", city: "Seattle", province: "WA", zip: "98101" },
    stats: { totalOrders: 0, totalSpent: 0, avgOrderValue: 0, returnRate: 0 },
    recentOrders: [],
    activityData: [
      { month: "Jan", orders: 0, spent: 0 },
      { month: "Feb", orders: 0, spent: 0 },
      { month: "Mar", orders: 0, spent: 0 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ]
  },
  {
    id: "USR-003",
    name: "Michael Chen",
    email: "michael.mgr@example.com",
    phone: "+1 (555) 333-4444",
    avatar: "https://picsum.photos/seed/mike3/128/128",
    role: "Manager",
    status: "Active",
    joinedAt: "2023-03-05T09:00:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    address: { street: "300 Market St", city: "Austin", province: "TX", zip: "73301" },
    stats: { totalOrders: 0, totalSpent: 0, avgOrderValue: 0, returnRate: 0 },
    recentOrders: [],
    activityData: [
      { month: "Jan", orders: 0, spent: 0 },
      { month: "Feb", orders: 0, spent: 0 },
      { month: "Mar", orders: 0, spent: 0 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ],
    note: "Content manager for electronics category."
  },
  {
    id: "USR-004",
    name: "Emily Davis",
    email: "emily.mgr@example.com",
    phone: "+1 (555) 444-5555",
    avatar: "https://picsum.photos/seed/emily4/128/128",
    role: "Manager",
    status: "Active",
    joinedAt: "2023-04-12T11:45:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    address: { street: "400 Commerce Dr", city: "Chicago", province: "IL", zip: "60601" },
    stats: { totalOrders: 0, totalSpent: 0, avgOrderValue: 0, returnRate: 0 },
    recentOrders: [],
    activityData: [
      { month: "Jan", orders: 0, spent: 0 },
      { month: "Feb", orders: 0, spent: 0 },
      { month: "Mar", orders: 0, spent: 0 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ]
  },
  {
    id: "USR-005",
    name: "Robert Wilson",
    email: "robert.mgr@example.com",
    phone: "+1 (555) 555-6666",
    avatar: "https://picsum.photos/seed/rob5/128/128",
    role: "Manager",
    status: "Inactive",
    joinedAt: "2023-05-20T16:20:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
    address: { street: "500 Business Pkwy", city: "Denver", province: "CO", zip: "80201" },
    stats: { totalOrders: 0, totalSpent: 0, avgOrderValue: 0, returnRate: 0 },
    recentOrders: [],
    activityData: [
      { month: "Jan", orders: 0, spent: 0 },
      { month: "Feb", orders: 0, spent: 0 },
      { month: "Mar", orders: 0, spent: 0 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ],
    note: "Currently on extended leave."
  },
  {
    id: "USR-006",
    name: "Jessica Brown",
    email: "jessica@example.com",
    phone: "+1 (555) 666-7777",
    avatar: "https://picsum.photos/seed/jess6/128/128",
    role: "Customer",
    status: "Active",
    joinedAt: "2023-06-15T10:10:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    address: { street: "600 Residential Ave", city: "New York", province: "NY", zip: "10001" },
    stats: { totalOrders: 15, totalSpent: 2450.50, avgOrderValue: 163.37, returnRate: 5.2 },
    recentOrders: [
      { orderId: "ORD-001", date: "2024-03-10", total: 1513, status: "Delivered", itemCount: 2 },
      { orderId: "ORD-042", date: "2024-02-15", total: 349, status: "Delivered", itemCount: 1 },
      { orderId: "ORD-085", date: "2024-01-20", total: 89, status: "Delivered", itemCount: 1 },
      { orderId: "ORD-123", date: "2023-12-05", total: 499.50, status: "Delivered", itemCount: 4 }
    ],
    activityData: [
      { month: "Jan", orders: 1, spent: 89 },
      { month: "Feb", orders: 1, spent: 349 },
      { month: "Mar", orders: 1, spent: 1513 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ]
  },
  {
    id: "USR-007",
    name: "David Taylor",
    email: "david.t@example.com",
    phone: "+1 (555) 777-8888",
    avatar: "https://picsum.photos/seed/david7/128/128",
    role: "Customer",
    status: "Active",
    joinedAt: "2023-07-22T08:45:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    address: { street: "700 Oak Ln", city: "Miami", province: "FL", zip: "33101" },
    stats: { totalOrders: 8, totalSpent: 850.00, avgOrderValue: 106.25, returnRate: 0 },
    recentOrders: [
      { orderId: "ORD-005", date: "2024-03-17", total: 115, status: "Pending", itemCount: 3 },
      { orderId: "ORD-056", date: "2024-02-28", total: 250, status: "Delivered", itemCount: 2 },
      { orderId: "ORD-092", date: "2024-01-15", total: 150, status: "Delivered", itemCount: 1 },
      { orderId: "ORD-145", date: "2023-11-20", total: 335, status: "Delivered", itemCount: 4 }
    ],
    activityData: [
      { month: "Jan", orders: 1, spent: 150 },
      { month: "Feb", orders: 1, spent: 250 },
      { month: "Mar", orders: 1, spent: 115 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ]
  },
  {
    id: "USR-008",
    name: "Jennifer Garcia",
    email: "jen.garcia@example.com",
    phone: "+1 (555) 888-9999",
    avatar: "https://picsum.photos/seed/jen8/128/128",
    role: "Customer",
    status: "Active",
    joinedAt: "2023-08-05T13:20:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    address: { street: "800 Pine St", city: "Los Angeles", province: "CA", zip: "90001" },
    stats: { totalOrders: 22, totalSpent: 3105.75, avgOrderValue: 141.17, returnRate: 8.5 },
    recentOrders: [
      { orderId: "ORD-012", date: "2024-02-15", total: 2298, status: "Delivered", itemCount: 2 },
      { orderId: "ORD-068", date: "2024-01-30", total: 129, status: "Refunded", itemCount: 1 },
      { orderId: "ORD-112", date: "2023-12-10", total: 450.75, status: "Delivered", itemCount: 5 },
      { orderId: "ORD-167", date: "2023-11-05", total: 228, status: "Delivered", itemCount: 2 }
    ],
    activityData: [
      { month: "Jan", orders: 1, spent: 129 },
      { month: "Feb", orders: 1, spent: 2298 },
      { month: "Mar", orders: 0, spent: 0 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ]
  },
  {
    id: "USR-009",
    name: "William Martinez",
    email: "william.m@example.com",
    phone: "+1 (555) 999-0000",
    avatar: "https://picsum.photos/seed/will9/128/128",
    role: "Customer",
    status: "Banned",
    joinedAt: "2023-09-10T17:30:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(), // 120 days ago
    address: { street: "900 Cedar Blvd", city: "Houston", province: "TX", zip: "77001" },
    stats: { totalOrders: 5, totalSpent: 1250.00, avgOrderValue: 250.00, returnRate: 80.0 },
    recentOrders: [
      { orderId: "ORD-189", date: "2023-10-15", total: 349, status: "Cancelled", itemCount: 1 },
      { orderId: "ORD-204", date: "2023-10-10", total: 190, status: "Refunded", itemCount: 1 },
      { orderId: "ORD-231", date: "2023-09-25", total: 450, status: "Refunded", itemCount: 3 },
      { orderId: "ORD-255", date: "2023-09-15", total: 261, status: "Delivered", itemCount: 2 }
    ],
    activityData: [
      { month: "Jan", orders: 0, spent: 0 },
      { month: "Feb", orders: 0, spent: 0 },
      { month: "Mar", orders: 0, spent: 0 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ],
    note: "Banned due to excessive returns and suspicious payment activity."
  },
  {
    id: "USR-010",
    name: "Linda Rodriguez",
    email: "linda.r@example.com",
    phone: "+1 (555) 000-1111",
    avatar: "https://picsum.photos/seed/linda10/128/128",
    role: "Customer",
    status: "Active",
    joinedAt: "2023-10-01T09:15:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    address: { street: "1010 Maple Ct", city: "Phoenix", province: "AZ", zip: "85001" },
    stats: { totalOrders: 12, totalSpent: 1845.25, avgOrderValue: 153.77, returnRate: 2.5 },
    recentOrders: [
      { orderId: "ORD-009", date: "2024-03-14", total: 171, status: "Processing", itemCount: 1 },
      { orderId: "ORD-077", date: "2024-01-22", total: 320.50, status: "Delivered", itemCount: 3 },
      { orderId: "ORD-134", date: "2023-12-01", total: 850, status: "Delivered", itemCount: 5 },
      { orderId: "ORD-198", date: "2023-10-20", total: 503.75, status: "Delivered", itemCount: 4 }
    ],
    activityData: [
      { month: "Jan", orders: 1, spent: 320.50 },
      { month: "Feb", orders: 0, spent: 0 },
      { month: "Mar", orders: 1, spent: 171 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ]
  },
  {
    id: "USR-011",
    name: "James Anderson",
    email: "james.a@example.com",
    phone: "+1 (555) 123-9876",
    avatar: "https://picsum.photos/seed/james11/128/128",
    role: "Customer",
    status: "Inactive",
    joinedAt: "2023-11-15T14:40:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), // 90 days ago
    address: { street: "1111 Birch Rd", city: "Portland", province: "OR", zip: "97201" },
    stats: { totalOrders: 2, totalSpent: 185.00, avgOrderValue: 92.50, returnRate: 0 },
    recentOrders: [
      { orderId: "ORD-155", date: "2023-11-25", total: 89, status: "Delivered", itemCount: 1 },
      { orderId: "ORD-172", date: "2023-11-18", total: 96, status: "Delivered", itemCount: 2 }
    ],
    activityData: [
      { month: "Jan", orders: 0, spent: 0 },
      { month: "Feb", orders: 0, spent: 0 },
      { month: "Mar", orders: 0, spent: 0 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ]
  },
  {
    id: "USR-012",
    name: "Mary Thomas",
    email: "mary.thomas@example.com",
    phone: "+1 (555) 234-8765",
    avatar: "https://picsum.photos/seed/mary12/128/128",
    role: "Customer",
    status: "Active",
    joinedAt: "2023-12-05T11:10:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    address: { street: "1212 Walnut St", city: "Atlanta", province: "GA", zip: "30301" },
    stats: { totalOrders: 18, totalSpent: 2150.80, avgOrderValue: 119.49, returnRate: 1.5 },
    recentOrders: [
      { orderId: "ORD-003", date: "2024-03-16", total: 379, status: "Pending", itemCount: 3 },
      { orderId: "ORD-044", date: "2024-02-12", total: 150, status: "Delivered", itemCount: 1 },
      { orderId: "ORD-088", date: "2024-01-18", total: 290, status: "Delivered", itemCount: 2 },
      { orderId: "ORD-120", date: "2023-12-15", total: 85, status: "Delivered", itemCount: 1 }
    ],
    activityData: [
      { month: "Jan", orders: 1, spent: 290 },
      { month: "Feb", orders: 1, spent: 150 },
      { month: "Mar", orders: 1, spent: 379 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ]
  },
  {
    id: "USR-013",
    name: "Richard Jackson",
    email: "richard.j@example.com",
    phone: "+1 (555) 345-7654",
    avatar: "https://picsum.photos/seed/rich13/128/128",
    role: "Customer",
    status: "Inactive",
    joinedAt: "2024-01-10T15:25:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
    address: { street: "1313 Chestnut Ave", city: "Las Vegas", province: "NV", zip: "89101" },
    stats: { totalOrders: 3, totalSpent: 425.00, avgOrderValue: 141.67, returnRate: 0 },
    recentOrders: [
      { orderId: "ORD-095", date: "2024-01-25", total: 150, status: "Delivered", itemCount: 1 },
      { orderId: "ORD-108", date: "2024-01-15", total: 85, status: "Delivered", itemCount: 1 },
      { orderId: "ORD-115", date: "2024-01-12", total: 190, status: "Delivered", itemCount: 1 }
    ],
    activityData: [
      { month: "Jan", orders: 3, spent: 425 },
      { month: "Feb", orders: 0, spent: 0 },
      { month: "Mar", orders: 0, spent: 0 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ]
  },
  {
    id: "USR-014",
    name: "Susan White",
    email: "susan.w@example.com",
    phone: "+1 (555) 456-6543",
    avatar: "https://picsum.photos/seed/sue14/128/128",
    role: "Customer",
    status: "Banned",
    joinedAt: "2024-02-05T09:40:00Z",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    address: { street: "1414 Dogwood Dr", city: "Dallas", province: "TX", zip: "75201" },
    stats: { totalOrders: 7, totalSpent: 2850.00, avgOrderValue: 407.14, returnRate: 100.0 },
    recentOrders: [
      { orderId: "ORD-022", date: "2024-03-05", total: 1199, status: "Cancelled", itemCount: 1 },
      { orderId: "ORD-035", date: "2024-02-28", total: 1099, status: "Refunded", itemCount: 1 },
      { orderId: "ORD-048", date: "2024-02-20", total: 349, status: "Refunded", itemCount: 1 },
      { orderId: "ORD-061", date: "2024-02-10", total: 203, status: "Refunded", itemCount: 2 }
    ],
    activityData: [
      { month: "Jan", orders: 0, spent: 0 },
      { month: "Feb", orders: 3, spent: 1651 },
      { month: "Mar", orders: 1, spent: 1199 },
      { month: "Apr", orders: 0, spent: 0 },
      { month: "May", orders: 0, spent: 0 },
      { month: "Jun", orders: 0, spent: 0 }
    ],
    note: "Fraudulent chargebacks reported."
  }
];
