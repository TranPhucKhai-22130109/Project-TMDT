export const mockProducts = [
  {
    id: "PRD-001",
    name: "iPhone 16 Pro Max 256GB",
    sku: "APL-IP16PM-256",
    category: "Electronics",
    price: 1199,
    originalPrice: 1299,
    stock: 8,
    maxStock: 50,
    status: "active",
    description: "Latest Apple flagship with A18 Pro chip, titanium design, and advanced camera system.",
    images: [
      "https://picsum.photos/seed/iphone1/400/400",
      "https://picsum.photos/seed/iphone2/400/400",
      "https://picsum.photos/seed/iphone3/400/400"
    ],
    tags: ["smartphone", "apple", "flagship", "5g"],
    specs: {
      weight: "227g",
      dimensions: "163 x 77.6 x 8.25 mm",
      material: "Titanium / Ceramic Shield",
      barcode: "194253123456",
      supplier: "Apple Inc."
    },
    salesStats: { totalSold: 128, revenue: 153472, returnRate: 1.2, avgRating: 4.8 },
    recentOrders: [
      { orderId: "ORD-901", customerName: "John Doe", qty: 1, date: "2024-03-10", status: "Delivered" },
      { orderId: "ORD-902", customerName: "Alice Smith", qty: 2, date: "2024-03-12", status: "Shipped" },
      { orderId: "ORD-903", customerName: "Bob Johnson", qty: 1, date: "2024-03-14", status: "Pending" },
      { orderId: "ORD-904", customerName: "Charlie Brown", qty: 1, date: "2024-03-15", status: "Processing" },
      { orderId: "ORD-905", customerName: "David Lee", qty: 1, date: "2024-03-16", status: "Pending" }
    ]
  },
  {
    id: "PRD-002",
    name: "Samsung Galaxy S25 Ultra",
    sku: "SAM-S25U-512",
    category: "Electronics",
    price: 1099,
    originalPrice: 1199,
    stock: 25,
    maxStock: 40,
    status: "active",
    description: "Samsung's top-of-the-line with S Pen, 200MP camera, and Snapdragon 8 Elite.",
    images: [
      "https://picsum.photos/seed/sam1/400/400",
      "https://picsum.photos/seed/sam2/400/400",
      "https://picsum.photos/seed/sam3/400/400"
    ],
    tags: ["smartphone", "samsung", "android", "stylus"],
    specs: {
      weight: "232g",
      dimensions: "162.3 x 79 x 8.6 mm",
      material: "Titanium / Gorilla Glass Armor",
      barcode: "880609123456",
      supplier: "Samsung Electronics"
    },
    salesStats: { totalSold: 92, revenue: 101108, returnRate: 2.1, avgRating: 4.7 },
    recentOrders: [
      { orderId: "ORD-801", customerName: "Emma Davis", qty: 1, date: "2024-02-28", status: "Delivered" },
      { orderId: "ORD-802", customerName: "Frank Wright", qty: 1, date: "2024-03-01", status: "Delivered" },
      { orderId: "ORD-803", customerName: "Grace Kelly", qty: 1, date: "2024-03-05", status: "Shipped" },
      { orderId: "ORD-804", customerName: "Henry Ford", qty: 2, date: "2024-03-10", status: "Processing" },
      { orderId: "ORD-805", customerName: "Ivy Chen", qty: 1, date: "2024-03-15", status: "Pending" }
    ]
  },
  {
    id: "PRD-003",
    name: "MacBook Pro 14\" M4",
    sku: "APL-MBP14-M4",
    category: "Electronics",
    price: 1999,
    originalPrice: null,
    stock: 5,
    maxStock: 20,
    status: "active",
    description: "Apple MacBook Pro 14-inch with M4 chip, Liquid Retina XDR display.",
    images: [
      "https://picsum.photos/seed/mac1/400/400",
      "https://picsum.photos/seed/mac2/400/400",
      "https://picsum.photos/seed/mac3/400/400"
    ],
    tags: ["laptop", "apple", "macbook", "m4"],
    specs: {
      weight: "1.55kg",
      dimensions: "31.26 x 22.12 x 1.55 cm",
      material: "Recycled Aluminum",
      barcode: "194253123789",
      supplier: "Apple Inc."
    },
    salesStats: { totalSold: 61, revenue: 121939, returnRate: 0.5, avgRating: 4.9 },
    recentOrders: [
      { orderId: "ORD-701", customerName: "Jack Black", qty: 1, date: "2024-01-15", status: "Delivered" },
      { orderId: "ORD-702", customerName: "Karen Hill", qty: 1, date: "2024-02-02", status: "Delivered" },
      { orderId: "ORD-703", customerName: "Leo Dicaprio", qty: 1, date: "2024-02-20", status: "Delivered" },
      { orderId: "ORD-704", customerName: "Mia Wong", qty: 1, date: "2024-03-11", status: "Shipped" },
      { orderId: "ORD-705", customerName: "Noah Smith", qty: 1, date: "2024-03-16", status: "Pending" }
    ]
  },
  {
    id: "PRD-004",
    name: "Sony WH-1000XM5",
    sku: "SNY-WH1000XM5",
    category: "Electronics",
    price: 349,
    originalPrice: 399,
    stock: 45,
    maxStock: 100,
    status: "active",
    description: "Industry-leading noise canceling wireless headphones with 30-hour battery.",
    images: [
      "https://picsum.photos/seed/sony1/400/400",
      "https://picsum.photos/seed/sony2/400/400",
      "https://picsum.photos/seed/sony3/400/400"
    ],
    tags: ["audio", "headphones", "sony", "wireless"],
    specs: {
      weight: "250g",
      dimensions: "Over-ear",
      material: "Soft fit leather",
      barcode: "027242923531",
      supplier: "Sony Corporation"
    },
    salesStats: { totalSold: 215, revenue: 75035, returnRate: 3.2, avgRating: 4.6 },
    recentOrders: [
      { orderId: "ORD-601", customerName: "Olivia Pope", qty: 1, date: "2024-03-01", status: "Delivered" },
      { orderId: "ORD-602", customerName: "Peter Parker", qty: 2, date: "2024-03-08", status: "Delivered" },
      { orderId: "ORD-603", customerName: "Quinn Davis", qty: 1, date: "2024-03-12", status: "Shipped" },
      { orderId: "ORD-604", customerName: "Rachel Green", qty: 1, date: "2024-03-14", status: "Processing" },
      { orderId: "ORD-605", customerName: "Steve Rogers", qty: 1, date: "2024-03-16", status: "Pending" }
    ]
  },
  {
    id: "PRD-005",
    name: "Nike Air Max 270",
    sku: "NKE-AM270-BLK",
    category: "Clothing",
    price: 150,
    originalPrice: 160,
    stock: 15,
    maxStock: 50,
    status: "active",
    description: "Nike's biggest Air unit yet provides all-day comfort in a sleek design.",
    images: [
      "https://picsum.photos/seed/nike1/400/400",
      "https://picsum.photos/seed/nike2/400/400",
      "https://picsum.photos/seed/nike3/400/400"
    ],
    tags: ["shoes", "sneakers", "nike", "running"],
    specs: {
      weight: "800g",
      dimensions: "Standard shoe box",
      material: "Mesh / Synthetic",
      barcode: "193654123456",
      supplier: "Nike Inc."
    },
    salesStats: { totalSold: 387, revenue: 58050, returnRate: 5.5, avgRating: 4.5 },
    recentOrders: [
      { orderId: "ORD-501", customerName: "Tony Stark", qty: 1, date: "2024-03-10", status: "Delivered" },
      { orderId: "ORD-502", customerName: "Uma Thurman", qty: 1, date: "2024-03-11", status: "Shipped" },
      { orderId: "ORD-503", customerName: "Victor Hugo", qty: 1, date: "2024-03-13", status: "Shipped" },
      { orderId: "ORD-504", customerName: "Wanda Maximoff", qty: 1, date: "2024-03-15", status: "Processing" },
      { orderId: "ORD-505", customerName: "Xavier Woods", qty: 2, date: "2024-03-16", status: "Pending" }
    ]
  },
  {
    id: "PRD-006",
    name: "Levi's 501 Original Jeans",
    sku: "LVS-501-INDG",
    category: "Clothing",
    price: 89,
    originalPrice: null,
    stock: 65,
    maxStock: 100,
    status: "active",
    description: "The original straight fit jeans since 1873. A timeless American icon.",
    images: [
      "https://picsum.photos/seed/levis1/400/400",
      "https://picsum.photos/seed/levis2/400/400",
      "https://picsum.photos/seed/levis3/400/400"
    ],
    tags: ["jeans", "denim", "levis", "pants"],
    specs: {
      weight: "600g",
      dimensions: "Varies by size",
      material: "100% Cotton Denim",
      barcode: "052176123456",
      supplier: "Levi Strauss & Co."
    },
    salesStats: { totalSold: 512, revenue: 45568, returnRate: 4.2, avgRating: 4.7 },
    recentOrders: [
      { orderId: "ORD-401", customerName: "Yara Shahidi", qty: 1, date: "2024-03-01", status: "Delivered" },
      { orderId: "ORD-402", customerName: "Zack Snyder", qty: 2, date: "2024-03-05", status: "Delivered" },
      { orderId: "ORD-403", customerName: "Alice Cooper", qty: 1, date: "2024-03-12", status: "Shipped" },
      { orderId: "ORD-404", customerName: "Bruce Wayne", qty: 1, date: "2024-03-14", status: "Processing" },
      { orderId: "ORD-405", customerName: "Clark Kent", qty: 1, date: "2024-03-16", status: "Pending" }
    ]
  },
  {
    id: "PRD-007",
    name: "Adidas Ultraboost 24",
    sku: "ADS-UB24-WHT",
    category: "Clothing",
    price: 190,
    originalPrice: 200,
    stock: 0,
    maxStock: 40,
    status: "inactive",
    description: "Running shoes with BOOST midsole for incredible energy return.",
    images: [
      "https://picsum.photos/seed/adidas1/400/400",
      "https://picsum.photos/seed/adidas2/400/400",
      "https://picsum.photos/seed/adidas3/400/400"
    ],
    tags: ["shoes", "sneakers", "adidas", "running"],
    specs: {
      weight: "750g",
      dimensions: "Standard shoe box",
      material: "Primeknit / Boost",
      barcode: "194813123456",
      supplier: "Adidas AG"
    },
    salesStats: { totalSold: 198, revenue: 37620, returnRate: 6.1, avgRating: 4.4 },
    recentOrders: [
      { orderId: "ORD-301", customerName: "Diana Prince", qty: 1, date: "2024-02-15", status: "Delivered" },
      { orderId: "ORD-302", customerName: "Ethan Hunt", qty: 1, date: "2024-02-28", status: "Delivered" },
      { orderId: "ORD-303", customerName: "Fiona Gallagher", qty: 1, date: "2024-03-01", status: "Delivered" },
      { orderId: "ORD-304", customerName: "George Bluth", qty: 1, date: "2024-03-05", status: "Delivered" },
      { orderId: "ORD-305", customerName: "Haley Dunphy", qty: 1, date: "2024-03-10", status: "Cancelled" }
    ]
  },
  {
    id: "PRD-008",
    name: "Zara Premium Blazer",
    sku: "ZRA-BLZR-NVY",
    category: "Clothing",
    price: 129,
    originalPrice: 149,
    stock: 12,
    maxStock: 30,
    status: "active",
    description: "Slim-fit navy blazer crafted from premium wool blend fabric.",
    images: [
      "https://picsum.photos/seed/zara1/400/400",
      "https://picsum.photos/seed/zara2/400/400",
      "https://picsum.photos/seed/zara3/400/400"
    ],
    tags: ["clothing", "menswear", "blazer", "formal"],
    specs: {
      weight: "1.2kg",
      dimensions: "Varies by size",
      material: "Wool / Polyester",
      barcode: "089123123456",
      supplier: "Zara S.A."
    },
    salesStats: { totalSold: 73, revenue: 9417, returnRate: 8.5, avgRating: 4.2 },
    recentOrders: [
      { orderId: "ORD-201", customerName: "Ian Gallagher", qty: 1, date: "2024-03-01", status: "Delivered" },
      { orderId: "ORD-202", customerName: "Jane Doe", qty: 1, date: "2024-03-05", status: "Delivered" },
      { orderId: "ORD-203", customerName: "Kevin Malone", qty: 1, date: "2024-03-12", status: "Shipped" },
      { orderId: "ORD-204", customerName: "Laura Palmer", qty: 1, date: "2024-03-15", status: "Processing" },
      { orderId: "ORD-205", customerName: "Michael Scott", qty: 1, date: "2024-03-16", status: "Pending" }
    ]
  },
  {
    id: "PRD-009",
    name: "Organic Coffee Beans 1kg",
    sku: "FD-COFFEE-ORG",
    category: "Food",
    price: 34,
    originalPrice: null,
    stock: 120,
    maxStock: 200,
    status: "active",
    description: "Single-origin Colombian Arabica beans, medium roast, fair trade certified.",
    images: [
      "https://picsum.photos/seed/coffee1/400/400",
      "https://picsum.photos/seed/coffee2/400/400",
      "https://picsum.photos/seed/coffee3/400/400"
    ],
    tags: ["food", "coffee", "organic", "beans"],
    specs: {
      weight: "1kg",
      dimensions: "15 x 10 x 25 cm",
      material: "Paper bag",
      barcode: "012345678901",
      supplier: "Organic Farms Co."
    },
    salesStats: { totalSold: 634, revenue: 21556, returnRate: 0.1, avgRating: 4.9 },
    recentOrders: [
      { orderId: "ORD-101", customerName: "Nina Simone", qty: 2, date: "2024-03-12", status: "Delivered" },
      { orderId: "ORD-102", customerName: "Oscar Wilde", qty: 1, date: "2024-03-13", status: "Shipped" },
      { orderId: "ORD-103", customerName: "Paul McCartney", qty: 3, date: "2024-03-14", status: "Processing" },
      { orderId: "ORD-104", customerName: "Queen Elizabeth", qty: 1, date: "2024-03-15", status: "Pending" },
      { orderId: "ORD-105", customerName: "Ringo Starr", qty: 2, date: "2024-03-16", status: "Pending" }
    ]
  },
  {
    id: "PRD-010",
    name: "Manuka Honey MGO 400+",
    sku: "FD-HONEY-MGO4",
    category: "Food",
    price: 59,
    originalPrice: 65,
    stock: 7,
    maxStock: 30,
    status: "active",
    description: "Premium New Zealand Manuka honey with certified MGO 400+ strength.",
    images: [
      "https://picsum.photos/seed/honey1/400/400",
      "https://picsum.photos/seed/honey2/400/400",
      "https://picsum.photos/seed/honey3/400/400"
    ],
    tags: ["food", "honey", "health", "organic"],
    specs: {
      weight: "500g",
      dimensions: "10 x 10 x 12 cm",
      material: "Glass jar",
      barcode: "098765432109",
      supplier: "NZ Honey Co."
    },
    salesStats: { totalSold: 289, revenue: 17051, returnRate: 0.3, avgRating: 4.8 },
    recentOrders: [
      { orderId: "ORD-091", customerName: "Sam Smith", qty: 1, date: "2024-03-10", status: "Delivered" },
      { orderId: "ORD-092", customerName: "Tina Turner", qty: 1, date: "2024-03-12", status: "Shipped" },
      { orderId: "ORD-093", customerName: "Uma Thurman", qty: 2, date: "2024-03-14", status: "Processing" },
      { orderId: "ORD-094", customerName: "Vin Diesel", qty: 1, date: "2024-03-15", status: "Pending" },
      { orderId: "ORD-095", customerName: "Will Smith", qty: 1, date: "2024-03-16", status: "Pending" }
    ]
  },
  {
    id: "PRD-011",
    name: "Whey Protein Isolate 2kg",
    sku: "FD-WHEY-ISO-2K",
    category: "Food",
    price: 79,
    originalPrice: 89,
    stock: 41,
    maxStock: 100,
    status: "active",
    description: "Pure whey protein isolate with 27g protein per serving, chocolate flavor.",
    images: [
      "https://picsum.photos/seed/whey1/400/400",
      "https://picsum.photos/seed/whey2/400/400",
      "https://picsum.photos/seed/whey3/400/400"
    ],
    tags: ["food", "supplements", "protein", "fitness"],
    specs: {
      weight: "2kg",
      dimensions: "20 x 20 x 30 cm",
      material: "Plastic tub",
      barcode: "112233445566",
      supplier: "Optimum Nutrition"
    },
    salesStats: { totalSold: 156, revenue: 12324, returnRate: 1.5, avgRating: 4.6 },
    recentOrders: [
      { orderId: "ORD-081", customerName: "Xena Warrior", qty: 1, date: "2024-03-05", status: "Delivered" },
      { orderId: "ORD-082", customerName: "Yoda Master", qty: 1, date: "2024-03-08", status: "Delivered" },
      { orderId: "ORD-083", customerName: "Zorro Fox", qty: 1, date: "2024-03-12", status: "Shipped" },
      { orderId: "ORD-084", customerName: "Aragorn King", qty: 2, date: "2024-03-15", status: "Processing" },
      { orderId: "ORD-085", customerName: "Bilbo Baggins", qty: 1, date: "2024-03-16", status: "Pending" }
    ]
  },
  {
    id: "PRD-012",
    name: "Organic Green Tea Leaves",
    sku: "FD-TEA-GRN",
    category: "Food",
    price: 24,
    originalPrice: null,
    stock: 85,
    maxStock: 150,
    status: "active",
    description: "Premium loose leaf green tea from Japan. Antioxidant rich.",
    images: [
      "https://picsum.photos/seed/tea1/400/400",
      "https://picsum.photos/seed/tea2/400/400",
      "https://picsum.photos/seed/tea3/400/400"
    ],
    tags: ["food", "tea", "green tea", "organic"],
    specs: {
      weight: "250g",
      dimensions: "10 x 10 x 15 cm",
      material: "Tin can",
      barcode: "223344556677",
      supplier: "Japan Tea Co."
    },
    salesStats: { totalSold: 412, revenue: 9888, returnRate: 0.8, avgRating: 4.8 },
    recentOrders: [
      { orderId: "ORD-071", customerName: "Cersei Lannister", qty: 1, date: "2024-03-01", status: "Delivered" },
      { orderId: "ORD-072", customerName: "Daenerys Targaryen", qty: 2, date: "2024-03-05", status: "Delivered" },
      { orderId: "ORD-073", customerName: "Jon Snow", qty: 1, date: "2024-03-10", status: "Shipped" },
      { orderId: "ORD-074", customerName: "Tyrion Lannister", qty: 1, date: "2024-03-14", status: "Processing" },
      { orderId: "ORD-075", customerName: "Arya Stark", qty: 1, date: "2024-03-16", status: "Pending" }
    ]
  }
];
