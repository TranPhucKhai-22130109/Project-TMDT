'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Facebook } from 'lucide-react';
import { Flame } from 'lucide-react';
import { Image } from '@/components/Image';
import { Input } from '@/components/Input';
import { Instagram } from 'lucide-react';
import { Link } from '@/components/Link';
import { Menu } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Search } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { SlidersHorizontal } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Text } from '@/components/Text';
import { Twitter } from 'lucide-react';
import { User } from 'lucide-react';
import { X } from 'lucide-react';
import { Zap } from 'lucide-react';
export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <>
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 transition-colors duration-300">
          {/* TOP BAR */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold py-2 text-center relative z-50">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <Text className="hidden sm:inline"> ⚡ FLASH SALE: Extra 20% OFF Everything! Code: BLITZ20 </Text>
              <Text className="sm:hidden"> ⚡ Extra 20% OFF: BLITZ20 </Text>
              <div className="flex items-center space-x-4">
                <Link className="hover:underline" href="deals.html"> View Deals </Link>
                <Text className="hidden sm:inline"> | </Text>
                <Link variant="inline" className="hidden sm:inline hover:underline" href="contact.html"> Help </Link>
              </div>
            </div>
          </div>
          {/* NAV BAR */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
              {/* Mobile Menu Button + Logo */}
              <div className="flex items-center gap-2">
                <button onClick={() => { setMobileMenuOpen(true) }} className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"><Menu className="w-6 h-6" /></button>
                {/* Logo */}
                <Link className="flex-shrink-0 flex items-center gap-2 group" href="index.html"><div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-500 rounded-lg flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-red-500/50"><Zap className="w-6 h-6 fill-current" /></div>
                <Text variant="italic" className="text-2xl font-black tracking-tighter italic text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-orange-500 transition-all"> BLITZ </Text></Link>
              </div>
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                <Link className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors" href="index.html"> Home </Link>
                <Link className="text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors flex items-center gap-1" href="deals.html"><Flame className="w-4 h-4" />
                 Deals </Link>
                <Link className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors" href="products.html"> Shop </Link>
                <Link className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors" href="contact.html"> Support </Link>
              </nav>
              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-md relative mx-4">
                <Input variant="text" className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm" type="text" placeholder="Search for deals..." />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {/* Utility Icons */}
              <div className="flex items-center space-x-3 sm:space-x-6">
                {/* Search Toggle (Mobile) */}
                <Button className="md:hidden p-2 text-gray-600 dark:text-gray-300"><Search className="w-6 h-6" /></Button>
                {/* Dark Mode Toggle */}
                <button onClick={() => { setDarkMode(!darkMode) }} className="p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Sun className="w-5 h-5 hidden dark:block" />
                  <Moon className="w-5 h-5 dark:hidden" />
                </button>
                {/* Account */}
                <Link className="hidden sm:block p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors" href="login.html"><User className="w-6 h-6" /></Link>
                {/* Cart */}
                <Link className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors group" href="cart.html"><ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
                <Text variant="bold" className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900"> 2 </Text></Link>
              </div>
            </div>
          </div>
          {/* MOBILE MENU OVERLAY */}
          {mobileMenuOpen && (
            <div onClick={() => { setMobileMenuOpen(false) }} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"></div>
          )}
          {/* MOBILE MENU PANEL */}
          {mobileMenuOpen && (
            <div className="fixed inset-y-0 left-0 z-[70] w-[80%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl lg:hidden border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <Link className="flex items-center gap-2" href="index.html"><div className="w-8 h-8 bg-gradient-to-br from-red-600 to-yellow-500 rounded flex items-center justify-center text-white"><Zap className="w-5 h-5 fill-current" /></div>
                <Text variant="italic" className="text-xl font-black tracking-tighter italic text-gray-900 dark:text-white"> BLITZ </Text></Link>
                <button onClick={() => { setMobileMenuOpen(false) }} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-500"><X className="w-6 h-6" /></button>
              </div>
              {/* Mobile Nav Links */}
              <nav className="p-6 space-y-6">
                <div className="space-y-4">
                  <Link className="block text-lg font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500" href="index.html"> Home </Link>
                  <Link className="block text-lg font-bold text-red-600 dark:text-red-500 flex items-center gap-2" href="deals.html"><Flame className="w-5 h-5" />
                   Today's Deals </Link>
                  <Link className="block text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500" href="products.html"> Shop All </Link>
                  <Link className="block text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500" href="cart.html"> Your Cart (2) </Link>
                  <Link className="block text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500" href="contact.html"> Support Center </Link>
                </div>
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                  <Link contentKey="cta_17" className="block w-full py-3 px-4 text-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" href="login.html"> Log In </Link>
                  <Link contentKey="cta_18" className="block w-full py-3 px-4 text-center rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all" href="login.html"> Sign Up Free </Link>
                </div>
              </nav>
            </div>
          )}
        </header>
        {/* Categories */}
        <section id="categories" className="py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className={`w-full lg:w-64 flex-shrink-0 space-y-8 ${`${!filterOpen ? 'hidden lg:block' : ''} ${filterOpen ? 'block' : ''}`}`}>
                {/* Categories */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider"> Categories </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input variant="text" className="rounded text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600" type="checkbox" />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"> Electronics (120) </Text>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input variant="text" className="rounded text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600" type="checkbox" />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"> Fashion (85) </Text>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input variant="text" className="rounded text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600" type="checkbox" />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"> Home & Living (45) </Text>
                    </label>
                  </div>
                </div>
                {/* Price Range */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider"> Price </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input variant="text" className="text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600" type="radio" name="price" />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"> Under $50 </Text>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input variant="text" className="text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600" type="radio" name="price" />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"> $50 - $100 </Text>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input variant="text" className="text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600" type="radio" name="price" />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"> $100 - $500 </Text>
                    </label>
                  </div>
                </div>
                {/* Discount */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider"> Discount </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input variant="text" className="rounded text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600" type="checkbox" />
                      <Text variant="bold" className="text-red-600 font-bold dark:text-red-400"> 50% Off or More </Text>
                    </label>
                  </div>
                </div>
              </aside>
              {/* Product Grid */}
              <div className="flex-1">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-6">
                  <button onClick={() => { setFilterOpen(!filterOpen) }} className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm">
                    <SlidersHorizontal className="w-5 h-5" />
                     Filters & Sort 
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Product Card 1 */}
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10"> -30% </Badge>
                    <Link className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700" href="product-detail.html"><Image variant="cover" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" /></Link>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate">
                        <Link className="hover:text-red-600 transition-colors" href="product-detail.html"> Nike Air Max </Link>
                      </h3>
                      <div className="flex items-end justify-between">
                        <div>
                          <Text className="text-gray-400 line-through text-sm"> $199.00 </Text>
                          <div className="text-xl font-black text-red-600"> $139.30 </div>
                        </div>
                        <Button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Plus className="w-5 h-5" /></Button>
                      </div>
                    </div>
                  </div>
                  {/* Product Card 2 */}
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10"> -50% </Badge>
                    <Link className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700" href="product-detail.html"><Image variant="cover" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" /></Link>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate">
                        <Link className="hover:text-red-600 transition-colors" href="product-detail.html"> Sony Headphones </Link>
                      </h3>
                      <div className="flex items-end justify-between">
                        <div>
                          <Text className="text-gray-400 line-through text-sm"> $299.00 </Text>
                          <div className="text-xl font-black text-red-600"> $149.50 </div>
                        </div>
                        <Button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Plus className="w-5 h-5" /></Button>
                      </div>
                    </div>
                  </div>
                  {/* Product Card 3 */}
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10"> -20% </Badge>
                    <Link className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700" href="product-detail.html"><Image variant="cover" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" /></Link>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate">
                        <Link className="hover:text-red-600 transition-colors" href="product-detail.html"> Polaroid Camera </Link>
                      </h3>
                      <div className="flex items-end justify-between">
                        <div>
                          <Text className="text-gray-400 line-through text-sm"> $120.00 </Text>
                          <div className="text-xl font-black text-red-600"> $96.00 </div>
                        </div>
                        <Button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Plus className="w-5 h-5" /></Button>
                      </div>
                    </div>
                  </div>
                  {/* Product Card 4 */}
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10"> -40% </Badge>
                    <Link className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700" href="product-detail.html"><Image variant="cover" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" /></Link>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate">
                        <Link className="hover:text-red-600 transition-colors" href="product-detail.html"> Designer Sunglasses </Link>
                      </h3>
                      <div className="flex items-end justify-between">
                        <div>
                          <Text className="text-gray-400 line-through text-sm"> $350.00 </Text>
                          <div className="text-xl font-black text-red-600"> $210.00 </div>
                        </div>
                        <Button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Plus className="w-5 h-5" /></Button>
                      </div>
                    </div>
                  </div>
                  {/* Product Card 5 */}
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10"> -15% </Badge>
                    <Link className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700" href="product-detail.html"><Image variant="cover" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" /></Link>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate">
                        <Link className="hover:text-red-600 transition-colors" href="product-detail.html"> Running Shoes </Link>
                      </h3>
                      <div className="flex items-end justify-between">
                        <div>
                          <Text className="text-gray-400 line-through text-sm"> $180.00 </Text>
                          <div className="text-xl font-black text-red-600"> $153.00 </div>
                        </div>
                        <Button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Plus className="w-5 h-5" /></Button>
                      </div>
                    </div>
                  </div>
                  {/* Product Card 6 */}
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10"> -60% </Badge>
                    <Link className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700" href="product-detail.html"><Image variant="cover" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" /></Link>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate">
                        <Link className="hover:text-red-600 transition-colors" href="product-detail.html"> Productivity Monitor </Link>
                      </h3>
                      <div className="flex items-end justify-between">
                        <div>
                          <Text className="text-gray-400 line-through text-sm"> $400.00 </Text>
                          <div className="text-xl font-black text-red-600"> $160.00 </div>
                        </div>
                        <Button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Plus className="w-5 h-5" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                  <nav className="flex gap-2">
                    <Link contentKey="cta_20" className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors" href="#"> Prev </Link>
                    <Link contentKey="cta_21" className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold" href="#"> 1 </Link>
                    <Link contentKey="cta_22" className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors" href="#"> 2 </Link>
                    <Link contentKey="cta_23" className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors" href="#"> 3 </Link>
                    <Link contentKey="cta_24" className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors" href="#"> Next </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
              {/* Brand Column */}
              <div className="lg:col-span-4 space-y-6">
                <Link className="flex items-center gap-2 group" href="index.html"><div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-500 rounded-lg flex items-center justify-center text-white shadow-lg"><Zap className="w-6 h-6 fill-current" /></div>
                <Text variant="italic" className="text-2xl font-black tracking-tighter italic text-gray-900 dark:text-white"> BLITZ </Text></Link>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                   The world's fastest growing flash sale platform. Daily deals on tech, fashion, and home goods with unbeatable prices. Don't blink. 
                </p>
                <div className="flex items-center gap-4">
                  <Link className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:shadow-md transition-all" href="#"><Twitter className="w-5 h-5" /></Link>
                  <Link className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:shadow-md transition-all" href="#"><Facebook className="w-5 h-5" /></Link>
                  <Link className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 hover:shadow-md transition-all" href="#"><Instagram className="w-5 h-5" /></Link>
                </div>
              </div>
              {/* Links Column 1 */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider"> Shop </h3>
                <ul className="space-y-4">
                  <li>
                    <Link className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors flex items-center gap-2" href="deals.html"><Flame className="w-4 h-4 text-red-500" />
                     Daily Deals </Link>
                  </li>
                  <li>
                    <Link className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" href="products.html"> Top Categories </Link>
                  </li>
                  <li>
                    <Link className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" href="products.html"> New Arrivals </Link>
                  </li>
                  <li>
                    <Link className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" href="products.html"> Clearance </Link>
                  </li>
                </ul>
              </div>
              {/* Links Column 2 */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider"> Support </h3>
                <ul className="space-y-4">
                  <li>
                    <Link className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" href="contact.html"> Help Center </Link>
                  </li>
                  <li>
                    <Link className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" href="contact.html"> Return Policy </Link>
                  </li>
                  <li>
                    <Link className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" href="terms.html"> Terms of Service </Link>
                  </li>
                  <li>
                    <Link className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" href="privacy.html"> Privacy Policy </Link>
                  </li>
                </ul>
              </div>
              {/* Newsletter Column */}
              <div className="lg:col-span-4 space-y-6">
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider"> Don't Miss Out </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                   Join 1M+ shoppers getting exclusive early access to flash sales. 
                </p>
                <form className="space-y-4">
                  <div className="relative">
                    <Input variant="text" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all dark:text-white" type="email" placeholder="Enter your email" />
                    <Button contentKey="cta_25" className="absolute right-2 top-2 bottom-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors" type="submit"> Subscribe </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                     By subscribing, you agree to our 
                    <Link className="underline hover:text-gray-900 dark:hover:text-white" href="terms.html"> Terms </Link>
                     and 
                    <Link className="underline hover:text-gray-900 dark:hover:text-white" href="privacy.html"> Privacy Policy </Link>
                     . 
                  </p>
                </form>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-sm text-gray-500 dark:text-gray-400"> © 2026 Blitz Commerce. All rights reserved. </p>
            </div>
          </div>
        </footer>
        {/* Script Init */}
      </>
    </div>
  );
}
