import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck, HeadphonesIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Features Bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-zinc-700" />
            <div>
              <h4 className="font-semibold text-sm">Free Shipping</h4>
              <p className="text-xs text-zinc-500">For all orders $200</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="w-8 h-8 text-zinc-700" />
            <div>
              <h4 className="font-semibold text-sm">1 & 1 Returns</h4>
              <p className="text-xs text-zinc-500">Cancellation after 1 day</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-zinc-700" />
            <div>
              <h4 className="font-semibold text-sm">100% Secure Payments</h4>
              <p className="text-xs text-zinc-500">Guarantee secure payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HeadphonesIcon className="w-8 h-8 text-zinc-700" />
            <div>
              <h4 className="font-semibold text-sm">24/7 Dedicated Support</h4>
              <p className="text-xs text-zinc-500">Anywhere & anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">Help & Support</h3>
          <ul className="space-y-3 text-sm text-zinc-600">
            <li>685 Market Street, Las Vegas, LA 95820, United States.</li>
            <li>(+099) 532-786-9843</li>
            <li>support@example.com</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Account</h3>
          <ul className="space-y-3 text-sm text-zinc-600">
            <li><Link href="#" className="hover:text-blue-600">Login / Register</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Cart</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Wishlist</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Shop</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Link</h3>
          <ul className="space-y-3 text-sm text-zinc-600">
            <li><Link href="#" className="hover:text-blue-600">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Refund Policy</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Terms of Use</Link></li>
            <li><Link href="#" className="hover:text-blue-600">FAQ's</Link></li>
            <li><Link href="#" className="hover:text-blue-600">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Download App</h3>
          <p className="text-sm text-zinc-600 mb-4">Get started in seconds - it's fast, free, and easy!</p>
          <div className="flex flex-col gap-3">
            <button className="bg-zinc-900 text-white rounded-md py-2 px-4 flex items-center justify-center gap-2 hover:bg-zinc-800 transition">
              <span>Download on the App Store</span>
            </button>
            <button className="border border-zinc-300 text-zinc-900 rounded-md py-2 px-4 flex items-center justify-center gap-2 hover:bg-zinc-50 transition">
              <span>Get it on Google Play</span>
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-zinc-50 py-4 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500">
          <p>© 2026. All rights reserved by Pimjo.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span>We Accept:</span>
            {/* Payment icons placeholder */}
            <div className="flex gap-1">
              <div className="w-8 h-5 bg-zinc-200 rounded"></div>
              <div className="w-8 h-5 bg-zinc-200 rounded"></div>
              <div className="w-8 h-5 bg-zinc-200 rounded"></div>
              <div className="w-8 h-5 bg-zinc-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
