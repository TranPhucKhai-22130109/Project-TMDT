'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { Menu, Sun, Moon, Search, ShoppingCart, User, Zap, Flame } from 'lucide-react';
import { useCart } from '@/app/cart/CartContext';
import { Text } from '@/components/Text';   // Nếu bạn có component này

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { cartCount } = useCart();

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold py-2 text-center">
        <div className="container mx-auto px-4">
          ⚡ FLASH SALE: Extra 20% OFF Everything! Code: BLITZ20
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Logo + Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-red-600"
            >
              <Menu className="w-6 h-6" />
            </button>

            <NextLink href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-500 rounded-lg flex items-center justify-center text-white">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <Text variant="italic" className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                BLITZ
              </Text>
            </NextLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NextLink href="/" className="text-sm font-bold uppercase tracking-wide hover:text-red-600">Home</NextLink>
            <NextLink href="/deals" className="text-sm font-bold uppercase tracking-wide text-red-600 flex items-center gap-1">
              <Flame className="w-4 h-4" /> Deals
            </NextLink>
            <NextLink href="/products" className="text-sm font-bold uppercase tracking-wide hover:text-red-600">Shop</NextLink>
            <NextLink href="/contact" className="text-sm font-bold uppercase tracking-wide hover:text-red-600">Support</NextLink>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-4">
            <input
              type="text"
              placeholder="Search for deals..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 dark:hidden" />
            </button>

            {/* Account */}
            <NextLink href="/login" className="hidden sm:block p-2 text-gray-600 dark:text-gray-300 hover:text-red-600">
              <User className="w-6 h-6" />
            </NextLink>

            {/* Cart */}
            <NextLink href="/cart" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-600">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                  {cartCount}
                </span>
              )}
            </NextLink>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay & Panel */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-y-0 left-0 z-[70] w-[80%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl lg:hidden border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          {/* Mobile Menu Content - bạn có thể copy từ code cũ của mình */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <NextLink href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-yellow-500 rounded flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <Text variant="italic" className="text-xl font-black tracking-tighter">BLITZ</Text>
            </NextLink>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Thêm các link mobile menu nếu cần */}
        </div>
      )}
    </header>
  );
}

export { Navbar };