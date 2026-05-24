"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Trophy, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { getMyWonAuctions } from "@/services/auctionService";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function MyWonAuctionsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchWonAuctions = async () => {
      try {
        setLoading(true);
        const res = await getMyWonAuctions();
        const data = Array.isArray(res) ? res : (res.data || []);
        setAuctions(data);
      } catch (err) {
        console.error("Lỗi lấy danh sách đấu giá đã thắng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWonAuctions();
  }, [authLoading, isAuthenticated, router]);

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN");
  };

  const handleCheckout = (auction) => {
    router.push(`/checkout?auctionProductId=${auction.id}&price=${auction.currentPrice}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <NextLink
          href="/auctions"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại đấu giá
        </NextLink>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Đấu giá đã thắng
            </h1>
            <p className="text-sm text-gray-500">Các phiên đấu giá bạn thắng và cần thanh toán</p>
          </div>
        </div>

        {auctions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Chưa có phiên đấu giá nào cần thanh toán
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Khi bạn thắng một phiên đấu giá, sản phẩm sẽ xuất hiện ở đây để bạn thanh toán.
            </p>
            <NextLink
              href="/auctions"
              className="inline-flex px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
            >
              Khám phá đấu giá
            </NextLink>
          </div>
        ) : (
          <div className="space-y-4">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                  <img
                    src={auction.imageUrl || "/placeholder.png"}
                    alt={auction.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2">
                    {auction.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase">
                      {auction.status}
                    </span>
                    <span className="text-sm font-black text-red-600">
                      {formatPrice(auction.currentPrice)} ₫
                    </span>
                  </div>
                </div>

                {/* Action */}
                {!auction.auctionPaid ? (
                  <button
                    onClick={() => handleCheckout(auction)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap"
                  >
                    Thanh toán
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 text-sm font-medium rounded-xl">
                    Đã thanh toán
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
