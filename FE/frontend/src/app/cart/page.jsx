"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { useCart } from "@/app/cart/CartContext";
import Navbar from "@/components/Navbar";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Lock,
  Sparkles,
  ArrowLeft,
  Clock,
  ShoppingCart,
  Tag,
} from "lucide-react";
import {
  getCartItems,
  updateCartItem,
  removeCartItem,
} from "@/services/cartService";

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function Page() {
  const { reloadCartCount } = useCart();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const data = await getCartItems();
        const list = Array.isArray(data) ? data : data.content || [];

        setCart(list);
        reloadCartCount();
      } catch (error) {
        console.error("Load cart items error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, []);

  const cartCount = cart.length;

  const cartTotal = cart.reduce((sum, item) => {
    const product = item.product || item;
    return sum + Number(product.price || 0) * Number(item.quantity || 1);
  }, 0);

  const shippingFee = cartTotal >= 5_000_000 ? 0 : cart.length > 0 ? 50_000 : 0;
  const discount = couponApplied ? Math.floor(cartTotal * 0.1) : 0;
  const grandTotal = cartTotal - discount + shippingFee;

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === "BLITZ20") {
      setCouponApplied(true);
    } else {
      alert("Mã giảm giá không hợp lệ");
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem(item.id, newQuantity);

      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem,
        ),
      );

      await reloadCartCount();
    } catch (error) {
      console.error("Update quantity error:", error);
      alert("Cập nhật số lượng thất bại!");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);

      setCart((prev) => prev.filter((item) => item.id !== itemId));

      await reloadCartCount();
    } catch (error) {
      console.error("Remove cart item error:", error);
      alert("Xóa sản phẩm thất bại!");
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Xóa toàn bộ giỏ hàng?")) return;

    try {
      for (const item of cart) {
        await removeCartItem(item.id);
      }

      setCart([]);
      await reloadCartCount();
    } catch (error) {
      console.error("Clear cart error:", error);
      alert("Xóa toàn bộ giỏ hàng thất bại!");
    }
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter">
            Giỏ hàng ({cartCount})
          </h1>
          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> Xóa tất cả
            </button>
          )}
        </div>

        {/* Empty state */}
        {loading ? (
          <div className="py-28 text-center text-gray-500">
            Đang tải giỏ hàng...
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-400 dark:text-gray-500 mb-3">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-400 dark:text-gray-500 mb-8 max-w-sm">
              Hãy khám phá các sản phẩm mô hình xe thu nhỏ tuyệt đẹp của chúng
              tôi!
            </p>
            <NextLink
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-red-500/30 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              Bắt đầu mua sắm
            </NextLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Urgency banner */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Đặt hàng ngay để đảm bảo hàng có sẵn — số lượng có hạn!
                </p>
              </div>

              {/* Items */}
              {cart.map((item) => {
                const product = item.product || item;
                const productId = product.id || item.productId;
                const price = Number(product.price || 0);
                const quantity = Number(item.quantity || 1);

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex flex-col sm:flex-row gap-5 items-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <NextLink
                      href={`/product-detail/${productId}`}
                      className="flex-shrink-0"
                    >
                      <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
                        <img
                          src={
                            product.imageUrl ||
                            product.image ||
                            "/placeholder.png"
                          }
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      </div>
                    </NextLink>

                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <NextLink href={`/product-detail/${productId}`}>
                        <h3 className="font-bold text-gray-900 dark:text-white hover:text-red-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </NextLink>

                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        {formatPrice(price)} / sản phẩm
                      </p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item, quantity - 1)
                          }
                          disabled={quantity <= 1}
                          className="px-3 py-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-12 text-center font-bold text-sm select-none">
                          {quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleUpdateQuantity(item, quantity + 1)
                          }
                          className="px-3 py-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <p className="font-black text-gray-900 dark:text-white">
                          {formatPrice(price * quantity)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Continue shopping */}
              <NextLink
                href="/products"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Tiếp tục mua sắm
              </NextLink>
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-24 space-y-5">
                <h2 className="text-xl font-black uppercase italic text-gray-900 dark:text-white">
                  Tổng đơn hàng
                </h2>

                {/* Price breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tạm tính ({cartCount} sản phẩm)</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-red-600 font-semibold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> Mã BLITZ20 (-10%)
                      </span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Phí vận chuyển</span>
                    <span
                      className={
                        shippingFee === 0 ? "text-green-600 font-semibold" : ""
                      }
                    >
                      {shippingFee === 0
                        ? "Miễn phí 🎉"
                        : formatPrice(shippingFee)}
                    </span>
                  </div>

                  {shippingFee > 0 && (
                    <p className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                      Mua thêm {formatPrice(5_000_000 - cartTotal)} để được miễn
                      phí ship
                    </p>
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white text-base">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-black text-red-600">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Coupon */}
                {!couponApplied && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Mã giảm giá"
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}

                {couponApplied && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Mã BLITZ20 đã được áp dụng — giảm 10%!
                  </div>
                )}

                {/* Checkout CTA */}
                <NextLink
                  href="/checkout"
                  className="block w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold text-center rounded-2xl shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Thanh toán an toàn
                </NextLink>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[
                    { icon: "", label: "Bảo mật" },
                    { icon: "", label: "Đổi trả" },
                    { icon: "", label: "Chính hãng" },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="flex flex-col items-center gap-1 text-xs text-gray-400 dark:text-gray-500"
                    >
                      <span className="text-lg">{b.icon}</span>
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
