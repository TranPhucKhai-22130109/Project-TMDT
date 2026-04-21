import ProductCard from "./ProductCard";

const BEST_SELLING = [
  { id: 1, title: "iPhone 16 Pro - 8/128GB", price: 600, originalPrice: 898, imageUrl: "/images/sellers/sellers-01.png" },
  { id: 2, title: "Indoor Steel Adjustable Silent Treadmill Home Fitness", price: 888, originalPrice: 999, imageUrl: "/images/sellers/sellers-02.png" },
  { id: 3, title: "Rangs 43 Inch Frameless FHD Double Glass Android TV", price: 700, originalPrice: 799, imageUrl: "/images/sellers/sellers-03.png" },
  { id: 4, title: "Apple Watch Ultra", price: 89, originalPrice: 99, imageUrl: "/images/sellers/sellers-04.png" },
  { id: 5, title: "Macbook Pro - 512/16GB", price: 500, imageUrl: "/images/sellers/sellers-05.png" },
  { id: 6, title: "MacBook Air M4 chip, 16/256GB", price: 600, originalPrice: 699, imageUrl: "/images/sellers/sellers-06.png" },
];

export default function BestSelling() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-3xl font-bold text-zinc-900 mb-2">Best Selling Products</h2>
        <p className="text-zinc-500 text-sm text-center max-w-md">
          These top picks are flying off the shelves! Find out what everyone's loving right now.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BEST_SELLING.map((product) => (
          <div key={product.id} className="bg-slate-50 rounded-xl p-2">
            <ProductCard
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              imageUrl={product.imageUrl}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-10 flex justify-center">
        <button className="bg-gray-100 text-zinc-800 px-8 py-2.5 rounded-md font-medium hover:bg-gray-200 transition">
          View All
        </button>
      </div>
    </section>
  );
}
