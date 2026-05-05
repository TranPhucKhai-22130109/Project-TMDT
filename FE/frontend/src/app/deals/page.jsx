'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { CheckCircle } from 'lucide-react';
import { Eye } from 'lucide-react';
import { Facebook } from 'lucide-react';
import { Flame } from 'lucide-react';
import { Image } from '@/components/Image';
import { Input } from '@/components/Input';
import { Instagram } from 'lucide-react';
import { Link } from '@/components/Link';
import { Menu } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Package } from 'lucide-react';
import { Search } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Text } from '@/components/Text';
import { Twitter } from 'lucide-react';
import { User } from 'lucide-react';
import { X } from 'lucide-react';
import { Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState(86400);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

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
        <Navbar />
        {/* Flash Sale Central */}
        <section id="flash_sale_central" className="bg-red-600 dark:bg-red-900 py-12 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <Text className="inline-block py-1 px-3 rounded bg-white text-red-600 font-black uppercase text-xs tracking-widest mb-4"> Limited Time Only </Text>
            <h1 className="text-4xl lg:text-7xl font-black text-white italic uppercase tracking-tighter mb-6 drop-shadow-lg"> Flash Sale Central </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto mb-8 font-medium">
               Up to 70% OFF on Electronics, Fashion & More. Deals expire at midnight! 
            </p>
            {/* Countdown */}
            <div className="flex justify-center gap-4 text-white">
              <div className="text-center">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white/10 backdrop-blur rounded-xl border border-white/20 flex items-center justify-center text-2xl lg:text-5xl font-black font-mono"><Text> 00 </Text></div>
                <div className="text-xs uppercase mt-2 font-bold tracking-wider"> Hours </div>
              </div>
              <div className="text-3xl font-black self-start mt-4"> : </div>
              <div className="text-center">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white/10 backdrop-blur rounded-xl border border-white/20 flex items-center justify-center text-2xl lg:text-5xl font-black font-mono"><Text> 00 </Text></div>
                <div className="text-xs uppercase mt-2 font-bold tracking-wider"> Mins </div>
              </div>
              <div className="text-3xl font-black self-start mt-4"> : </div>
              <div className="text-center">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-red-500 rounded-xl border border-red-400 shadow-lg shadow-red-900/50 flex items-center justify-center text-2xl lg:text-5xl font-black font-mono animate-pulse"><Text> 00 </Text></div>
                <div className="text-xs uppercase mt-2 font-bold tracking-wider"> Secs </div>
              </div>
            </div>
          </div>
        </section>
        {/* Smart Watch Series 7 */}
        <section id="smart_watch_series_7" className="py-12 lg:py-20">
          <div className="container mx-auto px-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-12 justify-center">
              <Button contentKey="cta_17" className="px-6 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg shadow-red-500/30"> All Deals </Button>
              <Button contentKey="cta_18" className="px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold border border-gray-200 dark:border-gray-700 hover:border-red-500 hover:text-red-500 transition-colors"> Electronics </Button>
              <Button contentKey="cta_19" className="px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold border border-gray-200 dark:border-gray-700 hover:border-red-500 hover:text-red-500 transition-colors"> Fashion </Button>
              <Button contentKey="cta_20" className="px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold border border-gray-200 dark:border-gray-700 hover:border-red-500 hover:text-red-500 transition-colors"> Home </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Deal Card 1 */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300">
                <div className="relative aspect-square">
                  <Text variant="italic" className="absolute top-3 left-3 bg-red-600 text-white text-sm font-black italic px-3 py-1 rounded shadow-lg z-10"> -50% OFF </Text>
                  {/* Image */}
                  <Link className="block w-full h-full" href="product-detail.html"><Image variant="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" /></Link>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                    <Button className="pointer-events-auto p-3 bg-white text-red-600 rounded-full hover:bg-red-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"><ShoppingCart className="w-5 h-5" /></Button>
                    <Link className="pointer-events-auto p-3 bg-white text-gray-900 rounded-full hover:bg-gray-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 flex items-center justify-center" href="product-detail.html"><Eye className="w-5 h-5" /></Link>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                    <Link href="product-detail.html"> Smart Watch Series 7 </Link>
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Text className="text-2xl font-black text-red-600 dark:text-red-400"> $199 </Text>
                    <Text className="text-sm text-gray-400 line-through"> $399 </Text>
                  </div>
                  {/* Claims Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                      <Text> claimed </Text>
                      <Text className="text-red-600"> 82% </Text>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 w-[82%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
                    <CheckCircle className="w-3 h-3" />
                     Free Shipping 
                  </div>
                </div>
              </div>
              {/* Deal Card 2 */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300">
                <div className="relative aspect-square">
                  <Text variant="italic" className="absolute top-3 left-3 bg-yellow-500 text-black text-sm font-black italic px-3 py-1 rounded shadow-lg z-10"> -30% OFF </Text>
                  {/* Image */}
                  <Link className="block w-full h-full" href="product-detail.html"><Image variant="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" /></Link>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                    <Button className="pointer-events-auto p-3 bg-white text-red-600 rounded-full hover:bg-red-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"><ShoppingCart className="w-5 h-5" /></Button>
                    <Link className="pointer-events-auto p-3 bg-white text-gray-900 rounded-full hover:bg-gray-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 flex items-center justify-center" href="product-detail.html"><Eye className="w-5 h-5" /></Link>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-red-600 transition-colors"><Link href="product-detail.html"> Minimalist Watch </Link></h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Text className="text-2xl font-black text-red-600 dark:text-red-400"> $89 </Text>
                    <Text className="text-sm text-gray-400 line-through"> $129 </Text>
                  </div>
                  {/* Claims Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                      <Text> claimed </Text>
                      <Text className="text-red-600"> 45% </Text>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 w-[45%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-orange-500 font-bold">
                    <Flame className="w-3 h-3" />
                     Selling Fast 
                  </div>
                </div>
              </div>
              {/* Deal Card 3 */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300">
                <div className="relative aspect-square">
                  <Text variant="italic" className="absolute top-3 left-3 bg-red-600 text-white text-sm font-black italic px-3 py-1 rounded shadow-lg z-10"> -60% OFF </Text>
                  {/* Image */}
                  <Link className="block w-full h-full" href="product-detail.html"><Image variant="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" /></Link>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                    <Button className="pointer-events-auto p-3 bg-white text-red-600 rounded-full hover:bg-red-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"><ShoppingCart className="w-5 h-5" /></Button>
                    <Link className="pointer-events-auto p-3 bg-white text-gray-900 rounded-full hover:bg-gray-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 flex items-center justify-center" href="product-detail.html"><Eye className="w-5 h-5" /></Link>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-red-600 transition-colors"><Link href="product-detail.html"> USB-C Hub Pro </Link></h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Text className="text-2xl font-black text-red-600 dark:text-red-400"> $29 </Text>
                    <Text className="text-sm text-gray-400 line-through"> $75 </Text>
                  </div>
                  {/* Claims Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                      <Text> claimed </Text>
                      <Text className="text-red-600"> 95% </Text>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 w-[95%] rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-600 font-bold">
                    <AlertCircle className="w-3 h-3" />
                     Almost Gone 
                  </div>
                </div>
              </div>
              {/* Deal Card 4 */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300">
                <div className="relative aspect-square">
                  <Text variant="italic" className="absolute top-3 left-3 bg-yellow-500 text-black text-sm font-black italic px-3 py-1 rounded shadow-lg z-10"> -25% OFF 
                  <Link className="block w-full h-full" href="product-detail.html"><Image variant="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" /></Link>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                    <Button className="pointer-events-auto p-3 bg-white text-red-600 rounded-full hover:bg-red-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"><ShoppingCart className="w-5 h-5" /></Button>
                    <Link className="pointer-events-auto p-3 bg-white text-gray-900 rounded-full hover:bg-gray-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 flex items-center justify-center" href="product-detail.html"><Eye className="w-5 h-5" /></Link>
                  </div></Text>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                    <Link href="product-detail.html"> Nike Air Max 270 </Link>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-red-600 transition-colors"> Nike Air Max 270 </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Text className="text-2xl font-black text-red-600 dark:text-red-400"> $139 </Text>
                        <Text className="text-sm text-gray-400 line-through"> $199 </Text>
                      </div>
                      {/* Claims Bar */}
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                          <Text> claimed </Text>
                          <Text className="text-red-600"> 60% </Text>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 w-[60%] rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                        <Package className="w-3 h-3" />
                         In Stock 
                      </div>
                    </div>
                  </h3>
                </div>
              </div>
              <div className="mt-12 text-center">
                <Button contentKey="cta_21" className="px-8 py-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"> Load More Deals </Button>
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
                    <Button contentKey="cta_22" className="absolute right-2 top-2 bottom-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors" type="submit"> Subscribe </Button>
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
