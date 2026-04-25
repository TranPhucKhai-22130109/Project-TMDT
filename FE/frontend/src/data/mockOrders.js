export const mockOrders = [
  {
    id: "ORD-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://picsum.photos/seed/user1/64/64",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001"
    },
    items: [
      { productId: "PRD-001", productName: "iPhone 16 Pro Max", image: "https://picsum.photos/seed/iphone1/64/64", qty: 1, unitPrice: 1199, subtotal: 1199 },
      { productId: "PRD-004", productName: "Sony WH-1000XM5", image: "https://picsum.photos/seed/sony1/64/64", qty: 1, unitPrice: 349, subtotal: 349 }
    ],
    subtotal: 1548,
    shippingFee: 15,
    discount: 50,
    total: 1513,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    status: "Delivered",
    shippingAddress: { street: "123 Main St", city: "New York", province: "NY", zip: "10001" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Customer successfully placed the order", timestamp: "2024-03-10 09:00", completed: true },
      { status: "Processing", label: "Processing", description: "Payment confirmed, preparing for shipment", timestamp: "2024-03-10 14:30", completed: true },
      { status: "Shipped", label: "Shipped", description: "Order has been handed over to GHN Express", timestamp: "2024-03-11 10:15", completed: true },
      { status: "Delivered", label: "Delivered", description: "Package was delivered to customer", timestamp: "2024-03-12 16:45", completed: true }
    ],
    note: "Please leave at the front door if no one is home.",
    createdAt: "2024-03-10",
    updatedAt: "2024-03-12"
  },
  {
    id: "ORD-002",
    customer: {
      name: "Alice Smith",
      email: "alice@example.com",
      avatar: "https://picsum.photos/seed/user2/64/64",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Ave, Los Angeles, CA 90001"
    },
    items: [
      { productId: "PRD-003", productName: "MacBook Pro 14\"", image: "https://picsum.photos/seed/mac1/64/64", qty: 1, unitPrice: 1999, subtotal: 1999 }
    ],
    subtotal: 1999,
    shippingFee: 0,
    discount: 0,
    total: 1999,
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    status: "Processing",
    shippingAddress: { street: "456 Oak Ave", city: "Los Angeles", province: "CA", zip: "90001" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Customer successfully placed the order", timestamp: "2024-03-15 11:20", completed: true },
      { status: "Processing", label: "Processing", description: "Payment confirmed, preparing for shipment", timestamp: "2024-03-15 11:45", completed: true },
      { status: "Shipped", label: "Shipped", description: "Pending handover to courier", timestamp: null, completed: false },
      { status: "Delivered", label: "Delivered", description: "Pending delivery", timestamp: null, completed: false }
    ],
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15"
  },
  {
    id: "ORD-003",
    customer: {
      name: "Bob Johnson",
      email: "bob@example.com",
      avatar: "https://picsum.photos/seed/user3/64/64",
      phone: "+1 (555) 246-8101",
      address: "789 Pine Rd, Chicago, IL 60601"
    },
    items: [
      { productId: "PRD-005", productName: "Nike Air Max 270", image: "https://picsum.photos/seed/nike1/64/64", qty: 2, unitPrice: 150, subtotal: 300 },
      { productId: "PRD-006", productName: "Levi's 501", image: "https://picsum.photos/seed/levis1/64/64", qty: 1, unitPrice: 89, subtotal: 89 }
    ],
    subtotal: 389,
    shippingFee: 10,
    discount: 20,
    total: 379,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    status: "Pending",
    shippingAddress: { street: "789 Pine Rd", city: "Chicago", province: "IL", zip: "60601" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Order received via COD", timestamp: "2024-03-16 08:30", completed: true },
      { status: "Processing", label: "Processing", description: "Awaiting confirmation call", timestamp: null, completed: false },
      { status: "Shipped", label: "Shipped", description: "Pending handover to courier", timestamp: null, completed: false },
      { status: "Delivered", label: "Delivered", description: "Pending delivery", timestamp: null, completed: false }
    ],
    note: "Call me before delivery.",
    createdAt: "2024-03-16",
    updatedAt: "2024-03-16"
  },
  {
    id: "ORD-004",
    customer: {
      name: "Charlie Brown",
      email: "charlie@example.com",
      avatar: "https://picsum.photos/seed/user4/64/64",
      phone: "+1 (555) 135-7911",
      address: "321 Elm St, Houston, TX 77001"
    },
    items: [
      { productId: "PRD-009", productName: "Organic Coffee Beans 1kg", image: "https://picsum.photos/seed/coffee1/64/64", qty: 3, unitPrice: 34, subtotal: 102 }
    ],
    subtotal: 102,
    shippingFee: 5,
    discount: 0,
    total: 107,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    status: "Shipped",
    shippingAddress: { street: "321 Elm St", city: "Houston", province: "TX", zip: "77001" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Customer successfully placed the order", timestamp: "2024-03-14 10:00", completed: true },
      { status: "Processing", label: "Processing", description: "Payment confirmed, preparing for shipment", timestamp: "2024-03-14 12:00", completed: true },
      { status: "Shipped", label: "Shipped", description: "Order has been handed over to FedEx", timestamp: "2024-03-15 09:30", completed: true },
      { status: "Delivered", label: "Delivered", description: "Pending delivery", timestamp: null, completed: false }
    ],
    createdAt: "2024-03-14",
    updatedAt: "2024-03-15"
  },
  {
    id: "ORD-005",
    customer: {
      name: "David Lee",
      email: "david@example.com",
      avatar: "https://picsum.photos/seed/user5/64/64",
      phone: "+1 (555) 112-2334",
      address: "654 Cedar Ln, Miami, FL 33101"
    },
    items: [
      { productId: "PRD-010", productName: "Manuka Honey MGO 400+", image: "https://picsum.photos/seed/honey1/64/64", qty: 1, unitPrice: 59, subtotal: 59 },
      { productId: "PRD-012", productName: "Organic Green Tea Leaves", image: "https://picsum.photos/seed/tea1/64/64", qty: 2, unitPrice: 24, subtotal: 48 }
    ],
    subtotal: 107,
    shippingFee: 8,
    discount: 0,
    total: 115,
    paymentMethod: "Bank Transfer",
    paymentStatus: "Pending",
    status: "Pending",
    shippingAddress: { street: "654 Cedar Ln", city: "Miami", province: "FL", zip: "33101" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Awaiting bank transfer confirmation", timestamp: "2024-03-17 07:45", completed: true },
      { status: "Processing", label: "Processing", description: "Pending payment verification", timestamp: null, completed: false },
      { status: "Shipped", label: "Shipped", description: "Pending handover to courier", timestamp: null, completed: false },
      { status: "Delivered", label: "Delivered", description: "Pending delivery", timestamp: null, completed: false }
    ],
    createdAt: "2024-03-17",
    updatedAt: "2024-03-17"
  },
  {
    id: "ORD-006",
    customer: {
      name: "Emma Davis",
      email: "emma@example.com",
      avatar: "https://picsum.photos/seed/user6/64/64",
      phone: "+1 (555) 998-8776",
      address: "987 Birch Blvd, Seattle, WA 98101"
    },
    items: [
      { productId: "PRD-002", productName: "Samsung Galaxy S25 Ultra", image: "https://picsum.photos/seed/sam1/64/64", qty: 1, unitPrice: 1099, subtotal: 1099 }
    ],
    subtotal: 1099,
    shippingFee: 0,
    discount: 100,
    total: 999,
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    status: "Delivered",
    shippingAddress: { street: "987 Birch Blvd", city: "Seattle", province: "WA", zip: "98101" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Customer successfully placed the order", timestamp: "2024-02-28 14:00", completed: true },
      { status: "Processing", label: "Processing", description: "Payment confirmed, preparing for shipment", timestamp: "2024-02-28 16:30", completed: true },
      { status: "Shipped", label: "Shipped", description: "Order has been handed over to UPS", timestamp: "2024-03-01 09:00", completed: true },
      { status: "Delivered", label: "Delivered", description: "Package was delivered to customer", timestamp: "2024-03-03 11:20", completed: true }
    ],
    createdAt: "2024-02-28",
    updatedAt: "2024-03-03"
  },
  {
    id: "ORD-007",
    customer: {
      name: "Frank Wright",
      email: "frank@example.com",
      avatar: "https://picsum.photos/seed/user7/64/64",
      phone: "+1 (555) 334-4556",
      address: "159 Maple Dr, Austin, TX 73301"
    },
    items: [
      { productId: "PRD-011", productName: "Whey Protein Isolate 2kg", image: "https://picsum.photos/seed/whey1/64/64", qty: 1, unitPrice: 79, subtotal: 79 },
      { productId: "PRD-005", productName: "Nike Air Max 270", image: "https://picsum.photos/seed/nike1/64/64", qty: 1, unitPrice: 150, subtotal: 150 }
    ],
    subtotal: 229,
    shippingFee: 12,
    discount: 0,
    total: 241,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    status: "Shipped",
    shippingAddress: { street: "159 Maple Dr", city: "Austin", province: "TX", zip: "73301" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Customer successfully placed the order", timestamp: "2024-03-12 18:45", completed: true },
      { status: "Processing", label: "Processing", description: "Payment confirmed, preparing for shipment", timestamp: "2024-03-13 08:30", completed: true },
      { status: "Shipped", label: "Shipped", description: "Order has been handed over to USPS", timestamp: "2024-03-14 14:00", completed: true },
      { status: "Delivered", label: "Delivered", description: "Pending delivery", timestamp: null, completed: false }
    ],
    createdAt: "2024-03-12",
    updatedAt: "2024-03-14"
  },
  {
    id: "ORD-008",
    customer: {
      name: "Grace Kelly",
      email: "grace@example.com",
      avatar: "https://picsum.photos/seed/user8/64/64",
      phone: "+1 (555) 776-6554",
      address: "753 Cherry Ct, Boston, MA 02101"
    },
    items: [
      { productId: "PRD-008", productName: "Zara Premium Blazer", image: "https://picsum.photos/seed/zara1/64/64", qty: 1, unitPrice: 129, subtotal: 129 }
    ],
    subtotal: 129,
    shippingFee: 8,
    discount: 0,
    total: 137,
    paymentMethod: "Credit Card",
    paymentStatus: "Refunded",
    status: "Cancelled",
    shippingAddress: { street: "753 Cherry Ct", city: "Boston", province: "MA", zip: "02101" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Customer successfully placed the order", timestamp: "2024-03-05 10:15", completed: true },
      { status: "Processing", label: "Processing", description: "Payment confirmed, preparing for shipment", timestamp: "2024-03-05 11:30", completed: true },
      { status: "Cancelled", label: "Cancelled", description: "Order cancelled by customer request", timestamp: "2024-03-06 09:00", completed: true }
    ],
    note: "I ordered the wrong size, please cancel.",
    createdAt: "2024-03-05",
    updatedAt: "2024-03-06"
  },
  {
    id: "ORD-009",
    customer: {
      name: "Henry Ford",
      email: "henry@example.com",
      avatar: "https://picsum.photos/seed/user9/64/64",
      phone: "+1 (555) 221-1334",
      address: "852 Willow Way, Denver, CO 80201"
    },
    items: [
      { productId: "PRD-007", productName: "Adidas Ultraboost 24", image: "https://picsum.photos/seed/adidas1/64/64", qty: 1, unitPrice: 190, subtotal: 190 }
    ],
    subtotal: 190,
    shippingFee: 0,
    discount: 19,
    total: 171,
    paymentMethod: "Bank Transfer",
    paymentStatus: "Paid",
    status: "Processing",
    shippingAddress: { street: "852 Willow Way", city: "Denver", province: "CO", zip: "80201" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Awaiting bank transfer confirmation", timestamp: "2024-03-14 15:20", completed: true },
      { status: "Processing", label: "Processing", description: "Payment confirmed, preparing for shipment", timestamp: "2024-03-15 10:00", completed: true },
      { status: "Shipped", label: "Shipped", description: "Pending handover to courier", timestamp: null, completed: false },
      { status: "Delivered", label: "Delivered", description: "Pending delivery", timestamp: null, completed: false }
    ],
    createdAt: "2024-03-14",
    updatedAt: "2024-03-15"
  },
  {
    id: "ORD-010",
    customer: {
      name: "Ivy Chen",
      email: "ivy@example.com",
      avatar: "https://picsum.photos/seed/user10/64/64",
      phone: "+1 (555) 665-5443",
      address: "963 Poplar Pl, San Francisco, CA 94101"
    },
    items: [
      { productId: "PRD-004", productName: "Sony WH-1000XM5", image: "https://picsum.photos/seed/sony1/64/64", qty: 2, unitPrice: 349, subtotal: 698 }
    ],
    subtotal: 698,
    shippingFee: 0,
    discount: 50,
    total: 648,
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    status: "Delivered",
    shippingAddress: { street: "963 Poplar Pl", city: "San Francisco", province: "CA", zip: "94101" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Customer successfully placed the order", timestamp: "2024-03-08 12:30", completed: true },
      { status: "Processing", label: "Processing", description: "Payment confirmed, preparing for shipment", timestamp: "2024-03-08 13:45", completed: true },
      { status: "Shipped", label: "Shipped", description: "Order has been handed over to FedEx", timestamp: "2024-03-09 16:00", completed: true },
      { status: "Delivered", label: "Delivered", description: "Package was delivered to customer", timestamp: "2024-03-11 14:10", completed: true }
    ],
    createdAt: "2024-03-08",
    updatedAt: "2024-03-11"
  },
  {
    id: "ORD-011",
    customer: {
      name: "Jack Black",
      email: "jack@example.com",
      avatar: "https://picsum.photos/seed/user11/64/64",
      phone: "+1 (555) 443-3221",
      address: "147 Spruce St, Portland, OR 97201"
    },
    items: [
      { productId: "PRD-009", productName: "Organic Coffee Beans 1kg", image: "https://picsum.photos/seed/coffee1/64/64", qty: 1, unitPrice: 34, subtotal: 34 },
      { productId: "PRD-010", productName: "Manuka Honey MGO 400+", image: "https://picsum.photos/seed/honey1/64/64", qty: 2, unitPrice: 59, subtotal: 118 }
    ],
    subtotal: 152,
    shippingFee: 10,
    discount: 0,
    total: 162,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    status: "Shipped",
    shippingAddress: { street: "147 Spruce St", city: "Portland", province: "OR", zip: "97201" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Order received via COD", timestamp: "2024-03-13 16:20", completed: true },
      { status: "Processing", label: "Processing", description: "Awaiting confirmation call", timestamp: "2024-03-14 09:15", completed: true },
      { status: "Shipped", label: "Shipped", description: "Order has been handed over to DHL", timestamp: "2024-03-15 11:30", completed: true },
      { status: "Delivered", label: "Delivered", description: "Pending delivery", timestamp: null, completed: false }
    ],
    createdAt: "2024-03-13",
    updatedAt: "2024-03-15"
  },
  {
    id: "ORD-012",
    customer: {
      name: "Karen Hill",
      email: "karen@example.com",
      avatar: "https://picsum.photos/seed/user12/64/64",
      phone: "+1 (555) 887-7665",
      address: "258 Ash Ave, Phoenix, AZ 85001"
    },
    items: [
      { productId: "PRD-001", productName: "iPhone 16 Pro Max", image: "https://picsum.photos/seed/iphone1/64/64", qty: 2, unitPrice: 1199, subtotal: 2398 }
    ],
    subtotal: 2398,
    shippingFee: 0,
    discount: 100,
    total: 2298,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    status: "Delivered",
    shippingAddress: { street: "258 Ash Ave", city: "Phoenix", province: "AZ", zip: "85001" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Customer successfully placed the order", timestamp: "2024-02-15 20:00", completed: true },
      { status: "Processing", label: "Processing", description: "Payment confirmed, preparing for shipment", timestamp: "2024-02-16 08:30", completed: true },
      { status: "Shipped", label: "Shipped", description: "Order has been handed over to UPS", timestamp: "2024-02-17 10:15", completed: true },
      { status: "Delivered", label: "Delivered", description: "Package was delivered to customer", timestamp: "2024-02-19 14:20", completed: true }
    ],
    createdAt: "2024-02-15",
    updatedAt: "2024-02-19"
  },
  {
    id: "ORD-013",
    customer: {
      name: "Leo Dicaprio",
      email: "leo@example.com",
      avatar: "https://picsum.photos/seed/user13/64/64",
      phone: "+1 (555) 554-4332",
      address: "369 Walnut Way, Atlanta, GA 30301"
    },
    items: [
      { productId: "PRD-006", productName: "Levi's 501", image: "https://picsum.photos/seed/levis1/64/64", qty: 1, unitPrice: 89, subtotal: 89 }
    ],
    subtotal: 89,
    shippingFee: 8,
    discount: 0,
    total: 97,
    paymentMethod: "PayPal",
    paymentStatus: "Refunded",
    status: "Cancelled",
    shippingAddress: { street: "369 Walnut Way", city: "Atlanta", province: "GA", zip: "30301" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Customer successfully placed the order", timestamp: "2024-03-10 11:30", completed: true },
      { status: "Cancelled", label: "Cancelled", description: "Items out of stock, order cancelled automatically", timestamp: "2024-03-11 09:45", completed: true }
    ],
    note: "System cancellation: Out of stock.",
    createdAt: "2024-03-10",
    updatedAt: "2024-03-11"
  },
  {
    id: "ORD-014",
    customer: {
      name: "Mia Wong",
      email: "mia@example.com",
      avatar: "https://picsum.photos/seed/user14/64/64",
      phone: "+1 (555) 778-8990",
      address: "741 Chestnut Cir, Las Vegas, NV 89101"
    },
    items: [
      { productId: "PRD-012", productName: "Organic Green Tea Leaves", image: "https://picsum.photos/seed/tea1/64/64", qty: 5, unitPrice: 24, subtotal: 120 }
    ],
    subtotal: 120,
    shippingFee: 5,
    discount: 10,
    total: 115,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    status: "Processing",
    shippingAddress: { street: "741 Chestnut Cir", city: "Las Vegas", province: "NV", zip: "89101" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Customer successfully placed the order", timestamp: "2024-03-16 18:00", completed: true },
      { status: "Processing", label: "Processing", description: "Payment confirmed, preparing for shipment", timestamp: "2024-03-16 18:30", completed: true },
      { status: "Shipped", label: "Shipped", description: "Pending handover to courier", timestamp: null, completed: false },
      { status: "Delivered", label: "Delivered", description: "Pending delivery", timestamp: null, completed: false }
    ],
    createdAt: "2024-03-16",
    updatedAt: "2024-03-16"
  },
  {
    id: "ORD-015",
    customer: {
      name: "Noah Smith",
      email: "noah@example.com",
      avatar: "https://picsum.photos/seed/user15/64/64",
      phone: "+1 (555) 332-2110",
      address: "852 Dogwood Dr, Dallas, TX 75201"
    },
    items: [
      { productId: "PRD-011", productName: "Whey Protein Isolate 2kg", image: "https://picsum.photos/seed/whey1/64/64", qty: 2, unitPrice: 79, subtotal: 158 },
      { productId: "PRD-005", productName: "Nike Air Max 270", image: "https://picsum.photos/seed/nike1/64/64", qty: 1, unitPrice: 150, subtotal: 150 },
      { productId: "PRD-007", productName: "Adidas Ultraboost 24", image: "https://picsum.photos/seed/adidas1/64/64", qty: 1, unitPrice: 190, subtotal: 190 }
    ],
    subtotal: 498,
    shippingFee: 0,
    discount: 50,
    total: 448,
    paymentMethod: "Bank Transfer",
    paymentStatus: "Pending",
    status: "Pending",
    shippingAddress: { street: "852 Dogwood Dr", city: "Dallas", province: "TX", zip: "75201" },
    timeline: [
      { status: "Pending", label: "Order Placed", description: "Awaiting bank transfer confirmation", timestamp: "2024-03-17 09:30", completed: true },
      { status: "Processing", label: "Processing", description: "Pending payment verification", timestamp: null, completed: false },
      { status: "Shipped", label: "Shipped", description: "Pending handover to courier", timestamp: null, completed: false },
      { status: "Delivered", label: "Delivered", description: "Pending delivery", timestamp: null, completed: false }
    ],
    note: "Will transfer money tomorrow morning.",
    createdAt: "2024-03-17",
    updatedAt: "2024-03-17"
  }
];
