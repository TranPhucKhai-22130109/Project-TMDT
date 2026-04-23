'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { Button } from '@/components/Button';
import { CheckCircle } from 'lucide-react';
import { CreditCard } from 'lucide-react';
import { Download } from 'lucide-react';
import { Eye } from 'lucide-react';
import { Facebook } from 'lucide-react';
import { Flame } from 'lucide-react';
import { Input } from '@/components/Input';
import { Instagram } from 'lucide-react';
import { Link } from '@/components/Link';
import { ListChecks } from 'lucide-react';
import { Lock } from 'lucide-react';
import { Mail } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Megaphone } from 'lucide-react';
import { Menu } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Package } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { ScanEye } from 'lucide-react';
import { Search } from 'lucide-react';
import { Server } from 'lucide-react';
import { Shield } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Text } from '@/components/Text';
import { Trash2 } from 'lucide-react';
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
                  <Link contentKey="cta_52" className="block w-full py-3 px-4 text-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" href="login.html"> Log In </Link>
                  <Link contentKey="cta_53" className="block w-full py-3 px-4 text-center rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all" href="login.html"> Sign Up Free </Link>
                </div>
              </nav>
            </div>
          )}
        </header>
        <main className="py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Page Header */}
            <div className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-4"> Privacy Policy </h1>
              <p className="text-gray-500 dark:text-gray-400"> Last Updated: January 1, 2026 </p>
            </div>
            {/* Introduction */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-6 lg:p-8 rounded-2xl mb-8 shadow-lg">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold mb-2"> Your Privacy Matters </h2>
                  <p className="text-white/90 leading-relaxed">
                     At Blitz, we're committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data when you shop with us. 
                  </p>
                </div>
              </div>
            </div>
            {/* Quick Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-red-500" />
                 Quick Summary 
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <Text> We never sell your data </Text>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <Text> SSL encrypted checkout </Text>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <Text> Opt-out of marketing anytime </Text>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <Text> Request data deletion </Text>
                </div>
              </div>
            </div>
            {/* Privacy Sections */}
            <div className="space-y-6">
              {/* Section 1 */}
              <article className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <Text className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-black text-lg"> 1 </Text>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white"> Information We Collect </h2>
                </div>
                <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                     We collect information you provide directly to us when you interact with our platform: 
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-red-500" />
                         Account Information 
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li> • Name and email address </li>
                        <li> • Phone number </li>
                        <li> • Password (encrypted) </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                         Shipping Details 
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li> • Street address </li>
                        <li> • City, state, postal code </li>
                        <li> • Delivery preferences </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-red-500" />
                         Payment Information 
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li> • Card details (via secure processor) </li>
                        <li> • Billing address </li>
                        <li> • Transaction history </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-500" />
                         Usage Data 
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li> • Browsing history on our site </li>
                        <li> • Device and browser info </li>
                        <li> • IP address </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
              {/* Section 2 */}
              <article className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <Text className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-black text-lg"> 2 </Text>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white"> How We Use Your Information </h2>
                </div>
                <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                     We use the information we collect to provide and improve our services: 
                  </p>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <Package className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white"> Order Fulfillment </h4>
                        <p className="text-sm">
                           Process payments, ship products, and provide order tracking 
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <Mail className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white"> Communications </h4>
                        <p className="text-sm">
                           Send order confirmations, shipping updates, and respond to inquiries 
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <Sparkles className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white"> Personalization </h4>
                        <p className="text-sm"> Recommend products and deals tailored to your interests </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <Megaphone className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white"> Marketing </h4>
                        <p className="text-sm">
                           Send promotional emails about flash sales (you can opt-out anytime) 
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              {/* Section 3 */}
              <article className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <Text className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-black text-lg"> 3 </Text>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white"> Cookies & Tracking </h2>
                </div>
                <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                     We use cookies and similar technologies to enhance your shopping experience: 
                  </p>
                  <table className="w-full mt-4 text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 font-semibold text-gray-900 dark:text-white"> Cookie Type </th>
                        <th className="text-left py-3 font-semibold text-gray-900 dark:text-white"> Purpose </th>
                        <th className="text-left py-3 font-semibold text-gray-900 dark:text-white"> Duration </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="py-3 font-medium"> Essential </td>
                        <td className="py-3"> Cart, authentication, security </td>
                        <td className="py-3"> Session </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium"> Preferences </td>
                        <td className="py-3"> Theme, language, region </td>
                        <td className="py-3"> 1 year </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium"> Analytics </td>
                        <td className="py-3"> Site usage and performance </td>
                        <td className="py-3"> 2 years </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium"> Marketing </td>
                        <td className="py-3"> Personalized ads and offers </td>
                        <td className="py-3"> 90 days </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-sm bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mt-4">
                    <strong> Manage your preferences: </strong>
                     You can control cookies through your browser settings. Disabling essential cookies may affect site functionality. 
                  </p>
                </div>
              </article>
              {/* Section 4 */}
              <article className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <Text className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-black text-lg"> 4 </Text>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white"> Data Security </h2>
                </div>
                <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                     We implement robust security measures to protect your personal data: 
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1"> Encryption </h4>
                      <p className="text-xs"> 256-bit SSL encryption for all transactions </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Server className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1"> Secure Storage </h4>
                      <p className="text-xs"> Data stored on protected, monitored servers </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ScanEye className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1"> Monitoring </h4>
                      <p className="text-xs"> 24/7 fraud detection and prevention </p>
                    </div>
                  </div>
                </div>
              </article>
              {/* Section 5 */}
              <article className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <Text className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-black text-lg"> 5 </Text>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white"> Your Rights </h2>
                </div>
                <div className="pl-14 space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                     You have the following rights regarding your personal data: 
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white"> Access </h4>
                        <p className="text-sm"> Request a copy of your personal data </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Pencil className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white"> Correction </h4>
                        <p className="text-sm"> Update or correct inaccurate information </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Trash2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white"> Deletion </h4>
                        <p className="text-sm"> Request deletion of your account and data </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white"> Portability </h4>
                        <p className="text-sm"> Export your data in a portable format </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            {/* Contact CTA */}
            <div className="mt-12 bg-gray-100 dark:bg-gray-800 p-6 lg:p-8 rounded-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2"> Privacy Questions? </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                     Contact our Data Protection Officer at 
                    <Link className="text-red-600 dark:text-red-400 hover:underline font-medium" href="mailto:privacy@blitzecom.com"> privacy@blitzecom.com </Link>
                  </p>
                </div>
                <Link variant="inline" contentKey="cta_54" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap" href="contact.html"><MessageCircle className="w-5 h-5" />
                 Contact Support </Link>
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
                    <Button contentKey="cta_55" className="absolute right-2 top-2 bottom-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors" type="submit"> Subscribe </Button>
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
