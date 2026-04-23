'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Facebook } from 'lucide-react';
import { Flame } from 'lucide-react';
import { Input } from '@/components/Input';
import { Instagram } from 'lucide-react';
import { Link } from '@/components/Link';
import { Menu } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Search } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Text } from '@/components/Text';
import { Twitter } from 'lucide-react';
import { User } from 'lucide-react';
import { X } from 'lucide-react';
import { Zap } from 'lucide-react';
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
                  <Link contentKey="cta_33" className="block w-full py-3 px-4 text-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" href="login.html"> Log In </Link>
                  <Link contentKey="cta_34" className="block w-full py-3 px-4 text-center rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all" href="login.html"> Sign Up Free </Link>
                </div>
              </nav>
            </div>
          )}
        </header>
        <main className="py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Page Header */}
            <div className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-4"> Terms of Service </h1>
              <p className="text-gray-500 dark:text-gray-400"> Last Updated: January 1, 2026 </p>
            </div>
            {/* Introduction */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-6 lg:p-8 rounded-2xl mb-8 shadow-lg">
              <p className="text-lg font-medium leading-relaxed">
                 Welcome to Blitz Ecommerce. By accessing or using our website, mobile application, or any services provided by Blitz, you agree to be bound by these Terms of Service. Please read them carefully. 
              </p>
            </div>
            {/* Terms Sections */}
            <div className="space-y-6">
              {/* Section 1 */}
              <article className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <Text className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-black text-lg"> 1 </Text>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white"> General Conditions </h2>
                </div>
                <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                     We reserve the right to refuse service to anyone for any reason at any time. By using our services, you acknowledge and agree that: 
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                       Your content (excluding credit card information) may be transferred unencrypted over various networks 
                    </li>
                    <li>
                       You will not use our products for any illegal or unauthorized purpose 
                    </li>
                    <li>
                       You are responsible for maintaining the confidentiality of your account credentials 
                    </li>
                    <li> You must be at least 18 years of age to make purchases </li>
                  </ul>
                </div>
              </article>
              {/* Section 2 */}
              <article className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <Text className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-black text-lg"> 2 </Text>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white"> Products & Pricing </h2>
                </div>
                <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                     All prices displayed on our platform are in USD unless otherwise stated. Please note: 
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2"> Price Changes </h4>
                      <p className="text-sm">
                         Prices are subject to change without notice. Flash sale prices are time-limited and may expire. 
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2"> Product Availability </h4>
                      <p className="text-sm">
                         We reserve the right to modify or discontinue any product without notice at any time. 
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2"> Product Descriptions </h4>
                      <p className="text-sm">
                         We strive for accuracy but do not guarantee that descriptions are error-free or complete. 
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2"> Color Accuracy </h4>
                      <p className="text-sm">
                         Actual product colors may vary slightly from images due to display settings. 
                      </p>
                    </div>
                  </div>
                </div>
              </article>
              {/* Section 3 */}
              <article className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <Text className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-black text-lg"> 3 </Text>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white"> Orders & Billing </h2>
                </div>
                <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                     We reserve the right to refuse or cancel any order at our sole discretion. This includes but is not limited to: 
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                       Orders that appear to be placed by dealers, resellers, or distributors 
                    </li>
                    <li>
                       Multiple orders placed by the same person or household exceeding quantity limits 
                    </li>
                    <li>
                       Orders where billing or shipping information cannot be verified 
                    </li>
                    <li> Suspected fraudulent transactions </li>
                  </ul>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-xl mt-4">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      <strong> Note: </strong>
                       If your order is cancelled, you will be notified via email and receive a full refund to your original payment method. 
                    </p>
                  </div>
                </div>
              </article>
              {/* Section 4 */}
              <article className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <Text className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-black text-lg"> 4 </Text>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white"> Third-Party Links </h2>
                </div>
                <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                     Our platform may contain links to third-party websites or services that are not owned or controlled by Blitz. We are not responsible for: 
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                       The content, privacy policies, or practices of third-party sites 
                    </li>
                    <li>
                       Any damage or loss caused by third-party content or services 
                    </li>
                    <li>
                       The accuracy or reliability of information on linked websites 
                    </li>
                  </ul>
                  <p className="mt-4">
                     We encourage you to review the terms and privacy policies of any third-party sites you visit. 
                  </p>
                </div>
              </article>
              {/* Section 5 */}
              <article className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <Text className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-black text-lg"> 5 </Text>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white"> Returns & Refunds </h2>
                </div>
                <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                    <Text> 30-Day Return Policy </Text>
                  </div>
                  <p>
                     We want you to be completely satisfied with your purchase. If you're not happy, here's what you need to know: 
                  </p>
                  <dl className="mt-4 space-y-4">
                    <div className="flex gap-4">
                      <dt className="font-semibold text-gray-900 dark:text-white min-w-[120px]"> Timeframe </dt>
                      <dd> Returns must be initiated within 30 days of delivery </dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="font-semibold text-gray-900 dark:text-white min-w-[120px]"> Condition </dt>
                      <dd>
                         Items must be unused, in original packaging, with all tags attached 
                      </dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="font-semibold text-gray-900 dark:text-white min-w-[120px]"> Process </dt>
                      <dd>
                         Contact our support team to receive a prepaid return label 
                      </dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="font-semibold text-gray-900 dark:text-white min-w-[120px]"> Refund </dt>
                      <dd>
                         Refunds are processed within 5-7 business days of receiving the return 
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            </div>
            {/* Contact CTA */}
            <div className="mt-12 bg-gray-100 dark:bg-gray-800 p-6 lg:p-8 rounded-2xl text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2"> Questions about our terms? </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4"> Our support team is here to help clarify any concerns. </p>
              <Link variant="inline" contentKey="cta_35" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors" href="contact.html"><MessageCircle className="w-5 h-5" />
               Contact Support </Link>
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
                    <Button contentKey="cta_36" className="absolute right-2 top-2 bottom-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors" type="submit"> Subscribe </Button>
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
