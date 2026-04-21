import ProductCard from "./ProductCard";

const NEW_ARRIVALS = [
  { id: 1, title: "Macbook Pro - 512/16GB", price: 500, imageUrl: "/images/arrivals/arrivals-01.png" },
  { id: 2, title: "Indoor Steel Adjustable Silent...", price: 888, originalPrice: 999, discountBadge: "11% OFF", imageUrl: "/images/arrivals/arrivals-02.png" },
  { id: 3, title: "Rangs 43 Inch Frameless FHD Double...", price: 700, originalPrice: 799, discountBadge: "12% OFF", imageUrl: "/images/arrivals/arrivals-03.png" },
  { id: 4, title: "Portable Electric Grinder Maker", price: 777, originalPrice: 888, discountBadge: "13% OFF", imageUrl: "/images/arrivals/arrivals-04.png" },
  { id: 5, title: "iPhone 16 Pro - 8/128GB", price: 600, originalPrice: 898, discountBadge: "33% OFF", imageUrl: "/images/arrivals/arrivals-05.png" },
  { id: 6, title: "MacBook Air M1 chip, 8/256GB", price: 899, originalPrice: 930, discountBadge: "3% OFF", imageUrl: "/images/arrivals/arrivals-06.png" },
  { id: 7, title: "Apple iMac M4 24-inch 2025", price: 333, originalPrice: 555, discountBadge: "40% OFF", imageUrl: "/images/arrivals/arrivals-07.png" },
  { id: 8, title: "MacBook Air M4 chip, 16/256GB", price: 600, originalPrice: 699, discountBadge: "14% OFF", imageUrl: "/images/arrivals/arrivals-08.png" },
];

export default function NewArrivals() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">New Arrivals</h2>
        <button className="text-sm font-medium border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 transition">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {NEW_ARRIVALS.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            discountBadge={product.discountBadge}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}
