'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { Button } from '@/components/Button';
import { Clock } from 'lucide-react';
import { CreditCard } from 'lucide-react';
import { Facebook } from 'lucide-react';
import { Flame } from 'lucide-react';
import { Image } from '@/components/Image';
import { Input } from '@/components/Input';
import { Instagram } from 'lucide-react';
import { Link } from '@/components/Link';
import { Lock } from 'lucide-react';
import { Menu } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Search } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Text } from '@/components/Text';
import { Trash2 } from 'lucide-react';
import { Twitter } from 'lucide-react';
import { User } from 'lucide-react';
import { X } from 'lucide-react';
import { Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        {/* Your Cart 2 */}
        <section id="your_cart_2" className="py-20">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-8"> Your Cart (2) </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Urgency Banner */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-red-700 dark:text-red-400 font-bold">
                    <Clock className="w-5 h-5" />
                    <Text> Items reserved for 
                    <Text> 05:00 </Text></Text>
                  </div>
                  <Text variant="bold" className="text-xs text-red-600 dark:text-red-500 uppercase font-bold tracking-wider"> Do not delay </Text>
                </div>
                {/* Item 1 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-6 items-center">
                  <Image variant="cover" className="w-24 h-24 object-cover rounded-xl bg-gray-100" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Product" />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white"> Nike Air Max 270 </h3>
                    <p className="text-sm text-gray-500"> Size: US 10 | Color: Black </p>
                    <div className="mt-2 text-red-600 font-bold text-xs uppercase animate-pulse"> Low Stock: Only 3 left </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <Button contentKey="cta_15" className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-l-lg"> - </Button>
                      <Input variant="text" className="w-12 text-center bg-transparent outline-none text-sm" type="text" value="1" />
                      <Button contentKey="cta_16" className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-r-lg"> + </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-xl text-gray-900 dark:text-white"> $139.30 </div>
                      <div className="text-xs text-gray-400 line-through"> $199.00 </div>
                    </div>
                    <Button className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-5 h-5" /></Button>
                  </div>
                </div>
                {/* Item 2 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-6 items-center">
                  <Image variant="cover" className="w-24 h-24 object-cover rounded-xl bg-gray-100" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Product" />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white"> Sony Headphones </h3>
                    <p className="text-sm text-gray-500"> Color: Silver </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <Button contentKey="cta_17" className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-l-lg"> - </Button>
                      <Input variant="text" className="w-12 text-center bg-transparent outline-none text-sm" type="text" value="1" />
                      <Button contentKey="cta_18" className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-r-lg"> + </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-xl text-gray-900 dark:text-white"> $149.50 </div>
                      <div className="text-xs text-gray-400 line-through"> $299.00 </div>
                    </div>
                    <Button className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-5 h-5" /></Button>
                  </div>
                </div>
              </div>
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 sticky top-32">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase italic"> Order Summary </h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <Text> Subtotal </Text>
                      <Text> $498.00 </Text>
                    </div>
                    <div className="flex justify-between text-red-600 dark:text-red-400 font-bold">
                      <Text> Flash Savings </Text>
                      <Text> -$209.20 </Text>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <Text> Shipping </Text>
                      <Text variant="bold" className="text-green-600 font-bold"> Free </Text>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-end">
                      <Text variant="bold" className="font-bold text-gray-900 dark:text-white"> Total </Text>
                      <Text className="text-3xl font-black text-gray-900 dark:text-white"> $288.80 </Text>
                    </div>
                  </div>
                  {/* Savings Badge */}
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-xl text-center font-bold mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                     You are saving $209.20! 
                  </div>
                  <NextLink href="/checkout" className="block w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold text-center rounded-xl shadow-lg shadow-red-500/30 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"> Secure Checkout <Lock className="w-4 h-4 group-hover:animate-pulse" /></NextLink>
                  <div className="mt-6 flex justify-center gap-4 opacity-50">
                    <CreditCard className="w-6 h-6" />
                    <Image className="h-6 filter grayscale" src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
                  </div>
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
                    <Button contentKey="cta_20" className="absolute right-2 top-2 bottom-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors" type="submit"> Subscribe </Button>
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
