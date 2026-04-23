'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Armchair } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Check } from 'lucide-react';
import { Facebook } from 'lucide-react';
import { Flame } from 'lucide-react';
import { Gamepad2 } from 'lucide-react';
import { Gift } from 'lucide-react';
import { Image } from '@/components/Image';
import { Input } from '@/components/Input';
import { Instagram } from 'lucide-react';
import { Link } from '@/components/Link';
import { Menu } from 'lucide-react';
import { Monitor } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Search } from 'lucide-react';
import { Shirt } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { Smartphone } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Text } from '@/components/Text';
import { Timer } from 'lucide-react';
import { Twitter } from 'lucide-react';
import { User } from 'lucide-react';
import { X } from 'lucide-react';
import { Zap } from 'lucide-react';


export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState(7200);
  const [hours, setHours] = useState("02");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

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
                  <Link contentKey="cta_26" className="block w-full py-3 px-4 text-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" href="login.html"> Log In </Link>
                  <Link contentKey="cta_27" className="block w-full py-3 px-4 text-center rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all" href="login.html"> Sign Up Free </Link>
                </div>
              </nav>
            </div>
          )}
        </header>
        {/* Hero Section */}
        <section id="hero" className="relative py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-white dark:bg-gray-900"></div>
            <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-red-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-8 text-center lg:text-left">
                <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full font-bold text-sm uppercase tracking-wider animate-pulse"><Timer className="w-4 h-4" />
                 Ending Soon </Badge>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none text-gray-900 dark:text-white">
                   FLASH SALE 
                  <br />
                  <Text className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500"> 50% OFF </Text>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
                   Get massive discounts on premium tech, fashion, and home goods. Prices drop every hour. Don't miss out! 
                </p>
                {/* Countdown Timer */}
                <div className="flex justify-center lg:justify-start gap-4">
                  <div className="flex flex-col items-center p-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl w-24 shadow-xl">
                    <Text className="text-4xl font-black font-mono"> 02 </Text>
                    <Text variant="bold" className="text-xs uppercase font-bold tracking-widest opacity-80"> Hrs </Text>
                  </div>
                  <div className="text-4xl font-black self-start mt-2 text-gray-400"> : </div>
                  <div className="flex flex-col items-center p-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl w-24 shadow-xl">
                    <Text className="text-4xl font-black font-mono"> 00 </Text>
                    <Text variant="bold" className="text-xs uppercase font-bold tracking-widest opacity-80"> Mins </Text>
                  </div>
                  <div className="text-4xl font-black self-start mt-2 text-gray-400"> : </div>
                  <div className="flex flex-col items-center p-4 bg-red-600 text-white rounded-2xl w-24 shadow-xl shadow-red-500/30 animate-pulse">
                    <Text className="text-4xl font-black font-mono"> 00 </Text>
                    <Text variant="bold" className="text-xs uppercase font-bold tracking-widest opacity-80"> Secs </Text>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                  <NextLink href="/deals" className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-red-500/30 transform hover:scale-105 transition-all flex items-center justify-center gap-2"> Shop Now <ArrowRight className="w-5 h-5" /></NextLink>
                  <Link contentKey="cta_29" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 text-lg font-bold rounded-xl transition-all flex items-center justify-center" href="products.html"> View Categories </Link>
                </div>
              </div>
              {/* Hero Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-yellow-500 rounded-[3rem] transform rotate-6 opacity-20 blur-xl group-hover:rotate-12 transition-transform duration-700"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl p-8 transform group-hover:-translate-y-2 transition-transform duration-500 border border-gray-100 dark:border-gray-700">
                  <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg z-20"> -40% OFF </div>
                  <Image className="w-full h-auto rounded-3xl transform -rotate-12 hover:rotate-0 transition-all duration-500 scale-110 drop-shadow-2xl" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" alt="Flash Sale Sneaker" />
                  <div className="absolute bottom-6 right-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl flex flex-col items-center animate-bounce z-20">
                    <Text variant="bold" className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase"> Only </Text>
                    <Text className="text-2xl font-black text-red-600"> $129 </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Deal of the Day */}
        <section id="deal_of_the_day" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter"> Deal of the Day </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2"> Highest discount, limited stock. Expires at midnight. </p>
              </div>
              <Link className="text-red-600 font-bold hover:underline flex items-center gap-1" href="deals.html"> View All Deals 
              <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-16 flex flex-col justify-center space-y-6">
                  <Badge className="inline-block bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full font-bold text-sm mb-4 self-start"> ⭐ Top Rated </Badge>
                  <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white"> Sony WH-1000XM5 Wireless Headphones </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                     Industry-leading noise cancellation, exceptional sound quality, and crystal clear hands-free calling. 
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="text-4xl font-black text-red-600"> $298 </div>
                    <div className="text-xl text-gray-400 line-through font-bold"> $399 </div>
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg font-bold"> SAVE $101 </div>
                  </div>
                  {/* Stock Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <Text className="text-gray-900 dark:text-white"> Already Sold: 85% </Text>
                      <Text className="text-red-600"> Only 14 Left! </Text>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 w-[85%] rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Link variant="inline" contentKey="cta_30" className="inline-flex w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity justify-center gap-2" href="product-detail.html"><ShoppingCart className="w-5 h-5" />
                     Add to Cart </Link>
                  </div>
                </div>
                <div className="relative bg-gray-100 dark:bg-gray-700/50 min-h-[400px]">
                  <Image variant="cover" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Headphones" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-black/20 lg:to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Shop By Category */}
        <section id="shop_by_category" className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl lg:text-4xl font-black text-center text-gray-900 dark:text-white uppercase italic tracking-tighter mb-16"> Shop by Category </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* Category 1 */}
              <NextLink href="/products" className="group flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-red-500/20"><div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform"><Smartphone className="w-8 h-8" /></div><h3 className="font-bold text-gray-900 dark:text-white"> Phones </h3><Text className="text-xs text-gray-500 mt-1"> 120+ Deals </Text></NextLink>
              {/* Category 2 */}
              <NextLink href="/products" className="group flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-red-500/20"><div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform"><Monitor className="w-8 h-8" /></div><h3 className="font-bold text-gray-900 dark:text-white"> Computing </h3><Text className="text-xs text-gray-500 mt-1"> 85 Deals </Text></NextLink>
              {/* Category 3 */}
              <NextLink href="/products" className="group flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-red-500/20"><div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4 group-hover:scale-110 transition-transform"><Shirt className="w-8 h-8" /></div><h3 className="font-bold text-gray-900 dark:text-white"> Fashion </h3><Text className="text-xs text-gray-500 mt-1"> 300+ Deals </Text></NextLink>
              {/* Category 4 */}
              <NextLink href="/products" className="group flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-red-500/20"><div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform"><Armchair className="w-8 h-8" /></div><h3 className="font-bold text-gray-900 dark:text-white"> Home </h3><Text className="text-xs text-gray-500 mt-1"> 50+ Deals </Text></NextLink>
              {/* Category 5 */}
              <NextLink href="/products" className="group flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-red-500/20"><div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 group-hover:scale-110 transition-transform"><Gamepad2 className="w-8 h-8" /></div><h3 className="font-bold text-gray-900 dark:text-white"> Gaming </h3><Text className="text-xs text-gray-500 mt-1"> 45 Deals </Text></NextLink>
              {/* Category 6 */}
              <NextLink href="/products" className="group flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-red-500/20"><div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4 group-hover:scale-110 transition-transform"><Gift className="w-8 h-8" /></div><h3 className="font-bold text-gray-900 dark:text-white"> Clearance </h3><Text className="text-xs text-gray-500 mt-1"> Last Chance </Text></NextLink>
            </div>
          </div>
        </section>
        {/* Trending Right Now */}
        <section id="trending_right_now" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl lg:text-4xl font-black text-center text-gray-900 dark:text-white uppercase italic tracking-tighter mb-12"> Trending Right Now </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Product Card 1 */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                <Badge className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10"> -30% </Badge>
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Link className="block w-full h-full" href="product-detail.html"><Image variant="cover" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" /></Link>
                  {/* Quick Add Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link contentKey="cta_37" className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-all" href="product-detail.html"> Quick View </Link>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate">
                    <Link className="hover:text-red-600 transition-colors" href="product-detail.html"> Minimalist Analog Watch </Link>
                  </h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <Text className="text-gray-400 line-through text-sm"> $199.00 </Text>
                      <div className="text-xl font-black text-red-600"> $139.30 </div>
                    </div>
                    <Button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Plus className="w-5 h-5" /></Button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center text-xs font-bold text-orange-500">
                    <Flame className="w-3 h-3 mr-1" />
                     Selling fast! 5 sold in last hour 
                  </div>
                </div>
              </div>
              {/* Product Card 2 */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                <Badge className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10"> -50% </Badge>
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Link className="block w-full h-full" href="product-detail.html"><Image variant="cover" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" /></Link>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link contentKey="cta_38" className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-all" href="product-detail.html"> Quick View </Link>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate">
                    <Link className="hover:text-red-600 transition-colors" href="product-detail.html"> Smart Fitness Tracker </Link>
                  </h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <Text className="text-gray-400 line-through text-sm"> $99.00 </Text>
                      <div className="text-xl font-black text-red-600"> $49.50 </div>
                    </div>
                    <Button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Plus className="w-5 h-5" /></Button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center text-xs font-bold text-red-500">
                    <AlertCircle className="w-3 h-3 mr-1" />
                     Only 3 left at this price 
                  </div>
                </div>
              </div>
              {/* Product Card 3 */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                <Badge className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10"> -20% </Badge>
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Link className="block w-full h-full" href="product-detail.html"><Image variant="cover" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" /></Link>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link contentKey="cta_39" className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-all" href="product-detail.html"> Quick View </Link>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate">
                    <Link className="hover:text-red-600 transition-colors" href="product-detail.html"> Modern Smart Watch </Link>
                  </h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <Text className="text-gray-400 line-through text-sm"> $299.00 </Text>
                      <div className="text-xl font-black text-red-600"> $224.25 </div>
                    </div>
                    <Button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Plus className="w-5 h-5" /></Button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center text-xs font-bold text-green-500">
                    <Check className="w-3 h-3 mr-1" />
                     Free Shipping 
                  </div>
                </div>
              </div>
              {/* Product Card 4 */}
              <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                <Badge className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10"> -40% </Badge>
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Link className="block w-full h-full" href="product-detail.html"><Image variant="cover" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" /></Link>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link contentKey="cta_40" className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-all" href="product-detail.html"> Quick View </Link>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate">
                    <Link className="hover:text-red-600 transition-colors" href="product-detail.html"> Nike Air Max Sneakers </Link>
                  </h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <Text className="text-gray-400 line-through text-sm"> $150.00 </Text>
                      <div className="text-xl font-black text-red-600"> $60.00 </div>
                    </div>
                    <Button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"><Plus className="w-5 h-5" /></Button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center text-xs font-bold text-orange-500">
                    <Flame className="w-3 h-3 mr-1" />
                     Hot! 20+ watching 
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
              <Link variant="inline" contentKey="cta_41" className="inline-flex items-center gap-2 px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" href="products.html"> View All Flash Deals 
              <ArrowRight className="w-5 h-5" /></Link>
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
                    <Button contentKey="cta_42" className="absolute right-2 top-2 bottom-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors" type="submit"> Subscribe </Button>
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
