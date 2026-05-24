"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Zap, Trophy, AlertCircle } from "lucide-react";
import NextLink from "next/link";
import { getAuctionProducts, getAuctionBids, getAuctionCurrentBid, placeBid, getAuctionWinner } from "@/services/auctionService";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, userId } = useAuth();

  const [activeImage, setActiveImage] = useState(0);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [submittingBid, setSubmittingBid] = useState(false);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [auctionEnded, setAuctionEnded] = useState(false);

  // Winner state
  const [winner, setWinner] = useState(null);
  const [winnerLoading, setWinnerLoading] = useState(false);

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
        const res = await getAuctionProducts();
        const allProducts = Array.isArray(res) ? res : (res.data || []);
        
        const foundProduct = allProducts.find(
          (p) => String(p.id) === String(params.id),
        );

        if (foundProduct) {
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
            auctionHash: foundProduct.id + "-abcd-efgh-ijkl",
            currentPrice: currentPrice,
            startingPrice: foundProduct.auctionStartPrice || foundProduct.price || 0,
            buyNowPrice: currentPrice * 3,
            minBid: currentPrice + 1000,
          });
          
          if (bidsRes && bidsRes.data) {
             setBids(bidsRes.data);
          }

          // Nếu product đã ENDED, gọi winner ngay
          if (foundProduct.status === "ENDED") {
            setAuctionEnded(true);
            fetchWinner(foundProduct.id);
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

  // Fetch winner helper
  const fetchWinner = async (productId) => {
    try {
      setWinnerLoading(true);
      const res = await getAuctionWinner(productId);
      if (res && res.data) {
        setWinner(res.data);
      } else {
        setWinner(null);
      }
    } catch (err) {
      console.error("Lỗi lấy winner:", err);
      setWinner(null);
    } finally {
      setWinnerLoading(false);
    }
  };

  // Countdown timer - chạy mỗi giây
  useEffect(() => {
    if (!auction?.auctionEndTime || auctionEnded) return;

    const endTime = new Date(auction.auctionEndTime).getTime();

    const calcTimeLeft = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setAuctionEnded(true);
        // Khi countdown về 0, gọi API winner
        fetchWinner(auction.id);
        return false; // signal to clear interval
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      return true; // continue
    };

    // Initial calc
    const shouldContinue = calcTimeLeft();
    if (!shouldContinue) return;

    const interval = setInterval(() => {
      const shouldContinue = calcTimeLeft();
      if (!shouldContinue) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [auction?.auctionEndTime, auction?.id, auctionEnded]);

  // TODO: [POLLING PLACEHOLDER] Uncomment below để auto-refresh bid history mỗi 15 giây.
  // useEffect(() => {
  //   if (!auction?.id || auctionEnded) return;
  //   const pollInterval = setInterval(async () => {
  //     try {
  //       const [currentBidRes, bidsRes] = await Promise.all([
  //         getAuctionCurrentBid(auction.id).catch(() => null),
  //         getAuctionBids(auction.id).catch(() => null),
  //       ]);
  //       if (currentBidRes?.data) {
  //         setAuction(prev => ({ ...prev, currentPrice: currentBidRes.data.currentPrice }));
  //       }
  //       if (bidsRes?.data) {
  //         setBids(bidsRes.data);
  //       }
  //     } catch (err) {
  //       console.error("Poll error:", err);
  //     }
  //   }, 15000);
  //   return () => clearInterval(pollInterval);
  // }, [auction?.id, auctionEnded]);

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN");
  };

  const handleQuickBid = (amount) => {
    setBidAmount(amount);
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
            setAuction(prev => ({
                ...prev,
                currentPrice: res.data.currentPrice,
                minBid: res.data.currentPrice + 1000
            }));
            
            setBids(prev => [res.data, ...prev]);
            setBidAmount("");
            alert("Đặt giá thành công!");
        } else {
            // Map error codes cụ thể
            const errorMessages = {
              "AUCTION_ENDED": "Phiên đấu giá đã kết thúc!",
              "VALIDATION_ERROR": "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
            };
            alert(errorMessages[res.code] || res.message || "Lỗi khi đặt giá");

            if (res.code === "AUCTION_ENDED") {
              setAuctionEnded(true);
              fetchWinner(auction.id);
            }
        }
    } catch (err) {
        console.error("Bid error:", err);
        // Kiểm tra error message từ backend
        const msg = err.message || "";
        if (msg.includes("AUCTION_ENDED") || msg.includes("ended")) {
          setAuctionEnded(true);
          fetchWinner(auction.id);
          alert("Phiên đấu giá đã kết thúc!");
        } else {
          alert("Có lỗi xảy ra khi gửi yêu cầu.");
        }
    } finally {
        setSubmittingBid(false);
    }
  };

  // Checkout cho winner
  const handleWinnerCheckout = () => {
    if (!winner) return;
    router.push(`/checkout?auctionProductId=${auction.id}&price=${winner.winningPrice}`);
  };

  const isAuctionOpen = auction?.status === "OPEN" && !auctionEnded;

  // Format countdown display
  const countdownDisplay = () => {
    if (auctionEnded) return "Đã kết thúc";
    if (auction?.status === "SCHEDULED") return "Chưa bắt đầu";
    const { days, hours, minutes, seconds } = timeLeft;
    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

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

                {/* Countdown display */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Thời gian còn lại</span>
                  <span className={`font-black ${auctionEnded ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
                    {countdownDisplay()}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
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
            {/* Winner Block - hiển thị khi auction kết thúc */}
            {auctionEnded && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                {winnerLoading ? (
                  <div className="text-center py-6 text-gray-500">Đang tải kết quả...</div>
                ) : winner ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                      <Trophy className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      Phiên đấu giá đã kết thúc!
                    </h3>

                    {userId && userId === winner.winnerUserId ? (
                      <>
                        <p className="text-emerald-600 font-bold text-lg">
                          🎉 Chúc mừng! Bạn đã thắng!
                        </p>
                        <p className="text-sm text-gray-500">
                          Giá thắng: <span className="font-black text-red-600">{formatPrice(winner.winningPrice)}</span>
                        </p>
                        {winner.canPay && (
                          <button
                            onClick={handleWinnerCheckout}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-emerald-600/20"
                          >
                            Thanh toán ngay
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-gray-500 font-medium">
                          Người thắng: <span className="font-bold text-gray-900 dark:text-white">{winner.winnerUsername}</span>
                        </p>
                        <p className="text-sm text-gray-400">
                          Giá thắng: <span className="font-bold text-red-600">{formatPrice(winner.winningPrice)}</span>
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      Phiên đấu giá đã kết thúc
                    </h3>
                    <p className="text-sm text-gray-500">Không có người thắng cuộc.</p>
                  </div>
                )}
              </div>
            )}

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
