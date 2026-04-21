import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES = [
  { id: 1, name: "Laptop & PC", icon: "/images/categories/categories-01.png" },
  { id: 2, name: "Watches", icon: "/images/categories/categories-07.png" },
  {
    id: 3,
    name: "Mobile & Tablets",
    icon: "/images/categories/categories-03.png",
  },
  {
    id: 4,
    name: "Health & Sports",
    icon: "/images/categories/categories-06.png",
  },
  {
    id: 5,
    name: "Home Appliances",
    icon: "/images/categories/categories-05.png",
  },
  {
    id: 6,
    name: "Games & Videos",
    icon: "/images/categories/categories-04.png",
  },
];

export default function CategoryBrowse() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-[#1e293b]">
          Browse by Category
        </h2>
        <div className="flex gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-[10px] border border-gray-200 hover:bg-gray-50 transition text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-[10px] border border-gray-200 hover:bg-gray-50 transition text-gray-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap justify-between gap-6">
        {CATEGORIES.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center gap-6 cursor-pointer group"
          >
            <div className="w-36 h-36 md:w-[150px] md:h-[150px] bg-[#f8fafc] rounded-full flex items-center justify-center border border-transparent group-hover:border-blue-600 group-hover:shadow-md transition-all">
              <Image
                src={category.icon}
                alt={category.name}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <span className="text-base font-semibold text-[#1e293b] group-hover:text-blue-600 transition text-center">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
