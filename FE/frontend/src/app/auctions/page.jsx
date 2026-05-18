"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import {
  Facebook,
  Instagram,
  Zap,
  Twitter,
  Play,
  Clock,
  Gavel,
  Eye,
} from "lucide-react";
import NextLink from "next/link";
import { Link } from "@/components/Link";
import { Text } from "@/components/Text";
import Navbar from "@/components/Navbar";

import { getAuctionProducts } from "@/services/auctionService";

export default function AuctionsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("Sắp kết thúc");
  const itemsPerPage = 8;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    getAuctionProducts()
      .then((res) => {
        // Ánh xạ dữ liệu sản phẩm thành dữ liệu đấu giá
        // Backend Response trả về ApiResponse: { success, code, data: [...] }
        const products = Array.isArray(res) ? res : (res.data || []);
        
        const mappedAuctions = products.map((product) => {
           // Tính toán thời gian còn lại một cách đơn giản (hoặc mock nếu chưa xử lý Date tốt)
           let timeLeftDisplay = "N/A";
           if (product.auctionEndTime) {
               const end = new Date(product.auctionEndTime);
               const now = new Date();
               const diff = end - now;
               if (diff > 0) {
                   const h = Math.floor(diff / (1000 * 60 * 60));
                   const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                   timeLeftDisplay = `${h}h ${m}m`;
               } else {
                   timeLeftDisplay = "Kết thúc";
               }
           }

           return {
             id: product.id,
             status: product.status,
             views: Math.floor(Math.random() * 1000), // Random số lượt xem (mock)
             imageUrl: product.imageUrl || "/placeholder.png",
             name: product.name,
             currentPrice: product.currentPrice || product.auctionStartPrice || product.price || 0,
             startingPrice: product.auctionStartPrice || product.price || 0,
             timeLeft: timeLeftDisplay,
             bidCount: 0, // Sẽ update sau nếu có API
           };
        });
        setAuctions(mappedAuctions);
      })
      .catch((err) => {
        console.error("Get auctions error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(auctions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAuctions = auctions.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN");
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      <Navbar />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                Danh sách đấu giá
              </h2>
              <p className="text-gray-500 font-medium">
                Tham gia và khám phá đấu giá mô hình
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilter("Sắp kết thúc")}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  filter === "Sắp kết thúc"
                    ? "bg-white text-gray-900 border-gray-300 shadow-sm"
                    : "bg-transparent text-gray-500 border-transparent hover:bg-gray-100"
                }`}
              >
                Sắp kết thúc
              </button>
              <button
                onClick={() => setFilter("Mới nhất")}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  filter === "Mới nhất"
                    ? "bg-white text-gray-900 border-gray-300 shadow-sm"
                    : "bg-transparent text-gray-500 border-transparent hover:bg-gray-100"
                }`}
              >
                Mới nhất
              </button>
            </div>
          </div>

          {/* Auction Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <p className="text-gray-600 dark:text-gray-300 col-span-full text-center py-10">
                Loading auctions...
              </p>
            ) : currentAuctions.length === 0 ? (
              <p className="col-span-full text-center py-10 text-gray-500">
                Chưa có phiên đấu giá nào.
              </p>
            ) : (
              currentAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col relative"
                >
                  {/* IMAGE AND BADGE */}
                  <div className="relative w-full h-56 bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      {auction.status === "SCHEDULED" ? (
                        <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          {auction.status}
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          {auction.status}
                        </span>
                      )}
                    </div>

                    <img
                      src={auction.imageUrl}
                      alt={auction.name}
                      className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105 duration-500 mix-blend-multiply dark:mix-blend-normal"
                    />

                    {/* View Count Overlay */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm text-xs font-bold text-gray-700 dark:text-gray-300">
                      <Play className="w-3 h-3 fill-red-600 text-red-600" />
                      {auction.views}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-[15px] leading-snug line-clamp-2 min-h-[44px]">
                      {auction.name}
                    </h3>

                    <div className="mt-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">
                        Giá cao nhất hiện tại
                      </p>
                      <div className="text-2xl font-black text-red-600 tracking-tight">
                        {formatPrice(auction.currentPrice)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        Khởi điểm: {formatPrice(auction.startingPrice)}
                      </p>
                    </div>

                    {/* Footer Info (Time and Bid Count) */}
                    <div className="mt-auto pt-5 flex items-center justify-between text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        {auction.timeLeft}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Gavel className="w-4 h-4" />
                        {auction.bidCount}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center gap-2">
                      <NextLink
                        href={`/auctions/${auction.id}`}
                        className="flex-1"
                      >
                        {auction.status !== "SCHEDULED" ? (
                          <Button
                            variant="outline"
                            className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all"
                          >
                            <Eye className="w-4 h-4" /> Xem
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            disabled
                            className="w-full bg-white border-2 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold cursor-not-allowed"
                          >
                            <Eye className="w-4 h-4" /> Xem
                          </Button>
                        )}
                      </NextLink>

                      {auction.status === "SCHEDULED" ? (
                        <Button className="flex-[1.5] bg-red-100 hover:bg-red-200 text-red-700 py-2.5 rounded-xl font-bold transition-colors">
                          Sắp diễn ra
                        </Button>
                      ) : (
                        <Button className="flex-[1.5] bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold shadow-md shadow-red-600/20 transition-all">
                          Tham gia
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
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

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum = i + 1;
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
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-6 py-3 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                >
                  Next →
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link className="flex items-center gap-2 group" href="/">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <Text
                variant="italic"
                className="text-2xl font-black tracking-tighter italic text-gray-900 dark:text-white"
              >
                BLITZ
              </Text>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2026 Blitz Commerce. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
