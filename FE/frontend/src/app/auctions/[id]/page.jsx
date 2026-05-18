"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Zap } from "lucide-react";
import NextLink from "next/link";
import { getAuctionProducts, getAuctionBids, getAuctionCurrentBid, placeBid } from "@/services/auctionService";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [activeImage, setActiveImage] = useState(0);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [submittingBid, setSubmittingBid] = useState(false);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Fetch data
  useEffect(() => {
    const fetchAuctionDetail = async () => {
      try {
        setLoading(true);
        // Lấy danh sách sản phẩm đấu giá
        const res = await getAuctionProducts();
        const allProducts = Array.isArray(res) ? res : (res.data || []);
        
        const foundProduct = allProducts.find(
          (p) => String(p.id) === String(params.id),
        );

        if (foundProduct) {
          // Fetch current bid & bid history parallel
          const [currentBidRes, bidsRes] = await Promise.all([
            getAuctionCurrentBid(foundProduct.id).catch(() => null),
            getAuctionBids(foundProduct.id).catch(() => null)
          ]);
          
          let currentPrice = foundProduct.auctionStartPrice || foundProduct.price || 0;
          
          if (currentBidRes && currentBidRes.data) {
             currentPrice = currentBidRes.data.currentPrice;
          } else if (foundProduct.currentPrice) {
             currentPrice = foundProduct.currentPrice;
          }

          setAuction({
            ...foundProduct,
            images: foundProduct.images || (foundProduct.imageUrl ? [
              foundProduct.imageUrl,
              foundProduct.imageUrl,
              foundProduct.imageUrl,
            ] : []),
            auctionHash: foundProduct.id + "-abcd-efgh-ijkl", // Tạm dùng id làm một phần hash
            currentPrice: currentPrice,
            startingPrice: foundProduct.auctionStartPrice || foundProduct.price || 0,
            buyNowPrice: currentPrice * 3, // Mock buy now price nếu backend ko trả về
            minBid: currentPrice + 1000, // Tạm fix minBid = currentPrice + 1000
          });
          
          if (bidsRes && bidsRes.data) {
             setBids(bidsRes.data);
          }

          setActiveImage(0);
        } else {
          router.push("/auctions");
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết đấu giá:", error);
        router.push("/auctions");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAuctionDetail();
    }
  }, [params.id, router]);

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN");
  };

  const handleQuickBid = (amount) => {
    setBidAmount(amount); // Bid amount là số tiền cộng thêm
  };

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
        alert("Vui lòng đăng nhập để tham gia đấu giá!");
        router.push("/login");
        return;
    }
    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
        alert("Vui lòng nhập bước giá hợp lệ!");
        return;
    }

    try {
        setSubmittingBid(true);
        const res = await placeBid(auction.id, Number(bidAmount));
        
        if (res.success || res.code === "PLACE_BID_SUCCESS") {
            // Update UI with new bid
            setAuction(prev => ({
                ...prev,
                currentPrice: res.data.currentPrice,
                minBid: res.data.currentPrice + 1000
            }));
            
            // Add new bid to history
            setBids(prev => [res.data, ...prev]);
            setBidAmount("");
            alert("Đặt giá thành công!");
        } else {
            alert(res.message || "Lỗi khi đặt giá");
        }
    } catch (err) {
        console.error("Bid error:", err);
        alert("Có lỗi xảy ra khi gửi yêu cầu.");
    } finally {
        setSubmittingBid(false);
    }
  };

  const isAuctionOpen = auction?.status === "OPEN";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Đang tải thông tin phiên đấu giá...
        </p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-red-600">Không tìm thấy phiên đấu giá</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <NextLink
          href="/auctions"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 mb-8 font-medium"
        >
          ← Quay lại danh sách đấu giá
        </NextLink>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Left Column: Image and Basic Info */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="aspect-[4/3] flex items-center justify-center bg-gray-50 dark:bg-gray-700 relative">
                <img
                  src={auction.images[activeImage] || auction.imageUrl || "/placeholder.png"}
                  alt={auction.name}
                  className="max-h-[500px] w-auto object-contain p-8 mix-blend-multiply dark:mix-blend-normal"
                />
              </div>
            </div>
            
            {/* Image Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {auction.images && auction.images.length > 0 && auction.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 bg-white ${
                    activeImage === index
                      ? "border-red-600 shadow-md"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Hình ${index + 1}`}
                    className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal p-2"
                  />
                </button>
              ))}
            </div>

            {/* Auction Info */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-2">
                {auction.name}
              </h1>
              <p className="text-sm text-gray-400 mb-8 font-medium">
                Auction #{auction.auctionHash}
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 font-bold mb-1">Giá hiện tại</p>
                  <div className="text-5xl font-black text-red-600 tracking-tight">
                    {formatPrice(auction.currentPrice)}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Giá khởi điểm</span>
                  <span className="font-black text-gray-900 dark:text-white">{formatPrice(auction.startingPrice)}</span>
                </div>

                <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/10 p-4 rounded-xl">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Giá mua ngay</span>
                  <span className="font-black text-red-600">{formatPrice(auction.buyNowPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bidding Module */}
          <div className="space-y-6">
            {/* Bid Box */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Your Bid
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  disabled={!isAuctionOpen || submittingBid}
                  placeholder={`Minimum: ${formatPrice(auction.minBid)}`}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500 font-medium px-1">
                  <span>Min: {formatPrice(auction.minBid)}</span>
                  <span>•</span>
                  <span>Buy now: {formatPrice(auction.buyNowPrice)}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button 
                  onClick={handlePlaceBid}
                  disabled={!isAuctionOpen || submittingBid}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-600/20"
                >
                  {submittingBid ? "Đang xử lý..." : "Đặt bước giá"}
                </Button>
                
                <div>
                  <Button 
                    disabled={true}
                    variant="outline" 
                    className="w-full py-4 border-2 border-gray-200 text-gray-400 bg-gray-50 dark:border-gray-700 dark:text-gray-500 dark:bg-gray-800 font-bold rounded-xl transition-colors cursor-not-allowed"
                  >
                    Mua ngay ({formatPrice(auction.buyNowPrice)})
                  </Button>
                  <p className="text-[11px] text-center text-gray-400 mt-1.5 font-medium italic">
                    * Tính năng mua ngay đang trong quá trình phát triển
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button disabled={!isAuctionOpen} onClick={() => handleQuickBid(5000)} className="py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5 text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Zap className="w-3.5 h-3.5" /> +5k
                </button>
                <button disabled={!isAuctionOpen} onClick={() => handleQuickBid(10000)} className="py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5 text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Zap className="w-3.5 h-3.5" /> +10k
                </button>
                <button disabled={!isAuctionOpen} onClick={() => handleQuickBid(50000)} className="py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5 text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Zap className="w-3.5 h-3.5" /> +50k
                </button>
                <button disabled={!isAuctionOpen} onClick={() => handleQuickBid(100000)} className="py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-1.5 text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Zap className="w-3.5 h-3.5" /> +100k
                </button>
              </div>
            </div>

            {/* History Box */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white">Lịch sử đấu giá</h3>
                <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
                  {bids.length} bids
                </span>
              </div>

              {bids.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {bids.map((bid, index) => (
                    <div key={bid.bidId || index} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                          {bid.username}
                          {index === 0 && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">Cao nhất</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(bid.createdAt).toLocaleString("vi-VN")}
                        </div>
                      </div>
                      <div className="font-bold text-red-600">
                        {formatPrice(bid.currentPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-gray-500 font-medium">
                  Hiện chưa có ai tham gia! Bạn là người đầu tiên
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
