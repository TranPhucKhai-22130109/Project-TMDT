'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { CreditCard } from 'lucide-react';
import { Flame } from 'lucide-react';
import { Image } from '@/components/Image';
import { Input } from '@/components/Input';
import { Link } from '@/components/Link';
import { Menu } from 'lucide-react';
import { Moon } from 'lucide-react';
import { Search } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Text } from '@/components/Text';
import { User } from 'lucide-react';
import { X } from 'lucide-react';
import { Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [step, setStep] = useState(1);

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
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Checkout Steps */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress */}
              <div className="flex items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold"> 1 </div>
                  <Text variant="bold" className="font-bold text-gray-900 dark:text-white"> Shipping </Text>
                </div>
                <div className={`h-1 w-16 mx-4 rounded-full transition-colors ${`${step > 1 ? 'bg-red-600' : ''} ${step <= 1 ? 'bg-gray-200 dark:bg-gray-700' : ''}`}`}></div>
                <div className={`flex items-center gap-2 opacity-50 ${`${step >= 2 ? 'opacity-100' : ''}`}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${`${step >= 2 ? 'bg-red-600 text-white' : ''} ${step < 2 ? 'bg-gray-200 dark:bg-gray-700' : ''}`}`}> 2 </div>
                  <Text variant="bold" className="font-bold"> Payment </Text>
                </div>
              </div>
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6"> Contact Information </h2>
                  <form onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> First Name </label>
                        <Input className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" type="text" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> Last Name </label>
                        <Input className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" type="text" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> Address </label>
                      <Input className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" type="text" />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2 col-span-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> City </label>
                        <Input className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" type="text" />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> State </label>
                        <select className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                          <option> CA </option>
                          <option> NY </option>
                          <option> TX </option>
                        </select>
                      </div>
                      <div className="space-y-2 col-span-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> ZIP </label>
                        <Input className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" type="text" />
                      </div>
                    </div>
                    <Button contentKey="cta_8" className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl mt-4 hover:opacity-90 transition-opacity" type="submit"> Continue to Payment </Button>
                  </form>
                </div>
              )}
              {/* Step 2: Payment */}
              {step === 2 && (
                <div style={{ display: "none" }} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6"> Payment Method </h2>
                  <div className="space-y-4 mb-6">
                    <label className="flex items-center gap-4 p-4 border border-red-500 rounded-xl bg-red-50 dark:bg-red-900/10 cursor-pointer">
                      <Input variant="text" className="text-red-600 focus:ring-red-500" type="radio" name="payment" />
                      <Text variant="bold" className="font-bold flex-1 text-gray-900 dark:text-white"> Credit Card </Text>
                      <div className="flex gap-2 text-gray-500"><CreditCard className="w-5 h-5" /></div>
                    </label>
                    <label className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
                      <Input variant="text" className="text-red-600 focus:ring-red-500" type="radio" name="payment" />
                      <Text variant="bold" className="font-bold flex-1 text-gray-900 dark:text-white"> PayPal </Text>
                    </label>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> Card Number </label>
                      <div className="relative">
                        <Input className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" type="text" placeholder="0000 0000 0000 0000" />
                        <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> Expiry </label>
                        <Input className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" type="text" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300"> CVC </label>
                        <Input className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" type="text" placeholder="123" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => { setStep(1) }} className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl hover:opacity-90"> Back </button>
                    <button className="flex-[2] py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:scale-[1.02] transform transition-all"> Pay $288.80 </button>
                  </div>
                </div>
              )}
            </div>
            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sticky top-8">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4"> In Your Bag </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg overflow-hidden relative">
                      <Text className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"> 1 </Text>
                      <Image variant="cover" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white"> Nike Air Max </h4>
                      <p className="text-xs text-gray-500"> Size: 10 </p>
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white"> $139.30 </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg overflow-hidden relative">
                      <Text className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"> 1 </Text>
                      <Image variant="cover" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white"> Sony Headphones </h4>
                      <p className="text-xs text-gray-500"> Silver </p>
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white"> $149.50 </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <Text className="text-gray-500"> Subtotal </Text>
                    <Text className="text-gray-900 dark:text-white"> $498.00 </Text>
                  </div>
                  <div className="flex justify-between text-sm text-red-600 font-bold">
                    <Text> Discount </Text>
                    <Text> -$209.20 </Text>
                  </div>
                  <div className="flex justify-between text-sm">
                    <Text className="text-gray-500"> Shipping </Text>
                    <Text className="text-gray-900 dark:text-white"> Free </Text>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Text variant="bold" className="font-bold text-lg text-gray-900 dark:text-white"> Total </Text>
                    <Text className="font-black text-2xl text-gray-900 dark:text-white"> $288.80 </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Script Init */}
      </>
    </div>
  );
}
