import Link from "next/link";
import { Search, User, Heart, ShoppingBag, ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <ShoppingCart className="w-6 h-6" />
          <span>Cozy<span className="text-zinc-800 font-semibold">commerce</span></span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-zinc-600">
          <Link href="#" className="text-zinc-900">Popular</Link>
          <Link href="#" className="hover:text-zinc-900">Shop</Link>
          <Link href="#" className="hover:text-zinc-900">Pages ▾</Link>
          <Link href="#" className="hover:text-zinc-900">Blog ▾</Link>
          <Link href="#" className="hover:text-zinc-900">Contact</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-5 text-zinc-600">
          <button className="hover:text-zinc-900"><Search className="w-5 h-5" /></button>
          <button className="hover:text-zinc-900"><User className="w-5 h-5" /></button>
          <button className="relative hover:text-zinc-900">
            <Heart className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </button>
          <button className="relative hover:text-zinc-900">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">1</span>
          </button>
        </div>
      </div>
    </header>
  );
}
