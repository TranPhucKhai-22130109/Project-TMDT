import Image from "next/image";
import { Eye, Heart, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  imageUrl?: string;
}

export default function ProductCard({
  title,
  price,
  originalPrice,
  discountBadge,
  imageUrl,
}: ProductCardProps) {
  // Use a generic placeholder if no image is provided
  const imgSource = imageUrl || "https://placehold.co/400x400/f3f4f6/a1a1aa?text=Product+Image";

  return (
    <div className="group relative bg-white border border-gray-100 rounded-lg p-4 transition-all hover:shadow-lg hover:border-gray-200">
      {/* Discount Badge */}
      {discountBadge && (
        <div className="absolute top-4 right-4 z-10 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm">
          {discountBadge}
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-48 w-full mb-4 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
        <Image 
          src={imgSource} 
          alt={title} 
          fill
          className="object-contain p-4 mix-blend-multiply"
          unoptimized={imgSource.includes("placehold.co")}
        />
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-zinc-700 hover:bg-zinc-50 hover:text-blue-600 transition">
            <Eye className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition">
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-zinc-700 hover:bg-zinc-50 hover:text-red-500 transition">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-800 line-clamp-1 mb-1">{title}</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-zinc-900">${price}</span>
          {originalPrice && (
            <span className="text-zinc-400 line-through">${originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}
