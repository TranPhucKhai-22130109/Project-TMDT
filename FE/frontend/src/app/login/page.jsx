'use client';

import { useState, useEffect } from 'react';
import { Apple } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { Chrome } from 'lucide-react';
import { Input } from '@/components/Input';
import { Lock } from 'lucide-react';
import { Mail } from 'lucide-react';
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
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen flex items-center justify-center p-4">
      <>
        {/* Form */}
        <form className="border border-gray-300 rounded-xl dark:border-gray-700 p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300"> Email Address </label>
            <div className="relative">
              <Input variant="text" className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all dark:text-white" type="email" placeholder="you@example.com" id="email" />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300"> Password </label>
              <a href="#" className="text-sm text-red-600 dark:text-red-500 hover:underline"> Forgot? </a>
            </div>
            <div className="relative">
              <Input variant="text" className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all dark:text-white" type="password" placeholder="••••••••" id="password" />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
             Sign In 
            <ArrowRight className="w-5 h-5" />
          </button>
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500"> Or continue with </span>
            </div>
          </div>
          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button contentKey="cta_2" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white" type="button"><Chrome className="w-5 h-5 text-red-500" />
             Google </Button>
            <Button contentKey="cta_3" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white" type="button"><Apple className="w-5 h-5 text-gray-900 dark:text-white" />
             Apple </Button>
          </div>
        </form>
        {/* Script Init */}
      </>
    </div>
  );
}
