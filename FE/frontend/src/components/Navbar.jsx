"use client";

import { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import {
  Menu,
  Sun,
  Moon,
  Search,
  ShoppingCart,
  User,
  Zap,
  Flame,
  X,
  Trophy,
  ChevronDown,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/cart/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Text } from "@/components/Text";
import {
  getCartItems,
  updateCartItem,
  removeCartItem,
} from "@/services/cartService";
import { getMyProfile } from "@/services/userService";
import { getSearchSuggestions } from "@/services/searchService";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { isAuthenticated, isLoading, username, logout } = useAuth();
  const { cartCount, reloadCartCount } = useCart();

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [drawerItems, setDrawerItems] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [navbarAvatar, setNavbarAvatar] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  const [suggestions, setSuggestions] = useState({
    products: [],
    sellers: [],
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      reloadCartCount();

      // Tải thông tin ảnh đại diện thực tế của user lên thanh Navbar
      getMyProfile()
        .then((data) => {
          if (data) {
            if (data.avatarUrl) {
              setNavbarAvatar(data.avatarUrl);
            }
            if (data.roles) {
              setUserRoles(data.roles);
            }
          }
        })
        .catch((err) => console.error("Lỗi tải avatar trên Navbar:", err));
    } else {
      setNavbarAvatar(null);
      setUserRoles([]);
    }
  }, [isAuthenticated]);

  const openCartDrawer = async () => {
    setCartDrawerOpen(true);

    if (isAuthenticated) {
      try {
        setDrawerLoading(true);
        const data = await getCartItems();
        const list = Array.isArray(data) ? data : data.content || [];
        setDrawerItems(list);
      } catch (error) {
        console.error("Load cart drawer error:", error);
        setDrawerItems([]);
      } finally {
        setDrawerLoading(false);
      }
    } else {
      const savedCart = localStorage.getItem("blitz-cart");
      setDrawerItems(savedCart ? JSON.parse(savedCart) : []);
    }
  };

  const handleIncrease = async (item) => {
    try {
      if (isAuthenticated) {
        await updateCartItem(item.id, item.quantity + 1);

        setDrawerItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        );
      } else {
        const updated = drawerItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );

        setDrawerItems(updated);
        localStorage.setItem("blitz-cart", JSON.stringify(updated));
      }

      reloadCartCount();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;

    try {
      if (isAuthenticated) {
        await updateCartItem(item.id, item.quantity - 1);

        setDrawerItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i,
          ),
        );
      } else {
        const updated = drawerItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i,
        );

        setDrawerItems(updated);
        localStorage.setItem("blitz-cart", JSON.stringify(updated));
      }

      reloadCartCount();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (item) => {
    try {
      if (isAuthenticated) {
        await removeCartItem(item.id);
      }

      const updated = drawerItems.filter((i) => i.id !== item.id);

      setDrawerItems(updated);

      if (!isAuthenticated) {
        localStorage.setItem("blitz-cart", JSON.stringify(updated));
      }

      reloadCartCount();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const keyword = searchKeyword.trim();

    if (!keyword) return;

    router.push(`/products?search=${encodeURIComponent(keyword)}`);

    setShowSuggestions(false);
  };

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const keyword = searchKeyword.trim();

    if (!keyword) {
      setSuggestions({
        products: [],
        sellers: [],
      });

      setShowSuggestions(false);

      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const data = await getSearchSuggestions(keyword);

        setSuggestions(data);

        setShowSuggestions(true);
      } catch (error) {
        console.error(error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchKeyword]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold py-2 text-center">
        <div className="container mx-auto px-4">
          ⚡ FLASH SALE: Giảm giá sốc đến 20% cho hàng ngàn sản phẩm! Mua ngay
          kẻo lỡ! ⚡
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Logo + Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-red-600"
            >
              <Menu className="w-6 h-6" />
            </button>

            <NextLink href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-500 rounded-lg flex items-center justify-center text-white">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <Text
                variant="italic"
                className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white"
              >
                BLITZ
              </Text>
            </NextLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NextLink
              href="/"
              className="text-sm font-bold uppercase tracking-wide hover:text-red-600"
            >
              Trang chủ
            </NextLink>
            <NextLink
              href="/auctions"
              className="text-sm font-bold uppercase tracking-wide text-red-600 flex items-center gap-1"
            >
              <Flame className="w-4 h-4" /> Đấu giá
            </NextLink>
            <NextLink
              href="/products"
              className="text-sm font-bold uppercase tracking-wide hover:text-red-600"
            >
              Cửa hàng
            </NextLink>
            <NextLink
              href="/contact"
              className="text-sm font-bold uppercase tracking-wide hover:text-red-600"
            >
              Hỗ trợ
            </NextLink>
          </nav>

          {/* Search Bar */}
          <div
            ref={searchRef}
            className="hidden md:flex flex-1 max-w-md relative mx-4"
          >
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md relative mx-4"
            >
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm kiếm mô hình xe..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <button type="submit">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </button>
            </form>
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                {/* Products */}
                {suggestions.products?.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 dark:bg-gray-700">
                      SẢN PHẨM
                    </div>

                    {suggestions.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setShowSuggestions(false);

                          router.push(`/product-detail/${product.id}`);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                      >
                        <img
                          src={product.imageUrl || "/placeholder.png"}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />

                        <div>
                          <p className="font-medium text-sm">{product.name}</p>

                          <p className="text-red-600 text-xs">
                            {Number(product.price).toLocaleString("vi-VN")} ₫
                          </p>
                        </div>
                      </button>
                    ))}
                  </>
                )}

                {/* Sellers */}
                {suggestions.sellers?.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 dark:bg-gray-700 border-t">
                      GIAN HÀNG
                    </div>

                    {suggestions.sellers.map((seller) => (
                      <button
                        key={seller.id}
                        onClick={() => {
                          setShowSuggestions(false);

                          router.push(`/profile?sellerId=${seller.id}`);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                      >
                        <img
                          src={seller.avatarUrl || "/default-avatar.png"}
                          alt={seller.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />

                        <div>
                          <p className="font-medium text-sm">
                            {seller.username}
                          </p>

                          <p className="text-xs text-gray-500">Người bán</p>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 dark:hidden" />
            </button>

            {/* Account */}
            <div className="hidden sm:flex items-center gap-4">
              {!isLoading &&
                (isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 transition-colors px-2 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-red-500/80 flex items-center justify-center bg-red-50 dark:bg-gray-800 text-red-600 font-bold shrink-0 shadow-sm">
                        {navbarAvatar ? (
                          <img
                            src={navbarAvatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <span className="font-bold hidden md:inline">
                        {username || "User"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {userDropdownOpen && (
                      <>
                        <div
                          onClick={() => setUserDropdownOpen(false)}
                          className="fixed inset-0 z-[45]"
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-[50]">
                          <NextLink
                            href="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <User className="w-4 h-4 text-indigo-500" />
                            Trang cá nhân
                          </NextLink>
                          {(userRoles.includes("SELLER") ||
                            userRoles.includes("ADMIN")) && (
                            <NextLink
                              href="/dashboard"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Store className="w-4 h-4 text-emerald-500" />
                              Kênh người bán
                            </NextLink>
                          )}
                          <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                          <NextLink
                            href="/auctions/my-won"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            Đấu giá đã thắng
                          </NextLink>

                          {/* --- NÚT LỊCH SỬ ĐẶT HÀNG MỚI ĐƯỢC CHÈN VÀO ĐÂY --- */}
                          <NextLink
                            href="/orders"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              ></path>
                            </svg>
                            Lịch sử đặt hàng
                          </NextLink>
                          {/* ------------------------------------------------ */}

                          <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Đăng xuất
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <NextLink
                      href="/login"
                      className="text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-red-600 transition-colors"
                    >
                      Đăng nhập
                    </NextLink>
                    <NextLink
                      href="/register"
                      className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-sm shadow-red-500/30"
                    >
                      Đăng ký
                    </NextLink>
                  </>
                ))}
            </div>

            {/* Cart */}
            <button
              onClick={openCartDrawer}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-600"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay & Panel */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-y-0 left-0 z-[70] w-[80%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl lg:hidden border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          {/* Mobile Menu Content */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <NextLink href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-yellow-500 rounded flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <Text
                variant="italic"
                className="text-xl font-black tracking-tighter"
              >
                BLITZ
              </Text>
            </NextLink>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {cartDrawerOpen && (
        <div
          onClick={() => setCartDrawerOpen(false)}
          className="fixed inset-0 z-[80] bg-black/40"
        />
      )}

      <div
        className={`fixed top-0 right-0 z-[90] h-full w-[380px] max-w-[90%] bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ${
          cartDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-black">Giỏ hàng</h2>
          <button onClick={() => setCartDrawerOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-150px)]">
          {drawerLoading ? (
            <p className="text-gray-500">Đang tải giỏ hàng...</p>
          ) : drawerItems.length === 0 ? (
            <p className="text-gray-500">Giỏ hàng đang trống</p>
          ) : (
            drawerItems.map((item, index) => {
              const product = item.product || item;
              const price = Number(product.price || 0);
              const quantity = Number(item.quantity || 1);

              return (
                <div
                  key={item.id || index}
                  className="flex gap-3 border-b pb-4"
                >
                  <img
                    src={
                      product.imageUrl || product.image || "/placeholder.png"
                    }
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded-lg bg-gray-100"
                  />

                  <div className="flex-1">
                    <p className="font-bold text-sm line-clamp-2">
                      {product.name}
                    </p>

                    <p className="text-red-600 font-bold mt-1">
                      {(price * quantity).toLocaleString("vi-VN")} ₫
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* quantity */}
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          -
                        </button>

                        <span className="px-3 text-sm font-bold">
                          {quantity}
                        </span>

                        <button
                          onClick={() => handleIncrease(item)}
                          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          +
                        </button>
                      </div>

                      {/* remove */}
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-5 border-t border-gray-200 dark:border-gray-800">
          <NextLink
            href="/cart"
            onClick={() => setCartDrawerOpen(false)}
            className="block w-full text-center py-3 rounded-xl bg-red-600 text-white font-bold"
          >
            Xem giỏ hàng
          </NextLink>
        </div>
      </div>
    </header>
  );
}

export { Navbar };
