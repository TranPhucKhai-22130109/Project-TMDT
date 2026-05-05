'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { ChevronDown } from 'lucide-react';
import { Facebook } from 'lucide-react';
import { Flame } from 'lucide-react';
import { Input } from '@/components/Input';
import { Instagram } from 'lucide-react';
import { Link } from '@/components/Link';
import { Mail } from 'lucide-react';
import { Menu } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Package } from 'lucide-react';
import { Phone } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import { Search } from 'lucide-react';
import { Send } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
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
  const [active, setActive] = useState(1);

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
        <main className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-4"> How Can We Help? </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                 Track orders, returns, or technical support. Our team responds within 2 hours. 
              </p>
            </div>
            {/* Support Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              <Link contentKey="cta_22" className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-all text-center" href="#"><div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Package className="w-8 h-8" /></div>
              <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white"> Track Order </h3>
              <p className="text-gray-500 text-sm"> Check shipping status </p></Link>
              <Link contentKey="cta_23" className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-all text-center" href="#"><div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><RefreshCw className="w-8 h-8" /></div>
              <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white"> Returns </h3>
              <p className="text-gray-500 text-sm"> 30-day return policy </p></Link>
              <Link contentKey="cta_24" className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-all text-center" href="#"><div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><ShieldCheck className="w-8 h-8" /></div>
              <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white"> Warranty </h3>
              <p className="text-gray-500 text-sm"> Product protection info </p></Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-8"> Send Us a Message </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> Name </label>
                      <Input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> Email </label>
                      <Input className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all" type="email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> Subject </label>
                    <select className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all">
                      <option> Order Status </option>
                      <option> Product Inquiry </option>
                      <option> Return Request </option>
                      <option> Other </option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> Message </label>
                    <textarea rows={5} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"></textarea>
                  </div>
                  <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                     Send Message 
                  </button>
                </form>
              </div>
              {/* FAQ & Info */}
              <div className="space-y-12">
                {/* Direct Info */}
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 text-center md:text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-red-600 shadow-sm flex-shrink-0"><Phone className="w-6 h-6" /></div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white"> Call Us </h4>
                        <p className="text-gray-500"> +1 (800) 555-0123 </p>
                        <Text variant="bold" className="text-xs text-green-500 font-bold"> Available 24/7 </Text>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-red-600 shadow-sm flex-shrink-0"><Mail className="w-6 h-6" /></div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white"> Email Us </h4>
                        <p className="text-gray-500"> support@blitzecom.com </p>
                        <Text variant="bold" className="text-xs text-gray-400 font-bold"> Response: 5h </Text>
                      </div>
                    </div>
                  </div>
                </div>
                {/* FAQ Accordion */}
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-6"> Frequently Asked </h2>
                  <div className="space-y-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <button onClick={() => { setActive(active === 1 ? null : 1) }} className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 text-left font-bold text-gray-900 dark:text-white">
                        <Text> How fast is shipping? </Text>
                        <ChevronDown className="w-5 h-5 transition-transform" />
                      </button>
                      {active === 1 && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm">
                           Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout. 
                        </div>
                      )}
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <button onClick={() => { setActive(active === 2 ? null : 2) }} className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 text-left font-bold text-gray-900 dark:text-white">
                        <Text> Can I cancel my order? </Text>
                        <ChevronDown className="w-5 h-5 transition-transform" />
                      </button>
                      {active === 2 && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm">
                           Orders can be cancelled within 1 hour of placement. After that, they enter processing and cannot be cancelled. 
                        </div>
                      )}
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <button onClick={() => { setActive(active === 3 ? null : 3) }} className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 text-left font-bold text-gray-900 dark:text-white">
                        <Text> Do you offer international shipping? </Text>
                        <ChevronDown className="w-5 h-5 transition-transform" />
                      </button>
                      {active === 3 && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm">
                           Yes! We ship to over 50 countries worldwide. Shipping rates are calculated at checkout. 
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
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
                    <Button contentKey="cta_29" className="absolute right-2 top-2 bottom-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors" type="submit"> Subscribe </Button>
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
