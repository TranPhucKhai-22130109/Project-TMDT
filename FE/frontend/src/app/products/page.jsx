"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Facebook } from "lucide-react";
import { Flame } from "lucide-react";
import { Input } from "@/components/Input";
import { Instagram } from "lucide-react";
import NextLink from 'next/link';
import { Link } from "@/components/Link";
import { Menu } from "lucide-react";
import { Moon } from "lucide-react";
import { Plus } from "lucide-react";
import { Search } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import { Sun } from "lucide-react";
import { Text } from "@/components/Text";
import { Twitter } from "lucide-react";
import { User } from "lucide-react";
import { X } from "lucide-react";
import { Zap } from "lucide-react";
import { getProducts } from "@/services/productService";
export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Get products error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <>
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 transition-colors duration-300">
          {/* TOP BAR */}
          <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold py-2 text-center relative z-50">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <Text className="hidden sm:inline">
                {" "}
                ⚡ FLASH SALE: Extra 20% OFF Everything! Code: BLITZ20{" "}
              </Text>
              <Text className="sm:hidden"> ⚡ Extra 20% OFF: BLITZ20 </Text>
              <div className="flex items-center space-x-4">
                <Link className="hover:underline" href="deals.html">
                  {" "}
                  View Deals{" "}
                </Link>
                <Text className="hidden sm:inline"> | </Text>
                <Link
                  variant="inline"
                  className="hidden sm:inline hover:underline"
                  href="contact.html"
                >
                  {" "}
                  Help{" "}
                </Link>
              </div>
            </div>
          </div>
          {/* NAV BAR */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
              {/* Mobile Menu Button + Logo */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(true);
                  }}
                  className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
                {/* Logo */}
                <Link
                  className="flex-shrink-0 flex items-center gap-2 group"
                  href="index.html"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-500 rounded-lg flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-red-500/50">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <Text
                    variant="italic"
                    className="text-2xl font-black tracking-tighter italic text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-orange-500 transition-all"
                  >
                    {" "}
                    BLITZ{" "}
                  </Text>
                </Link>
              </div>
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                <Link
                  className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                  href="index.html"
                >
                  {" "}
                  Home{" "}
                </Link>
                <Link
                  className="text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors flex items-center gap-1"
                  href="deals.html"
                >
                  <Flame className="w-4 h-4" />
                  Deals{" "}
                </Link>
                <Link
                  className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                  href="products.html"
                >
                  {" "}
                  Shop{" "}
                </Link>
                <Link
                  className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                  href="contact.html"
                >
                  {" "}
                  Support{" "}
                </Link>
              </nav>
              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-md relative mx-4">
                <Input
                  variant="text"
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm"
                  type="text"
                  placeholder="Search for deals..."
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {/* Utility Icons */}
              <div className="flex items-center space-x-3 sm:space-x-6">
                {/* Search Toggle (Mobile) */}
                <Button className="md:hidden p-2 text-gray-600 dark:text-gray-300">
                  <Search className="w-6 h-6" />
                </Button>
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => {
                    setDarkMode(!darkMode);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Sun className="w-5 h-5 hidden dark:block" />
                  <Moon className="w-5 h-5 dark:hidden" />
                </button>
                {/* Account */}
                <Link
                  className="hidden sm:block p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                  href="login.html"
                >
                  <User className="w-6 h-6" />
                </Link>
                {/* Cart */}
                <Link
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors group"
                  href="cart.html"
                >
                  <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
                  <Text
                    variant="bold"
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900"
                  >
                    {" "}
                    2{" "}
                  </Text>
                </Link>
              </div>
            </div>
          </div>
          {/* MOBILE MENU OVERLAY */}
          {mobileMenuOpen && (
            <div
              onClick={() => {
                setMobileMenuOpen(false);
              }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            ></div>
          )}
          {/* MOBILE MENU PANEL */}
          {mobileMenuOpen && (
            <div className="fixed inset-y-0 left-0 z-[70] w-[80%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl lg:hidden border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <Link className="flex items-center gap-2" href="index.html">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-yellow-500 rounded flex items-center justify-center text-white">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <Text
                    variant="italic"
                    className="text-xl font-black tracking-tighter italic text-gray-900 dark:text-white"
                  >
                    {" "}
                    BLITZ{" "}
                  </Text>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Mobile Nav Links */}
              <nav className="p-6 space-y-6">
                <div className="space-y-4">
                  <Link
                    className="block text-lg font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500"
                    href="index.html"
                  >
                    {" "}
                    Home{" "}
                  </Link>
                  <Link
                    className="block text-lg font-bold text-red-600 dark:text-red-500 flex items-center gap-2"
                    href="deals.html"
                  >
                    <Flame className="w-5 h-5" />
                    Today's Deals{" "}
                  </Link>
                  <Link
                    className="block text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
                    href="products.html"
                  >
                    {" "}
                    Shop All{" "}
                  </Link>
                  <Link
                    className="block text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
                    href="cart.html"
                  >
                    {" "}
                    Your Cart (2){" "}
                  </Link>
                  <Link
                    className="block text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
                    href="contact.html"
                  >
                    {" "}
                    Support Center{" "}
                  </Link>
                </div>
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                  <Link
                    contentKey="cta_17"
                    className="block w-full py-3 px-4 text-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    href="login.html"
                  >
                    {" "}
                    Log In{" "}
                  </Link>
                  <Link
                    contentKey="cta_18"
                    className="block w-full py-3 px-4 text-center rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all"
                    href="login.html"
                  >
                    {" "}
                    Sign Up Free{" "}
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </header>
        {/* Categories */}
        <section id="categories" className="py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside
                className={`w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-8 ${
                  filterOpen ? "block" : "hidden lg:block"
                }`}
              >
                {/* Categories */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input
                        variant="text"
                        className="rounded text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        type="checkbox"
                      />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        Electronics (120)
                      </Text>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input
                        variant="text"
                        className="rounded text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        type="checkbox"
                      />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        Fashion (85)
                      </Text>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input
                        variant="text"
                        className="rounded text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        type="checkbox"
                      />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        Home & Living (45)
                      </Text>
                    </label>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider">
                    Price
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input
                        variant="text"
                        className="text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        type="radio"
                        name="price"
                      />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        Under $50
                      </Text>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input
                        variant="text"
                        className="text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        type="radio"
                        name="price"
                      />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        $50 - $100
                      </Text>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input
                        variant="text"
                        className="text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        type="radio"
                        name="price"
                      />
                      <Text className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        $100 - $500
                      </Text>
                    </label>
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider">
                    Discount
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Input
                        variant="text"
                        className="rounded text-red-600 focus:ring-red-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        type="checkbox"
                      />
                      <Text
                        variant="bold"
                        className="text-red-600 font-bold dark:text-red-400"
                      >
                        50% Off or More
                      </Text>
                    </label>
                  </div>
                </div>
              </aside>

              {/* Product Section */}
              <div className="flex-1 min-w-0">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-6">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters & Sort
                  </button>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {loading ? (
                    <p className="text-gray-600 dark:text-gray-300 col-span-full text-center py-10">
                      Loading products...
                    </p>
                  ) : currentProducts.length === 0 ? (
                    <p className="col-span-full text-center py-10 text-gray-500">
                      No products found.
                    </p>
                  ) : (
                    currentProducts.map((product) => (
                      <NextLink
                        key={product.id}
                        href={`/product-detail/${product.id}`}
                        className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                      >
                        {/* IMAGE */}
                        <div className="relative w-full h-56 bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                          <Badge className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                            {product.status || "Product"}
                          </Badge>
                          <img
                            src={product.imageUrl || "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-contain p-5 transition-transform group-hover:scale-105 duration-300"
                          />
                        </div>

                        {/* CONTENT */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 min-h-[40px]">
                            {product.name}
                          </h3>

                          <div className="mt-3 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                            <p>Item No: {product.itemNo}</p>
                            <p>Scale: {product.scale}</p>
                            <p>Marque: {product.marque}</p>
                          </div>

                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <span className="text-lg font-black text-red-600">
                              {product.status}
                            </span>

                            <Button
                              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                              onClick={(e) => e.preventDefault()} // Ngăn chuyển trang khi click nút +
                            >
                              <Plus className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </NextLink>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center gap-2 bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-6 py-3 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                      >
                        ← Prev
                      </button>

                      {/* Hiển thị thông minh: không render hết tất cả trang */}
                      {Array.from(
                        { length: Math.min(totalPages, 7) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 7) {
                            pageNum = i + 1;
                          } else if (currentPage <= 4) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 3) {
                            pageNum = totalPages - 6 + i;
                          } else {
                            pageNum = currentPage - 3 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`min-w-[44px] h-11 flex items-center justify-center rounded-xl font-semibold text-sm transition-all ${
                                currentPage === pageNum
                                  ? "bg-red-600 text-white shadow-md"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-6 py-3 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                      >
                        Next →
                      </button>

                      {/* Hiển thị thông tin tổng */}
                      <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                        Trang {currentPage} / {totalPages}
                      </span>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
              {/* Brand Column */}
              <div className="lg:col-span-4 space-y-6">
                <Link
                  className="flex items-center gap-2 group"
                  href="index.html"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <Text
                    variant="italic"
                    className="text-2xl font-black tracking-tighter italic text-gray-900 dark:text-white"
                  >
                    {" "}
                    BLITZ{" "}
                  </Text>
                </Link>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  The world's fastest growing flash sale platform. Daily deals
                  on tech, fashion, and home goods with unbeatable prices. Don't
                  blink.
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:shadow-md transition-all"
                    href="#"
                  >
                    <Twitter className="w-5 h-5" />
                  </Link>
                  <Link
                    className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:shadow-md transition-all"
                    href="#"
                  >
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link
                    className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 hover:shadow-md transition-all"
                    href="#"
                  >
                    <Instagram className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              {/* Links Column 1 */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  {" "}
                  Shop{" "}
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors flex items-center gap-2"
                      href="deals.html"
                    >
                      <Flame className="w-4 h-4 text-red-500" />
                      Daily Deals{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                      href="products.html"
                    >
                      {" "}
                      Top Categories{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                      href="products.html"
                    >
                      {" "}
                      New Arrivals{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                      href="products.html"
                    >
                      {" "}
                      Clearance{" "}
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Links Column 2 */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  {" "}
                  Support{" "}
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                      href="contact.html"
                    >
                      {" "}
                      Help Center{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                      href="contact.html"
                    >
                      {" "}
                      Return Policy{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                      href="terms.html"
                    >
                      {" "}
                      Terms of Service{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                      href="privacy.html"
                    >
                      {" "}
                      Privacy Policy{" "}
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Newsletter Column */}
              <div className="lg:col-span-4 space-y-6">
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  {" "}
                  Don't Miss Out{" "}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Join 1M+ shoppers getting exclusive early access to flash
                  sales.
                </p>
                <form className="space-y-4">
                  <div className="relative">
                    <Input
                      variant="text"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all dark:text-white"
                      type="email"
                      placeholder="Enter your email"
                    />
                    <Button
                      contentKey="cta_25"
                      className="absolute right-2 top-2 bottom-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors"
                      type="submit"
                    >
                      {" "}
                      Subscribe{" "}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    By subscribing, you agree to our
                    <Link
                      className="underline hover:text-gray-900 dark:hover:text-white"
                      href="terms.html"
                    >
                      {" "}
                      Terms{" "}
                    </Link>
                    and
                    <Link
                      className="underline hover:text-gray-900 dark:hover:text-white"
                      href="privacy.html"
                    >
                      {" "}
                      Privacy Policy{" "}
                    </Link>
                    .
                  </p>
                </form>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {" "}
                © 2026 Blitz Commerce. All rights reserved.{" "}
              </p>
            </div>
          </div>
        </footer>
        {/* Script Init */}
      </>
    </div>
  );
}
