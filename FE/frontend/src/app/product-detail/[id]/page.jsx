"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import {
  Minus,
  Plus,
  Heart,
  Share2,
  Menu,
  Sun,
  Moon,
  Search,
  ShoppingCart,
  User,
  Zap,
  Flame,
} from "lucide-react";
import NextLink from "next/link";
import { getProducts } from "@/services/productService";
import { Text } from "@/components/Text";
import { useCart } from "@/app/cart/CartContext";
import { Navbar } from "@/components/Navbar";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  // States cho trang chi tiết
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // States cho Navbar (mobile menu & dark mode)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { addToCart } = useCart();
  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts();

        const foundProduct = allProducts.find(
          (p) => String(p.id) === String(params.id),
        );

        if (foundProduct) {
          setProduct({
            ...foundProduct,
            images: foundProduct.images || [
              foundProduct.imageUrl,
              foundProduct.imageUrl,
              foundProduct.imageUrl,
            ],
          });
          setActiveImage(0);
        } else {
          router.push("/products");
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết sản phẩm:", error);
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProductDetail();
    }
  }, [params.id, router]);

  const handleQuantityChange = (type) => {
    if (type === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    if (type === "plus") setQuantity((prev) => prev + 1);
  };

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Đang tải thông tin sản phẩm...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-red-600">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {Navbar && <Navbar />}

      {/* ==================== PRODUCT DETAIL CONTENT ==================== */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <NextLink
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 mb-8 font-medium"
        >
          ← Quay lại cửa hàng
        </NextLink>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] flex items-center justify-center border border-gray-100 dark:border-gray-700">
              <img
                src={product.images[activeImage] || product.imageUrl}
                alt={product.name}
                className="max-h-[520px] w-auto object-contain p-8"
              />
              <div className="absolute top-6 left-6 bg-red-600 text-white px-5 py-2 rounded-full font-bold shadow-lg">
                {product.status || "Released"}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    activeImage === index
                      ? "border-red-600 shadow-md"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Hình ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-4 py-1.5 rounded-full">
                  {product.status || "Released"}
                </span>
                <span className="text-sm text-gray-500">
                  Item No: {product.itemNo}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                {product.name}
              </h1>

              <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                Scale: {product.scale} • {product.marque}
              </p>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-5xl font-black text-red-600">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-2xl line-through text-gray-400">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description || "Mô hình xe chất lượng cao từ MINI GT."}
            </p>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold mb-3">Số lượng</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-2xl w-fit bg-white dark:bg-gray-800">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-7 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-2xl"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-12 font-bold text-2xl min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-7 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-2xl"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Button
              onClick={() => {
                addToCart(product, quantity);
                alert(` Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
              }}
              className="w-full py-8 text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white rounded-2xl shadow-xl transition-all active:scale-[0.98]"
            >
              Thêm vào giỏ hàng — ${(product.price * quantity).toFixed(2)}
            </Button>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex-1 py-6"
              >
                <Heart
                  className={`w-6 h-6 mr-3 ${isWishlisted ? "fill-red-600 text-red-600" : ""}`}
                />
                Yêu thích
              </Button>
              <Button variant="outline" className="flex-1 py-6">
                <Share2 className="w-6 h-6 mr-3" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
